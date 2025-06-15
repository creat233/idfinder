
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { AdminPermissionsList } from "./admin-settings/AdminPermissionsList";

export const AdminSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuration de l'application
        </CardTitle>
        <CardDescription>
          Gérez les administrateurs et les paramètres de sécurité de l'application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminPermissionsList />
      </CardContent>
    </Card>
  );
};
