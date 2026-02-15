import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import { LogIn, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <div className='bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100'>
        <div className='flex flex-col items-center mb-10'>
          <div className='bg-primary-100 p-4 rounded-2xl text-primary-600 mb-4'>
            <LogIn size={32} />
          </div>
          <h1 className='text-3xl font-black text-gray-900'>Welcome Back</h1>
          <p className='text-gray-500 mt-2 font-medium'>Sign in to your AgriMart account</p>
        </div>

        <form onSubmit={submitHandler} className='space-y-6'>
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

          <button
            disabled={isLoading}
            type='submit'
            className='w-full btn-primary py-4 rounded-2xl text-lg font-bold shadow-lg shadow-primary-200 mt-4'
          >
            {isLoading ? <Loader /> : 'Sign In'}
          </button>
        </form>

        <div className='mt-10 text-center pt-8 border-t border-gray-100'>
          <p className='text-gray-600 font-medium'>
            New to AgriMart?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
              className='text-primary-600 font-bold hover:underline'
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </FormContainer>
  );
};

export default LoginPage;
