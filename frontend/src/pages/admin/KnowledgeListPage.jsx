import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGetKnowledgePostsQuery,
  useDeleteKnowledgePostMutation,
  useCreateKnowledgePostMutation,
} from '../../slices/knowledgeApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { BookOpen, Plus, Edit, Trash2, Calendar, User } from 'lucide-react';

const KnowledgeListPage = () => {
  const navigate = useNavigate();
  const { data: posts, isLoading, error, refetch } = useGetKnowledgePostsQuery();

  const [deletePost, { isLoading: loadingDelete }] = useDeleteKnowledgePostMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id).unwrap();
        toast.success('Post deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Failed to delete post');
      }
    }
  };

  const [createPost, { isLoading: loadingCreate }] = useCreateKnowledgePostMutation();

  const createPostHandler = async () => {
    if (window.confirm('Are you sure you want to create a new post?')) {
      try {
        const res = await createPost().unwrap();
        refetch();
        toast.success('Sample post created');
        navigate(`/admin/knowledge/${res._id}/edit`);
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
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className='text-4xl font-black text-gray-900'>Knowledge Hub</h1>
            <p className='text-gray-500 font-medium'>Manage agricultural articles and guides</p>
          </div>
        </div>

        <button
          onClick={createPostHandler}
          className='inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200'
        >
          <Plus size={20} /> Create Post
        </button>
      </div>

      {(loadingCreate || loadingDelete) && <Loader />}

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
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Article</th>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Category</th>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Author</th>
                  <th className='px-8 py-6 font-bold text-gray-600 uppercase text-xs tracking-wider'>Date</th>
                  <th className='px-8 py-6'></th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {posts.map((post) => (
                  <tr key={post._id} className='group hover:bg-gray-50 transition-colors'>
                    <td className='px-8 py-6'>
                      <div className='flex items-center gap-4'>
                        <div className='w-16 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0'>
                          <img src={post.image} alt={post.title} className='w-full h-full object-cover' />
                        </div>
                        <div className='font-bold text-gray-900 line-clamp-1 max-w-xs'>{post.title}</div>
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-600 uppercase tracking-wider'>
                        {post.category}
                      </span>
                    </td>
                    <td className='px-8 py-6 text-gray-600 font-medium'>
                      <div className='flex items-center gap-2'>
                        <User size={14} className='text-gray-400' />
                        {post.author}
                      </div>
                    </td>
                    <td className='px-8 py-6 text-gray-600 font-medium'>
                      <div className='flex items-center gap-2'>
                        <Calendar size={14} className='text-gray-400' />
                        {post.createdAt.substring(0, 10)}
                      </div>
                    </td>
                    <td className='px-8 py-6 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link
                          to={`/admin/knowledge/${post._id}/edit`}
                          className='p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all'
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => deleteHandler(post._id)}
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
          {posts.length === 0 && (
            <div className='text-center py-20'>
              <div className='bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300'>
                <BookOpen size={40} />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>No Posts Found</h3>
              <p className='text-gray-500 font-medium'>Start by adding your first agricultural guide.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowledgeListPage;
