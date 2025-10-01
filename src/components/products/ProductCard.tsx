'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/interfaces';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, ShoppingCart } from 'lucide-react';
import { renderStars } from '@/helpers/rating';
import { formatPrice } from '@/helpers/currency';
import AddToCart from './AddToCart';
import { useContext, useEffect, useState } from 'react';
import { apiServices } from '@/services/api';
import toast from 'react-hot-toast';
import { CartContext } from '@/contexts/CartContext';
import { useSession } from 'next-auth/react';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  onWishlistChange?: () => void;
}

interface WishlistItem {
  _id: string;
  product?: Product;
}

export function ProductCard({
  product,
  viewMode = 'grid',
  onWishlistChange,
}: ProductCardProps) {
  const [AddToCartLoading, setAddToCartLoading] = useState<boolean>(false);
  const { handleAddToCart } = useContext(CartContext);
  const [inWishlist, setInWishlist] = useState(false);
  const { data } = useSession();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  async function toggleWishlist() {
    try {
      if (!data?.token) {
        toast.error('You must be logged in to manage wishlist');
        return;
      }

      setIsWishlistLoading(true);

      if (inWishlist) {
        const response = await apiServices.removeItemFormWishList(
          data.token,
          product._id
        );

        if (
          response.status === 200 ||
          response.status === 204 ||
          response.status === 'success'
        ) {
          toast.success('Removed from Wish List');
          onWishlistChange?.();
          setInWishlist(false);
        } else {
          toast.error('Failed to remove from Wish List');
        }
      } else {
        const response = await apiServices.addToWishList(
          product.id,
          data.token
        );

        if (response.status === 200) {
          toast.success('Added to Wish List');
          setInWishlist(true);
        } else {
          toast.error('Failed to add to Wish List');
        }
      }
    } catch (err) {
      toast.error('Something went wrong');
      console.error(err);
    } finally {
      setIsWishlistLoading(false);
    }
  }

  useEffect(() => {
    async function checkWishlist() {
      if (!data?.token) return;
      const wishlist = await apiServices.getAllWishList(data.token);

      const exists = wishlist?.data?.some(
        (item: WishlistItem) =>
          item._id === product._id || item.product?._id === product._id
      );

      setInWishlist(!!exists);
    }

    checkWishlist();
  }, [data?.token, product._id]);

  // ✅ List view
  if (viewMode === 'list') {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            className="object-cover rounded-md"
            sizes="128px"
          />

          {/* Overlay Loader */}
          {isWishlistLoading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 rounded-md">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">
              <Link
                href={`/products/${product.id}`}
                className="hover:text-primary transition-colors"
              >
                {product.title}
              </Link>
            </h3>
            <Button onClick={toggleWishlist} variant="ghost" size="sm">
              <Heart
                className="h-5 w-5"
                fill={inWishlist ? 'red' : 'none'}
                stroke={inWishlist ? 'red' : 'currentColor'}
              />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              {renderStars(product.ratingsAverage)}
              <span className="text-sm text-muted-foreground ml-1">
                ({product.ratingsQuantity})
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {product.sold} sold
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Brand:{' '}
                  <Link
                    href={``}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {product.brand.name}
                  </Link>
                </span>
                <span>
                  Category:{' '}
                  <Link
                    href={``}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </span>
              </div>
            </div>

            <Button
              onClick={() => handleAddToCart!(product._id, setAddToCartLoading)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Grid view
  return (
    <div className="group flex flex-col justify-between relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      <div>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Overlay Loader */}
          {isWishlistLoading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}

          {/* Wishlist Button */}
          <Button
            onClick={toggleWishlist}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white z-20"
          >
            <Heart
              className="h-5 w-5"
              fill={inWishlist ? 'red' : 'none'}
              stroke={inWishlist ? 'red' : 'currentColor'}
            />
          </Button>

          {product.sold > 100 && (
            <div className="absolute top-2 left-2 bg-green-700 text-primary-foreground text-xs px-2 py-1 rounded">
              Popular
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
            <Link
              href={`/brands/${product.brand._id}`}
              className="hover:text-primary hover:underline transition-colors"
            >
              {product.brand.name}
            </Link>
          </p>

          <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
            <Link href={`products/${product.id}`}>{product.title}</Link>
          </h3>

          <div className="flex items-center gap-1 mb-2">
            <div className="flex">{renderStars(product.ratingsAverage)}</div>
            <span className="text-xs text-muted-foreground">
              ({product.ratingsQuantity})
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-2">
            <Link
              href={``}
              className="hover:text-primary hover:underline transition-colors"
            >
              {product.category.name}
            </Link>
          </p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-muted-foreground">
              {product.sold} sold
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <AddToCart
          addToCartLoading={AddToCartLoading}
          productQuantity={product.quantity}
          handleAddToCart={() => {
            handleAddToCart!(product._id, setAddToCartLoading);
          }}
        />
      </div>
    </div>
  );
}
