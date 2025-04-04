
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserX } from "lucide-react";

export const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 opacity-50 pointer-events-none"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <Skeleton className="h-10 w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <Skeleton className="h-10 w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Téléphone</label>
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Assistance et FAQ</h2>
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="mt-8 border-t pt-8">
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
};
