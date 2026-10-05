// Renders a row of circular icon buttons for WhatsApp, Telegram, and
// LinkedIn -- each one only appears if its field is actually filled in
// via /admin/content/footer, so there's never a dead or placeholder link.

type Props = {
  whatsapp?: string | null; // raw digits with country code, e.g. "254712345678"
  telegram?: string | null; // username, no @
  linkedin?: string | null; // full URL
  variant?: "light" | "dark";
};

export function ContactIcons({ whatsapp, telegram, linkedin, variant = "light" }: Props) {
  const links = [
    whatsapp && {
      href: `https://wa.me/${whatsapp}`,
      label: "WhatsApp",
      icon: <WhatsAppIcon />,
    },
    telegram && {
      href: `https://t.me/${telegram}`,
      label: "Telegram",
      icon: <TelegramIcon />,
    },
    linkedin && {
      href: linkedin,
      label: "LinkedIn",
      icon: <LinkedInIcon />,
    },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  if (links.length === 0) return null;

  const buttonClass =
    variant === "dark"
      ? "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      : "flex h-11 w-11 items-center justify-center rounded-full bg-[#f5f5f7] text-[#1d1d1f] transition hover:bg-[#e8e8ed]";

  return (
    <div className="flex justify-center gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className={buttonClass}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.76.46 3.48 1.34 5L2 22l5.14-1.35A9.96 9.96 0 0012.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.2c-1.65 0-3.27-.44-4.68-1.28l-.34-.2-3.09.81.83-3.01-.22-.31A8.17 8.17 0 013.84 12c0-4.53 3.68-8.2 8.2-8.2 4.52 0 8.2 3.67 8.2 8.2 0 4.52-3.68 8.2-8.2 8.2z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M21.95 4.5c.26-1.1-.91-1.97-1.92-1.52L2.4 10.5c-1.04.46-1.03 1.95.02 2.4l4.44 1.87 1.7 5.44c.2.62 1 .78 1.44.3l2.5-2.73 4.5 3.3c.78.57 1.9.15 2.1-.8L21.95 4.5zM8.3 13.3l9.3-6.8c.24-.17.5.14.3.35l-7.6 7.3a1 1 0 00-.28.52l-.3 2-1.1-3a1 1 0 01-.03-.37z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4v12.02H3V8.98zM9 8.98h3.83v1.64h.05c.53-.99 1.84-2.04 3.79-2.04 4.05 0 4.8 2.67 4.8 6.14v6.28h-4v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9V8.98z" />
    </svg>
  );
}
