import ProfileHeader from "../../components/dashboard/ProfileHeader";
import ProfileSidebar from "../../components/dashboard/ProfileSidebar";
import PersonalInformation from "../../components/dashboard/PersonalInformation";
import NotificationPreferences from "../../components/dashboard/NotificationPreferences";
import SecuritySettings from "../../components/dashboard/SecuritySettings";
import AppearanceSettings from "../../components/dashboard/AppearanceSettings";
import LanguageSettings from "../../components/dashboard/LanguageSettings";
import ProfileFooter from "../../components/dashboard/ProfileFooter";
import PageTransition from "../../components/ui/PageTransition";

function Profile() {
  return (
    <PageTransition>
    <div className="space-y-8">

      <ProfileHeader />

      <div className="grid grid-cols-12 gap-8">

        <div className="col-span-3">
          <ProfileSidebar />
        </div>

        <div className="col-span-9 space-y-8">

          <PersonalInformation />

          <NotificationPreferences />

          <SecuritySettings />

          <div className="grid grid-cols-2 gap-8">
            <AppearanceSettings />
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