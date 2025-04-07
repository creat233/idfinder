
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Schema for reset password form
const resetPasswordSchema = z.object({
  email: z.string().email("Email invalide")
});

type ResetPasswordFormProps = {
  onSubmit: (values: z.infer<typeof resetPasswordSchema>) => void;
  loading: boolean;
  onCancel: () => void;
};

const ResetPasswordForm = ({ onSubmit, loading, onCancel }: ResetPasswordFormProps) => {
  // Initialize form with validation
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Votre adresse email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white font-medium rounded-lg hover:opacity-90"
            disabled={loading}
          >
            {loading ? 'Envoi en cours...' : 'Réinitialiser le mot de passe'}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="px-4 py-3"
          >
            Annuler
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
