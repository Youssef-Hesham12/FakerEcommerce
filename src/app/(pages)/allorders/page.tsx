'use client';
import { LoadingSpinner } from '@/components';
import { Order } from '@/interfaces/order';
import { apiServices } from '@/services/api';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export default function AllOrders() {
  const { data, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getUserId(token: string) {
    try {
      const response = await apiServices.verifyToken(token);
      setUserId(response?.decoded?.id || null);
    } catch (error) {
      console.error('Failed to verify token:', error);
    }
  }

  async function getUserOrders(userId: string) {
    try {
      const response = await apiServices.getUserOrder(userId);
      setOrders(Array.isArray(response) ? response.filter(Boolean) : []);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && data?.token) {
      getUserId(data.token);
    }
  }, [status, data?.token]);

  useEffect(() => {
    if (userId) {
      getUserOrders(userId);
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-20 text-gray-500">No orders found.</div>
    );
  }

  return (
    <div className="custom-container w-[80%] mx-auto my-10 space-y-8">
      {orders.map((order, index) => {
        if (!order) return null;

        const orderKey = order._id || order.id || `order-${index}`;
        const cartItems = Array.isArray(order.cartItems)
          ? order.cartItems.filter(Boolean)
          : [];
        const shipping = order.shippingAddress || {};

        return (
          <div
            key={orderKey}
            className="border rounded-xl p-6 shadow-md bg-white"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Order #{order._id || order.id || 'N/A'}
              </h2>
              <div className="flex gap-2">
                {order.isPaid ? (
                  <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded">
                    Paid
                  </span>
                ) : (
                  <span className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded">
                    Unpaid
                  </span>
                )}
                {order.isDelivered ? (
                  <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                    Delivered
                  </span>
                ) : (
                  <span className="px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded">
                    Pending
                  </span>
                )}
              </div>
            </div>

            {/* Products List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              {cartItems.length ? (
                cartItems.map((item, idx) => (
                  <div
                    key={item._id || item.product?.id || `product-${idx}`}
                    className="border p-2 rounded shadow-sm bg-gray-50"
                  >
                    <h4 className="font-medium">
                      {item.product?.title || 'Unnamed Product'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Price: ${item.price?.toFixed(2) ?? '0.00'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.count ?? 1}
                    </p>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-gray-500 text-center">
                  No products in this order.
                </p>
              )}
            </div>

            {/* Shipping & Payment Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t pt-4 mt-4">
              <div>
                <h3 className="font-medium">Shipping Info</h3>
                <p>{shipping.details || 'N/A'}</p>
                <p>{shipping.phone || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-medium">Payment</h3>
                <p>Method: {order.paymentMethodType || 'N/A'}</p>
                <p>
                  Paid At:{' '}
                  {order.paidAt
                    ? new Date(order.paidAt).toLocaleString()
                    : 'Not paid yet'}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Total</h3>
                <p>${order.totalOrderPrice?.toFixed(2) ?? '0.00'}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
