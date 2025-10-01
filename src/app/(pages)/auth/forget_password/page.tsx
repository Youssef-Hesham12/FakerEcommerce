'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { apiServices } from '@/services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export const formSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await apiServices.forgetPassword(values.email);

      if (response.statusMsg === 'success') {
        toast.success('Reset code sent to your email');
        setTimeout(() => {
          router.push('/auth/login');
        }, 1000);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Forget password error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto my-20 w-full px-4">
      <h1 className="text-2xl font-bold text-center my-10">Forget Password</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="ex@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row gap-3">
            <Button
              disabled={isLoading}
              className="bg-green-900 w-full md:w-auto"
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
