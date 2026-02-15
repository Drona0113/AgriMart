import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../slices/cartSlice';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { MapPin } from 'lucide-react';

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || 'India');
  const [stateName, setStateName] = useState(shippingAddress.state || 'Andhra Pradesh');
  const [village, setVillage] = useState(shippingAddress.village || '');
  const [landmark, setLandmark] = useState(shippingAddress.landmark || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country, state: stateName, village, landmark }));
    navigate('/payment');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
        <div className='flex items-center gap-3 mb-8'>
          <div className='bg-primary-100 p-2 rounded-xl text-primary-600'>
            <MapPin size={24} />
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>Shipping Details</h1>
        </div>

        <form onSubmit={submitHandler} className='space-y-6'>
          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Village / Area Name
            </label>
            <input
              type='text'
              className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500'
              placeholder='Enter village name'
              value={village}
              required
              onChange={(e) => setVillage(e.target.value)}
            />
          </div>

          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Address
            </label>
            <input
              type='text'
              className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500'
              placeholder='House no, Street name'
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                City / Town
              </label>
              <input
                type='text'
                className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500'
                placeholder='Enter city'
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Postal Code
              </label>
              <input
                type='text'
                className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500'
                placeholder='PIN Code'
                value={postalCode}
                required
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Landmark (Optional)
            </label>
            <input
              type='text'
              className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500'
              placeholder='Near school, temple, etc.'
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                State
              </label>
              <input
                type='text'
                className='w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                value={stateName}
                readOnly
              />
              <p className='text-xs text-primary-600 mt-1 font-medium'>* Service available only in Andhra Pradesh</p>
            </div>
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Country
              </label>
              <input
                type='text'
                className='w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                value={country}
                readOnly
              />
            </div>
          </div>

          <button
            type='submit'
            className='w-full bg-primary-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200'
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </FormContainer>
  );
};

export default ShippingPage;
