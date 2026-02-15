import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useGetKnowledgePostDetailsQuery,
  useCreateKnowledgeCommentMutation,
} from '../slices/knowledgeApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Calendar, User, ArrowLeft, Share2, BookOpen, Send } from 'lucide-react';

const KnowledgeDetailsPage = () => {
  const { id: knowledgeId } = useParams();
  const [comment, setComment] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: knowledge,
    isLoading,
    refetch,
    error,
  } = useGetKnowledgePostDetailsQuery(knowledgeId);

  const [createComment, { isLoading: loadingComment }] =
    useCreateKnowledgeCommentMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createComment({ postId: knowledgeId, text: comment }).unwrap();
      setComment('');
      refetch();
      toast.success('Comment added successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='max-w-4xl mx-auto'>
      <Link
        to='/knowledge'
        className='inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 font-bold mb-8 transition-colors group'
      >
        <ArrowLeft size={20} className='group-hover:-translate-x-1 transition-transform' /> Back to Knowledge Hub
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <article className='bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100'>
            <div className='aspect-video overflow-hidden'>
              <img
                src={knowledge.image}
                alt={knowledge.title}
                className='w-full h-full object-cover'
              />
            </div>

            <div className='p-8 md:p-12'>
              <div className='flex flex-wrap items-center gap-6 mb-8 text-sm font-bold text-gray-400 border-b border-gray-50 pb-8'>
                <div className='flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-xl'>
                  <BookOpen size={18} />
                  <span>{knowledge.category}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar size={18} />
                  <span>{knowledge.createdAt.substring(0, 10)}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <User size={18} />
                  <span>By Agri Expert</span>
                </div>
                <button className='ml-auto flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors'>
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>

              <h1 className='text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight'>
                {knowledge.title}
              </h1>

              <div className='prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed space-y-6'>
                {knowledge.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className='mt-12 p-8 bg-primary-50 rounded-3xl border border-primary-100 flex flex-col md:flex-row items-center gap-6'>
                <div className='w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-200'>
                  <User size={40} />
                </div>
                <div>
                  <h4 className='text-xl font-black text-gray-900 mb-2'>Was this helpful?</h4>
                  <p className='text-gray-600 font-medium'>
                    Our experts are here to help you grow. If you have more questions, contact our support team or visit your nearest AgriMart center.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Comment Section */}
          <div className='mt-12 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100'>
            <h3 className='text-3xl font-black text-gray-900 mb-8'>Comments</h3>

            {userInfo ? (
              <form onSubmit={submitHandler} className='mb-12'>
                <div className='relative'>
                  <textarea
                    rows='4'
                    className='w-full p-6 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary-500 font-medium text-gray-700 placeholder-gray-400'
                    placeholder='Ask a question or share your thoughts...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                  <button
                    disabled={loadingComment}
                    type='submit'
                    className='absolute bottom-4 right-4 bg-primary-600 text-white p-3 rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center gap-2 font-bold'
                  >
                    {loadingComment ? <Loader /> : <><Send size={20} /> Post Comment</>}
                  </button>
                </div>
              </form>
            ) : (
              <Message>
                Please <Link to='/login' className='font-bold text-primary-600 hover:underline'>sign in</Link> to post a comment.
              </Message>
            )}

            <div className='space-y-8'>
              {knowledge.comments && knowledge.comments.length > 0 ? (
                knowledge.comments.map((c) => (
                  <div key={c._id} className='flex gap-4 group'>
                    <div className='w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold shrink-0'>
                      {c.name.charAt(0)}
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-1'>
                        <h5 className='font-bold text-gray-900'>{c.name}</h5>
                        <span className='text-xs font-bold text-gray-400'>{c.createdAt.substring(0, 10)}</span>
                      </div>
                      <p className='text-gray-600 font-medium leading-relaxed'>{c.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-gray-400 font-medium text-center py-8'>No comments yet. Be the first to ask a question!</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KnowledgeDetailsPage;
