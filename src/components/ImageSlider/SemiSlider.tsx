'use client';

import Carousel from '@/components/ui/carousel';
export function CarouselDemo() {
  const slideData = [
    {
      title: 'Fakhr',
      src: 'https://images.unsplash.com/photo-1735977293045-0f15b2da718e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJyYW5kJTIwY2xvdGhlc3xlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      title: 'Zara',
      src: 'https://images.unsplash.com/photo-1708932228971-dbd115c3893d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8emFyYXxlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      title: 'abides',
      src: 'https://images.unsplash.com/photo-1511746315387-c4a76990fdce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWRpZGFzfGVufDB8fDB8fHww',
    },
    {
      title: 'Apple',
      src: 'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      title: 'Puma',
      src: 'https://images.unsplash.com/photo-1626298051747-1ba4ff5cd5a1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHVtYSUyMHNuZWFrZXJzfGVufDB8fDB8fHww',
    },
  ];
  return (
    <div className="relative overflow-hidden w-full h-full py-20">
      <Carousel slides={slideData} />
    </div>
  );
}
