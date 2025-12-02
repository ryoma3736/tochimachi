/**
 * メールテンプレートエクスポート
 * とちまち - 栃木県ポータルサイト
 */

// Billing Templates
export {
  generateMonthlyChargeEmail,
  type MonthlyChargeData,
} from './billing-monthly-charge';
export {
  generatePaymentFailureEmail,
  type PaymentFailureData,
} from './billing-payment-failure';
export {
  generateApprovalEmail,
  type ApprovalNotificationData,
} from './billing-approval';

// Authentication Templates
export {
  generatePasswordResetEmail,
  type PasswordResetData,
} from './auth-password-reset';
export {
  generateAccountVerificationEmail,
  type AccountVerificationData,
} from './auth-account-verification';

// Admin Templates
export {
  generateAdminAlertEmail,
  type AdminAlertData,
} from './admin-alert';

// Waitlist Templates
export {
  generateWaitlistNotificationEmail,
  type WaitlistNotificationData,
  generateWaitlistRegisteredEmail,
  type WaitlistRegisteredData,
} from './waitlist-notification';
