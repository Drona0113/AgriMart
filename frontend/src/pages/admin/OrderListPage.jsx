import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { ClipboardList, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const OrderListPage = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex items-center gap-4 mb-10'>
        <div className='bg-primary-100 p-3 rounded-2xl text-primary-600'>
          <ClipboardList size={32} />
        </div>
        <div>
          <h1 className='text-4xl font-black text-gray-900'>Orders Management</h1>
          <p className='text-gray-500 font-medium'>View and manage all customer orders</p>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className='bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead>
                <tr className='bg-gray-50/50 border-b border-gray-100'>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>ID</th>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>User</th>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Date</th>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Total</th>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Paid</th>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Delivered</th>
                  <th className='px-8 py-6'></th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {orders.map((order) => (
                  <tr key={order._id} className='group hover:bg-gray-50 transition-colors'>
                    <td className='px-8 py-6 font-medium text-gray-900'>
                      #{order._id.substring(0, 10)}
                    </td>
                    <td className='px-8 py-6'>
                      <div className='font-bold text-gray-900'>{order.user && order.user.name}</div>
                      <div className='text-xs text-gray-500 font-medium'>{order.user && order.user.email}</div>
                    </td>
                    <td className='px-8 py-6 text-gray-600 font-medium'>
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className='px-8 py-6'>
                      <span className='text-lg font-black text-gray-900'>₹{order.totalPrice}</span>
                    </td>
                    <td className='px-8 py-6'>
                      {order.isPaid ? (
                        <div className='inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full font-bold text-sm'>
                          <CheckCircle size={14} /> Paid
                        </div>
                      ) : (
                        <div className='inline-flex items-center gap-1.5 bg-red-50 text-red-500 px-3 py-1.5 rounded-full font-bold text-sm'>
                          <XCircle size={14} /> Unpaid
                        </div>
                      )}
                    </td>
                    <td className='px-8 py-6'>
                      {order.isDelivered ? (
                        <div className='inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full font-bold text-sm'>
                          <CheckCircle size={14} /> Delivered
                        </div>
                      ) : (
                        <div className='inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full font-bold text-sm'>
                          <XCircle size={14} /> Pending
                        </div>
                      )}
                    </td>
                    <td className='px-8 py-6 text-right'>
                      <Link
                        to={`/order/${order._id}`}
                        className='inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-600 hover:text-white transition-all shadow-sm group-hover:shadow-md'
                      >
                        Details <ArrowRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className='text-center py-20'>
              <div className='bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300'>
                <ClipboardList size={40} />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>No Orders Found</h3>
              <p className='text-gray-500 font-medium'>When customers place orders, they will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderListPage;
