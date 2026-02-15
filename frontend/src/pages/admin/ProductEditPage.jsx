import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import FormContainer from '../../components/FormContainer';
import { ChevronLeft, Save, Upload, Package, Tag, IndianRupee, Box, Image as ImageIcon, Briefcase } from 'lucide-react';

const ProductEditPage = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

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
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

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
      }).unwrap();
      toast.success('Product updated');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

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

  return (
    <div className='max-w-4xl mx-auto'>
      <Link to='/admin/productlist' className='inline-flex items-center gap-2 text-gray-600 font-bold hover:text-primary-600 transition-colors mb-8'>
        <ChevronLeft size={20} /> Back to Products
      </Link>

      <div className='bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden'>
        <div className='p-8 md:p-12 border-b border-gray-100 bg-gray-50/50'>
          <div className='flex items-center gap-4'>
            <div className='bg-primary-100 p-3 rounded-2xl text-primary-600'>
              <Package size={32} />
            </div>
            <div>
              <h1 className='text-3xl font-black text-gray-900'>Edit Product</h1>
              <p className='text-gray-500 font-medium'>Update product information and inventory</p>
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
                {/* Name */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Product Name</label>
                  <div className='relative'>
                    <Tag className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                    <input
                      type='text'
                      placeholder='Enter product name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50/30 transition-all'
                    />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Price (₹)</label>
                  <div className='relative'>
                    <IndianRupee className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                    <input
                      type='number'
                      placeholder='Enter price'
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50/30 transition-all'
                    />
                  </div>
                </div>

                {/* Count In Stock */}
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Stock Quantity</label>
                  <div className='relative'>
                    <Box className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                    <input
                      type='number'
                      placeholder='Enter stock'
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                      className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50/30 transition-all'
                    />
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Brand</label>
                  <div className='relative'>
                    <Briefcase className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                    <input
                      type='text'
                      placeholder='Enter brand'
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50/30 transition-all'
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Category</label>
                  <div className='relative'>
                    <Tag className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                    <input
                      type='text'
                      placeholder='Enter category'
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50/30 transition-all'
                    />
                  </div>
                </div>

                {/* Image */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Product Image</label>
                  <div className='space-y-4'>
                    <div className='relative'>
                      <ImageIcon className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                      <input
                        type='text'
                        placeholder='Enter image URL'
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50/30 transition-all'
                      />
                    </div>
                    <div className='flex items-center gap-4'>
                      <label className='flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold cursor-pointer transition-all border-2 border-dashed border-gray-300'>
                        <Upload size={20} />
                        <span>{loadingUpload ? 'Uploading...' : 'Upload Image File'}</span>
                        <input type='file' className='hidden' onChange={uploadFileHandler} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Description</label>
                  <textarea
                    rows='5'
                    placeholder='Enter product description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='w-full px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50/30 transition-all resize-none'
                  ></textarea>
                </div>
              </div>

              <button
                type='submit'
                className='w-full inline-flex items-center justify-center gap-2 bg-primary-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-100 mt-4'
              >
                <Save size={24} /> Update Product
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage;
