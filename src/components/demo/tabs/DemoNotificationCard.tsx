
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

export const DemoNotificationCard = () => {
  const { t } = useTranslation();

  return (
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
  );
};
