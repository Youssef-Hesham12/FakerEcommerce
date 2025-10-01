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
import { apiServices } from '@/services/api';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { GetUserCartResponse } from '@/interfaces';
import toast from 'react-hot-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  details: z.string().min(5, { message: 'Details must be at least 5 characters.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Phone must be at least 10 numbers.' }),
});

interface CartDataProp {
  cartData: GetUserCartResponse;
}

export default function Address({ cartData }: CartDataProp) {
  const { data } = useSession();
  const [isCheckOut, setIsCheckOut] = useState(false);
  const [innerCartData, setInnerCartData] = useState<GetUserCartResponse>(cartData);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      details: '',
      city: '',
      phone: '',
    },
  });

  // Fetch updated cart items whenever token changes
  useEffect(() => {
    const fetchCart = async () => {
      if (!data?.token) return;
      try {
        const newProductCart = await apiServices.getUserCart(data.token);
        setInnerCartData(newProductCart);
      } catch {
        toast.error('Failed to fetch cart items');
      }
    };

    fetchCart();
  }, [data?.token]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!data?.token) {
      toast.error('User not authenticated.');
      return;
    }

    try {
      setIsCheckOut(true);

      // Add user address
      await apiServices.addUserAddress(
        values.name,
        values.details,
        values.city,
        values.phone,
        data.token
      );

      // Proceed to checkout
      const response = await apiServices.checkout(
        innerCartData.cartId,
        data.token,
        values.city,
        values.phone,
        values.details
      );

      if (response?.session?.url) {
        location.href = response.session.url;
      } else {
        console.error('Checkout response invalid:', response);
        toast.error('Checkout response invalid');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout error');
    } finally {
      setIsCheckOut(false);
    }
  };

  return (
    <div className="mx-auto w-[80%] my-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Details</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Address details" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Your City" {...field} />
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
                  <Input type="tel" placeholder="Your Phone Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isCheckOut}>
            {isCheckOut ? 'Processing...' : 'Checkout'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
