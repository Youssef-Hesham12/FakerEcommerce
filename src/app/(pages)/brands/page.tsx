'use client';
import { LoadingSpinner } from '@/components';
import { Brand } from '@/interfaces';
import { apiServices } from '@/services/api';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getBrands() {
    try {
      const response = await apiServices.getAllBrands();
      setBrands(response.data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getBrands();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="custom-container mx-auto px-6 pb-10">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Our <span className="text-green-700">Brands</span>
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Discover top brands that bring you quality and trust.
        </p>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <div
            key={brand._id}
            className="group p-6 border rounded-2xl shadow-sm bg-white dark:bg-gray-900 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-center h-24 mb-4 dark:bg-gray-800 rounded-xl">
              {brand.image ? (
                <Image
                  width={500}
                  height={500}
                  src={brand.image}
                  alt={brand.name}
                  className="max-h-20 object-contain"
                />
              ) : (
                <span className="text-gray-400">No Logo</span>
              )}
            </div>
            <Link
              href={`/brands/${brand._id}`}
              className="block text-lg font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-green-700"
            >
              {brand.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
