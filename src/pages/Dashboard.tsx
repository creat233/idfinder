
import { Header } from "@/components/Header";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardHowItWorks } from "@/components/dashboard/DashboardHowItWorks";
import { DashboardShare } from "@/components/dashboard/DashboardShare";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DashboardHero />
      <DashboardStats />
      <DashboardHowItWorks />
      <DashboardShare />
    </div>
  );
};

export default Dashboard;
