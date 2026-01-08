import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#F8F7F5] to-[#EDECE9] dark:from-neutral-950 dark:to-neutral-900"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-8"
      >
        Kylan
      </motion.h1>

      <motion.div
        className="w-16 h-16 border-4 border-gray-300 dark:border-neutral-700 border-t-indigo-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-8 text-lg text-gray-600 dark:text-gray-400"
      >
        Chargement...
      </motion.p>
    </motion.div>
  );
};

export default Loader;