/**
 * Encryption Utilities for Sensitive Data
 *
 * AES-256-GCM暗号化を使用してInstagramトークンなどの
 * 機密情報を安全に保存・復号化します。
 *
 * セキュリティ要件:
 * - AES-256-GCM（認証付き暗号化）
 * - ランダムIV（初期化ベクトル）
 * - ENCRYPTION_KEY環境変数（32バイト hex）
 */

import crypto from 'crypto';

// 環境変数から暗号化キーを取得
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  console.warn('⚠️ ENCRYPTION_KEY not set. Sensitive data encryption disabled.');
}

// 暗号化アルゴリズム
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits
const KEY_LENGTH = 32; // 256 bits

/**
 * 暗号化キーをバッファに変換
 */
function getKeyBuffer(): Buffer {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  // Hex文字列からBufferに変換
  if (ENCRYPTION_KEY.length !== KEY_LENGTH * 2) {
    throw new Error(
      `ENCRYPTION_KEY must be ${KEY_LENGTH * 2} hex characters (${KEY_LENGTH} bytes). ` +
      `Generate with: openssl rand -hex ${KEY_LENGTH}`
    );
  }

  return Buffer.from(ENCRYPTION_KEY, 'hex');
}

/**
 * データを暗号化
 *
 * @param plainText - 平文データ
 * @returns 暗号化データ（Base64エンコード）
 *
 * 暗号化データ形式: [IV(16bytes)][AuthTag(16bytes)][EncryptedData]
 */
export function encrypt(plainText: string): string {
  if (!plainText) {
    throw new Error('Cannot encrypt empty string');
  }

  const key = getKeyBuffer();

  // ランダムIV生成
  const iv = crypto.randomBytes(IV_LENGTH);

  // 暗号化処理
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final(),
  ]);

  // 認証タグ取得（GCMモード）
  const authTag = cipher.getAuthTag();

  // [IV][AuthTag][Encrypted]の順で結合してBase64エンコード
  const combined = Buffer.concat([iv, authTag, encrypted]);

  return combined.toString('base64');
}

/**
 * データを復号化
 *
 * @param encryptedText - 暗号化データ（Base64エンコード）
 * @returns 復号化された平文
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) {
    throw new Error('Cannot decrypt empty string');
  }

  const key = getKeyBuffer();

  // Base64デコード
  const combined = Buffer.from(encryptedText, 'base64');

  // [IV][AuthTag][Encrypted]の分解
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  // 復号化処理
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

/**
 * 暗号化キーが設定されているかチェック
 */
export function isEncryptionEnabled(): boolean {
  return !!ENCRYPTION_KEY;
}

/**
 * 暗号化キーを生成（開発用ヘルパー）
 *
 * 本番環境では openssl rand -hex 32 を使用すること
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

/**
 * ハッシュ化（一方向暗号化）
 *
 * パスワードなどの復号不要なデータ用
 *
 * @param data - 平文データ
 * @param salt - ソルト（オプション）
 * @returns SHA-256ハッシュ（hex）
 */
export function hash(data: string, salt: string = ''): string {
  return crypto
    .createHash('sha256')
    .update(data + salt)
    .digest('hex');
}
