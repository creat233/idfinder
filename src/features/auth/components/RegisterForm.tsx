
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
import { useTranslation } from "@/hooks/useTranslation";

// Schema for registration form with stricter validation
const registerSchema = z.object({
  email: z.string().email("register_error_email_invalid"),
  password: z.string().min(6, "register_error_password_short"),
  firstName: z.string().min(2, "register_error_firstname_short"),
  lastName: z.string().min(2, "register_error_lastname_short"),
  phone: z.string()
    .min(8, "register_error_phone_short")
    .regex(/^[\+]?[\d\s\-\(\)]{8,}$/, "register_error_phone_invalid"),
  country: z.string().min(1, "register_error_country_required"),
});

type RegisterFormProps = {
  onSubmit: (values: z.infer<typeof registerSchema>) => void;
  loading: boolean;
  onSwitchToLogin: () => void;
};

const RegisterForm = ({ onSubmit, loading, onSwitchToLogin }: RegisterFormProps) => {
  const { t } = useTranslation();
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

  const translateError = (messageKey: string | undefined) => {
    return messageKey ? t(messageKey) : undefined;
  };

  const { errors } = form.formState;
  if (errors.email) errors.email.message = translateError(errors.email.message);
  if (errors.password) errors.password.message = translateError(errors.password.message);
  if (errors.firstName) errors.firstName.message = translateError(errors.firstName.message);
  if (errors.lastName) errors.lastName.message = translateError(errors.lastName.message);
  if (errors.phone) errors.phone.message = translateError(errors.phone.message);
  if (errors.country) errors.country.message = translateError(errors.country.message);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('register_firstname_label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('register_firstname_placeholder')} {...field} />
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
                <FormLabel>{t('register_lastname_label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('register_lastname_placeholder')} {...field} />
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
              <FormLabel>{t('register_country_label')}</FormLabel>
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
              <FormLabel>{t('register_phone_label')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('register_phone_placeholder')} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">
                {t('register_phone_helptext')}
              </p>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('register_email_label')}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t('register_email_placeholder')} {...field} />
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
              <FormLabel>{t('register_password_label')}</FormLabel>
              <FormControl>
                <Input type="password" placeholder={t('register_password_placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
          <strong>{t('register_important_note_title')}</strong> {t('register_important_note_text')}
        </div>
        
        <Button 
          type="submit" 
          className="w-full px-4 py-3 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white font-medium rounded-lg hover:opacity-90"
          disabled={loading}
        >
          {loading ? t('register_loading_button') : t('register_button')}
        </Button>

        <div className="text-center text-sm text-gray-600">
          {t('alreadyHaveAccount')}{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-[#7E69AB] hover:underline font-medium"
          >
            {t('signIn')}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
