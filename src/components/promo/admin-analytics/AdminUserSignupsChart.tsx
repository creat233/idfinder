
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { SignupData } from '@/hooks/useAdminUserSignups';

interface AdminUserSignupsChartProps {
  data: SignupData[];
}

export const AdminUserSignupsChart = ({ data }: AdminUserSignupsChartProps) => {
  const formattedData = data.map(item => ({
    ...item,
    signup_date: format(new Date(item.signup_date), "d MMM", { locale: fr }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution des Inscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="signup_date" />
            <YAxis allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Line type="monotone" dataKey="count" name="Nouveaux utilisateurs" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
