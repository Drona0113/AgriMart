import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from '../../slices/usersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Users, Trash2, Edit, CheckCircle, XCircle, Mail, User as UserIcon, Shield } from 'lucide-react';

const UserListPage = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        refetch();
        toast.success('User deleted');
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Failed to delete user');
      }
    }
  };

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex items-center gap-4 mb-10'>
        <div className='bg-primary-100 p-3 rounded-2xl text-primary-600'>
          <Users size={32} />
        </div>
        <div>
          <h1 className='text-4xl font-black text-gray-900'>User Management</h1>
          <p className='text-gray-500 font-medium'>Manage registered users and verify farmers (Sachivalayam Volunteer)</p>
        </div>
      </div>

      {loadingDelete && <Loader />}
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
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>User</th>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Email</th>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Roles</th>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Verification</th>
                  <th className='px-8 py-6'></th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {users.map((user) => (
                  <tr key={user._id} className='group hover:bg-gray-50 transition-colors'>
                    <td className='px-8 py-6'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold'>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className='font-bold text-gray-900'>{user.name}</div>
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      <div className='flex items-center gap-2 text-gray-600 font-medium'>
                        <Mail size={16} className='text-gray-400' />
                        <a href={`mailto:${user.email}`} className='hover:text-primary-600 transition-colors'>
                          {user.email}
                        </a>
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      <div className='flex flex-col gap-2'>
                        {user.isAdmin && (
                          <div className='inline-flex items-center gap-1.5 bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full font-bold text-xs w-fit'>
                            <Shield size={12} /> ADMIN
                          </div>
                        )}
                        {user.isFarmer && (
                          <div className='inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full font-bold text-xs w-fit'>
                            <UserIcon size={12} /> FARMER
                          </div>
                        )}
                        {!user.isAdmin && !user.isFarmer && (
                          <div className='inline-flex items-center gap-1.5 bg-gray-50 text-gray-500 px-3 py-1.5 rounded-full font-bold text-xs w-fit'>
                            <UserIcon size={12} /> USER
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      {user.govtId ? (
                        <div className='flex flex-col gap-1'>
                          <span className='font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 w-fit'>
                            ID: {user.govtId}
                          </span>
                          {user.isVerified ? (
                            <span className='text-green-600 text-xs font-bold flex items-center gap-1'>
                              <CheckCircle size={12} /> Verified
                            </span>
                          ) : (
                            <span className='text-amber-500 text-xs font-bold flex items-center gap-1 animate-pulse'>
                              <XCircle size={12} /> Pending Approval
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className='text-gray-400 text-xs italic'>No ID Provided</span>
                      )}
                    </td>
                    <td className='px-8 py-6 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link
                          to={`/admin/user/${user._id}/edit`}
                          className='p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all'
                        >
                          <Edit size={18} />
                        </Link>
                        {!user.isAdmin && (
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className='p-2.5 bg-gray-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all'
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div className='text-center py-20'>
              <div className='bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300'>
                <Users size={40} />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>No Users Found</h3>
              <p className='text-gray-500 font-medium'>There are no registered users in the system yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserListPage;
