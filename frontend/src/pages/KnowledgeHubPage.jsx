import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  useGetKnowledgePostsQuery,
  useCreateKnowledgePostMutation,
  useDeleteKnowledgePostMutation 
} from '../slices/knowledgeApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { BookOpen, Calendar, User, ArrowRight, Sprout, ShieldCheck, Wrench, Plus, Trash2 } from 'lucide-react';

const KnowledgeHubPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: knowledges, isLoading, error, refetch } = useGetKnowledgePostsQuery();

  const [createPost, { isLoading: loadingCreate }] = useCreateKnowledgePostMutation();
  const [deletePost, { isLoading: loadingDelete }] = useDeleteKnowledgePostMutation();

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

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id).unwrap();
        toast.success('Post removed');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // Sort by date - newest first
  const sortedKnowledges = knowledges 
    ? [...knowledges].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  const isNew = (date) => {
    const now = new Date();
    const articleDate = new Date(date);
    const diffTime = Math.abs(now - articleDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  const categories = [
    { name: 'Crop Care', icon: <Sprout size={24} />, color: 'bg-green-100 text-green-600' },
    { name: 'Pest Control', icon: <ShieldCheck size={24} />, color: 'bg-red-100 text-red-600' },
    { name: 'Tools & Tech', icon: <Wrench size={24} />, color: 'bg-blue-100 text-blue-600' },
    { name: 'Organic', icon: <BookOpen size={24} />, color: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div className='max-w-7xl mx-auto'>
      {/* Hero Section */}
      <section className='mb-16 bg-primary-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl'>
        <div className='absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none'>
          <Sprout size={400} className='-mr-20 -mt-20 rotate-12' />
        </div>
        <div className='relative z-10 max-w-2xl'>
          <div className='inline-flex items-center gap-2 bg-primary-800 text-primary-200 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-primary-700'>
            <BookOpen size={16} /> Knowledge Hub
          </div>
          <h1 className='text-5xl md:text-7xl font-black mb-6 leading-tight'>
            Farmer's <span className='text-primary-400'>Smart</span> Guide
          </h1>
          <p className='text-xl opacity-80 mb-8 leading-relaxed font-medium'>
            Expert advice, seasonal tips, and the latest agricultural techniques to help you grow better and earn more.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
        {categories.map((cat) => (
          <div key={cat.name} className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center'>
            <div className={`${cat.color} p-4 rounded-2xl mb-4`}>
              {cat.icon}
            </div>
            <h3 className='font-bold text-gray-900'>{cat.name}</h3>
          </div>
        ))}
      </div>

      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center gap-6'>
          <h2 className='text-3xl font-black text-gray-900'>Latest Articles</h2>
          {userInfo && userInfo.isAdmin && (
            <button
              onClick={createPostHandler}
              disabled={loadingCreate}
              className='inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 text-sm'
            >
              <Plus size={18} /> {loadingCreate ? 'Creating...' : 'Create Article'}
            </button>
          )}
        </div>
        <div className='h-1 flex-grow mx-8 bg-gray-100 rounded-full hidden md:block'></div>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {sortedKnowledges.map((item) => (
            <article key={item._id} className='bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col group relative'>
              {isNew(item.createdAt) && (
                  <div className='absolute top-4 right-4 z-20 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg animate-pulse'>
                    NEW
                  </div>
                )}
                
                {userInfo && userInfo.isAdmin && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      deleteHandler(item._id);
                    }}
                    className='absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm text-red-500 p-2 rounded-xl shadow-lg hover:bg-red-500 hover:text-white transition-all border border-red-100 opacity-0 group-hover:opacity-100'
                    title='Delete Article'
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              <div className='aspect-video overflow-hidden'>
                <img
                  src={item.image}
                  alt={item.title}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />
              </div>
              <div className='p-8 flex flex-col flex-grow'>
                <div className='flex items-center gap-4 text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest'>
                  <span className='bg-primary-50 text-primary-600 px-3 py-1 rounded-lg'>{item.category}</span>
                  <div className='flex items-center gap-1'><Calendar size={14} /> {new Date(item.createdAt).toLocaleDateString()}</div>
                </div>
                <h3 className='text-2xl font-black text-gray-900 mb-4 group-hover:text-primary-600 transition-colors leading-tight'>
                  {item.title}
                </h3>
                <p className='text-gray-500 mb-8 line-clamp-3 font-medium leading-relaxed'>
                  {item.content}
                </p>
                <div className='mt-auto pt-6 border-t border-gray-50 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600'>
                      <User size={16} />
                    </div>
                    <span className='text-sm font-bold text-gray-700'>{item.author || 'Agri Expert'}</span>
                  </div>
                  <Link
                    to={`/knowledge/${item._id}`}
                    className='text-primary-600 font-black flex items-center gap-2 hover:gap-3 transition-all'
                  >
                    Read More <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeHubPage;
