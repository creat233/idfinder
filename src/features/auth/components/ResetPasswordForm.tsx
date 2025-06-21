
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

// Schema for reset password form
const resetPasswordSchema = z.object({
  email: z.string().email("login_error_invalid_email")
});

type ResetPasswordFormProps = {
  onSubmit: (values: z.infer<typeof resetPasswordSchema>) => void;
  loading: boolean;
  onSwitchToLogin: () => void;
};

const ResetPasswordForm = ({ onSubmit, loading, onSwitchToLogin }: ResetPasswordFormProps) => {
  const { t } = useTranslation();
  // Initialize form with validation
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const translateError = (messageKey: string | undefined) => {
    return messageKey ? t(messageKey) : undefined;
  };
  form.formState.errors.email && (form.formState.errors.email.message = translateError(form.formState.errors.email.message));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('reset_password_email_label')}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t('reset_password_email_placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full px-4 py-3 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white font-medium rounded-lg hover:opacity-90"
          disabled={loading}
        >
          {loading ? t('reset_password_loading_button') : t('reset_password_button')}
        </Button>
        
        <div className="text-center text-sm text-gray-600">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-[#7E69AB] hover:underline font-medium"
          >
            {t('backToLogin')}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
