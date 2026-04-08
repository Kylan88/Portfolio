import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useDarkMode from "./useDarkMode";
import { Link as ScrollLink, Element } from "react-scroll";
import emailjs from '@emailjs/browser';
import ContactModal from "./components/ContactModal";
import Loader from "./components/Loader";
import contact from "./config/contact";
import ScrollProgressBar from "./components/ScrollProgressBar";

/*  ANIMATIONS  */
const menuVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
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
  const [status, setStatus] = useState(null);

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");
    emailjs.sendForm(
      process.env.REACT_APP_EMAILJS_SERVICE,
      process.env.REACT_APP_EMAILJS_TEMPLATE,
      formRef.current,
      process.env.REACT_APP_EMAILJS_KEY
    ).then(() => {
      setStatus("success");
      formRef.current.reset();
      setTimeout(() => setStatus(null), 5000);
    }).catch((err) => { console.error(err); setStatus("error"); });
  };

  const [isDark, setIsDark] = useDarkMode();
  const menuRef = useRef(null);

  // Fermeture du menu lors du clic à l'extérieur
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const finishLoading = useCallback(() => setLoading(false), []);
  useEffect(() => {
    let done = false;
    const t = setTimeout(() => { if (!done) { done = true; finishLoading(); } }, 1500);
    const img = new Image();
    img.src = "/img/profil.png";
    Promise.all([
      document.fonts.ready,
      new Promise((res) => { if (img.complete) res(); else { img.onload = res; img.onerror = res; } }),
    ]).then(() => { if (!done) { done = true; clearTimeout(t); finishLoading(); } });
    return () => clearTimeout(t);
  }, [finishLoading]);

  return (
    <>
      <ScrollProgressBar />
      <AnimatePresence mode="wait">{loading && <Loader />}</AnimatePresence>

      {!loading && (
        <div className="min-h-screen bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <main className="main-container">

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
                      aria-label="Ouvrir le menu de navigation"
                      className="absolute right-0 w-10 h-10 flex items-center justify-end text-3xl font-light text-gray-800 hover:scale-110 transition-transform dark:text-gray-100"
                    >
                      ☰
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ─── HERO : texte gauche / photo fond droit ─── */}
            <Element name="accueil">
              <section className="hero-section">
                <div className="hero-image-container">
                  <div className="hero-image">
                    <img
                      src="/img/profil.png"
                      alt="Jeff Akroman — Développeur Web & Web Designer"
                      loading="eager"
                      fetchpriority="high"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>

                <motion.div className="hero-left" initial="hidden" animate="visible" variants={stagger}>
                  <motion.p variants={fadeUp} className="text-sm font-semibold text-indigo-500 tracking-widest uppercase">
                    Hey, je suis Jeff Akroman
                  </motion.p>

                  <motion.h1 variants={fadeUp} className="hero-title">
                    Développeur Web<br />
                    <span className="italic font-medium text-gray-400 dark:text-gray-500">& Web Designer</span>
                  </motion.h1>

                  <motion.p variants={fadeUp} className="text-gray-500 dark:text-gray-400 leading-relaxed text-base sm:text-lg max-w-md">
                    Je conçois et développe des interfaces web modernes, responsives et centrées sur l'utilisateur.
                  </motion.p>

                  <motion.div variants={fadeUp} className="flex flex-wrap gap-4 items-center">
                    <motion.button
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setIsContactOpen(true)}
                      className="hero-button group hover:bg-indigo-600 transition-colors duration-300"
                    >
                      <span className="hero-button-text">Me contacter</span>
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7" />
                      </svg>
                    </motion.button>

                    <a href={contact.cv} download
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 font-semibold text-base hover:border-indigo-400 hover:text-indigo-600 transition-all duration-300">
                      CV
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </motion.div>

                  <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
                    {["React", "Tailwind", "Figma", "Flask", "React Native"].map((tech) => (
                      <span key={tech} className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 rounded-full border border-gray-200 dark:border-neutral-700">
                        {tech}
                      </span>
                    ))}
                  </motion.div>
                </motion.div>

                <motion.div className="hero-right" initial="hidden" animate="visible" variants={stagger}>
                  {[["1+", "An d'expérience"], ["5+", "Projets réalisés"], ["80%", "Satisfaction clients"]].map(([v, l]) => (
                    <motion.div key={v} variants={fadeUp}>
                      <h3 className="text-3xl md:text-4xl font-bold">{v}</h3>
                      <p className="text-xs text-gray-400 mt-1 max-w-[90px] md:ml-auto">{l}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            </Element>

            {/* ─── À PROPOS ─── */}
            <Element name="apropos">
              <motion.section className="section-padding py-20 border-t border-gray-100 dark:border-neutral-800"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
                  <motion.div variants={fadeUp}>
                    <p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-4">À propos</p>
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">Passionné par le web et le digital</h2>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                      Titulaire d'une licence en E-administration et transformation digital, je me spécialise dans la création d'interfaces front-end modernes et performantes. Mon approche mêle sens du design et rigueur technique.
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                      Autodidacte et curieux, j'ai bâti mes compétences sur des projets concrets, de la maquette Figma à l'intégration React complète. Mon objectif : livrer des expériences utilisateur qui marquent les esprits.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-8">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-neutral-800 rounded-full text-sm font-medium">Abidjan, Côte d'Ivoire</span>
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
                        Disponible pour projets
                      </span>
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUp} className="space-y-5">
                    {[
                      { label: "HTML & CSS", pct: 90 },
                      { label: "JavaScript & React", pct: 40 },
                      { label: "Figma & UI Design", pct: 75 },
                      { label: "Flask & Python", pct: 30 },
                      { label: "Node.js", pct: 20 },
                    ].map(({ label, pct }) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium">{label}</span>
                          <span className="text-gray-400">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 dark:bg-neutral-700 rounded-full overflow-hidden">
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

            {/* ─── SERVICES ─── */}
            <Element name="services">
              <motion.section className="section-padding py-20 border-t border-gray-100 dark:border-neutral-800"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                <motion.p variants={fadeUp} className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-4">Services</motion.p>
                <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-14">Ce que je propose</motion.h2>
                <div className="services-grid">
                  {[
                    ["01", "Développement Web", "Création de sites web performants, modernes et optimisés pour tous les écrans."],
                    ["02", "Web Design & UI/UX", "Conception d'interfaces intuitives et esthétiques, pensées pour l'utilisateur final."],
                    ["03", "Intégration Front-end", "Transformation de maquettes Figma en interfaces web fonctionnelles et responsives."],
                    ["04", "Branding Digital", "Création d'identités visuelles cohérentes pour renforcer la présence en ligne."],
                  ].map(([num, title, desc]) => (
                    <motion.div key={title} variants={fadeUp} className="group">
                      <p className="text-5xl font-black text-gray-100 dark:text-neutral-800 group-hover:text-indigo-100 dark:group-hover:text-indigo-950 transition-colors duration-300 mb-3 select-none leading-none">{num}</p>
                      <h4 className="font-bold text-lg mb-3">{title}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </Element>

            {/* ─── PORTFOLIO ─── */}
            <Element name="portfolio">
              <motion.section className="section-padding py-20 border-t border-gray-100 dark:border-neutral-800"
                initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <motion.p variants={fadeUp} className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-4">Portfolio</motion.p>
                <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-4">Mes projets</motion.h2>
                <motion.p variants={fadeUp} className="text-gray-500 dark:text-gray-400 mb-14 max-w-2xl">
                  Conception et intégration d'interfaces modernes, responsives et orientées expérience utilisateur.
                </motion.p>

                <div className="portfolio-grid">
                  {/* Projet 1 */}
                  <motion.div variants={fadeUp} whileHover={{ scale: 1.02, y: -6 }} className="portfolio-card">
                    <div className="relative pb-[56.25%] h-0 overflow-hidden">
                      <img src="/img/demo.jpg" alt="Démo Recouvrement" loading="lazy" className="absolute top-0 left-0 w-full h-full object-cover z-10" />
                      <iframe src="https://www.youtube.com/embed/ywlo_jZpJEw?autoplay=1&mute=1&loop=1&playlist=ywlo_jZpJEw&controls=0&rel=0&modestbranding=1"
                        title="Démo Application de Recouvrement de Créances"
                        className="absolute top-0 left-0 w-full h-full z-20"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-30">Full-Stack</div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">Application de Recouvrement de Créances</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Plateforme complète de gestion de recouvrement pour entreprises. Suivi des impayés, relances automatiques, statistiques et gestion multi-utilisateurs.</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {["React", "Tailwind CSS", "Framer Motion", "Flask", "SQLite", "Socket.io"].map(tag => (
                          <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">{tag}</span>
                        ))}
                      </div>
                      <a href="https://github.com/Kylan88/gestion-creances.git" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">Code source →</a>
                    </div>
                  </motion.div>

                  {/* MUTUA */}
                  <motion.div variants={fadeUp} whileHover={{ scale: 1.02, y: -6 }} className="portfolio-card">
                    <div className="relative pb-[56.25%] h-0 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                          </div>
                          <p className="text-sm text-indigo-500 font-medium">En cours de développement</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">En cours</div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">MUTUA – Gestion de tontine & cotisation</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Application mobile fintech pour digitaliser la gestion des tontines. Interface glassmorphism, notifications intelligentes, suivi en temps réel.</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {["Flutter", "Node.js", "API REST", "PostgreSQL"].map(tag => (
                          <span key={tag} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs">{tag}</span>
                        ))}
                      </div>
                      <span className="text-amber-500 text-sm font-medium">Disponible bientôt</span>
                    </div>
                  </motion.div>

                  {/* PRIKO */}
                  <motion.div variants={fadeUp} whileHover={{ scale: 1.02, y: -6 }} className="portfolio-card">
                    <div className="relative pb-[56.25%] h-0 overflow-hidden bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950 dark:to-green-950">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                            <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                          </div>
                          <p className="text-sm text-teal-500 font-medium">En cours de développement</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">En cours</div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">PRIKO – Comparateur de prix local</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">App web/mobile de comparaison de prix en temps réel. Vendeurs vérifiés, alertes baisse de prix, géolocalisation et transparence des marchés locaux.</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {["React", "Node.js", "API REST", "PostgreSQL", "Géolocalisation"].map(tag => (
                          <span key={tag} className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full text-xs">{tag}</span>
                        ))}
                      </div>
                      <span className="text-amber-500 text-sm font-medium">Disponible bientôt</span>
                    </div>
                  </motion.div>
                </div>
              </motion.section>
            </Element>

            {/* ─── CONTACT ─── */}
            <Element name="contact">
              <motion.section className="section-padding py-20 border-t border-gray-100 dark:border-neutral-800"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-4">Contact</p>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Travaillons ensemble</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mt-4 mb-0">
                  Vous avez un projet ? Vous cherchez une collaboration ? Envoyez-moi un message !
                </p>
                <form ref={formRef} onSubmit={sendEmail} className="contact-form">
                  <div><label htmlFor="from_name" className="sr-only">Votre nom</label>
                    <input id="from_name" type="text" name="from_name" placeholder="Votre nom" required className="contact-input" /></div>
                  <div><label htmlFor="reply_to" className="sr-only">Votre email</label>
                    <input id="reply_to" type="email" name="reply_to" placeholder="Votre email" required className="contact-input" /></div>
                  <div><label htmlFor="message" className="sr-only">Votre message</label>
                    <textarea id="message" name="message" placeholder="Votre message" rows="5" required className="contact-input"></textarea></div>
                  <button type="submit" disabled={status === "sending"}
                    className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-indigo-600 dark:hover:bg-indigo-400 dark:hover:text-white transition-colors duration-300 disabled:opacity-50">
                    {status === "sending" ? "Envoi en cours..." : status === "success" ? "Message envoyé !" : "Envoyer"}
                  </button>
                  {status === "error" && <p className="text-red-500 text-center text-sm">Erreur lors de l'envoi. Réessayez SVP.</p>}
                </form>
              </motion.section>
            </Element>

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

            {/* ─── FOOTER ─── */}
            <footer className="section-padding py-10 border-t border-gray-100 dark:border-neutral-800">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-400">© 2026 — Jeff Akroman · Développeur Web & Web Designer · Abidjan</p>
                <p className="footer-links text-sm text-gray-400">
                  <a href={`mailto:${contact.email}`} className="hover:text-black dark:hover:text-white transition-colors">Email</a>
                  <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors">WhatsApp</a>
                  <a href={contact.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Telegram</a>
                  <a href={contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">GitHub</a>
                </p>
              </div>
            </footer>

            {/* Dark Mode */}
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsDark(!isDark)}
              aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
              className="fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-neutral-800 shadow-lg z-50 border border-gray-200 dark:border-neutral-700 transition-colors">
              {isDark ? "☀️" : "🌙"}
            </motion.button>
          </main>
        </div>
      )}
    </>
  );
};

export default App;