import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, ArrowLeft, Key, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useForgotPasswordMutation, useResetPasswordMutation } from '../slices/usersApiSlice';
import FormContainer from '../components/FormContainer';
import { 
  INPUT_CLASSES, 
  LABEL_CLASSES,
  CARD_CLASSES,
  ICON_WRAPPER_CLASSES,
  TITLE_CLASSES,
  SUBTITLE_CLASSES
} from '../utils/styles';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Validate, 2: Reset
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const [forgotPassword, { isLoading: isValidating }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const validateHandler = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email, mobile }).unwrap();
      setStep(2);
      toast.success('Identity verified. Please set your new password.');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const resetHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await resetPassword({ email, mobile, password }).unwrap();
      toast.success('Password updated successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <div className={CARD_CLASSES}>
        <div className='flex flex-col items-center mb-10'>
          <div className={ICON_WRAPPER_CLASSES}>
            <Key size={32} />
          </div>
          <h1 className={TITLE_CLASSES}>
            {step === 1 ? 'Forgot Password?' : 'Reset Password'}
          </h1>
          <p className={SUBTITLE_CLASSES}>
            {step === 1 
              ? 'Enter your details to verify your identity' 
              : 'Set a new secure password for your account'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={validateHandler} className='space-y-6'>
            <div>
              <label className={LABEL_CLASSES}>
                Email Address
              </label>
              <div className='relative'>
                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
                <input
                  type='email'
                  className={INPUT_CLASSES}
                  placeholder='Enter your email'
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
                  placeholder='Enter your mobile number'
                  value={mobile}
                  required
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={isValidating}
              type='submit'
              className='w-full btn-primary py-4 rounded-2xl text-lg font-bold shadow-lg shadow-primary-200 mt-4'
            >
              {isValidating ? <Loader /> : 'Verify Identity'}
            </button>
          </form>
        ) : (
          <form onSubmit={resetHandler} className='space-y-6'>
            <div>
              <label className={LABEL_CLASSES}>
                New Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
                <input
                type={showPassword ? 'text' : 'password'}
                className={`${INPUT_CLASSES} pr-12`}
                placeholder='Enter new password'
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
                <button
                  type='button'
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className={LABEL_CLASSES}>
                Confirm New Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
                <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`${INPUT_CLASSES} pr-12`}
                placeholder='Confirm new password'
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
                <button
                  type='button'
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              disabled={isResetting}
              type='submit'
              className='w-full btn-primary py-4 rounded-2xl text-lg font-bold shadow-lg shadow-primary-200 mt-4'
            >
              {isResetting ? <Loader /> : 'Reset Password'}
            </button>
          </form>
        )}

        <div className='mt-10 text-center pt-8 border-t border-gray-100'>
          <Link
            to='/login'
            className='inline-flex items-center gap-2 text-gray-600 font-bold hover:text-primary-600 transition-colors'
          >
            <ArrowLeft size={18} /> Back to Sign In
          </Link>
        </div>
      </div>
    </FormContainer>
  );
};

export default ForgotPasswordPage;
