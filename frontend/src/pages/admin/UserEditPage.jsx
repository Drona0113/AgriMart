import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useUnmaskUserMutation,
} from '../../slices/usersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { ChevronLeft, User as UserIcon, Mail, Shield, Save, Eye, Loader2 } from 'lucide-react';

const UserEditPage = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFarmer, setIsFarmer] = useState(false);
  const [isSupplier, setIsSupplier] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [govtId, setGovtId] = useState('');

  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
  const [unmaskUser, { isLoading: loadingUnmask }] = useUnmaskUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
      setIsFarmer(user.isFarmer);
      setIsSupplier(user.isSupplier);
      setIsVerified(user.isVerified);
      setGovtId(user.govtId || '');
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const updateData = { userId, name, email, isAdmin, isFarmer, isSupplier, isVerified };
      // Only include govtId if it's not masked (i.e. user changed it or it's empty)
      if (!govtId.includes('XXXX')) {
        updateData.govtId = govtId;
      }
      
      await updateUser(updateData).unwrap();
      toast.success('User updated successfully');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const unmaskHandler = async () => {
    try {
      const res = await unmaskUser(userId).unwrap();
      setGovtId(res.govtId);
      toast.success('ID Unmasked & Logged');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <Link to='/admin/userlist' className='inline-flex items-center gap-2 text-gray-600 font-bold hover:text-primary-600 transition-colors mb-8'>
        <ChevronLeft size={20} /> Back to Users
      </Link>

      <div className='bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden'>
        <div className='p-8 md:p-12 border-b border-gray-100 bg-gray-50/50'>
          <div className='flex items-center gap-4'>
            <div className='bg-primary-100 p-3 rounded-2xl text-primary-600'>
              <UserIcon size={32} />
            </div>
            <div>
              <h1 className='text-3xl font-black text-gray-900'>Edit User</h1>
              <p className='text-gray-500 font-medium'>Update account details and permissions</p>
            </div>
          </div>
        </div>

        <div className='p-8 md:p-12'>
          {loadingUpdate && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error?.data?.message || error.error}</Message>
          ) : (
            <form onSubmit={submitHandler} className='space-y-8'>
              {/* Name */}
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Full Name</label>
                <div className='relative'>
                  <UserIcon className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                  <input
                    type='text'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50/30 transition-all'
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Email Address</label>
                <div className='relative'>
                  <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                  <input
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50/30 transition-all'
                  />
                </div>
              </div>

              {/* Is Admin */}
              <div className='flex items-center gap-3 p-6 bg-gray-50 rounded-2xl border border-gray-100'>
                <input
                  type='checkbox'
                  id='isAdmin'
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className='w-6 h-6 rounded-lg border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer'
                />
                <label htmlFor='isAdmin' className='flex items-center gap-2 font-bold text-gray-700 cursor-pointer'>
                  <Shield size={18} className='text-primary-600' />
                  Grant Administrator Privileges
                </label>
              </div>

              {/* Is Farmer */}
              <div className='flex items-center gap-3 p-6 bg-gray-50 rounded-2xl border border-gray-100'>
                <input
                  type='checkbox'
                  id='isFarmer'
                  checked={isFarmer}
                  onChange={(e) => setIsFarmer(e.target.checked)}
                  className='w-6 h-6 rounded-lg border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer'
                />
                <label htmlFor='isFarmer' className='flex items-center gap-2 font-bold text-gray-700 cursor-pointer'>
                  <UserIcon size={18} className='text-primary-600' />
                  Farmer Role
                </label>
              </div>

              {/* Is Supplier */}
              <div className='flex items-center gap-3 p-6 bg-gray-50 rounded-2xl border border-gray-100'>
                <input
                  type='checkbox'
                  id='isSupplier'
                  checked={isSupplier}
                  onChange={(e) => setIsSupplier(e.target.checked)}
                  className='w-6 h-6 rounded-lg border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer'
                />
                <label htmlFor='isSupplier' className='flex items-center gap-2 font-bold text-gray-700 cursor-pointer'>
                  <UserIcon size={18} className='text-primary-600' />
                  Supplier Role
                </label>
              </div>

              {/* Govt ID */}
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Government ID / GST ID</label>
                <div className='relative'>
                  <Shield className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                  <input
                    type='text'
                    placeholder='Enter ID'
                    value={govtId}
                    onChange={(e) => setGovtId(e.target.value)}
                    className='w-full pl-11 pr-12 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50/30 transition-all'
                  />
                  {govtId && govtId.includes('XXXX') && (
                    <button
                      type='button'
                      onClick={unmaskHandler}
                      disabled={loadingUnmask}
                      className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors'
                      title='Unmask ID (Logs access)'
                    >
                      {loadingUnmask ? <Loader2 size={18} className="animate-spin" /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
              </div>

              {/* Is Verified */}
              <div className='flex items-center gap-3 p-6 bg-gray-50 rounded-2xl border border-gray-100'>
                <input
                  type='checkbox'
                  id='isVerified'
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className='w-6 h-6 rounded-lg border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer'
                />
                <label htmlFor='isVerified' className='flex items-center gap-2 font-bold text-gray-700 cursor-pointer'>
                  <Shield size={18} className='text-green-600' />
                  Verify User (Approved)
                </label>
              </div>

              <button
                type='submit'
                className='w-full inline-flex items-center justify-center gap-2 bg-primary-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-100 mt-4'
              >
                <Save size={24} /> Update User
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserEditPage;
