import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhoneButtonProps {
  phoneNumber: string;
  label?: string;
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function PhoneButton({
  phoneNumber,
  label = '電話で問い合わせ',
  variant = 'default',
  size = 'md',
  showIcon = true,
  className,
  onClick,
}: PhoneButtonProps) {
  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/-/g, '');
  };

  const handleClick = () => {
    onClick?.();
    // Analytics tracking could be added here
  };

  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
    ghost: 'text-primary hover:bg-primary/10',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <a
      href={`tel:${formatPhoneNumber(phoneNumber)}`}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center space-x-2 rounded-lg font-medium transition-all',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {showIcon && <Phone className={iconSizes[size]} />}
      <span>{label}</span>
    </a>
  );
}

// Floating phone button (fixed position)
interface FloatingPhoneButtonProps {
  phoneNumber: string;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function FloatingPhoneButton({
  phoneNumber,
  label = '電話する',
  position = 'bottom-right',
}: FloatingPhoneButtonProps) {
  const positionStyles = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/-/g, '');
  };

  return (
    <a
      href={`tel:${formatPhoneNumber(phoneNumber)}`}
      className={cn(
        'fixed z-50 flex items-center space-x-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 md:px-6 md:py-4 md:text-base',
        positionStyles[position]
      )}
      aria-label="電話で問い合わせ"
    >
      <Phone className="h-5 w-5 md:h-6 md:w-6" />
      <span className="hidden md:inline">{label}</span>
    </a>
  );
}

// Phone number display with click-to-call
interface PhoneNumberDisplayProps {
  phoneNumber: string;
  showIcon?: boolean;
  className?: string;
}

export function PhoneNumberDisplay({
  phoneNumber,
  showIcon = true,
  className,
}: PhoneNumberDisplayProps) {
  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/-/g, '');
  };

  return (
    <a
      href={`tel:${formatPhoneNumber(phoneNumber)}`}
      className={cn(
        'inline-flex items-center space-x-1 text-primary transition-colors hover:text-primary/80',
        className
      )}
    >
      {showIcon && <Phone className="h-4 w-4" />}
      <span className="font-medium">{phoneNumber}</span>
    </a>
  );
}
