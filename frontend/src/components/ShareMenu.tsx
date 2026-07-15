import {
  Check,
  Copy,
  Share2,
} from "lucide-react";

import { useState } from "react";

interface ShareMenuProps {
  title: string;
}

export default function ShareMenu({
  title,
}: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = window.location.href;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      await handleCopy();
      return;
    }

    try {
      await navigator.share({
        title,
        url,
      });
    } catch {
      // User cancelled native share.
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `${title}\n${url}`
    );

    window.open(
      `https://wa.me/?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="relative ml-auto">
      <button
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <Share2 size={17} />
        Share
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-20 w-48 rounded-xl border border-border bg-surface p-2 shadow-lg">
          <button
            onClick={handleCopy}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-border/50"
          >
            {copied ? (
              <Check size={16} />
            ) : (
              <Copy size={16} />
            )}

            {copied ? "Copied" : "Copy link"}
          </button>

          <button
            onClick={handleNativeShare}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-border/50"
          >
            <Share2 size={16} />
            Share via device
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-border/50"
          >
            <span className="w-4 text-center font-semibold">
              W
            </span>
            WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}