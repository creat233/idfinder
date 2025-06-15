
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { usePasswordUpdate } from '@/hooks/usePasswordUpdate';
import { useTranslation } from '@/hooks/useTranslation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const PasswordChangeForm = () => {
  const { t } = useTranslation();
  const { loading, updatePassword } = usePasswordUpdate();

  const formSchema = z.object({
    newPassword: z.string().min(6, { message: t('passwordTooShort') || "Le mot de passe doit contenir au moins 6 caractères." }),
    confirmNewPassword: z.string(),
  }).refine(data => data.newPassword === data.confirmNewPassword, {
    message: t('passwordsDoNotMatch') || "Les mots de passe ne correspondent pas.",
    path: ['confirmNewPassword'],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { newPassword: '', confirmNewPassword: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const success = await updatePassword(values.newPassword);
    if (success) {
      form.reset();
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>{t('changePassword')}</AccordionTrigger>
        <AccordionContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('newPassword')}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('confirmNewPassword')}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>{t('save')}</Button>
            </form>
          </Form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
