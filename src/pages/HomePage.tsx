import HeroSection from "@/components/modules/Homepage/HeroSection";
import HowItWorks from "@/components/modules/Homepage/HowItWorks";
import Promotions from "@/components/modules/Homepage/Promotions";
import ServiceHighlights from "@/components/modules/Homepage/ServiceHighlights";
import Testimonials from "@/components/modules/Homepage/Testimonials";
import { useEffect, useState } from "react";
import Joyride, { type Step, type CallBackProps, STATUS } from "react-joyride";
import { RefreshCcw } from "lucide-react";
import type { EmergencyContact, IUser } from "@/types";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import SOSButton from "@/components/SOSButton";
import Skeleton from "@/components/Skeleton";

const steps: Step[] = [
  { target: ".hero-section", content: "Welcome! This is the hero section." },
  { target: ".how-it-works", content: "See how our service works." },
  { target: ".service-highlights", content: "Check our main features." },
  { target: ".testimonials", content: "What our customers say." },
  { target: ".promotions", content: "See our special offers." },
];

export default function HomePage() {
  const [joyrideRunning, setJoyrideRunning] = useState(true);
  const { data: userData, isLoading } = useUserInfoQuery(undefined);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  useEffect(() => {
    if (!isLoading && userData?.data) {
      const user: IUser = userData?.data;
      // Use name/email/phone as pre-filled emergency contact
      const contact: EmergencyContact = {
        name: user.name,
        email: user.email,
        phone: user.phone,
      };
      setEmergencyContacts([contact]); // could allow multiple later
    }
  }, [userData]);


  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setJoyrideRunning(false); // stop Joyride when finished/skipped
    }
  };

  const restartTour = () => {
    setJoyrideRunning(false); 
    setTimeout(() => setJoyrideRunning(true), 100);
  };

  if (isLoading) return <div className="flex min-h-svh flex-col items-center justify-center">
    <Skeleton className="h-8 w-40" />
  </div>;

  return (
    <div>
      <Joyride
        steps={steps}
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        run={joyrideRunning}
        callback={handleJoyrideCallback}
      />
      <HeroSection />
      <HowItWorks />
      <ServiceHighlights />
      <Testimonials />
      <Promotions />

      {/* SOS Button with user info */}
      <SOSButton savedContacts={emergencyContacts} />

      <button
        onClick={restartTour}
        className="fixed bottom-3 z-10 right-6 flex items-center gap-2 px-4 py-3 bg-red-950 text-white font-semibold rounded-full shadow-lg hover:bg-red-900 transition"
      >
        <RefreshCcw className="w-5 h-5" />
        Restart Tour
      </button>
    </div>
  );
};
