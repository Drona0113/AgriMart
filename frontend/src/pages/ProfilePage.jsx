import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useUploadProductImageMutation } from '../slices/productsApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { User, Mail, Lock, ShoppingBag, ArrowRight, XCircle, CheckCircle, Phone, MapPin, Upload, Camera, Trash2, Edit2, Eye, X } from 'lucide-react';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [image, setImage] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const [showImagePreview, setShowImagePreview] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
    
  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
    setMobile(userInfo.mobile || '');
    setImage(userInfo.image || '');
    if (userInfo.address) {
      setAddress(userInfo.address);
    }
  }, [userInfo.email, userInfo.name, userInfo.mobile, userInfo.image, userInfo.address]);

  const dispatch = useDispatch();

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

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
          image,
          address,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const removeImageHandler = () => {
    if (window.confirm('Are you sure you want to remove your profile photo?')) {
      setImage('');
    }
  };

  return (
    <div className='max-w-7xl mx-auto'>
      {/* Image Preview Modal */}
      {showImagePreview && image && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4' onClick={() => setShowImagePreview(false)}>
          <div className='relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200' onClick={e => e.stopPropagation()}>
            <div className='absolute top-4 right-4 z-10'>
              <button 
                onClick={() => setShowImagePreview(false)}
                className='bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors'
              >
                <X size={24} />
              </button>
            </div>
            <img src={image} alt="Profile Full View" className='w-full h-auto max-h-[80vh] object-contain' />
          </div>
        </div>
      )}

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
              
              {/* Profile Image Upload */}
              <div className='flex flex-col items-center justify-center mb-6'>
                <div className='relative w-32 h-32 mb-4 group'>
                  <div className='w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center'>
                    {image ? (
                      <img src={image} alt="Profile" className='w-full h-full object-cover' />
                    ) : (
                      <User size={64} className='text-gray-300' />
                    )}
                  </div>
                  
                  {/* Hover Actions */}
                  <div className='absolute inset-0 rounded-full bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10'>
                    {image && (
                      <button 
                        type="button" 
                        onClick={() => setShowImagePreview(true)}
                        className='p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 cursor-pointer shadow-lg transform hover:scale-110 transition-all'
                        title="View Photo"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    <label htmlFor="image-upload" className='p-2 bg-white rounded-full text-gray-700 hover:text-primary-600 cursor-pointer shadow-lg transform hover:scale-110 transition-all' title="Change Photo">
                      <Edit2 size={16} />
                    </label>
                    {image && (
                      <button 
                        type="button" 
                        onClick={removeImageHandler}
                        className='p-2 bg-white rounded-full text-gray-700 hover:text-red-500 cursor-pointer shadow-lg transform hover:scale-110 transition-all'
                        title="Remove Photo"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {!image && (
                    <label htmlFor="image-upload" className='absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors shadow-md'>
                      {loadingUpload ? <Loader size={16} /> : <Camera size={16} />}
                    </label>
                  )}
                  
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    onChange={uploadFileHandler}
                  />
                </div>
                <p className='text-sm text-gray-500'>Upload Profile Photo</p>
              </div>

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

              {/* Address Section */}
              <div className='pt-4 border-t border-gray-100'>
                <h3 className='text-lg font-bold text-gray-900 mb-4'>Address Details</h3>
                
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-bold text-gray-700 mb-2'>Street / Village</label>
                    <div className='relative'>
                      <MapPin className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                      <input
                        type='text'
                        name='street'
                        className='w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-medium'
                        placeholder='Enter street or village'
                        value={address.street}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-bold text-gray-700 mb-2'>City / District</label>
                      <input
                        type='text'
                        name='city'
                        className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-medium'
                        placeholder='City'
                        value={address.city}
                        onChange={handleAddressChange}
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-bold text-gray-700 mb-2'>State</label>
                      <input
                        type='text'
                        name='state'
                        className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-medium'
                        placeholder='State'
                        value={address.state}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-bold text-gray-700 mb-2'>Pincode</label>
                      <input
                        type='text'
                        name='pincode'
                        className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-medium'
                        placeholder='Pincode'
                        value={address.pincode}
                        onChange={handleAddressChange}
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-bold text-gray-700 mb-2'>Landmark</label>
                      <input
                        type='text'
                        name='landmark'
                        className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-medium'
                        placeholder='Landmark'
                        value={address.landmark}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>
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
                      <th className='pb-4 font-bold text-gray-600 uppercase text-xs tracking-wider'>Status</th>
                      <th className='pb-4 font-bold text-gray-600 uppercase text-xs tracking-wider'>Paid</th>
                      <th className='pb-4 font-bold text-gray-600 uppercase text-xs tracking-wider'>Delivered</th>
                      <th className='pb-4'></th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-50'>
                    {orders.map((order) => (
                      <tr key={order._id} className='group hover:bg-gray-50 transition-colors'>
                        <td className='py-4 font-medium text-gray-900'>{order._id.substring(0, 8)}...</td>
                        <td className='py-4 text-gray-600'>{new Date(order.createdAt).toLocaleString()}</td>
                        <td className='py-4 font-bold text-gray-900'>₹{order.totalPrice}</td>
                        <td className='py-4'>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                            order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                            order.status === 'Cancelled' ? 'bg-gray-50 text-gray-600' :
                            'bg-yellow-50 text-yellow-600'
                          }`}>
                            {order.status}
                          </div>
                        </td>
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
