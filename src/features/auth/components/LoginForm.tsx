
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
import { useTranslation } from "@/hooks/useTranslation";

// Schema for login form
const loginSchema = z.object({
  email: z.string().email("login_error_invalid_email"),
  password: z.string().min(1, "login_error_password_required"),
});

type LoginFormProps = {
  onSubmit: (values: z.infer<typeof loginSchema>) => void;
  loading: boolean;
};

const LoginForm = ({ onSubmit, loading }: LoginFormProps) => {
  const { t } = useTranslation();
  // Initialize login form with validation
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Translate error messages
  const translateError = (messageKey: string | undefined) => {
    return messageKey ? t(messageKey) : undefined;
  };
  form.formState.errors.email && (form.formState.errors.email.message = translateError(form.formState.errors.email.message));
  form.formState.errors.password && (form.formState.errors.password.message = translateError(form.formState.errors.password.message));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('login_email_label')}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t('login_email_placeholder')} {...field} />
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
              <FormLabel>{t('login_password_label')}</FormLabel>
              <FormControl>
                <Input type="password" placeholder={t('login_password_placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full px-4 py-3 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white font-medium rounded-lg hover:from-[#8b77e5] hover:to-[#6E59A5] active:from-[#7b67d5] active:to-[#5E4995] focus:from-[#8b77e5] focus:to-[#6E59A5] transition-all duration-200 transform active:scale-95"
          disabled={loading}
        >
          {loading ? t('login_loading_button') : t('login_button')}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
