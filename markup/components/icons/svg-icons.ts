import { RATING_CONFIG } from '../../constants/ui-config';

export const STAR_SVG_PATH =
  'M6.09194 0.968665C6.44936 0.193793 7.55064 0.193793 7.90806 0.968665L9.02264 3.38508C9.16831 3.70089 9.4676 3.91833 9.81296 3.95928L12.4555 4.2726C13.3029 4.37307 13.6432 5.42046 13.0167 5.99983L11.063 7.80658C10.8077 8.0427 10.6934 8.39454 10.7611 8.73565L11.2798 11.3457C11.4461 12.1827 10.5551 12.83 9.8105 12.4132L7.48844 11.1134C7.18497 10.9435 6.81503 10.9435 6.51156 11.1134L4.1895 12.4132C3.44489 12.83 2.55393 12.1827 2.72024 11.3457L3.23885 8.73565C3.30663 8.39454 3.19232 8.0427 2.93698 7.80658L0.983254 5.99983C0.356754 5.42046 0.697071 4.37307 1.54446 4.2726L4.18704 3.95928C4.5324 3.91833 4.83169 3.70089 4.97736 3.38508L6.09194 0.968665Z';

export const createStarSvg = (fill: string): string => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 13" aria-hidden="true">
    <path d="${STAR_SVG_PATH}" fill="${fill}" />
  </svg>
`;

export const createHalfStarSvg = (gradientId: string): string => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 13" aria-hidden="true">
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="50%" stop-color="${RATING_CONFIG.COLORS.FULL_STAR}" />
        <stop offset="50%" stop-color="${RATING_CONFIG.COLORS.EMPTY_STAR}" />
        <stop offset="100%" stop-color="${RATING_CONFIG.COLORS.EMPTY_STAR}" />
      </linearGradient>
    </defs>
    <path d="${STAR_SVG_PATH}" fill="url(#${gradientId})" />
  </svg>
`;

export const HEART_ICON_INLINE = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
`;
