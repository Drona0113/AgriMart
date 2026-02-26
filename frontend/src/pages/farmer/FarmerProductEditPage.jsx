import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { ChevronLeft, Save, Upload, Package, Tag, IndianRupee, Box, Image as ImageIcon, Plus, X, Video } from 'lucide-react';

const FarmerProductEditPage = () => {
  const { id: productId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Seeds');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      // Security check: If not admin and not owner, redirect away
      if (!userInfo.isAdmin && product.user !== userInfo._id) {
        toast.error('Not authorized to edit this product');
        navigate('/farmer/productlist');
        return;
      }
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setImages(product.images || []);
      setVideoUrl(product.videoUrl || '');
    }
  }, [product, userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
        images,
        videoUrl,
      }).unwrap();
      toast.success('Product updated');
      refetch();
      navigate('/farmer/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e, type = 'main') => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      if (type === 'main') {
        setImage(res.image);
      } else {
        setImages([...images, res.image]);
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='max-w-4xl mx-auto'>
      <Link to='/farmer/productlist' className={`inline-flex items-center gap-2 text-gray-600 font-bold ${userInfo.isSupplier ? 'hover:text-blue-600' : 'hover:text-green-600'} transition-colors mb-8`}>
        <ChevronLeft size={20} /> Back to My Shop
      </Link>

      <div className='bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden'>
        <div className='p-8 md:p-12 border-b border-gray-100 bg-gray-50/50'>
          <div className='flex items-center gap-4'>
            <div className='bg-green-100 p-3 rounded-2xl text-green-600'>
              <Package size={32} />
            </div>
            <div>
              <h1 className='text-3xl font-black text-gray-900'>Edit Product</h1>
              <p className='text-gray-500 font-medium'>Update your product listing details</p>
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
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Product Name</label>
                  <div className='relative'>
                    <Tag className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                    <input
                      type='text'
                      placeholder='Enter product name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-500 font-medium bg-gray-50/30 transition-all'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Price (₹)</label>
                  <div className='relative'>
                    <IndianRupee className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                    <input
                      type='number'
                      placeholder='Enter price'
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-500 font-medium bg-gray-50/30 transition-all'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Stock Quantity</label>
                  <div className='relative'>
                    <Box className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                    <input
                      type='number'
                      placeholder='Enter stock'
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                      className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-500 font-medium bg-gray-50/30 transition-all'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='w-full px-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-500 font-medium bg-gray-50/30 transition-all appearance-none'
                  >
                    <option value='Seeds'>Seeds</option>
                    <option value='Fertilizers'>Fertilizers</option>
                    <option value='Pesticides'>Pesticides</option>
                    <option value='Farming Tools'>Farming Tools</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Brand/Seller Name</label>
                  <input
                    type='text'
                    placeholder='Enter brand'
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className='w-full px-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-500 font-medium bg-gray-50/30 transition-all'
                  />
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Main Product Image</label>
                  <div className='flex items-center gap-4'>
                    <div className='flex-grow relative'>
                      <ImageIcon className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                      <input
                        type='text'
                        placeholder='Enter main image URL'
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-500 font-medium bg-gray-50/30 transition-all'
                      />
                    </div>
                    <div className='relative'>
                      <input
                        type='file'
                        onChange={(e) => uploadFileHandler(e, 'main')}
                        className='hidden'
                        id='image-upload'
                      />
                      <label
                        htmlFor='image-upload'
                        className='inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all cursor-pointer whitespace-nowrap'
                      >
                        <Upload size={18} /> Upload Main
                      </label>
                    </div>
                  </div>
                  {loadingUpload && <Loader />}
                </div>

                {/* Additional Images */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Additional Images (Optional)</label>
                  <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4'>
                    {images.map((img, index) => (
                      <div key={index} className='relative aspect-square rounded-2xl overflow-hidden group border border-gray-100 shadow-sm'>
                        <img src={img} alt={`Product ${index}`} className='w-full h-full object-cover' />
                        <button
                          type='button'
                          onClick={() => setImages(images.filter((_, i) => i !== index))}
                          className='absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600'
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <label className='aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-green-300 hover:text-green-500 hover:bg-green-50 transition-all cursor-pointer'>
                      <Plus size={24} />
                      <span className='text-xs font-bold uppercase tracking-wider'>Add Image</span>
                      <input type='file' className='hidden' onChange={(e) => uploadFileHandler(e, 'additional')} />
                    </label>
                  </div>
                </div>

                {/* Video URL */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Video URL (YouTube/Vimeo)</label>
                  <div className='relative'>
                    <Video className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                    <input
                      type='text'
                      placeholder='Enter video URL'
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-500 font-medium bg-gray-50/30 transition-all'
                    />
                  </div>
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Description</label>
                  <textarea
                    rows='4'
                    placeholder='Enter description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='w-full px-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-500 font-medium bg-gray-50/30 transition-all resize-none'
                  ></textarea>
                </div>
              </div>

              <button
                type='submit'
                className='w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-2'
              >
                <Save size={20} /> Update Product
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerProductEditPage;
