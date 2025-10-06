
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Share2, Edit, UserCheck, Leaf } from "lucide-react";

export const MCardFeatures = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Share2 className="h-8 w-8 text-primary" />,
      title: t('mCardFeature1Title'),
      description: t('mCardFeature1Desc')
    },
    {
      icon: <Edit className="h-8 w-8 text-primary" />,
      title: t('mCardFeature2Title'),
      description: t('mCardFeature2Desc')
    },
    {
      icon: <UserCheck className="h-8 w-8 text-primary" />,
      title: t('mCardFeature3Title'),
      description: t('mCardFeature3Desc')
    },
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: t('mCardFeature4Title'),
      description: t('mCardFeature4Desc')
    }
  ];

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 group">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit transition-transform group-hover:scale-110 duration-300">
                  {feature.icon}
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
