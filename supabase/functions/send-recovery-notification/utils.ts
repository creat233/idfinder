
export const getDocumentTypeLabel = (type: string): string => {
  const types: Record<string, string> = {
    id: "Carte d'identité nationale",
    driver_license: "Permis de conduire",
    passport: "Passeport",
    vehicle_registration: "Carte grise véhicule",
    motorcycle_registration: "Carte grise moto",
    residence_permit: "Carte de séjour",
    student_card: "Carte étudiante",
    health_card: "Carte de santé",
  };
  return types[type] || type;
};

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
