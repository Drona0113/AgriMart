import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import { UserPlus, Mail, Lock, User, Phone, Tractor, Store, Shield, Key } from 'lucide-react';
import { 
  INPUT_CLASSES, 
  LABEL_CLASSES,
  CARD_CLASSES,
  ICON_WRAPPER_CLASSES,
  TITLE_CLASSES,
  SUBTITLE_CLASSES
} from '../utils/styles';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [govtId, setGovtId] = useState('');
  const [isSupplier, setIsSupplier] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSecret, setAdminSecret] = useState('');

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
        const res = await register({ name, email, mobile, password, govtId, isSupplier, isAdmin, adminSecret }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <div className={CARD_CLASSES}>
        <div className='flex flex-col items-center mb-10'>
          <div className={ICON_WRAPPER_CLASSES}>
            {isAdmin ? <Shield size={32} /> : isSupplier ? <Store size={32} /> : <UserPlus size={32} />}
          </div>
          <h1 className={TITLE_CLASSES}>Create Account</h1>
          <p className={SUBTITLE_CLASSES}>Join AgriMart as a {isAdmin ? 'Administrator' : isSupplier ? 'Supplier' : 'Farmer/User'}</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-8 overflow-hidden">
          <button
            type="button"
            className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${!isSupplier && !isAdmin ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => {
              setIsSupplier(false);
              setIsAdmin(false);
            }}
          >
            Farmer
          </button>
          <button
            type="button"
            className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${isSupplier ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => {
              setIsSupplier(true);
              setIsAdmin(false);
            }}
          >
            Supplier
          </button>
          <button
            type="button"
            className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${isAdmin ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => {
              setIsAdmin(true);
              setIsSupplier(false);
            }}
          >
            Admin
          </button>
        </div>

        <form onSubmit={submitHandler} className='space-y-6'>
          <div>
            <label className={LABEL_CLASSES}>
              Full Name
            </label>
            <div className='relative'>
              <User className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='text'
                className={INPUT_CLASSES}
                placeholder='Enter your name'
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASSES}>
              Email Address
            </label>
            <div className='relative'>
              <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='email'
                className={INPUT_CLASSES}
                placeholder={isSupplier ? 'supplier@example.com' : 'farmer@example.com'}
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASSES}>
              Mobile Number
            </label>
            <div className='relative'>
              <Phone className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='tel'
                className={INPUT_CLASSES}
                placeholder='9876543210'
                value={mobile}
                required
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASSES}>
              {isAdmin ? 'Admin Secret Key' : isSupplier ? 'Supplier GST Shop ID' : 'Farmer ID / Kisan Card'}
            </label>
            <div className='relative'>
              {isAdmin ? (
                <Key className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              ) : isSupplier ? (
                <Store className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              ) : (
                <Tractor className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              )}
              <input
                type={isAdmin ? 'password' : 'text'}
                className={INPUT_CLASSES}
                placeholder={isAdmin ? 'Enter Admin Secret Key' : isSupplier ? 'e.g., 22AAAAA0000A1Z5' : 'e.g., KCC1234567890 or AP12345678'}
                value={isAdmin ? adminSecret : govtId}
                required={isAdmin}
                onChange={(e) => isAdmin ? setAdminSecret(e.target.value) : setGovtId(e.target.value)}
                pattern={isAdmin ? undefined : "[A-Za-z0-9]{10,16}"}
                title={isAdmin ? undefined : "ID must be 10-16 alphanumeric characters"}
              />
            </div>
            <p className='text-xs text-gray-400 mt-2 font-medium ml-2'>
              {isAdmin 
                ? '* This key is required to register as a system administrator.'
                : `* Provide this ID to get verified as a ${isSupplier ? 'Supplier' : 'Farmer'} and sell products.`
              }
            </p>
          </div>

          <div>
            <label className={LABEL_CLASSES}>
              Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='password'
                className={INPUT_CLASSES}
                placeholder='Enter your password'
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASSES}>
              Confirm Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='password'
                className={INPUT_CLASSES}
                placeholder='Confirm your password'
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {(govtId || isAdmin) && (
            <div className='flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100'>
              <input
                type='checkbox'
                id='consent'
                required
                className='mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500'
              />
              <label htmlFor='consent' className='text-sm text-gray-600 leading-snug'>
                {isAdmin 
                  ? 'I understand that as an Administrator, I will have access to manage system users, products, and sensitive data. I agree to maintain the security and confidentiality of this role.'
                  : `I hereby consent to providing my ${isSupplier ? 'GST Shop ID' : 'Government ID'} for verification purposes only. I understand this information will be securely used by AgriMart solely to validate my ${isSupplier ? 'Supplier' : 'Farmer'} status.`
                }
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
