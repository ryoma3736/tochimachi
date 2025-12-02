/**
 * バリデーションユーティリティ
 */

/**
 * メールアドレスの妥当性チェック
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 電話番号の妥当性チェック（日本）
 * ハイフンあり・なし両対応
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/-/g, '');
  const phoneRegex = /^\d{10,11}$/;
  return phoneRegex.test(cleaned);
}

/**
 * 郵便番号の妥当性チェック（日本）
 * XXX-XXXX または XXXXXXX 形式
 */
export function isValidPostalCode(postalCode: string): boolean {
  const postalRegex = /^\d{3}-?\d{4}$/;
  return postalRegex.test(postalCode);
}

/**
 * 電話番号をフォーマット（ハイフン追加）
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/-/g, '');

  if (cleaned.length === 10) {
    // 市外局番3桁の場合: XXX-XXXX-XXXX
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11) {
    // 市外局番4桁の場合: XXXX-XXX-XXXX
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
}

/**
 * 郵便番号をフォーマット（ハイフン追加）
 */
export function formatPostalCode(postalCode: string): string {
  const cleaned = postalCode.replace(/-/g, '');

  if (cleaned.length === 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }

  return postalCode;
}

/**
 * 必須フィールドの空チェック
 */
export function isNotEmpty(value: string | undefined | null): boolean {
  return value !== undefined && value !== null && value.trim().length > 0;
}

/**
 * 文字列の長さチェック
 */
export function isValidLength(
  value: string,
  min: number,
  max?: number
): boolean {
  const length = value.trim().length;
  if (length < min) return false;
  if (max !== undefined && length > max) return false;
  return true;
}
