import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className='max-w-6xl mx-auto'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className='bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100'>
          <div className='bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600'>
            <ShoppingBag size={40} />
          </div>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Your cart is empty</h2>
          <p className='text-gray-500 mb-8'>Looks like you haven't added anything to your cart yet.</p>
          <Link to='/' className='btn-primary inline-flex px-8 py-3 rounded-xl'>
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items List */}
          <div className='lg:col-span-2 space-y-4'>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className='bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6'
              >
                <div className='w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0'>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='w-full h-full object-cover'
                  />
                </div>

                <div className='flex-grow text-center sm:text-left'>
                  <Link
                    to={`/product/${item._id}`}
                    className='text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors'
                  >
                    {item.name}
                  </Link>
                  <p className='text-sm text-gray-500 mt-1'>{item.category}</p>
                  <p className='text-primary-600 font-bold mt-2'>₹{item.price}</p>
                </div>

                <div className='flex items-center gap-4'>
                  <select
                    value={item.qty}
                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                    className='bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 outline-none focus:border-primary-500'
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeFromCartHandler(item._id)}
                    className='p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                    title='Remove Item'
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24'>
              <h2 className='text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100'>
                Order Summary
              </h2>
              
              <div className='space-y-4 mb-8'>
                <div className='flex justify-between text-gray-600'>
                  <span>Total Items</span>
                  <span className='font-bold text-gray-900'>
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </span>
                </div>
                <div className='flex justify-between text-xl font-black text-gray-900 pt-4 border-t border-gray-100'>
                  <span>Subtotal</span>
                  <span>₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={checkoutHandler}
                className='w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2'
              >
                Proceed to Checkout <ArrowRight size={20} />
              </button>
              
              <p className='text-xs text-center text-gray-400 mt-4'>
                Taxes and shipping calculated at checkout
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
