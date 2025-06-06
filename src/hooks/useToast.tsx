
import { useToast as useToastOriginal } from "./use-toast";

export const useToast = () => {
  const { toast } = useToastOriginal();

  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
    });
  };

  const showError = (title: string, description?: string) => {
    toast({
      variant: "destructive",
      title,
      description,
    });
  };

  const showInfo = (title: string, description?: string) => {
    toast({
      title,
      description,
    });
  };

  return {
    toast,
    showSuccess,
    showError,
    showInfo,
  };
};
