// src/components/ContactModal.jsx
import React from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import contact from "../config/contact";

// ─── Vrais logos SVG des marques ───
const EmailIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#EA4335"/>
    <path d="M4.5 7.5h15L12 13.5 4.5 7.5z" fill="white"/>
    <path d="M4.5 7.5v9h15v-9" stroke="white" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
    <path d="M4.5 7.5L12 13.5l7.5-6" stroke="white" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#25D366"/>
    <path d="M12 4.5a7.5 7.5 0 0 0-6.47 11.28L4.5 19.5l3.84-1.01A7.5 7.5 0 1 0 12 4.5z" fill="white"/>
    <path d="M9.6 8.4c-.17-.38-.36-.39-.52-.4H8.7c-.17 0-.44.06-.67.32C7.8 8.6 7.2 9.16 7.2 10.3c0 1.14.83 2.25.95 2.4.12.16 1.6 2.55 3.94 3.47.55.24.98.38 1.32.48.55.18 1.06.15 1.46.09.45-.07 1.38-.56 1.57-1.11.2-.55.2-1.01.14-1.11-.06-.1-.22-.16-.46-.28-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.17-.7-.62-1.17-1.39-1.31-1.63-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78z" fill="#25D366"/>
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#229ED9"/>
    <path d="M5.2 11.7l12.1-4.66c.56-.2 1.05.14.87.99l-2.06 9.7c-.15.68-.56.84-1.13.52l-3.1-2.28-1.5 1.44c-.17.17-.3.3-.62.3l.22-3.14 5.74-5.18c.25-.22-.05-.35-.39-.13L7.28 13.87 4.22 12.9c-.67-.2-.68-.67.98-1.2z" fill="white"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#24292F"/>
    <path d="M12 5.5a6.5 6.5 0 0 0-2.05 12.67c.32.06.44-.14.44-.31v-1.1c-1.8.39-2.18-.87-2.18-.87-.3-.75-.72-.95-.72-.95-.59-.4.04-.4.04-.4.65.05.99.67.99.67.58 1 1.52.71 1.89.54.06-.42.23-.71.41-.87-1.44-.16-2.96-.72-2.96-3.2 0-.7.25-1.28.67-1.73-.07-.16-.29-.82.06-1.7 0 0 .55-.18 1.79.67a6.2 6.2 0 0 1 3.26 0c1.24-.85 1.78-.67 1.78-.67.36.88.13 1.54.07 1.7.42.45.66 1.03.66 1.73 0 2.49-1.52 3.04-2.97 3.2.23.2.44.6.44 1.2v1.78c0 .17.12.38.45.31A6.5 6.5 0 0 0 12 5.5z" fill="white"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#0A66C2"/>
    <path d="M7.5 10H5.5v8.5h2V10zM6.5 9a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 6.5 9z" fill="white"/>
    <path d="M9.5 10v8.5h2v-4.25c0-1.1.9-2 2-2s2 .9 2 2v4.25h2v-4.75a3.5 3.5 0 0 0-3.5-3.5 3.44 3.44 0 0 0-2.5 1.07V10h-2z" fill="white"/>
  </svg>
);

// ─── Config des réseaux ───
// Pour activer LinkedIn, ajoute "linkedin" dans src/config/contact.js
const socials = [
  {
    key: "email",
    label: "Email",
    sublabel: (c) => c.email,
    href: (c) => `mailto:${c.email}?subject=Contact%20depuis%20ton%20portfolio`,
    icon: <EmailIcon />,
    hover: "hover:bg-red-50 dark:hover:bg-red-950/30",
    ring: "hover:border-red-200 dark:hover:border-red-900",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    sublabel: () => "Message direct",
    href: (c) => c.whatsapp,
    icon: <WhatsAppIcon />,
    hover: "hover:bg-green-50 dark:hover:bg-green-950/30",
    ring: "hover:border-green-200 dark:hover:border-green-900",
    external: true,
  },
  {
    key: "telegram",
    label: "Telegram",
    sublabel: (c) => c.telegram?.replace("https://t.me/", "@"),
    href: (c) => c.telegram,
    icon: <TelegramIcon />,
    hover: "hover:bg-sky-50 dark:hover:bg-sky-950/30",
    ring: "hover:border-sky-200 dark:hover:border-sky-900",
    external: true,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    sublabel: () => "Mon profil professionnel",
    href: (c) => c.linkedin,
    icon: <LinkedInIcon />,
    hover: "hover:bg-blue-50 dark:hover:bg-blue-950/30",
    ring: "hover:border-blue-200 dark:hover:border-blue-900",
    external: true,
  },
  {
    key: "github",
    label: "GitHub",
    sublabel: (c) => c.github?.replace("https://github.com/", ""),
    href: (c) => c.github,
    icon: <GitHubIcon />,
    hover: "hover:bg-gray-50 dark:hover:bg-neutral-800",
    ring: "hover:border-gray-200 dark:hover:border-neutral-700",
    external: true,
  },
];

const ContactModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
          {/* Fond sombre */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-6 max-w-sm w-full relative border border-gray-100 dark:border-neutral-800"
            >
              {/* Bouton fermer */}
              <button
                onClick={onClose}
                aria-label="Fermer la modal"
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition text-xl leading-none"
              >
                ×
              </button>

              <h2 className="text-xl font-bold text-center mb-1 dark:text-gray-100">
                Me contacter
              </h2>
              <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-6">
                Choisissez votre canal préféré
              </p>

              <div className="space-y-1.5">
                {socials.map(({ key, label, sublabel, href, icon, hover, ring, external }) => {
                  const url = href(contact);
                  // Cache les entrées dont l'URL n'est pas configurée
                  if (!url || url.includes("undefined") || url === "mailto:undefined") return null;
                  return (
                    <motion.a
                      key={key}
                      href={url}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`flex items-center gap-4 p-3.5 rounded-2xl border border-transparent ${ring} ${hover} transition-all duration-200 group`}
                    >
                      {/* Icône */}
                      <div className="flex-shrink-0">
                        {icon}
                      </div>

                      {/* Texte */}
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 block">
                          {label}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 truncate block">
                          {sublabel(contact)}
                        </span>
                      </div>

                      {/* Chevron */}
                      <svg
                        className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;