
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
  onCancel: () => void;
};

const ResetPasswordForm = ({ onSubmit, loading, onCancel }: ResetPasswordFormProps) => {
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
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white font-medium rounded-lg hover:opacity-90"
            disabled={loading}
          >
            {loading ? t('reset_password_loading_button') : t('reset_password_button')}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="px-4 py-3"
          >
            {t('reset_password_cancel_button')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
