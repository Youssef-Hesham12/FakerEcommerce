'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/products';

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (response?.ok) {
        router.push(callbackUrl);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto my-20 w-full px-4">
      <h1 className="text-2xl font-bold text-center my-10">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e-mail.com"
                    type="email"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="*****"
                    type="password"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="bg-green-900 w-full sm:w-auto"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                'Login'
              )}
            </Button>
            <Link href="/auth/forget_password" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                Forget Password
              </Button>
            </Link>
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
