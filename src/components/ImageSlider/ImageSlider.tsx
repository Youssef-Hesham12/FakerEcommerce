'use client';
import { motion } from 'motion/react';
import React from 'react';
import { ImagesSlider } from '../ui/images-slider';
import Link from 'next/link';

export default function ImagesSliderDemo() {
  const images = [
    'https://images.unsplash.com/photo-1608541737042-87a12275d313?q=80&w=1161&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1555274175-75f4056dfd05?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1722965048261-3ef63bbf180f?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://th.bing.com/th/id/R.0d75813d6272420ba2e68988809ef4a2?rik=457%2fVI6WEW4nNQ&pid=ImgRaw&r=0',
  ];
  return (
    <ImagesSlider className="h-[40rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="text-5xl text-white font-bold ">
          Let&apos;s go to shopping <br /> Shop Now
        </motion.p>

        <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
          <Link href={'/brands'}>Brands</Link>
          <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
        </button>
      </motion.div>
    </ImagesSlider>
  );
}
