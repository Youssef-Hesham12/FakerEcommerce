'use client';
import { Button } from '@/components';
import CartProduct from '@/components/products/CartProduct';
import { CartContext } from '@/contexts/CartContext';
import { formatPrice } from '@/helpers/currency';
import { GetUserCartResponse } from '@/interfaces';
import { apiServices } from '@/services/api';
import { Separator } from '@radix-ui/react-separator';
import { Loader2, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';

interface cartDataProp {
  cartData: GetUserCartResponse;
}

export default function InnerCart({ cartData }: cartDataProp) {
  const { data } = useSession();
  const [innerCartData, setInnerCartData] =
    useState<GetUserCartResponse>(cartData);
  const [isCartClear, setIsCartClear] = useState(false);
  const [isCheckOut] = useState(false);
  useContext(CartContext);

  async function getNewCartItems() {
    if (!data?.token) return;
    const newProductCart = await apiServices.getUserCart(data.token);
    setInnerCartData(newProductCart);
  }

  async function handleRemoveCartProduct(
    productId: string,
    setIsRemovingProduct: (value: boolean) => void
  ) {
    if (!data?.token) return;
    setIsRemovingProduct(true);
    await apiServices.removeSpecificItem(productId, data.token);
    getNewCartItems();
    toast.success('Product removed from cart', { position: 'bottom-right' });
    setIsRemovingProduct(false);
  }

  async function handleUpdateProductCartCount(
    productId: string,
    count: number
  ) {
    if (!data?.token) return;
    await apiServices.updateCartCount(productId, count, data.token);
    getNewCartItems();
  }

  async function handleClearCart() {
    if (!data?.token) return;
    setIsCartClear(true);
    await apiServices.clearCart(data.token);
    getNewCartItems();
    toast.success('Cart cleared', { position: 'bottom-right' });
    setIsCartClear(false);
  }

  if (!innerCartData || innerCartData.numOfCartItems === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          No product in your cart
        </h2>
        <Button variant="outline" className="w-fit mt-2" asChild>
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        {innerCartData.numOfCartItems > 0 && (
          <p className="text-muted-foreground">
            {innerCartData.numOfCartItems} item
            {innerCartData.numOfCartItems > 1 ? 's' : ''} in your cart
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {innerCartData.data.products.map((item) => (
              <CartProduct
                handleUpdateProductCartCount={handleUpdateProductCartCount}
                key={item._id}
                handleRemoveCartProduct={handleRemoveCartProduct}
                item={item}
              />
            ))}
          </div>

          {/* Clear Cart */}
          <div className="mt-6">
            <Button
              disabled={isCartClear}
              variant="outline"
              onClick={handleClearCart}
            >
              {isCartClear ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-20">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({innerCartData.numOfCartItems} items)</span>
                <span>{formatPrice(innerCartData.data.totalCartPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <span>{formatPrice(innerCartData.data.totalCartPrice)}</span>
            </div>

            <Link href={'/address'}>
              <Button
                disabled={isCheckOut}
                className="w-full flex items-center bg-green-700 justify-center gap-2"
                size="lg"
              >
                {isCheckOut && <Loader2 className="animate-spin h-4 w-4" />}
                {isCheckOut ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full mt-2 border-green-700 text-green-700"
              asChild
            >
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
