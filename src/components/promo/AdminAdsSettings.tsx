
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminAdsManager } from "./AdminAdsManager";
import { AdminSettings } from "./AdminSettings";
import { PartnerEmailTemplates } from "./PartnerEmailTemplates";
import { AdminMessages } from "@/components/admin/AdminMessages";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Settings, Megaphone } from "lucide-react";

export const AdminAdsSettings = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration FinderID</h1>
        <p className="text-gray-600">Interface d'administration des codes promo et récupérations</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-800">Zone d'administration sécurisée</span>
        </div>
        <p className="text-blue-700 text-sm">
          Accès restreint aux administrateurs autorisés. Toutes les actions sont enregistrées et tracées.
        </p>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Publicités
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Emails Partenaires
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>

        <TabsContent value="ads">
          <AdminAdsManager />
        </TabsContent>

        <TabsContent value="emails">
          <PartnerEmailTemplates />
        </TabsContent>

        <TabsContent value="messages">
          <AdminMessages />
        </TabsContent>
      </Tabs>
    </div>
  );
};
