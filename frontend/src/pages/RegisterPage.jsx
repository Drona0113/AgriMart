import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import { UserPlus, Mail, Lock, User, Phone, Tractor } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [govtId, setGovtId] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ name, email, mobile, password, govtId }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <div className='bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100'>
        <div className='flex flex-col items-center mb-10'>
          <div className='bg-primary-100 p-4 rounded-2xl text-primary-600 mb-4'>
            <UserPlus size={32} />
          </div>
          <h1 className='text-3xl font-black text-gray-900'>Create Account</h1>
          <p className='text-gray-500 mt-2 font-medium'>Join AgriMart for your farming needs</p>
        </div>

        <form onSubmit={submitHandler} className='space-y-6'>
          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Full Name
            </label>
            <div className='relative'>
              <User className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='text'
                className='w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50 focus:bg-white transition-all'
                placeholder='Enter your name'
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Email Address
            </label>
            <div className='relative'>
              <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='email'
                className='w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50 focus:bg-white transition-all'
                placeholder='farmer@example.com'
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Mobile Number
            </label>
            <div className='relative'>
              <Phone className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='tel'
                className='w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50 focus:bg-white transition-all'
                placeholder='9876543210'
                value={mobile}
                required
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Farmer ID / Kisan Card (Optional)
            </label>
            <div className='relative'>
              <Tractor className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='text'
                className='w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50 focus:bg-white transition-all'
                placeholder='e.g., KCC1234567890 or AP12345678'
                value={govtId}
                onChange={(e) => setGovtId(e.target.value)}
                pattern="[A-Za-z0-9]{10,16}"
                title="ID must be 10-16 alphanumeric characters"
              />
            </div>
            <p className='text-xs text-gray-400 mt-2 font-medium ml-2'>
              * Provide this ID to get verified as a Farmer and sell products.
            </p>
          </div>

          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='password'
                className='w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50 focus:bg-white transition-all'
                placeholder='Enter your password'
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Confirm Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='password'
                className='w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50 focus:bg-white transition-all'
                placeholder='Confirm your password'
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {govtId && (
            <div className='flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100'>
              <input
                type='checkbox'
                id='consent'
                required
                className='mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500'
              />
              <label htmlFor='consent' className='text-sm text-gray-600 leading-snug'>
                I hereby consent to providing my Government ID for verification purposes only. I understand this information will be securely used by AgriMart solely to validate my Farmer status.
              </label>
            </div>
          )}

          <button
            disabled={isLoading}
            type='submit'
            className='w-full btn-primary py-4 rounded-2xl text-lg font-bold shadow-lg shadow-primary-200 mt-4'
          >
            {isLoading ? <Loader /> : 'Sign Up'}
          </button>
        </form>

        <div className='mt-10 text-center pt-8 border-t border-gray-100'>
          <p className='text-gray-600 font-medium'>
            Already have an account?{' '}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : '/login'}
              className='text-primary-600 font-bold hover:underline'
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </FormContainer>
  );
};

export default RegisterPage;
