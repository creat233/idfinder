import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/AdminRoute";

type Row = { variant: string; event_type: string; visitor_id: string };

type Stats = {
  variant: "vapor" | "sober";
  visitors: number;
  conversions: number;
  rate: number;
};

const AdminHeroAB = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hero_ab_events")
      .select("variant,event_type,visitor_id")
      .limit(10000);
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    const rows = (data as Row[]) || [];
    setTotalEvents(rows.length);

    const byVariant: Record<"vapor" | "sober", { imp: Set<string>; conv: Set<string> }> = {
      vapor: { imp: new Set(), conv: new Set() },
      sober: { imp: new Set(), conv: new Set() },
    };
    rows.forEach((r) => {
      const v = r.variant as "vapor" | "sober";
      if (!byVariant[v]) return;
      if (r.event_type === "impression") byVariant[v].imp.add(r.visitor_id);
      if (r.event_type === "cta_click") byVariant[v].conv.add(r.visitor_id);
    });
    const result: Stats[] = (["vapor", "sober"] as const).map((v) => {
      const visitors = byVariant[v].imp.size;
      const conversions = byVariant[v].conv.size;
      return {
        variant: v,
        visitors,
        conversions,
        rate: visitors > 0 ? (conversions / visitors) * 100 : 0,
      };
    });
    setStats(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const winner =
    stats.length === 2 && stats[0].visitors > 20 && stats[1].visitors > 20
      ? stats.reduce((a, b) => (a.rate > b.rate ? a : b)).variant
      : null;

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">A/B Test — Hero</h1>
              <p className="text-slate-600 text-sm mt-1">
                Comparaison Vapor Chrome vs Sober. Conversion = visiteur unique ayant cliqué un CTA dans le hero.
              </p>
            </div>
            <Button onClick={load} disabled={loading}>
              {loading ? "Chargement..." : "Rafraîchir"}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {stats.map((s) => (
              <Card key={s.variant} className={winner === s.variant ? "border-emerald-500 border-2" : ""}>
                <CardHeader>
                  <CardTitle className="capitalize flex items-center justify-between">
                    {s.variant === "vapor" ? "Vapor Chrome" : "Sober"}
                    {winner === s.variant && (
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        🏆 Gagnant
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Metric label="Visiteurs uniques" value={s.visitors.toString()} />
                  <Metric label="Conversions (CTA clic)" value={s.conversions.toString()} />
                  <Metric
                    label="Taux de conversion"
                    value={`${s.rate.toFixed(2)} %`}
                    highlight
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="py-4 text-sm text-slate-600 space-y-1">
              <div>Total événements enregistrés : <strong>{totalEvents}</strong></div>
              <div>Force d'affichage : passez <code>?hero=vapor</code> ou <code>?hero=sober</code> dans l'URL pour forcer une variante.</div>
              <div>L'attribution est persistée par visiteur (localStorage), 50/50 par défaut.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminRoute>
  );
};

const Metric = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-slate-600">{label}</span>
    <span className={`font-bold ${highlight ? "text-2xl text-indigo-600" : "text-lg text-slate-900"}`}>
      {value}
    </span>
  </div>
);

export default AdminHeroAB;
