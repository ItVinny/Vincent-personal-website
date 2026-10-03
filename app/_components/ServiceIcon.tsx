// Services store an `iconName` string in the database (set from the
// admin, once that form exists). This maps each known name to an
// inline SVG so the icon set stays fixed and lightweight rather than
// letting arbitrary icon markup be stored in the DB.

const strokeProps = {
  fill: "none",
  stroke: "#00a35c", // brand-green-mid -- readable on both light cards and dark-teal cards
  strokeWidth: 1.5,
} as const;

export function ServiceIcon({ name }: { name: string }) {
  switch (name) {
    case "target":
      return (
        <svg viewBox="0 0 24 24" width={22} height={22} {...strokeProps}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 24 24" width={22} height={22} {...strokeProps}>
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="13" y="3" width="8" height="8" rx="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" />
          <rect x="13" y="13" width="8" height="8" rx="1.5" />
        </svg>
      );
    case "monitor":
      return (
        <svg viewBox="0 0 24 24" width={22} height={22} {...strokeProps}>
          <rect x="3" y="4" width="18" height="12" rx="1.5" />
          <line x1="8" y1="20" x2="16" y2="20" />
          <line x1="12" y1="16" x2="12" y2="20" />
        </svg>
      );
    case "compass":
      return (
        <svg viewBox="0 0 24 24" width={22} height={22} {...strokeProps}>
          <path d="M4 20V10l8-6 8 6v10" />
          <path d="M4 10l8 6 8-6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width={22} height={22} {...strokeProps}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
