
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, CheckCircle, Camera, Clock, Users, Bell, CreditCard, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

export const DemoTabs = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'report'>('search');
  const { t } = useTranslation();

  const searchSteps = [
    {
      title: t("searchStep1Title"),
      description: t("searchStep1Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <Search className="w-8 h-8" />
    },
    {
      title: t("searchStep2Title"),
      description: t("searchStep2Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <MapPin className="w-8 h-8" />
    },
    {
      title: t("searchStep3Title"),
      description: t("searchStep3Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <Phone className="w-8 h-8" />
    },
    {
      title: t("searchStep4Title"),
      description: t("searchStep4Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <CheckCircle className="w-8 h-8" />
    }
  ];

  const reportSteps = [
    {
      title: t("reportStep1Title"),
      description: t("reportStep1Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <Camera className="w-8 h-8" />
    },
    {
      title: t("reportStep2Title"),
      description: t("reportStep2Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <MapPin className="w-8 h-8" />
    },
    {
      title: t("reportStep3Title"),
      description: t("reportStep3Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <Clock className="w-8 h-8" />
    },
    {
      title: t("reportStep4Title"),
      description: t("reportStep4Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <Users className="w-8 h-8" />
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t("stepByStep")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("chooseScenario")}
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center mb-16"
        >
          <div className="bg-white rounded-2xl p-2 shadow-xl border border-gray-100">
            <Button
              onClick={() => setActiveTab('search')}
              variant={activeTab === 'search' ? 'default' : 'ghost'}
              className={`rounded-xl px-8 py-4 font-semibold text-lg transition-all duration-300 ${
                activeTab === 'search' 
                  ? 'bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <MapPin className="w-6 h-6 mr-3" />
              {t("lostMyDocument")}
            </Button>
            <Button
              onClick={() => setActiveTab('report')}
              variant={activeTab === 'report' ? 'default' : 'ghost'}
              className={`rounded-xl px-8 py-4 font-semibold text-lg transition-all duration-300 ${
                activeTab === 'report' 
                  ? 'bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Camera className="w-6 h-6 mr-3" />
              {t("foundADocument")}
            </Button>
          </div>
        </motion.div>

        {/* Notification Alert for Lost Cards */}
        {activeTab === 'search' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                    <Bell className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-blue-900">
                      {t("autoNotificationSystem")}
                    </CardTitle>
                    <CardDescription className="text-blue-700 text-lg">
                      {t("cantFindCard")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-blue-500 text-white font-bold text-lg px-3 py-1">1</Badge>
                      <div>
                        <h4 className="font-semibold text-blue-900">{t("registerYourCard")}</h4>
                        <p className="text-blue-700">{t("registerYourCardDesc")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-blue-500 text-white font-bold text-lg px-3 py-1">2</Badge>
                      <div>
                        <h4 className="font-semibold text-blue-900">{t("activateMonitoring")}</h4>
                        <p className="text-blue-700">{t("activateMonitoringDesc")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-blue-500 text-white font-bold text-lg px-3 py-1">3</Badge>
                      <div>
                        <h4 className="font-semibold text-blue-900">{t("receiveNotification")}</h4>
                        <p className="text-blue-700">{t("receiveNotificationDesc")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <Button 
                      onClick={() => window.location.href = '/mes-cartes'}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <CreditCard className="mr-3 h-6 w-6" />
                      {t("manageMyCards")}
                    </Button>
                    <p className="text-center text-blue-600 text-sm mt-3 font-medium">
                      {t("freeAndNoStrings")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Steps Display */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {(activeTab === 'search' ? searchSteps : reportSteps).map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="relative"
            >
              <Card className="h-full border-2 border-gray-100 hover:border-[#9b87f5] transition-all duration-300 hover:shadow-2xl group transform hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                      {step.icon}
                    </div>
                    {/* Step connector line */}
                    {index < (activeTab === 'search' ? searchSteps : reportSteps).length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-full w-8 h-0.5 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] opacity-30"></div>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <div className="mb-6">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-40 object-contain rounded-xl border border-gray-200 bg-gray-50 group-hover:bg-[#9b87f5]/5 transition-all duration-300"
                    />
                  </div>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">{t("fastAndSecure")}</h3>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div>
                <div className="text-3xl font-bold">24h</div>
                <div className="text-purple-100">{t("averageRecoveryTime")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold">2000 Fr</div>
                <div className="text-purple-100">{t("finderRewardPlatform")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold">100%</div>
                <div className="text-purple-100">{t("securePlatform")}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
