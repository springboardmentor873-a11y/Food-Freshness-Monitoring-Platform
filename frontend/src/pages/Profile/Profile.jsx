import { useState, useEffect } from "react";
import ProfileHeader from "../../components/dashboard/ProfileHeader";
import ProfileSidebar from "../../components/dashboard/ProfileSidebar";
import PersonalInformation from "../../components/dashboard/PersonalInformation";
import NotificationPreferences from "../../components/dashboard/NotificationPreferences";
import SecuritySettings from "../../components/dashboard/SecuritySettings";
import LanguageSettings from "../../components/dashboard/LanguageSettings";
import ProfileFooter from "../../components/dashboard/ProfileFooter";
import PageTransition from "../../components/ui/PageTransition";

function Profile() {
  const [activeSection, setActiveSection] = useState("personal-info");

  useEffect(() => {
    const sectionIds = ["personal-info", "security", "notifications", "language"];
    const mainElement = document.querySelector("main");

    const observerOptions = {
      root: mainElement || null,
      rootMargin: "-10% 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const handleSelectSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <ProfileHeader />

        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-3">
            <ProfileSidebar
              activeSection={activeSection}
              onSelectSection={handleSelectSection}
            />
          </div>

          <div className="col-span-9 space-y-8">
            <div id="personal-info" className="scroll-mt-24">
              <PersonalInformation />
            </div>

            <div id="security" className="scroll-mt-24">
              <SecuritySettings />
            </div>

            <div id="notifications" className="scroll-mt-24">
              <NotificationPreferences />
            </div>

            <div id="language" className="scroll-mt-24">
              <LanguageSettings />
            </div>

            <ProfileFooter />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Profile;