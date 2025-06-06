
import { Header } from "@/components/Header";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardHowItWorks } from "@/components/dashboard/DashboardHowItWorks";
import { DashboardShare } from "@/components/dashboard/DashboardShare";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DashboardHero />
      <DashboardSearch />
      <DashboardStats />
      <DashboardHowItWorks />
      <DashboardShare />
    </div>
  );
};

export default Dashboard;
