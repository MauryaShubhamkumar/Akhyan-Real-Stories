import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareMenuProps {
  title: string;
}

export default function ShareMenu({ title }: ShareMenuProps) {
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
    const text = encodeURIComponent(`${title}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative ml-auto">
      <button
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 text-sm text-muted hover:text-ink cursor-pointer transition-colors"
      >
        <Share2 size={17} />
        Share
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-9 z-20 w-48 rounded-xl border border-border bg-paper p-2 shadow-lg"
            >
              <button
                onClick={() => {
                  handleCopy();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-surface cursor-pointer transition-colors"
              >
                {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy link"}
              </button>

              <button
                onClick={() => {
                  handleNativeShare();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-surface cursor-pointer transition-colors"
              >
                <Share2 size={16} />
                Share via device
              </button>

              <button
                onClick={() => {
                  handleWhatsAppShare();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-surface cursor-pointer transition-colors"
              >
                <span className="w-4 text-center font-bold text-emerald-600">W</span>
                WhatsApp
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
