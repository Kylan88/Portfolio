// src/components/ContactModal.jsx
import React from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

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

          {/* Modal centré */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
            >
              {/* Bouton fermer */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold text-center mb-8 dark:text-gray-100">
                Contactez-moi par
              </h2>

              <div className="space-y-4">
                {/* Email */}
                <a
                  href="mailto:akromanjeff8@gmail.com?subject=Contact%20depuis%20ton%20portfolio"
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 transition"
                >
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Email</span>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/+2250141819144"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 dark:bg-neutral-700 hover:bg-green-100 dark:hover:bg-green-900 transition"
                >
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm3.78 14.57a8.5 8.5 0 01-4.2 1.07 8.5 8.5 0 01-4.2-1.07l-1.3.5a1.5 1.5 0 01-1.8-1.8l.5-1.3a8.5 8.5 0 011.07-4.2 8.5 8.5 0 011.07-4.2l1.3-.5a1.5 1.5 0 011.8 1.8l-.5 1.3a8.5 8.5 0 01-1.07 4.2 8.5 8.5 0 01-1.07 4.2l-1.3.5a1.5 1.5 0 001.8-1.8l.5-1.3z" />
                  </svg>
                  <span className="font-medium">WhatsApp</span>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/jeffakroman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 dark:bg-neutral-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                >
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm3.93 6.48l-5.8 5.8a1 1 0 01-1.4 0l-2.8-2.8a1 1 0 011.4-1.4l2.1 2.1 5.1-5.1a1 1 0 011.4 1.4z" />
                  </svg>
                  <span className="font-medium">Telegram</span>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/Kylan88"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 dark:bg-neutral-700 hover:bg-purple-100 dark:hover:bg-purple-900 transition"
                >
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 00-3.16 19.5c.5.1.68-.22.68-.48v-1.68c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.71.11 2.52.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .26.18.58.68.48A10 10 0 0012 2z" />
                  </svg>
                  <span className="font-medium">GitHub</span>
                </a>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;