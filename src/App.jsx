import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { ScrollProgressBar } from './components/ScrollProgressBar.jsx';
import { Hero } from './components/Hero.jsx';
import { About } from './components/About.jsx';
import { Experience } from './components/Experience.jsx';
import { Education } from './components/Education.jsx';
import { Certifications } from './components/Certifications.jsx';
import { Skills } from './components/Skills.jsx';
import { Projects } from './components/Projects.jsx';
import { GitHubContributions } from './components/GitHubContributions.jsx';
import { Contact } from './components/Contact.jsx';
import { Footer } from './components/Footer.jsx';
import { BackToTop } from './components/BackToTop.jsx';
import { QuickContact } from './components/QuickContact.jsx';
import { CertificateModal } from './components/CertificateModal.jsx';
import { ResumeModal } from './components/ResumeModal.jsx';
import { WaveDivider } from './components/WaveDivider.jsx';
import { SideDotNav } from './components/SideDotNav.jsx';

export const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  // Navigation lock ref to avoid stutter/flicker and intermediate re-renders during smooth scroll
  const isNavigatingRef = useRef(false);
  const navLockTimeoutRef = useRef(null);

  const handleNavigate = useCallback((id, fromClick = false) => {
    setActiveSection(id);
    if (fromClick) {
      isNavigatingRef.current = true;
      if (navLockTimeoutRef.current) {
        clearTimeout(navLockTimeoutRef.current);
      }
      navLockTimeoutRef.current = setTimeout(() => {
        isNavigatingRef.current = false;
      }, 750);
    }
  }, []);

  const handleOpenResume = useCallback(() => {
    setIsResumeModalOpen(true);
  }, []);

  const handleCloseResume = useCallback(() => {
    setIsResumeModalOpen(false);
  }, []);

  const handleSelectCertificate = useCallback((cert) => {
    setSelectedCertificate(cert);
  }, []);

  const handleCloseCertificate = useCallback(() => {
    setSelectedCertificate(null);
  }, []);

  const sections = useMemo(
    () => [
      'home',
      'about',
      'experience',
      'education',
      'certifications',
      'skills',
      'projects',
      'github-contributions',
      'contact',
    ],
    []
  );

  // Accurate page-wise scroll position tracking for navbar
  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      if (isNavigatingRef.current) {
        ticking = false;
        return;
      }

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // 1. Extreme top boundary
      if (scrollY < 80) {
        setActiveSection((prev) => (prev !== 'home' ? 'home' : prev));
        ticking = false;
        return;
      }

      // 2. Extreme bottom boundary
      if (windowHeight + scrollY >= docHeight - 70) {
        setActiveSection((prev) => (prev !== 'contact' ? 'contact' : prev));
        ticking = false;
        return;
      }

      // 3. Page-wise position detection:
      // An element is active when its top is at or above the reading offset
      // and its bottom is still below the offset.
      const navHeader = document.querySelector('.navbar-header');
      const headerOffset = navHeader ? navHeader.offsetHeight + 40 : 110;

      let currentSection = null;

      for (let i = 0; i < sections.length; i++) {
        const id = sections[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerOffset && rect.bottom > headerOffset) {
            currentSection = id;
            break;
          }
        }
      }

      // Fallback: choose the section closest to the top offset
      if (!currentSection) {
        let minDistance = Infinity;
        for (let i = 0; i < sections.length; i++) {
          const id = sections[i];
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            const distance = Math.abs(rect.top - headerOffset);
            if (distance < minDistance) {
              minDistance = distance;
              currentSection = id;
            }
          }
        }
      }

      if (currentSection) {
        setActiveSection((prev) => (prev !== currentSection ? currentSection : prev));
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (navLockTimeoutRef.current) {
        clearTimeout(navLockTimeoutRef.current);
      }
    };
  }, [sections]);

  // Section Scroll Reveal Animation: adds 'fade-in-up' (fading in and sliding up) as each section enters viewport
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.02,
      }
    );

    const sectionElements = document.querySelectorAll('section');
    sectionElements.forEach((sec) => {
      // Reveal immediately if already partially visible on mount (e.g. Hero, or top of screen on refresh)
      const rect = sec.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 50) {
        sec.classList.add('fade-in-up');
      } else {
        revealObserver.observe(sec);
      }
    });

    return () => revealObserver.disconnect();
  }, []);

  // Memoize main content sections so activeSection changes don't cause costly re-renders of the entire page
  const memoizedMainContent = useMemo(
    () => (
      <main>
        {/* 1. Hero Section */}
        <Hero />

        {/* Wave Divider 1: Hero (gradient) -> About (secondary bg) */}
        <WaveDivider variant={1} bgColor="var(--hero-bottom-bg)" fill="var(--bg-secondary)" />

        {/* 2. About Section */}
        <About onOpenResume={handleOpenResume} />

        {/* Wave Divider 2: About (secondary bg) -> Experience (primary bg) */}
        <WaveDivider variant={2} bgColor="var(--bg-secondary)" fill="var(--bg-primary)" />

        {/* 3. Experience Section */}
        <Experience onSelectCertificate={handleSelectCertificate} />

        {/* Wave Divider 3: Experience (primary bg) -> Education (secondary bg) */}
        <WaveDivider variant={3} bgColor="var(--bg-primary)" fill="var(--bg-secondary)" />

        {/* 4. Education Section */}
        <Education />

        {/* Wave Divider 4: Education (secondary bg) -> Certifications (primary bg) */}
        <WaveDivider variant={1} bgColor="var(--bg-secondary)" fill="var(--bg-primary)" />

        {/* 5. Certifications Section */}
        <Certifications onSelectCertificate={handleSelectCertificate} />

        {/* Wave Divider 5: Certifications (primary bg) -> Skills (secondary bg) */}
        <WaveDivider variant={2} bgColor="var(--bg-primary)" fill="var(--bg-secondary)" />

        {/* 6. Skills Section */}
        <Skills />

        {/* Wave Divider 6: Skills (secondary bg) -> Projects (primary bg) */}
        <WaveDivider variant={3} bgColor="var(--bg-secondary)" fill="var(--bg-primary)" />

        {/* 7. Projects Section */}
        <Projects />

        {/* Wave Divider 7: Projects (primary bg) -> GitHub Contributions (secondary bg) */}
        <WaveDivider variant={1} bgColor="var(--bg-primary)" fill="var(--bg-secondary)" />

        {/* 8. GitHub Contributions Section */}
        <GitHubContributions />

        {/* Wave Divider 8: GitHub Contributions (secondary bg) -> Contact (primary bg) */}
        <WaveDivider variant={2} bgColor="var(--bg-secondary)" fill="var(--bg-primary)" />

        {/* 9. Contact Section */}
        <Contact />

        {/* Wave Divider 9: Contact (primary bg) -> Footer (footer bg) */}
        <WaveDivider variant={3} bgColor="var(--bg-primary)" fill="var(--footer-bg)" />
      </main>
    ),
    [handleOpenResume, handleSelectCertificate]
  );

  return (
    <>
      <ScrollProgressBar />
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      <div className="portfolio-app">
        {memoizedMainContent}

        {/* 10. Footer */}
        <Footer />

        <SideDotNav activeSection={activeSection} onNavigate={handleNavigate} />
        <QuickContact activeSection={activeSection} />
        <BackToTop />

        {/* Certificate Preview Modal */}
        <CertificateModal
          certificate={selectedCertificate}
          onClose={handleCloseCertificate}
        />

        {/* In-Page Same-View Resume Modal */}
        <ResumeModal
          isOpen={isResumeModalOpen}
          onClose={handleCloseResume}
        />
      </div>
    </>
  );
};

export default App;
