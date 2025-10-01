'use client';

import { LoadingSpinner, ProductCard } from '@/components';
import { Product } from '@/interfaces';
import { apiServices } from '@/services/api';
import { ProductsResponse } from '@/types';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useCallback } from 'react';

export default function WishList() {
  const { data } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllWishList = useCallback(async () => {
    try {
      if (!data?.token) return;
      const response: ProductsResponse = await apiServices.getAllWishList(
        data.token
      );
      setProducts(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setLoading(false);
    }
  }, [data?.token]);

  useEffect(() => {
    getAllWishList();
  }, [getAllWishList]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!products.length) {
    return <p className="text-center py-10">Your wishlist is empty.</p>;
  }

  return (
    <div className="custom-container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            viewMode="grid"
            onWishlistChange={getAllWishList}
          />
        ))}
      </div>
    </div>
  );
}
