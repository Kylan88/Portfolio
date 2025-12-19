import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useDarkMode from "./useDarkMode";
import { Link as ScrollLink, Element } from "react-scroll";
import emailjs from '@emailjs/browser';
import ContactModal from "./components/ContactModal";

/* ================= ANIMATIONS ================= */
const menuVariants = {
  hidden: { 
    opacity: 0, 
    y: -20, // Slide du haut vers le bas
    scale: 0.95, 
    originX: 1, 
    originY: 0 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 25 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 0.2 } 
  },
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
      "service_7n64b5v",     // Service ID
      "template_r6fceab",    //  Template ID
      formRef.current,
      "1mFdI4a1FGtVAtYwY"     //  Public Key // emailjs
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
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F5] to-[#EDECE9] dark:from-neutral-950 dark:to-neutral-900 flex items-start justify-center py-12 px-4 transition-colors duration-300">
      <main className="bg-[#FFFFFF] dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-3xl shadow-2xl main-container overflow-hidden transition-colors duration-300">

        {/* MENU HEADER */}
        <div className="relative flex justify-end p-6 sm:p-8">
          <div ref={menuRef} className="relative z-50 flex items-center h-12">
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  /* Ajustements : -right-2 pour coller au bord, p-5 pour réduire la taille interne */
                  className="absolute -right-2 top-0 mt-0 flex flex-col items-center bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 dark:border-neutral-800 p-5 z-[60] min-w-[160px] sm:relative sm:right-0 sm:flex-row sm:h-10 sm:p-6 sm:rounded-full"
                >
                  <nav className="flex flex-col gap-5 items-end sm:items-center sm:flex-row sm:gap-6">
                    {[
                      { name: "accueil", to: "accueil" },
                      { name: "Service", to: "services" },
                      { name: "portfolio", to: "portfolio" },
                      { name: "Contact", to: "contact" },
                      { name: "télécharger cv", href: "/cv.pdf", download: true },
                    ].map((item) => (
                      item.to ? (
                        <ScrollLink
                          key={item.name}
                          to={item.to}
                          smooth={true}
                          onClick={() => setMenuOpen(false)}
                          /* Texte réduit et aligné à droite sur mobile */
                          className="text-base sm:text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition-colors cursor-pointer capitalize whitespace-nowrap"
                        >
                          {item.name}
                        </ScrollLink>
                      ) : (
                        <a
                          key={item.name}
                          href={item.href}
                          download={item.download}
                          className="text-base sm:text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-indigo-600 capitalize whitespace-nowrap"
                        >
                          {item.name}
                        </a>
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
                  /* Aligné sur le bord droit */
                  className="absolute right-0 w-10 h-10 flex items-center justify-end text-3xl font-light text-gray-800 hover:scale-110 transition-transform dark:text-gray-100"
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
            className="hero-section"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* LEFT – Texte (au-dessus avec fond semi-transparent) */}
            <motion.div className="hero-left" variants={stagger}>
              <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-gray-400 text-center md:text-left">
                Hey, je suis Kylan,
              </motion.p>
              <motion.h1 variants={fadeUp} className="hero-title">
                Développeur Web<br />
                <span className="italic font-medium">& Web Designer</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg">
                Je conçois et développe des interfaces web modernes, responsives et centrées sur l’utilisateur, en alliant design soigné et intégration front-end efficace.
              </motion.p>
              <motion.button
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsContactOpen(true)}
                className="hero-button group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-black to-gray-900 opacity-90 group-hover:opacity-0 transition-opacity duration-500"></span>
                <span className="hero-button-text">Me contacter</span>
                <svg className="w-7 h-7 relative z-10 transition-transform duration-300 group-hover:translate-x-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7" />
                </svg>
              </motion.button>
            </motion.div>

            {/* IMAGE (en dessous du texte) */}
            <div className="hero-image-container">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hero-image"
              >
                <img
                  src="/img/profil.png"
                  alt="Kylan"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* RIGHT – Stats + Skills */}
            <motion.div className="hero-right" variants={stagger}>
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
          <motion.section className="section-padding pt-12 border-t border-gray-200 dark:border-neutral-800" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <div className="services-grid">
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
          <motion.section className="section-padding py-20" initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 className="text-4xl font-bold text-center md:text-left" variants={fadeUp}>Portfolio</motion.h2>
            <p className="mt-6 text-gray-600 dark:text-gray-400 text-center md:text-left text-lg">
              Conception et intégration d'interfaces modernes, responsives et orientées expérience utilisateur. Projets en développement local avec code sur GitHub.
            </p>

            <div className="mt-16 portfolio-grid">
              {/* Projet : Application de Recouvrement de Créances */}
              <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.05, y: -10 }}
                className="portfolio-card"
              >
                <div className="relative pb-[56.25%] h-0 overflow-hidden">
                  <img
                    src="/img/demo.jpg"
                    alt="Démo Recouvrement"
                    className="absolute top-0 left-0 w-full h-full object-cover z-10"
                  />
                  <iframe
                    src="https://www.youtube.com/embed/ywlo_jZpJEw?autoplay=1&mute=1&loop=1&playlist=ywlo_jZpJEw&controls=0&rel=0&modestbranding=1"
                    title="Démo Application de Recouvrement de Créances"
                    className="absolute top-0 left-0 w-full h-full z-20"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
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
              {/* Futur projets ici */}
            </div>
          </motion.section>
        </Element>

        {/* ================= CONTACT ================= */}
        <Element name="contact">
          <motion.section
            className="section-padding py-20 bg-gray-50 dark:bg-neutral-950"
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
              className="contact-form"
            >
              <input
                type="text"
                name="from_name"
                placeholder="Votre nom"
                required
                className="contact-input"
              />
              <input
                type="email"
                name="reply_to"
                placeholder="Votre email"
                required
                className="contact-input"
              />
              <textarea
                name="message"
                placeholder="Votre message"
                rows="5"
                required
                className="contact-input"
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
        <footer className="section-padding py-16 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-neutral-800">
          <p className="footer-links">
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

        {/* Bouton Dark Mode */}
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