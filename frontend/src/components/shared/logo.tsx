import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo = ({ className, showText = true }: LogoProps) => {
  return (
    <Link to="/" className={cn('flex items-center gap-2', className)}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
      >
        <rect width="40" height="40" rx="10" fill="#059669" />
        <path
          d="M12 28V16L20 10L28 16V28H12Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 28V20H24V28"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 20V24"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span className="text-xl font-bold text-neutral-900 dark:text-white">
          Imara<span className="text-brand-600">Rent</span>
        </span>
      )}
    </Link>
  );
};