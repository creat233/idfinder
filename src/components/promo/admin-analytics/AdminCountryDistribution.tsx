
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { getCountryInfo } from "@/utils/countryUtils";

interface CountryStat {
  country: string;
  count: number;
  percentage: number;
  flag: string;
  name: string;
}

export const AdminCountryDistribution = () => {
  const [stats, setStats] = useState<CountryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCountryStats = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("country");

        if (error) throw error;

        const countryMap: Record<string, number> = {};
        let totalUsers = 0;

        (data || []).forEach((profile) => {
          const country = profile.country || "SN";
          countryMap[country] = (countryMap[country] || 0) + 1;
          totalUsers++;
        });

        setTotal(totalUsers);

        const sorted = Object.entries(countryMap)
          .map(([country, count]) => {
            const info = getCountryInfo(country, "fr");
            return {
              country,
              count,
              percentage: totalUsers > 0 ? (count / totalUsers) * 100 : 0,
              flag: info.flag,
              name: info.name,
            };
          })
          .sort((a, b) => b.count - a.count);

        setStats(sorted);
      } catch (err) {
        console.error("Erreur chargement stats pays:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryStats();
  }, []);

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  const maxCount = stats.length > 0 ? stats[0].count : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Globe className="h-5 w-5" />
          Répartition par pays ({total} utilisateurs)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {stats.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucune donnée disponible
          </p>
        ) : (
          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div key={stat.country} className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-6">
                  {index + 1}.
                </span>
                <span className="text-xl">{stat.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">
                      {stat.name}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.count} ({stat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all duration-500"
                      style={{
                        width: `${(stat.count / maxCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
