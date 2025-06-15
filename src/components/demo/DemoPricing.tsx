
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";

export const DemoPricing = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("howItWorksFinancially")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                💰
              </div>
              <CardTitle className="text-2xl text-green-700">{t("forTheFinder")}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-4">2000 Fr</div>
              <p className="text-gray-700">
                {t("finderReward")}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                📄
              </div>
              <CardTitle className="text-2xl text-blue-700">{t("forTheOwner")}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-4">7000 Fr</div>
              <p className="text-gray-700 mb-4">
                {t("ownerFee")}
              </p>
              <p className="text-sm text-gray-600">
                {t("plusDelivery")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            <strong>{t("deliveryOption")}</strong> {t("deliveryOptionDesc")}
          </p>
        </div>
      </div>
    </section>
  );
};
