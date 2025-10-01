import React from 'react';
import { Button } from '../ui';
import { Loader2, ShoppingCart } from 'lucide-react';

interface AddToCartProps {
  productQuantity: number;
  addToCartLoading: boolean;
  handleAddToCart: () => void;
}
export default function AddToCart({
  handleAddToCart,
  productQuantity,
  addToCartLoading,
}: AddToCartProps) {
  return (
    <div>
      <Button
        onClick={handleAddToCart}
        size="lg"
        className="flex-1 w-full bg-green-700 hover:bg-green-800"
        disabled={productQuantity === 0 || addToCartLoading}
      >
        {addToCartLoading && <Loader2 className="animate-spin" />}
        <ShoppingCart className="h-5 w-5 mr-2" />
        Add to Cart
      </Button>
    </div>
  );
}
