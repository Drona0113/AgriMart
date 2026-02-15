import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { CreditCard, Wallet, Banknote } from 'lucide-react';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
        <div className='flex items-center gap-3 mb-8'>
          <div className='bg-primary-100 p-2 rounded-xl text-primary-600'>
            <CreditCard size={24} />
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>Payment Method</h1>
        </div>

        <form onSubmit={submitHandler} className='space-y-6'>
          <div className='space-y-4'>
            <label className='flex items-center p-4 border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-primary-200 transition-all has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50'>
              <input
                type='radio'
                className='w-5 h-5 text-primary-600 focus:ring-primary-500'
                name='paymentMethod'
                value='PayPal'
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className='ml-4 flex items-center gap-3'>
                <div className='bg-white p-2 rounded-lg shadow-sm'>
                  <Wallet size={20} className='text-blue-600' />
                </div>
                <div>
                  <p className='font-bold text-gray-900'>PayPal or Credit Card</p>
                  <p className='text-xs text-gray-500'>Safe and secure online payment</p>
                </div>
              </div>
            </label>

            <label className='flex items-center p-4 border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-primary-200 transition-all has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50'>
              <input
                type='radio'
                className='w-5 h-5 text-primary-600 focus:ring-primary-500'
                name='paymentMethod'
                value='COD'
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className='ml-4 flex items-center gap-3'>
                <div className='bg-white p-2 rounded-lg shadow-sm'>
                  <Banknote size={20} className='text-green-600' />
                </div>
                <div>
                  <p className='font-bold text-gray-900'>Cash on Delivery (COD)</p>
                  <p className='text-xs text-gray-500'>Pay when you receive the items</p>
                </div>
              </div>
            </label>
          </div>

          <button type='submit' className='w-full btn-primary py-4 mt-8'>
            Continue to Review
          </button>
        </form>
      </div>
    </FormContainer>
  );
};

export default PaymentPage;
