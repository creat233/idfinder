
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
import { CountrySelect } from "@/components/auth/CountrySelect";

// Schema for registration form with stricter validation
const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string()
    .min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres")
    .regex(/^[\+]?[\d\s\-\(\)]{8,}$/, "Format de téléphone invalide (ex: +221 77 123 45 67)"),
  country: z.string().min(1, "Le pays est requis"),
});

type RegisterFormProps = {
  onSubmit: (values: z.infer<typeof registerSchema>) => void;
  loading: boolean;
};

const RegisterForm = ({ onSubmit, loading }: RegisterFormProps) => {
  // Initialize registration form with validation
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      country: "SN",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom *</FormLabel>
                <FormControl>
                  <Input placeholder="Votre prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom *</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pays de résidence *</FormLabel>
              <FormControl>
                <CountrySelect control={form.control} name="country" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="ex: +221 77 123 45 67" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">
                Le numéro de téléphone est obligatoire pour recevoir les notifications WhatsApp
              </p>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Votre adresse email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe *</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Choisissez un mot de passe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
          <strong>Important :</strong> Tous les champs marqués d'un (*) sont obligatoires. 
          Votre numéro de téléphone sera utilisé pour vous contacter via WhatsApp 
          concernant vos codes promo et les cartes trouvées.
        </div>
        
        <Button 
          type="submit" 
          className="w-full px-4 py-3 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white font-medium rounded-lg hover:opacity-90"
          disabled={loading}
        >
          {loading ? 'Inscription en cours...' : 'Créer un compte'}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
