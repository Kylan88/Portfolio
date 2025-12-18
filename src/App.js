import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useDarkMode from "./useDarkMode";
import { Link as ScrollLink, Element } from "react-scroll";
import emailjs from '@emailjs/browser';
import ContactModal from "./components/ContactModal";


/* ================= ANIMATIONS ================= */
const menuLeftVariants = {
  hidden: { opacity: 0, scaleX: 0, originX: 1 },
  visible: { opacity: 1, scaleX: 1, transition: { type: "spring", stiffness: 120, damping: 18, mass: 0.6 } },
  exit: { opacity: 0, scale: 0.6, transition: { duration: 0.35, ease: "easeInOut" } },
};

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

/* ================= APP ================= */
const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

const formRef = useRef(null);
const [status, setStatus] = useState(null); // null, "sending", "success", "error"

const sendEmail = (e) => {
  e.preventDefault();
  setStatus("sending");

  emailjs.sendForm(
    "service_7n64b5v",     // ← remplace par ton Service ID
    "template_r6fceab",    // ← remplace par ton Template ID
    formRef.current,
    "1mFdI4a1FGtVAtYwY"      // ← remplace par ta Public Key
  )
    .then(() => {
      setStatus("success");
      formRef.current.reset();
      setTimeout(() => setStatus(null), 5000); // Reset après 5s
    })
    .catch((error) => {
      console.error(error);
      setStatus("error");
    });
};
  const [isDark, setIsDark] = useDarkMode();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F5] to-[#EDECE9] dark:from-neutral-950
     dark:to-neutral-900 flex items-start justify-center py-12 px-4 transition-colors duration-300">
    <main className="bg-[#FFFFFF] dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-3xl 
  shadow-2xl w-full max-w-lg md:max-w-4xl lg:max-w-[90vw] overflow-hidden transition-colors duration-300">

        {/* MENU HEADER */}
        <div className="relative flex justify-end p-8">
          <div ref={menuRef} className="relative z-50 flex items-center gap-4 h-12">
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  variants={menuLeftVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 h-12 flex items-center bg-white dark:bg-neutral-900 rounded-full shadow-xl border border-gray-100 dark:border-neutral-800 px-6 overflow-hidden whitespace-nowrap"
                >
                  <nav className="flex flex-row gap-8">
  {[
    { name: "Accueil", to: "accueil" },
    { name: "Services", to: "services" },
    { name: "Portfolio", to: "portfolio" },
    { name: "Contact", to: "contact" },
    { name: "Télécharger CV", href: "/cv.pdf", download: true }, // ← Nouveau item avec download
  ].map((item) => (
    item.to ? (
      <ScrollLink
        key={item.name}
        to={item.to}
        smooth={true}
        duration={800}
        offset={-100}
        onClick={() => setMenuOpen(false)}
        className="text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer dark:text-gray-400 dark:hover:text-white"
      >
        {item.name}
      </ScrollLink>
    ) : (
      <motion.a
        key={item.name}
        href={item.href}
        download={item.download}
        onClick={() => setMenuOpen(false)}
        className="text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer dark:text-gray-400 dark:hover:text-white"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {item.name}
      </motion.a>
    )
  ))}
</nav>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!menuOpen && (
                <motion.button
                  key="trigger"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                  onClick={() => setMenuOpen(true)}
                  className="absolute right-0 w-12 h-12 flex items-center justify-center text-3xl font-light text-gray-800 hover:scale-110 transition-transform dark:text-gray-100"
                >
                  ☰
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ================= ACCUEIL (HERO) ================= */}
<Element name="accueil">
  <motion.section
    className="px-8 pb-12 text-center md:text-left md:grid md:grid-cols-3 md:gap-16 lg:gap-32 md:items-center md:px-12 lg:px-24 relative"
    initial="hidden"
    animate="visible"
    variants={stagger}
  >
    {/* LEFT – Texte */}
    <motion.div className="space-y-6 md:col-span-1 z-10" variants={stagger}>
      <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-gray-400">Hey, je suis Kylan,</motion.p>
      <motion.h1 variants={fadeUp} 
        className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-right md:text-left pl-8 md:pl-0 translate-x-4 md:translate-x-8 lg:translate-x-12">
        Développeur Web<br />
        <span className="italic font-medium">& Web Designer</span>
      </motion.h1>
      <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 leading-relaxed">
        Je conçois et développe des interfaces web modernes, responsives et centrées sur l’utilisateur, en alliant design soigné et intégration front-end efficace.
      </motion.p>
      <motion.button
        variants={fadeUp}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsContactOpen(true)}
        className="mt-8 relative inline-flex items-center gap-4 px-12 py-6 rounded-full bg-black text-white font-semibold text-xl overflow-hidden shadow-xl group cursor-pointer"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
        <span className="absolute inset-0 bg-gradient-to-r from-black to-gray-900 opacity-90 group-hover:opacity-0 transition-opacity duration-500"></span>
        <span className="relative z-10">Me contacter</span>
        <svg className="w-7 h-7 relative z-10 transition-transform duration-300 group-hover:translate-x-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7" />
        </svg>
      </motion.button>
    </motion.div>

    {/* IMAGE – agrandie et remontée un peu plus haut */}
<div className="my-12 md:my-0 md:col-span-1 flex justify-center -mt-20 md:-mt-56 lg:-mt-72 xl:-mt-96 relative z-50">
  <motion.div
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="w-72 h-72 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] xl:w-[480px] xl:h-[480px] rounded-full overflow-hidden shadow-2xl border-8 border-white"
  >
    <img
      src="/img/profil.png"
      alt="Kylan"
      className="w-full h-full object-cover"
    />
  </motion.div>
</div>

    {/* RIGHT – Stats + Skills */}
    <motion.div className="space-y-12 md:col-span-1 text-center md:text-right z-10" variants={stagger}>
      {[
        ["1+", "Année d'apprentissage et de pratique"],
        ["5+", "Projets académiques et personnels"],
        ["80%", "Satisfaction sur les projets livrés"],
      ].map(([value, label]) => (
        <motion.div key={value} variants={fadeUp}>
          <h3 className="text-4xl font-bold">{value}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{label}</p>
        </motion.div>
      ))}
      <motion.div variants={fadeUp} className="mt-12">
        <h4 className="text-xl font-bold">Front-end</h4>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          HTML • CSS • JavaScript • Figma • React.js • React Native
        </p>
      </motion.div>
    </motion.div>
  </motion.section>
</Element>
        {/* ================= SERVICES ================= */}
        <Element name="services">
          <motion.section className="px-8 pt-12 border-t border-gray-200 dark:border-neutral-800 lg:px-24" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 text-center md:text-left">
              {[
                ["Développement Web", "Création de sites web performants, modernes et optimisés pour tous les écrans."],
                ["Web Design & UI/UX", "Conception d'interfaces intuitives et esthétiques, pensées pour l'utilisateur final."],
                ["Intégration Front-end", "Transformation de maquettes Figma en interfaces web fonctionnelles et responsives."],
                ["Branding Digital", "Création d'identités visuelles cohérentes pour renforcer la présence en ligne."],
              ].map(([title, desc]) => (
                <motion.div key={title} variants={fadeUp}>
                  <h4 className="font-semibold text-lg">{title}</h4>
                  <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </Element>

       {/* ================= PORTFOLIO ================= */}
<Element name="portfolio">
  <motion.section className="px-8 py-20 lg:px-24" initial="hidden" whileInView="visible" viewport={{ once: true }}>
    <motion.h2 className="text-4xl font-bold text-center md:text-left" variants={fadeUp}>Portfolio</motion.h2>
    <p className="mt-6 text-gray-600 dark:text-gray-400 text-center md:text-left text-lg">
      Conception et intégration d'interfaces modernes, responsives et orientées expérience utilisateur. Projets en développement local avec code sur GitHub.
    </p>

    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {/* Projet : Application de Recouvrement de Créances */}
<motion.div
  variants={fadeUp}
  whileHover={{ scale: 1.05, y: -10 }}
  className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
>
  <div className="relative">
    {/* Vidéo locale (mp4) */}
    <video
      src="/videos/recouvrement-demo.mp4" // ← Ton fichier vidéo ici
      autoPlay
      muted
      loop
      playsInline
      poster="/img/projects/recouvrement-dashboard.png" // ← Image de fallback
      className="w-full h-64 object-cover"
    >
      <source src="/videos/recouvrement-demo.mp4" type="video/mp4" />
      Votre navigateur ne supporte pas la vidéo.
    </video>

    {/* Badge Full-Stack */}
    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
      Full-Stack
    </div>
  </div>
  <div className="p-6">
    <h3 className="text-xl font-bold mb-2">Application de Recouvrement de Créances</h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
      Plateforme complète de gestion de recouvrement de créances pour entreprises. Suivi des impayés, relances automatiques, paiements, statistiques et gestion multi-utilisateurs. Développée avec React (frontend) et Flask/Python (backend avec SQLite).
    </p>
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">React</span>
      <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full text-xs">Tailwind CSS</span>
      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs">Framer Motion</span>
      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs">Flask</span>
      <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">SQLite</span>
      <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-xs">Socket.io</span>
      <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs">Authentification</span>
    </div>
    <div className="flex gap-4">
            <a href="https://github.com/Kylan88/gestion-creances.git" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Code source
            </a>
            
          </div>
        </div>
      </motion.div>

      {/* Ajoute d'autres projets ici en dupliquant le bloc motion.div */}
      {/* Exemple : Projet 2 */}
      {/* <motion.div ... > ... </motion.div> */}
    </div>
  </motion.section>
</Element>

        {/* ================= CONTACT ================= */}
<Element name="contact">
  <motion.section 
    className="px-8 py-20 lg:px-24 bg-gray-50 dark:bg-neutral-950" 
    initial="hidden" 
    whileInView="visible" 
    viewport={{ once: true }} 
    variants={fadeUp}
  >
    <h2 className="text-3xl md:text-4xl font-bold text-center">Contactez-moi</h2>
    <p className="mt-6 text-center text-gray-700 dark:text-gray-300">Vous avez un projet ? Envoyez-moi un message !</p>

    <form 
      ref={formRef} 
      onSubmit={sendEmail} 
      className="mt-12 max-w-2xl mx-auto space-y-6"
    >
      <input 
        type="text" 
        name="from_name" 
        placeholder="Votre nom" 
        required 
        className="w-full p-4 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
      />
      <input 
        type="email" 
        name="reply_to" 
        placeholder="Votre email" 
        required 
        className="w-full p-4 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
      />
      <textarea 
        name="message" 
        placeholder="Votre message" 
        rows="5" 
        required 
        className="w-full p-4 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
      ></textarea>
      <button 
        type="submit" 
        disabled={status === "sending"}
        className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {status === "sending" ? "Envoi en cours..." : status === "success" ? "Message envoyé !" : "Envoyer"}
      </button>
      {status === "error" && <p className="text-red-500 text-center">Erreur lors de l'envoi. Réessayez.</p>}
    </form>
  </motion.section>
</Element>

 {/* ================= CONTACT MODAL ================= */}
   <ContactModal 
                isOpen={isContactOpen} 
                onClose={() => setIsContactOpen(false)} 
  />
        {/* ================= FOOTER ================= */}
<footer className="px-8 py-16 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-neutral-800 lg:px-24">
  <p className="flex flex-wrap justify-center gap-8 text-lg font-medium">
    <a
      href="mailto:tonemail@example.com?subject=Contact%20depuis%20ton%20portfolio"
      className="hover:text-black dark:hover:text-white transition-transform hover:scale-105"
    >
      Email
    </a>
    <a
      href="https://wa.me/+225XXXXXXXXXX?text=Salut%20Kylan%2C%20je%20viens%20de%20ton%20portfolio"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-green-600 dark:hover:text-green-400 transition-transform hover:scale-105"
    >
      WhatsApp
    </a>
    <a
      href="https://t.me/myusername"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-blue-600 dark:hover:text-blue-400 transition-transform hover:scale-105"
    >
      Telegram
    </a>
    <a
      href="https://github.com/myusername"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-purple-600 dark:hover:text-purple-400 transition-transform hover:scale-105"
    >
      GitHub
    </a>
  </p>
  <p className="mt-8">© 2026 — Jeff Akroman Développeur Web & Web Designer</p>
</footer>

        {/* Bouton Dark Mode (fixé en bas à droite) */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDark(!isDark)}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 shadow-lg z-50 transition-colors"
        >
          {isDark ? "☀️" : "🌙"}
        </motion.button>
      </main>
    </div>
  );
};

export default App;