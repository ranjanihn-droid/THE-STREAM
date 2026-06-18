/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import AboutView from "./components/AboutView";
import ProgramsView from "./components/ProgramsView";
import PlacementView from "./components/PlacementView";
import GalleryView from "./components/GalleryView";
import ContactView from "./components/ContactView";
import StaffPortalView from "./components/StaffPortalView";
import Footer from "./components/Footer";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");

  useEffect(() => {
    const titles: Record<string, string> = {
      home: "The Stream | Educator Training Programs, Bangalore",
      about: "About Us & J. Krishnamurti Philosophy | The Stream Teacher Training",
      programs: "Alternative Educator Certification Programs | The Stream_NeeAr_TTP",
      placement: "Alternative School Placements & Partners | The Stream Bangalore",
      gallery: "Alternative Practical Learning Gallery | The Stream",
      contact: "Contact Us & Alternative Education Admissions | The Stream",
      staff: "Staff Room Facilitators Portal | The Stream Bangalore",
    };
    document.title = titles[activeTab] || "The Stream — Educator Training Programs, Bangalore";
  }, [activeTab]);

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Navigation transition definition
  const tabVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: "easeIn" } }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "home":
        return (
          <motion.div key="home" variants={tabVariants} initial="initial" animate="animate" exit="exit">
            <HomeView onExplorePrograms={() => {
              handleSetActiveTab("programs");
            }} />
          </motion.div>
        );
      case "about":
        return (
          <motion.div key="about" variants={tabVariants} initial="initial" animate="animate" exit="exit">
            <AboutView />
          </motion.div>
        );
      case "programs":
        return (
          <motion.div key="programs" variants={tabVariants} initial="initial" animate="animate" exit="exit">
            <ProgramsView />
          </motion.div>
        );
      case "placement":
        return (
          <motion.div key="placement" variants={tabVariants} initial="initial" animate="animate" exit="exit">
            <PlacementView onContactClick={() => {
              handleSetActiveTab("contact");
            }} />
          </motion.div>
        );
      case "gallery":
        return (
          <motion.div key="gallery" variants={tabVariants} initial="initial" animate="animate" exit="exit">
            <GalleryView />
          </motion.div>
        );
      case "contact":
        return (
          <motion.div key="contact" variants={tabVariants} initial="initial" animate="animate" exit="exit">
            <ContactView />
          </motion.div>
        );
      case "staff":
        return (
          <motion.div key="staff" variants={tabVariants} initial="initial" animate="animate" exit="exit">
            <StaffPortalView />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas-bg font-hand selection:bg-[#F37021] selection:text-white">
      {/* 🧭 Main Responsive Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={handleSetActiveTab} />

      {/* 📺 Active Content Board with smooth swap animation */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {renderActiveView()}
        </AnimatePresence>
      </main>

      {/* 🪵 Anchor Footer */}
      <Footer setActiveTab={handleSetActiveTab} />
      
      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
