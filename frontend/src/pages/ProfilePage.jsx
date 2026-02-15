import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { User, Mail, Lock, ShoppingBag, ArrowRight, XCircle, CheckCircle, Phone } from 'lucide-react';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
    setMobile(userInfo.mobile || '');
  }, [userInfo.email, userInfo.name, userInfo.mobile]);

  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          mobile,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
        {/* User Profile Form */}
        <div className='lg:col-span-1'>
          <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='bg-primary-100 p-2 rounded-xl text-primary-600'>
                <User size={24} />
              </div>
              <h2 className='text-2xl font-bold text-gray-900'>Your Profile</h2>
            </div>

            <form onSubmit={submitHandler} className='space-y-6'>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>
                  Full Name
                </label>
                <div className='relative'>
                  <User className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                  <input
                    type='text'
                    className='w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-medium'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>
                  Email Address
                </label>
                <div className='relative'>
                  <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                  <input
                    type='email'
                    className='w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-medium'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>
                  Mobile Number
                </label>
                <div className='relative'>
                  <Phone className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                  <input
                    type='text'
                    className='w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-medium'
                    placeholder='Enter mobile number'
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>
                  New Password
                </label>
                <div className='relative'>
                  <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                  <input
                    type='password'
                    className='w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-medium'
                    placeholder='Enter new password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>
                  Confirm New Password
                </label>
                <div className='relative'>
                  <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                  <input
                    type='password'
                    className='w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-medium'
                    placeholder='Confirm new password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                disabled={loadingUpdateProfile}
                type='submit'
                className='w-full btn-primary py-4 rounded-xl font-bold shadow-lg shadow-primary-100'
              >
                {loadingUpdateProfile ? <Loader /> : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>

        {/* My Orders Table */}
        <div className='lg:col-span-2'>
          <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='bg-primary-100 p-2 rounded-xl text-primary-600'>
                <ShoppingBag size={24} />
              </div>
              <h2 className='text-2xl font-bold text-gray-900'>My Orders</h2>
            </div>

            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger'>
                {error?.data?.message || error.error}
              </Message>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                  <thead>
                    <tr className='border-b border-gray-100'>
                      <th className='pb-4 font-bold text-gray-600 uppercase text-xs tracking-wider'>ID</th>
                      <th className='pb-4 font-bold text-gray-600 uppercase text-xs tracking-wider'>Date</th>
                      <th className='pb-4 font-bold text-gray-600 uppercase text-xs tracking-wider'>Total</th>
                      <th className='pb-4 font-bold text-gray-600 uppercase text-xs tracking-wider'>Paid</th>
                      <th className='pb-4 font-bold text-gray-600 uppercase text-xs tracking-wider'>Delivered</th>
                      <th className='pb-4'></th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-50'>
                    {orders.map((order) => (
                      <tr key={order._id} className='group hover:bg-gray-50 transition-colors'>
                        <td className='py-4 font-medium text-gray-900'>{order._id.substring(0, 8)}...</td>
                        <td className='py-4 text-gray-600'>{order.createdAt.substring(0, 10)}</td>
                        <td className='py-4 font-bold text-gray-900'>₹{order.totalPrice}</td>
                        <td className='py-4'>
                          {order.isPaid ? (
                            <div className='flex items-center gap-1 text-green-600 font-bold text-sm'>
                              <CheckCircle size={16} /> Paid
                            </div>
                          ) : (
                            <div className='flex items-center gap-1 text-red-500 font-bold text-sm'>
                              <XCircle size={16} /> No
                            </div>
                          )}
                        </td>
                        <td className='py-4'>
                          {order.isDelivered ? (
                            <div className='flex items-center gap-1 text-green-600 font-bold text-sm'>
                              <CheckCircle size={16} /> Yes
                            </div>
                          ) : (
                            <div className='flex items-center gap-1 text-orange-500 font-bold text-sm'>
                              <XCircle size={16} /> No
                            </div>
                          )}
                        </td>
                        <td className='py-4 text-right'>
                          <Link
                            to={`/order/${order._id}`}
                            className='inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary-600 hover:text-white transition-all'
                          >
                            Details <ArrowRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && (
                  <div className='text-center py-12'>
                    <p className='text-gray-500 font-medium mb-4'>You haven't placed any orders yet.</p>
                    <Link to='/' className='text-primary-600 font-bold hover:underline'>
                      Start shopping
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
