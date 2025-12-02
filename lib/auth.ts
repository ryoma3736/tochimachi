import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ユーザータイプの定義
export type UserRole = "customer" | "vendor" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    // 顧客・業者・管理者 共通のCredentials認証
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }, // "customer" | "vendor" | "admin"
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          throw new Error("認証情報が不足しています");
        }

        const { email, password, role } = credentials;

        try {
          // ロールに応じて認証対象を切り替え
          if (role === "customer") {
            const user = await prisma.user.findUnique({
              where: { email },
            });

            if (!user || !user.isActive) {
              throw new Error("ユーザーが見つからないか、無効化されています");
            }

            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
              throw new Error("パスワードが正しくありません");
            }

            await prisma.user.update({
              where: { id: user.id },
              data: { lastLoginAt: new Date() },
            });

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: "customer" as UserRole,
              isActive: user.isActive,
            };
          } else if (role === "vendor") {
            const vendor = await prisma.vendor.findUnique({
              where: { email },
            });

            if (!vendor || !vendor.isActive) {
              throw new Error("業者アカウントが見つからないか、無効化されています");
            }

            if (!vendor.approvedAt) {
              throw new Error("業者アカウントは審査待ちです");
            }

            const isPasswordValid = await bcrypt.compare(password, vendor.passwordHash);
            if (!isPasswordValid) {
              throw new Error("パスワードが正しくありません");
            }

            return {
              id: vendor.id,
              email: vendor.email,
              name: vendor.companyName,
              role: "vendor" as UserRole,
              isActive: vendor.isActive,
            };
          } else if (role === "admin") {
            const admin = await prisma.admin.findUnique({
              where: { email },
            });

            if (!admin || !admin.isActive) {
              throw new Error("管理者アカウントが見つからないか、無効化されています");
            }

            const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
            if (!isPasswordValid) {
              throw new Error("パスワードが正しくありません");
            }

            await prisma.admin.update({
              where: { id: admin.id },
              data: { lastLoginAt: new Date() },
            });

            return {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: "admin" as UserRole,
              isActive: admin.isActive,
            };
          }

          throw new Error("無効なロールが指定されました");
        } catch (error) {
          console.error("認証エラー:", error);
          throw error;
        }
      },
    }),

    // 顧客向けGoogle OAuth（オプション）
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // 初回ログイン時にユーザー情報をトークンに追加
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as AuthUser).role;
        token.isActive = (user as AuthUser).isActive;
      }

      // Google OAuth経由の場合、自動的に顧客として登録
      if (account?.provider === "google" && user?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "Google User",
              passwordHash: "", // OAuthではパスワード不要
              prefecture: "未設定", // 後で更新可能
            },
          });

          token.id = newUser.id;
          token.role = "customer";
          token.isActive = newUser.isActive;
        } else {
          token.id = existingUser.id;
          token.role = "customer";
          token.isActive = existingUser.isActive;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // セッションにカスタム情報を追加
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as UserRole,
          isActive: token.isActive as boolean,
        };
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // ログイン後のリダイレクト先をロール別に設定
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// ユーティリティ関数: パスワードハッシュ化
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ユーティリティ関数: パスワード検証
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ユーティリティ関数: ロールチェック
export function hasRole(user: AuthUser | null, allowedRoles: UserRole[]): boolean {
  if (!user || !user.isActive) return false;
  return allowedRoles.includes(user.role);
}
