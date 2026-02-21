import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import Paginate from '../../components/Paginate';
import { Package, Plus, Edit, Trash2, Tag, Box, Store } from 'lucide-react';

const FarmerProductListPage = () => {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
    user: userInfo._id, // Filter by current farmer's ID
  });

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Failed to delete product');
      }
    }
  };

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const createProductHandler = async () => {
    if (!userInfo.isVerified) {
      toast.error('You must be a verified seller to add products. Please wait for admin approval.');
      return;
    }
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        const res = await createProduct().unwrap();
        refetch();
        toast.success('Sample product created');
        navigate(`/farmer/product/${res._id}/edit`);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'>
        <div className='flex items-center gap-4'>
          <div className={`${userInfo.isSupplier ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} p-3 rounded-2xl`}>
            <Store size={32} />
          </div>
          <div>
            <h1 className='text-4xl font-black text-gray-900'>{userInfo.isSupplier ? 'My Supplier Shop' : 'My Farmer Shop'}</h1>
            <p className='text-gray-500 font-medium'>
              {userInfo.isSupplier ? 'Manage your products for farmers to buy' : 'Manage your products for other farmers to buy'}
            </p>
          </div>
        </div>

        {userInfo.isVerified ? (
          <button
            onClick={createProductHandler}
            className={`inline-flex items-center gap-2 ${userInfo.isSupplier ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'} text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg`}
          >
            <Plus size={20} /> Add New Product
          </button>
        ) : (
          <div className='bg-yellow-50 text-yellow-800 px-4 py-3 rounded-xl border border-yellow-200 flex items-center gap-2'>
            <span className='font-bold text-2xl'>⏳</span>
            <div>
              <p className='font-bold'>Verification Pending</p>
              <p className='text-sm'>Waiting for approval to enable selling.</p>
            </div>
          </div>
        )}
      </div>

      {(loadingCreate || loadingDelete) && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error || 'An unexpected error occurred while fetching products'}
        </Message>
      ) : (
        <>
          <div className='bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left'>
                <thead>
                  <tr className='bg-gray-50/50 border-b border-gray-100'>
                    <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Product</th>
                    <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Price</th>
                    <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Category</th>
                    <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Stock</th>
                    <th className='px-8 py-6'></th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-50'>
                  {data.products.map((product) => (
                    <tr key={product._id} className='group hover:bg-gray-50 transition-colors'>
                      <td className='px-8 py-6'>
                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0'>
                            <img src={product.image} alt={product.name} className='w-full h-full object-cover' />
                          </div>
                          <div>
                            <div className='font-bold text-gray-900 line-clamp-1'>{product.name}</div>
                            <div className='text-xs text-gray-500 font-medium'>ID: {product._id.substring(0, 10)}</div>
                          </div>
                        </div>
                      </td>
                      <td className='px-8 py-6'>
                        <span className='text-lg font-black text-gray-900'>₹{product.price}</span>
                      </td>
                      <td className='px-8 py-6'>
                        <div className='inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-bold text-sm'>
                          <Tag size={14} /> {product.category}
                        </div>
                      </td>
                      <td className='px-8 py-6'>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm ${
                          product.countInStock > 0 
                            ? 'bg-green-50 text-green-600' 
                            : 'bg-red-50 text-red-600'
                        }`}>
                          <Box size={14} /> {product.countInStock}
                        </div>
                      </td>
                      <td className='px-8 py-6 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Link
                            to={`/farmer/product/${product._id}/edit`}
                            className='p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-green-600 hover:text-white transition-all'
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => deleteHandler(product._id)}
                            className='p-2.5 bg-gray-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all'
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.products.length === 0 && (
              <div className='text-center py-20'>
                <div className='bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300'>
                  <Package size={40} />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>No Products Found</h3>
                <p className='text-gray-500 font-medium'>Start by adding your first item to sell.</p>
              </div>
            )}
          </div>
          <div className='mt-8 flex justify-center'>
            <Paginate pages={data.pages} page={data.page} isAdmin={false} />
          </div>
        </>
      )}
    </div>
  );
};

export default FarmerProductListPage;
