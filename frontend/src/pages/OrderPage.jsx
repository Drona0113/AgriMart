import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from '../slices/ordersApiSlice';
import { MapPin, CreditCard, ShoppingBag, CheckCircle2, Clock, Truck } from 'lucide-react';

const OrderPage = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order delivered');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // For demo purposes, a simple pay handler
  const payHandler = async () => {
    try {
      await payOrder({ orderId, details: { id: 'DEMO_PAYMENT_ID', status: 'COMPLETED', update_time: new Date().toISOString(), payer: { email_address: userInfo.email } } });
      refetch();
      toast.success('Payment successful');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <div className='max-w-6xl mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4'>
        <div>
          <h1 className='text-3xl font-black text-gray-900'>Order Details</h1>
          <p className='text-gray-500 font-medium'>Order ID: {order._id}</p>
        </div>
        <div className='flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100'>
          <Clock size={20} className='text-primary-600' />
          <span className='font-bold text-gray-700'>
            Placed on: {order.createdAt.substring(0, 10)}
          </span>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-8'>
          {/* Shipping Section */}
          <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='bg-primary-100 p-2 rounded-xl text-primary-600'>
                <MapPin size={24} />
              </div>
              <h2 className='text-2xl font-bold text-gray-900'>Shipping</h2>
            </div>
            <div className='space-y-4'>
              <div className='text-gray-600'>
                <p className='font-bold text-gray-800 mb-1'>Customer:</p>
                <p>{order.user.name} ({order.user.email})</p>
              </div>
              <div className='text-gray-600'>
                <p className='font-bold text-gray-800 mb-1'>Address:</p>
                <p>{order.shippingAddress.village}, {order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
              {order.isDelivered ? (
                <div className='flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-2xl border border-green-100'>
                  <CheckCircle2 size={20} />
                  <p className='font-bold'>Delivered on {order.deliveredAt.substring(0, 10)}</p>
                </div>
              ) : (
                <div className='flex items-center gap-2 text-orange-600 bg-orange-50 p-4 rounded-2xl border border-orange-100'>
                  <Truck size={20} />
                  <p className='font-bold'>Not Delivered</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Section */}
          <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='bg-primary-100 p-2 rounded-xl text-primary-600'>
                <CreditCard size={24} />
              </div>
              <h2 className='text-2xl font-bold text-gray-900'>Payment</h2>
            </div>
            <div className='space-y-4'>
              <p className='text-gray-800 font-medium'>
                Method: <span className='font-bold'>{order.paymentMethod}</span>
              </p>
              {order.isPaid ? (
                <div className='flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-2xl border border-green-100'>
                  <CheckCircle2 size={20} />
                  <p className='font-bold'>Paid on {order.paidAt.substring(0, 10)}</p>
                </div>
              ) : (
                <div className='flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100'>
                  <Clock size={20} />
                  <p className='font-bold'>Not Paid</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items Section */}
          <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='bg-primary-100 p-2 rounded-xl text-primary-600'>
                <ShoppingBag size={24} />
              </div>
              <h2 className='text-2xl font-bold text-gray-900'>Order Items</h2>
            </div>
            <div className='divide-y divide-gray-100'>
              {order.orderItems.map((item, index) => (
                <div key={index} className='py-4 flex items-center gap-4'>
                  <div className='w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-50'>
                    <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
                  </div>
                  <div className='flex-grow'>
                    <Link to={`/product/${item.product}`} className='font-bold text-gray-900 hover:text-primary-600'>
                      {item.name}
                    </Link>
                    <p className='text-sm text-gray-500 font-medium'>{item.qty} x ₹{item.price}</p>
                  </div>
                  <div className='font-bold text-gray-900 text-lg'>
                    ₹{(item.qty * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className='lg:col-span-1'>
          <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24'>
            <h2 className='text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100'>
              Order Summary
            </h2>
            <div className='space-y-4 mb-8'>
              <div className='flex justify-between text-gray-600'>
                <span>Items Total</span>
                <span className='font-bold text-gray-900'>₹{order.itemsPrice}</span>
              </div>
              <div className='flex justify-between text-gray-600'>
                <span>Shipping</span>
                <span className='font-bold text-gray-900'>₹{order.shippingPrice}</span>
              </div>
              <div className='flex justify-between text-gray-600'>
                <span>Tax (GST)</span>
                <span className='font-bold text-gray-900'>₹{order.taxPrice}</span>
              </div>
              <div className='flex justify-between text-2xl font-black text-gray-900 pt-6 border-t border-gray-100'>
                <span>Total</span>
                <span>₹{order.totalPrice}</span>
              </div>
            </div>

            {/* Payment Button (for demo/farmer-friendly simple pay) */}
            {!order.isPaid && (
              <button
                onClick={payHandler}
                disabled={loadingPay}
                className='w-full btn-primary py-4 rounded-xl font-bold mb-4 shadow-lg shadow-primary-200'
              >
                {loadingPay ? <Loader /> : 'Pay Now (Demo)'}
              </button>
            )}

            {/* Admin Deliver Button */}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                type='button'
                className='w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors'
                onClick={deliverHandler}
                disabled={loadingDeliver}
              >
                {loadingDeliver ? <Loader /> : 'Mark As Delivered'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
