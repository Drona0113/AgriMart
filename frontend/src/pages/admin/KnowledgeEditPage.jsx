import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useUpdateKnowledgePostMutation,
  useGetKnowledgePostDetailsQuery,
} from '../../slices/knowledgeApiSlice';
import { useUploadProductImageMutation } from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { ChevronLeft, Save, Upload, BookOpen, Tag, User, Image as ImageIcon, Video, FileText } from 'lucide-react';

const KnowledgeEditPage = () => {
  const { id: postId } = useParams();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const {
    data: post,
    isLoading,
    refetch,
    error,
  } = useGetKnowledgePostDetailsQuery(postId);

  const [updateKnowledgePost, { isLoading: loadingUpdate }] =
    useUpdateKnowledgePostMutation();

  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
      setAuthor(post.author);
      setImage(post.image);
      setVideoUrl(post.videoUrl);
    }
  }, [post]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateKnowledgePost({
        postId,
        title,
        content,
        category,
        author,
        image,
        videoUrl,
      }).unwrap();
      toast.success('Post updated successfully');
      refetch();
      navigate('/admin/knowledgelist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='max-w-4xl mx-auto'>
      <Link to='/admin/knowledgelist' className='inline-flex items-center gap-2 text-gray-600 font-bold hover:text-primary-600 transition-colors mb-8'>
        <ChevronLeft size={20} /> Back to Knowledge Hub
      </Link>

      <div className='bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden'>
        <div className='p-8 md:p-12 border-b border-gray-100 bg-gray-50/50'>
          <div className='flex items-center gap-4'>
            <div className='bg-primary-100 p-3 rounded-2xl text-primary-600'>
              <BookOpen size={32} />
            </div>
            <div>
              <h1 className='text-3xl font-black text-gray-900'>Edit Article</h1>
              <p className='text-gray-500 font-medium'>Update agricultural guide or blog post</p>
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
                {/* Title */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Article Title</label>
                  <div className='relative'>
                    <FileText className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                    <input
                      type='text'
                      placeholder='Enter title'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
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
                      placeholder='e.g. Farming Tips, Pest Control'
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50/30 transition-all'
                    />
                  </div>
                </div>

                {/* Author */}
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Author</label>
                  <div className='relative'>
                    <User className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                    <input
                      type='text'
                      placeholder='Author name'
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50/30 transition-all'
                    />
                  </div>
                </div>

                {/* Image */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Feature Image</label>
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
                    <label className='flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold cursor-pointer transition-all border-2 border-dashed border-gray-300'>
                      <Upload size={20} />
                      <span>{loadingUpload ? 'Uploading...' : 'Upload Image File'}</span>
                      <input type='file' className='hidden' onChange={uploadFileHandler} />
                    </label>
                  </div>
                </div>

                {/* Video URL */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Video URL (Optional)</label>
                  <div className='relative'>
                    <Video className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
                    <input
                      type='text'
                      placeholder='e.g. YouTube link'
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className='w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50/30 transition-all'
                    />
                  </div>
                </div>

                {/* Content */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Article Content</label>
                  <textarea
                    rows='10'
                    placeholder='Enter full article content here...'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className='w-full px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:border-primary-500 font-medium bg-gray-50/30 transition-all resize-none'
                  ></textarea>
                </div>
              </div>

              <button
                type='submit'
                className='w-full inline-flex items-center justify-center gap-2 bg-primary-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-100 mt-4'
              >
                <Save size={24} /> Update Article
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeEditPage;
