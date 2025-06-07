import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price) => {
  // Convert to number first to handle any string inputs
  const numPrice = Number(price);

  // Check if it's a valid number
  if (isNaN(numPrice)) return '0';

  // Format with commas for thousands
  return numPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
