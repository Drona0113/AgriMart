import { useGetAuditLogsQuery } from '../../slices/usersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Shield, FileText, User, Eye, Calendar, Clock, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuditLogPage = () => {
  const { data: logs, isLoading, error } = useGetAuditLogsQuery();

  return (
    <div className='max-w-7xl mx-auto'>
      <Link to='/admin/userlist' className='inline-flex items-center gap-2 text-gray-600 font-bold hover:text-primary-600 transition-colors mb-8'>
        <ChevronLeft size={20} /> Back to Users
      </Link>

      <div className='flex items-center gap-4 mb-10'>
        <div className='bg-primary-100 p-3 rounded-2xl text-primary-600'>
          <Shield size={32} />
        </div>
        <div>
          <h1 className='text-4xl font-black text-gray-900'>Security Audit Logs</h1>
          <p className='text-gray-500 font-medium'>Track sensitive data access and security events</p>
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
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Admin / Staff</th>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Action</th>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Target User</th>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Metadata</th>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Timestamp</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {logs.map((log) => (
                  <tr key={log._id} className='group hover:bg-gray-50 transition-colors'>
                    <td className='px-8 py-6'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold'>
                          {log.viewerId?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className='font-bold text-gray-900'>{log.viewerId?.name || 'Unknown User'}</div>
                          <div className='text-xs text-gray-500'>{log.viewerId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      <div className='inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full font-bold text-xs w-fit'>
                        <Eye size={12} /> {log.action}
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      <div className='flex items-center gap-2'>
                        <User size={16} className='text-gray-400' />
                        <span className='font-medium text-gray-700'>{log.targetUserId?.name || 'Unknown User'}</span>
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      <div className='text-xs font-mono text-gray-500 space-y-1'>
                        <div>IP: {log.metadata?.ip}</div>
                        <div className='truncate max-w-[200px]' title={log.metadata?.userAgent}>
                          UA: {log.metadata?.userAgent}
                        </div>
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      <div className='flex flex-col gap-1 text-sm text-gray-600'>
                        <div className='flex items-center gap-1.5'>
                          <Calendar size={14} className='text-gray-400' />
                          {new Date(log.createdAt).toLocaleDateString()}
                        </div>
                        <div className='flex items-center gap-1.5'>
                          <Clock size={14} className='text-gray-400' />
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {logs.length === 0 && (
            <div className='text-center py-20'>
              <div className='bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300'>
                <FileText size={40} />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>No Logs Found</h3>
              <p className='text-gray-500 font-medium'>No security events have been recorded yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditLogPage;
