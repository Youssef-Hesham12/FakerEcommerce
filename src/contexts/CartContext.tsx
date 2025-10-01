'use client';
import { apiServices } from '@/services/api';
import { useSession } from 'next-auth/react';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';

type SetLoadingFn = Dispatch<SetStateAction<boolean>>;

type CartContextType = {
  cartCount: number;
  setCartCount: Dispatch<SetStateAction<number>>;
  cartLoading: boolean;
  handleAddToCart: (
    productId: string,
    setAddToCartLoading: SetLoadingFn
  ) => Promise<void>;
};

export const CartContext = createContext<CartContextType>({
  cartCount: 0,
  setCartCount: () => {},
  cartLoading: false,
  handleAddToCart: async () => {},
});

export default function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);

  const getCard = useCallback(async () => {
    try {
      setCartLoading(true);
      if (!session?.token) return;
      const response = await apiServices.getUserCart(session.token);
      setCartCount(response?.numOfCartItems ?? 0);
    } catch (error) {
      console.error('Failed to fetch cart', error);
      setCartCount(0);
    } finally {
      setCartLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    getCard();
  }, [getCard]);

  const handleAddToCart = async (
    productId: string,
    setAddToCartLoading: SetLoadingFn
  ) => {
    try {
      setAddToCartLoading(true);
      if (!session?.token) {
        toast.error('You must be logged in to add items.');
        return;
      }
      const data = await apiServices.addProductToCart(productId, session.token);
      setCartCount(data.numOfCartItems ?? 0);
      toast.success(data.message);
    } catch (error) {
      console.error('Failed to add product to cart', error);
      toast.error('Something went wrong!');
    } finally {
      setAddToCartLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartCount, setCartCount, cartLoading, handleAddToCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
