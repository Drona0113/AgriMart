import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import Paginate from '../../components/Paginate';
import { Package, Plus, Edit, Trash2, Tag, Box } from 'lucide-react';

const ProductListPage = () => {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted');
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Failed to delete product');
      }
    }
  };

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        const res = await createProduct().unwrap();
        refetch();
        toast.success('Sample product created');
        navigate(`/admin/product/${res._id}/edit`);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'>
        <div className='flex items-center gap-4'>
          <div className='bg-primary-100 p-3 rounded-2xl text-primary-600'>
            <Package size={32} />
          </div>
          <div>
            <h1 className='text-4xl font-black text-gray-900'>Products</h1>
            <p className='text-gray-500 font-medium'>Manage your inventory and product details</p>
          </div>
        </div>

        <button
          onClick={createProductHandler}
          className='inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200'
        >
          <Plus size={20} /> Create Product
        </button>
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
                    <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Seller</th>
                    <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Price</th>
                    <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Category</th>
                    <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Brand</th>
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
                        <div className='font-bold text-gray-900'>{product.user ? product.user.name : 'Unknown'}</div>
                        <div className='text-xs text-gray-500 font-medium'>{product.user ? product.user.email : ''}</div>
                      </td>
                      <td className='px-8 py-6'>
                        <span className='text-lg font-black text-gray-900'>₹{product.price}</span>
                      </td>
                      <td className='px-8 py-6'>
                        <div className='inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-bold text-sm'>
                          <Tag size={14} /> {product.category}
                        </div>
                      </td>
                      <td className='px-8 py-6 text-gray-600 font-medium'>
                        {product.brand}
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
                          {(product.user?._id === userInfo._id || product.user === userInfo._id) && (
                            <>
                              <Link
                                to={`/admin/product/${product._id}/edit`}
                                className='p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all'
                              >
                                <Edit size={18} />
                              </Link>
                              <button
                                onClick={() => deleteHandler(product._id)}
                                className='p-2.5 bg-gray-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all'
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
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
                <p className='text-gray-500 font-medium'>Start by adding your first agricultural product.</p>
              </div>
            )}
          </div>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </div>
  );
};

export default ProductListPage;
