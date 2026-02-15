import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { MapPin, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();
  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-8'>
          {/* Shipping Review */}
          <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='bg-primary-100 p-2 rounded-xl text-primary-600'>
                <MapPin size={24} />
              </div>
              <h2 className='text-2xl font-bold text-gray-900'>Shipping Details</h2>
            </div>
            <div className='text-gray-600 space-y-1'>
              <p className='font-bold text-gray-800'>Delivery to:</p>
              <p>{cart.shippingAddress.village}, {cart.shippingAddress.address}</p>
              <p>{cart.shippingAddress.city} {cart.shippingAddress.postalCode}</p>
              <p>{cart.shippingAddress.country}</p>
              {cart.shippingAddress.landmark && (
                <p className='text-sm italic'>Landmark: {cart.shippingAddress.landmark}</p>
              )}
            </div>
          </div>

          {/* Payment Review */}
          <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='bg-primary-100 p-2 rounded-xl text-primary-600'>
                <CreditCard size={24} />
              </div>
              <h2 className='text-2xl font-bold text-gray-900'>Payment Method</h2>
            </div>
            <p className='text-gray-800 font-medium'>
              Method: <span className='font-bold'>{cart.paymentMethod}</span>
            </p>
          </div>

          {/* Items Review */}
          <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='bg-primary-100 p-2 rounded-xl text-primary-600'>
                <ShoppingBag size={24} />
              </div>
              <h2 className='text-2xl font-bold text-gray-900'>Order Items</h2>
            </div>
            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <div className='divide-y divide-gray-100'>
                {cart.cartItems.map((item, index) => (
                  <div key={index} className='py-4 flex items-center gap-4'>
                    <div className='w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-50'>
                      <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
                    </div>
                    <div className='flex-grow'>
                      <Link to={`/product/${item._id}`} className='font-bold text-gray-900 hover:text-primary-600'>
                        {item.name}
                      </Link>
                      <p className='text-sm text-gray-500'>{item.qty} x ₹{item.price}</p>
                    </div>
                    <div className='font-bold text-gray-900'>
                      ₹{(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className='lg:col-span-1'>
          <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24'>
            <h2 className='text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100'>
              Final Summary
            </h2>
            <div className='space-y-4 mb-8'>
              <div className='flex justify-between text-gray-600'>
                <span>Items Total</span>
                <span className='font-bold text-gray-900'>₹{cart.itemsPrice}</span>
              </div>
              <div className='flex justify-between text-gray-600'>
                <span>Shipping</span>
                <span className='font-bold text-gray-900'>₹{cart.shippingPrice}</span>
              </div>
              <div className='flex justify-between text-gray-600'>
                <span>Tax (GST)</span>
                <span className='font-bold text-gray-900'>₹{cart.taxPrice}</span>
              </div>
              <div className='flex justify-between text-2xl font-black text-gray-900 pt-6 border-t border-gray-100'>
                <span>Total</span>
                <span>₹{cart.totalPrice}</span>
              </div>
            </div>

            {error && (
              <Message variant='danger'>
                {error?.data?.message || error.error}
              </Message>
            )}

            <button
              type='button'
              className='w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2'
              disabled={cart.cartItems.length === 0 || isLoading}
              onClick={placeOrderHandler}
            >
              {isLoading ? <Loader /> : (
                <>Place Order <ArrowRight size={20} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
