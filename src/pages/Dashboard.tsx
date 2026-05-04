
import { Header } from "@/components/Header";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardHowItWorks } from "@/components/dashboard/DashboardHowItWorks";
import { DashboardShare } from "@/components/dashboard/DashboardShare";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { dashboardTourSteps } from "@/components/onboarding/HomeTourSteps";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
      <OnboardingTour tourId="dashboard" steps={dashboardTourSteps} />
      <Header />
      <DashboardHero />
      <DashboardStats />
      <DashboardHowItWorks />
      <DashboardShare />
    </div>
  );
};

export default Dashboard;
