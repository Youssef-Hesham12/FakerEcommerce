'use client';

import React, { useEffect, useState } from 'react';
import { InfiniteMovingCards } from '../ui/infinite-moving-cards';
import { apiServices } from '@/services/api';
import { Category } from '@/interfaces';

export function InfiniteMovingCardsDemo() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await apiServices.getAllCategories();
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="h-[40rem] flex items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={categories.map((cat) => ({
          id: Number(cat._id),
          name: cat.name,
          image: cat.image ?? '/fallback.jpg',
        }))}
        direction="right"
        speed="slow"
      />
    </div>
  );
}
