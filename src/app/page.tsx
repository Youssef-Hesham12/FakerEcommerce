'use client';
import ImagesSliderDemo from '@/components/ImageSlider/ImageSlider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LoadingSpinner, ProductCard } from '@/components';
import { apiServices } from '@/services/api';
import { Product } from '@/interfaces';
import { useEffect, useState } from 'react';
import { CarouselDemo } from '@/components/ImageSlider/SemiSlider';
import { InfiniteMovingCardsDemo } from '@/components/ImageSlider/InfMov';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function getProduct() {
    setLoading(true);
    try {
      const response = await apiServices.getAllProducts();
      setProducts(response?.data ?? []);
    } catch (err) {
      console.error('getAllProducts error', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div>
      <h1 className="text-center text-4xl font-bold pb-10 ">
        Welcome To <span className="text-green-700">Fakhr</span> Store
      </h1>
      <div className="container mx-auto px-5 pb-5">
        <div className="text-center space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Slider */}
            <div className="md:col-span-2 px-20">
              <ImagesSliderDemo />
            </div>

            {/* Buttons */}
            <div className="flex  flex-col items-center gap-4 justify-center">
              <Link href="/products" className="w-full md:w-auto">
                <Button size="lg" className="text-lg bg-green-700 px-8 w-full">
                  Shop Now
                </Button>
              </Link>

              <Link href="/categories" className="w-full md:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg text-green-700 border-green-700 px-8 w-full"
                >
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div>
          <InfiniteMovingCardsDemo />
        </div>
        <div className="text-center my-10">
          <h2 className="text-3xl font-bold italic">Product</h2>
        </div>

        <div className="custom-container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 my-10">
          {loading ? (
            <div className="flex justify-center items-center col-span-full min-h-[200px]">
              <LoadingSpinner />
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No products found.
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
        {
          <div className="mt-10">
            <CarouselDemo />
          </div>
        }
      </div>
    </div>
  );
}
