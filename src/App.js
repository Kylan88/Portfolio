import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useDarkMode from "./useDarkMode";
import { Link as ScrollLink, Element } from "react-scroll";
import emailjs from '@emailjs/browser';
import ContactModal from "./components/ContactModal";
import Loader from "./components/Loader";
import contact from "./config/contact"; // ← Source unique des liens
import ScrollProgressBar from "./components/ScrollProgressBar";

/*  ANIMATIONS  */
const menuVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.95, originX: 1, originY: 0 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 25 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

/*  APP  */
const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const formRef = useRef(null);
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"

  // Clés EmailJS depuis les variables d'environnement 
  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");

    emailjs.sendForm(
      process.env.REACT_APP_EMAILJS_SERVICE,
      process.env.REACT_APP_EMAILJS_TEMPLATE,
      formRef.current,
      process.env.REACT_APP_EMAILJS_KEY
    )
      .then(() => {
        setStatus("success");
        formRef.current.reset();
        setTimeout(() => setStatus(null), 5000);
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

  //Loader intelligent — attend la vraie fin de chargement 
  // On attend : fonts prêtes + image profil chargée, avec timeout max 1.5s
  const finishLoading = useCallback(() => setLoading(false), []);

  useEffect(() => {
    let done = false;
    const maxTimer = setTimeout(() => {
      if (!done) { done = true; finishLoading(); }
    }, 1500); // timeout de secours

    const profilImg = new Image();
    profilImg.src = "/img/profil.png";

    Promise.all([
      document.fonts.ready,
      new Promise((res) => {
        if (profilImg.complete) res();
        else { profilImg.onload = res; profilImg.onerror = res; }
      }),
    ]).then(() => {
      if (!done) { done = true; clearTimeout(maxTimer); finishLoading(); }
    });

    return () => clearTimeout(maxTimer);
  }, [finishLoading]);

  return (
    <>
      {/* BARRE DE PROGRESSION */}
      <ScrollProgressBar />

      {/* LOADER */}
      <AnimatePresence mode="wait">
        {loading && <Loader />}
      </AnimatePresence>

      {!loading && (
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
                      className="absolute -right-2 top-0 mt-0 flex flex-col items-center bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 dark:border-neutral-800 p-5 z-[60] min-w-[160px] sm:relative sm:right-0 sm:flex-row sm:h-10 sm:p-6 sm:rounded-full"
                    >
                      <nav className="flex flex-col gap-5 items-end sm:items-center sm:flex-row sm:gap-6">
                        {[
                          { name: "accueil", to: "accueil" },
                          { name: "à propos", to: "apropos" },
                          { name: "Service", to: "services" },
                          { name: "portfolio", to: "portfolio" },
                          { name: "Contact", to: "contact" },
                          { name: "télécharger cv", href: contact.cv, download: true },
                        ].map((item) => (
                          item.to ? (
                            <ScrollLink
                              key={item.name}
                              to={item.to}
                              smooth={true}
                              onClick={() => setMenuOpen(false)}
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
                      aria-label="Ouvrir le menu de navigation" // ← accessibilité
                      className="absolute right-0 w-10 h-10 flex items-center justify-end text-3xl font-light text-gray-800 hover:scale-110 transition-transform dark:text-gray-100"
                    >
                      ☰
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ACCUEIL (HERO) */}
            <Element name="accueil">
              <motion.section
                className="hero-section"
                initial="hidden"
                animate="visible"
                variants={stagger}
              >
                <motion.div className="hero-left" variants={stagger}>
                  <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-gray-400 text-center md:text-left">
                    Hey, je suis Kylan,
                  </motion.p>
                  <motion.h1 variants={fadeUp} className="hero-title">
                    Développeur Web<br />
                    <span className="italic font-medium">& Web Designer</span>
                  </motion.h1>
                  <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg">
                    Je conçois et développe des interfaces web modernes, responsives et centrées sur l'utilisateur, en alliant design soigné et intégration front-end efficace.
                  </motion.p>
                                             <motion.button
  variants={fadeUp}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => setIsContactOpen(true)}
  className="hero-button group relative overflow-hidden bg-black hover:bg-purple-600 transition-colors duration-300"
>
  <span className="hero-button-text relative z-10 text-white">
    Me contacter
  </span>

  <svg
    className="w-7 h-7 relative z-10 text-white transition-transform duration-300 group-hover:translate-x-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M13 5l7 7-7 7"
    />
  </svg>
</motion.button>
                </motion.div>

                <div className="hero-image-container">
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hero-image"
                  >
                    <img
                      src="/img/profil.png"
                      alt="Jeff Akroman — Développeur Web & Web Designer"
                      loading="eager"
                      fetchpriority="high"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>

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

            {/* À PROPOS */}
            <Element name="apropos">
              <motion.section
                className="section-padding py-16 border-t border-gray-200 dark:border-neutral-800"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <motion.div variants={fadeUp}>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">
                      À propos
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                      Passionné par le web et le digital<br />
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base mb-4">
                      Titulaire d'une licence en E-administration et transformation digital, je me spécialise dans la création d'interfaces front-end modernes et performantes. Mon approche mêle sens du design et rigueur technique.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                      Autodidacte et curieux, j'ai bâti mes compétences sur des projets concrets, de la maquette Figma à l'intégration React complète. Mon objectif : livrer des expériences utilisateur qui marquent les esprits.
                    </p>
                  </motion.div>

                  <motion.div variants={fadeUp} className="space-y-5">
                    {[
                      { label: "HTML & CSS", pct: 90 },
                      { label: "JavaScript & React", pct: 40 },
                      { label: "Figma & UI Design", pct: 75 },
                      { label: "Flask & Python", pct: 30 },
                      { label: "Node js", pct: 20 },
                    ].map(({ label, pct }) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-800 dark:text-gray-200">{label}</span>
                          <span className="text-gray-500 dark:text-gray-400">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.section>
            </Element>

            {/* SERVICES */}
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

            {/* PORTFOLIO */}
            <Element name="portfolio">
              <motion.section className="section-padding py-20" initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.h2 className="text-4xl font-bold text-center md:text-left" variants={fadeUp}>Portfolio</motion.h2>
                <p className="mt-6 text-gray-600 dark:text-gray-400 text-center md:text-left text-lg">
                  Conception et intégration d'interfaces modernes, responsives et orientées expérience utilisateur. Projets en développement local avec code sur GitHub.
                </p>

                <div className="mt-16 portfolio-grid">
                  <motion.div
                    variants={fadeUp}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="portfolio-card"
                  >
                    <div className="relative pb-[56.25%] h-0 overflow-hidden">
                      <img
                        src="/img/demo.jpg"
                        alt="Démo Recouvrement"
                        loading="lazy"
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
                  {/* CARD EN COURS 1 */}
                  <motion.div
                    variants={fadeUp}
                    whileHover={{ scale: 1.03, y: -6 }}
                    className="portfolio-card opacity-80"
                  >
                    <div className="relative pb-[56.25%] h-0 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-sm text-indigo-500 font-medium">En cours de développement</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        En cours
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">MUTUA – Application de gestion de tontine et de cotisation</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        MUTUA est une application mobile fintech conçue pour digitaliser et simplifier la gestion des tontines et des cotisations de groupe. 
                        Elle permet aux utilisateurs de créer ou rejoindre des groupes, suivre les contributions, gérer les rotations de bénéficiaires et effectuer des paiements en toute transparence.
                        L’application met l’accent sur l’expérience utilisateur grâce à une interface moderne inspirée du glassmorphism, des notifications intelligentes et un système de suivi en temps réel.
                        MUTUA vise à renforcer la confiance entre les membres tout en éliminant les contraintes liées à la gestion manuelle des tontines.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">Flutter (frontend mobile)</span>
                        <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full text-xs">Node.js (backend)</span>
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs">API REST</span>
                         <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs">base de données (PostgreSQL).</span>
                      </div>
                      <span className="text-amber-500 text-sm font-medium"> Disponible bientôt</span>
                    </div>
                  </motion.div>

                  {/* CARD EN COURS 2 */}
                  <motion.div
                    variants={fadeUp}
                    whileHover={{ scale: 1.03, y: -6 }}
                    className="portfolio-card opacity-80"
                  >
                    <div className="relative pb-[56.25%] h-0 overflow-hidden bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950 dark:to-green-950">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                            <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <p className="text-sm text-teal-500 font-medium">En cours de développement</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        En cours
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">PRIKO-application web/mobile </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        L’application intègre un système de vendeurs vérifiés qui peuvent gérer leurs produits, mettre à jour leurs prix et leurs stocks, garantissant ainsi des informations fiables et actualisées. PRIKO propose également des fonctionnalités comme la recherche intelligente, les alertes de baisse de prix et un comparateur optimisé pour aider les utilisateurs à prendre des décisions d’achat rapides et économiques.
                        PRIKO vise à améliorer la transparence des prix sur le marché local tout en créant un lien de confiance entre consommateurs et commerçants grâce à une expérience utilisateur fluide et centrée sur la performance.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">React (frontend web)</span>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">Node.js (backend)</span>
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs">API REST</span>
                        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs">base de données (PostgreSQL), géolocalisation.</span>
                      </div>
                      <span className="text-amber-500 text-sm font-medium"> Disponible bientôt</span>
                    </div>
                  </motion.div>

                </div>
              </motion.section>
            </Element>

            {/* CONTACT */}
            <Element name="contact">
              <motion.section
                className="section-padding py-20 bg-gray-50 dark:bg-neutral-950"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-center">Contactez-moi</h2>
                <p className="mt-6 text-center text-gray-700 dark:text-gray-300">Vous avez un projet ? Vous chercher une collaborations ? Envoyez-moi un message !</p>

                <form ref={formRef} onSubmit={sendEmail} className="contact-form">
                  {/* Fix accessibilité : labels visuellement cachés */}
                  <div>
                    <label htmlFor="from_name" className="sr-only">Votre nom</label>
                    <input
                      id="from_name"
                      type="text"
                      name="from_name"
                      placeholder="Votre nom"
                      required
                      className="contact-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="reply_to" className="sr-only">Votre email</label>
                    <input
                      id="reply_to"
                      type="email"
                      name="reply_to"
                      placeholder="Votre email"
                      required
                      className="contact-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="sr-only">Votre message</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Votre message"
                      rows="5"
                      required
                      className="contact-input"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:opacity-90 transition disabled:opacity-50"
                  >
                    {status === "sending" ? "Envoi en cours..." : status === "success" ? "Message envoyé !" : "Envoyer"}
                  </button>
                  {status === "error" && <p className="text-red-500 text-center">Erreur lors de l'envoi. Réessayez SVP.</p>}
                </form>
              </motion.section>
            </Element>

            {/* CONTACT MODAL */}
            <ContactModal
              isOpen={isContactOpen}
              onClose={() => setIsContactOpen(false)}
            />

            {/* FOOTER  utilise contact.js */}
            <footer className="section-padding py-16 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-neutral-800">
              <p className="footer-links">
                <a
                  href={contact.email}
                  className="hover:text-black dark:hover:text-white transition-transform hover:scale-105"
                >
                  Email
                </a>
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-600 dark:hover:text-green-400 transition-transform hover:scale-105"
                >
                  WhatsApp
                </a>
                <a
                  href={contact.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-transform hover:scale-105"
                >
                  Telegram
                </a>
                <a
                  href={contact.github}
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
              aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"} // ← accessibilité
              className="fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 shadow-lg z-50 transition-colors"
            >
              {isDark ? "☀️" : "🌙"}
            </motion.button>
          </main>
        </div>
      )}
    </>
  );
};

export default App;