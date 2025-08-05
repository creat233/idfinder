import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AdminNavigation } from "./AdminNavigation";
import { Settings, Database, Mail, Shield, Globe, Bell, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";

export const AdminSettings = () => {
  const { showSuccess, showError } = useToast();
  const [settings, setSettings] = useState({
    siteName: "FinderID",
    siteDescription: "Plateforme de récupération de cartes perdues",
    maxFileSize: "5",
    enableRegistrations: true,
    enableNotifications: true,
    maintenanceMode: false,
    enableEmailVerification: true,
    sessionTimeout: "24",
    maxLoginAttempts: "3",
    enableAuditLogs: true,
    defaultCountry: "SN",
    supportEmail: "support@finderid.info",
    adminEmail: "admin@finderid.info"
  });

  const handleSaveSettings = async () => {
    try {
      // Ici on sauvegarderait les paramètres en base de données
      showSuccess("Paramètres sauvegardés", "Les paramètres ont été mis à jour avec succès");
    } catch (error) {
      showError("Erreur", "Impossible de sauvegarder les paramètres");
    }
  };

  return (
    <div className="space-y-6">
      <AdminNavigation />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paramètres Généraux */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres Généraux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nom du site</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Description</Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultCountry">Pays par défaut</Label>
              <Input
                id="defaultCountry"
                value={settings.defaultCountry}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultCountry: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="maintenanceMode">Mode maintenance</Label>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Expiration de session (heures)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Tentatives de connexion max</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings(prev => ({ ...prev, maxLoginAttempts: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enableEmailVerification">Vérification email obligatoire</Label>
              <Switch
                id="enableEmailVerification"
                checked={settings.enableEmailVerification}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableEmailVerification: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enableAuditLogs">Journal d'audit</Label>
              <Switch
                id="enableAuditLogs"
                checked={settings.enableAuditLogs}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAuditLogs: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuration Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configuration Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Email de support</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email administrateur</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enableNotifications">Notifications email</Label>
              <Switch
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableNotifications: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres Système */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Système
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Taille max fichiers (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings(prev => ({ ...prev, maxFileSize: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enableRegistrations">Inscriptions ouvertes</Label>
              <Switch
                id="enableRegistrations"
                checked={settings.enableRegistrations}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableRegistrations: checked }))}
              />
            </div>

            <Button onClick={handleSaveSettings} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder tous les paramètres
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Actions Système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Actions Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="w-full">
              <Database className="h-4 w-4 mr-2" />
              Nettoyer la cache
            </Button>
            
            <Button variant="outline" className="w-full">
              <Globe className="h-4 w-4 mr-2" />
              Vérifier les mises à jour
            </Button>
            
            <Button variant="outline" className="w-full">
              <Bell className="h-4 w-4 mr-2" />
              Tester les notifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};