'use client';
import { Button, LoadingSpinner } from '@/components';
import { Brand } from '@/interfaces';
import { apiServices } from '@/services/api';
import { SingleBrandResponse } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function BrandPage() {
  const { id } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);

  useEffect(() => {
    async function fetchBrand() {
      const response: SingleBrandResponse = await apiServices.getSpecificBrand(
        id ?? ''
      );
      setBrand(response.data);
    }

    fetchBrand();
  }, [id]);

  if (!brand) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
        {/* Brand Image */}
        <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          {brand.image ? (
            <Image
              width={500}
              height={500}
              src={brand.image}
              alt={brand.name}
              className="max-h-60 object-contain"
            />
          ) : (
            <span className="text-gray-400">No Logo Available</span>
          )}
        </div>

        {/* Brand Info */}
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {brand.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {brand.slug ? brand.slug : 'This brand has no description yet.'}
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <Link href="/brands">
          <Button
            size="lg"
            className="px-8 bg-green-700 hover:bg-green-800 text-lg"
          >
            Go To Brands
          </Button>
        </Link>
      </div>
    </div>
  );
}
