'use client';
import { LoadingSpinner } from '@/components';
import { Category, Subcategory } from '@/interfaces';
import { apiServices } from '@/services/api';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [subCategories, setSubCategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  async function getAllCategories() {
    setLoadingCategories(true);
    const response = await apiServices.getAllCategories();
    setCategories(response.data);
    setLoadingCategories(false);
  }

  async function handleCategoryClick(cat: Category) {
    setSelectedCategory(cat);
    setLoadingSubcategories(true);
    try {
      const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/categories/${cat._id}/subcategories`
      );
      const data = await res.json();
      setSubCategories(data.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubCategories([]);
    }
    setLoadingSubcategories(false);
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div className="custom-container mx-auto px-6 pb-10">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Our <span className="text-green-700">Categories</span>
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Explore a variety of product categories.
        </p>
      </div>

      {/* Categories */}
      {loadingCategories ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => handleCategoryClick(cat)}
              className={`group p-6 border rounded-2xl shadow-sm bg-white dark:bg-gray-900 hover:shadow-lg transition cursor-pointer ${
                selectedCategory?._id === cat._id ? 'border-green-600' : ''
              }`}
            >
              <div className="flex items-center justify-center h-52 mb-4 dark:bg-gray-800 rounded-xl overflow-hidden">
                {cat.image ? (
                  <Image
                    width={500}
                    height={500}
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-blue-600">
                {cat.name}
              </h2>
            </div>
          ))}
        </div>
      )}

      {/* Subcategories */}
      <div className="mt-12">
        {selectedCategory && (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Subcategories of {selectedCategory.name}
            </h2>

            {loadingSubcategories ? (
              <div className="flex justify-center py-6">
                <LoadingSpinner />
              </div>
            ) : subCategories.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {subCategories.map((sub) => (
                  <div
                    key={sub._id}
                    className="p-4 border rounded-xl shadow-sm bg-gray-50 dark:bg-gray-800"
                  >
                    <p className="text-center font-medium text-gray-700 dark:text-gray-200">
                      {sub.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No subcategories found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
