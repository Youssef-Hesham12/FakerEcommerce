'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Loader2, LogOutIcon } from 'lucide-react';
import { Button } from '@/components';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components';
import { cn } from '@/lib/utils';
import React, { useContext, useState } from 'react';
import { CartContext } from '@/contexts/CartContext';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, cartLoading } = useContext(CartContext);
  const { status } = useSession();

  const navItems = [
    { href: '/products', label: 'Products' },
    { href: '/brands', label: 'Brands' },
    { href: '/categories', label: 'Categories' },
    { href: '/cart', label: 'Cart' },
    { href: '/wishlist', label: 'WishList' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-green-700 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                F
              </span>
            </div>
            <span className="font-bold text-green-700 text-xl">Fakhr</span>
          </Link>

          {/* Desktop Navigation */}
          {status === 'authenticated' ? (
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {navItems.map((item) => {
                  const isActive =
                    item.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.href);

                  return (
                    <NavigationMenuItem key={item.href}>
                      <Link href={item.href}>
                        <NavigationMenuLink
                          className={cn(
                            'group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                            isActive
                              ? 'bg-green-700 text-primary-foreground shadow-md font-semibold'
                              : 'bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                          )}
                        >
                          {item.label}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          ) : null}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {status === 'loading' ? (
              <Loader2 className="animate-spin" />
            ) : status === 'authenticated' ? (
              <>
                {/* Shopping Cart */}
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-700 text-xs text-primary-foreground flex items-center justify-center">
                      {cartLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        cartCount
                      )}
                    </span>
                    <span className="sr-only">Shopping cart</span>
                  </Button>
                </Link>

                {/* Logout */}
                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  size="icon"
                  className="relative"
                >
                  <LogOutIcon />
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login">
                  <Button variant="secondary">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="secondary">Register</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === '/products' && pathname.startsWith('/products'));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-green-700 text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Logout for mobile */}
            {status === 'authenticated' && (
              <Button
                onClick={() => signOut()}
                variant="ghost"
                size="icon"
                className="mt-2"
              >
                <LogOutIcon />
                <span className="ml-2">Logout</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
