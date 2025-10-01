'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiServices } from '@/services/api';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export const formSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(32, "Password can't be longer than 32 characters"),
    rePassword: z.string(),
    phone: z.string().regex(/^01[0-9]{9}$/, 'Invalid Egyptian phone number'),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ['rePassword'],
    message: "Passwords don't match",
  });

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: '',
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const phoneNumber = Number(values.phone);
    setIsLoading(true);
    try {
      const response = await apiServices.register(
        values.name,
        values.email,
        values.password,
        values.rePassword,
        phoneNumber
      );

      if (response.message === 'success') {
        toast.success('Register Successful');
        setTimeout(() => {
          router.push('/auth/login');
        }, 1000);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto my-20 w-full px-4">
      <h1 className="text-2xl font-bold text-center my-10">Register</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Name" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="**********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rePassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="**********" type="password" {...field} />
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Phone"
                    type="text"
                    {...field}
                  />
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
                'Register'
              )}
            </Button>

            <Link href="/auth/login" className="w-full md:w-auto">
              <Button className="w-full md:w-auto" variant="outline">
                Have Account
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
