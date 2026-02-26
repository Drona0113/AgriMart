import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../slices/productsApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { addToCart } from '../slices/cartSlice';
import { ShoppingCart, ArrowLeft, Plus, Minus, Star, PlayCircle } from 'lucide-react';

const ProductPage = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [showVideo, setShowVideo] = useState(false);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (product && !selectedImage) {
      setSelectedImage(product.image);
    }
  }, [product, selectedImage]);

  const addToCartHandler = () => {
    if (!userInfo) {
      navigate(`/login?redirect=/product/${productId}`);
      return;
    }
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment || comment.trim() === '') {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review submitted successfully');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='max-w-7xl mx-auto'>
      <Link
        to='/'
        className='inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 font-bold mb-8 transition-colors'
      >
        <ArrowLeft size={20} /> Back to Products
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
          {/* Product Media Gallery */}
          <div className='space-y-4'>
            <div className='bg-white p-4 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative group aspect-square flex items-center justify-center'>
              {showVideo && product.videoUrl ? (
                <div className='w-full h-full'>
                  <iframe
                    className='w-full h-full rounded-2xl'
                    src={product.videoUrl.replace('watch?v=', 'embed/').replace('vimeo.com/', 'player.vimeo.com/video/')}
                    title="Product Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <img
                  src={selectedImage || product.image}
                  alt={product.name}
                  className='w-full h-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105'
                />
              )}
            </div>
            
            {/* Thumbnails */}
            <div className='flex flex-wrap gap-4'>
              {/* Main Image Thumbnail */}
              <button
                onClick={() => {
                  setSelectedImage(product.image);
                  setShowVideo(false);
                }}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  !showVideo && selectedImage === product.image ? 'border-primary-500 shadow-md' : 'border-transparent hover:border-gray-200'
                }`}
              >
                <img src={product.image} alt="Main" className='w-full h-full object-cover' />
              </button>

              {/* Additional Images Thumbnails */}
              {product.images && product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(img);
                    setShowVideo(false);
                  }}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    !showVideo && selectedImage === img ? 'border-primary-500 shadow-md' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img src={img} alt={`Gallery ${index}`} className='w-full h-full object-cover' />
                </button>
              ))}

              {/* Video Thumbnail */}
              {product.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-gray-900 flex flex-col items-center justify-center text-white gap-1 ${
                    showVideo ? 'border-primary-500 shadow-md' : 'border-transparent hover:border-gray-700'
                  }`}
                >
                  <PlayCircle size={24} />
                  <span className='text-[10px] font-bold uppercase'>Video</span>
                </button>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className='flex flex-col'>
            <div className='bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-sm font-bold w-fit mb-4 uppercase tracking-wider'>
              {product.category}
            </div>
            <h1 className='text-4xl font-black text-gray-900 mb-4'>
              {product.name}
            </h1>
            <div className='mb-6'>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </div>
            <div className='text-3xl font-black text-primary-600 mb-6'>
              ₹{product.price}
            </div>
            <p className='text-gray-600 leading-relaxed mb-8 text-lg'>
              {product.description}
            </p>

            <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8'>
              <div className='flex items-center justify-between mb-6 pb-6 border-b border-gray-100'>
                <span className='font-bold text-gray-700'>Availability:</span>
                <span
                  className={`font-black ${
                    product.countInStock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {product.countInStock > 0 && (
                <div className='space-y-6'>
                  <div className='flex items-center justify-between'>
                    <span className='font-bold text-gray-700'>Quantity:</span>
                    <div className='flex items-center gap-4 bg-gray-50 p-2 rounded-xl'>
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className='p-2 hover:bg-white rounded-lg transition-all text-gray-600 shadow-sm'
                      >
                        <Minus size={20} />
                      </button>
                      <span className='w-8 text-center font-bold text-lg'>
                        {qty}
                      </span>
                      <button
                        onClick={() =>
                          setQty(Math.min(product.countInStock, qty + 1))
                        }
                        className='p-2 hover:bg-white rounded-lg transition-all text-gray-600 shadow-sm'
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={addToCartHandler}
                    className='w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-xl shadow-primary-200'
                  >
                    <ShoppingCart size={24} /> Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className='md:col-span-2 mt-12'>
            <h2 className='text-3xl font-black text-gray-900 mb-8'>
              Customer Reviews
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
              {/* Existing Reviews */}
              <div className='space-y-6'>
                {product.reviews.length === 0 && (
                  <Message>No reviews yet. Be the first to review!</Message>
                )}
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'
                  >
                    <div className='flex justify-between items-start mb-4'>
                      <div>
                        <p className='font-bold text-gray-900'>{review.name}</p>
                        <p className='text-sm text-gray-400 font-medium'>
                          {review.createdAt.substring(0, 10)}
                        </p>
                      </div>
                      <Rating value={review.rating} />
                    </div>
                    <p className='text-gray-600 leading-relaxed'>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <div className='bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200'>
                <h3 className='text-xl font-bold text-gray-900 mb-6'>
                  Write a Review
                </h3>
                {loadingProductReview && <Loader />}

                {userInfo ? (
                  <form onSubmit={submitHandler} className='space-y-6'>
                    <div>
                      <label className='block text-sm font-bold text-gray-700 mb-2'>
                        Rating
                      </label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className='w-full bg-white px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-medium'
                      >
                        <option value=''>Select Rating...</option>
                        <option value='1'>1 - Poor</option>
                        <option value='2'>2 - Fair</option>
                        <option value='3'>3 - Good</option>
                        <option value='4'>4 - Very Good</option>
                        <option value='5'>5 - Excellent</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm font-bold text-gray-700 mb-2'>
                        Comment
                      </label>
                      <textarea
                        rows='4'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className='w-full bg-white px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary-500 font-medium'
                        placeholder='What did you think of this product?'
                      ></textarea>
                    </div>

                    <button
                      disabled={loadingProductReview}
                      type='submit'
                      className='w-full btn-primary py-4 rounded-xl font-bold'
                    >
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <Message>
                    Please{' '}
                    <Link
                      to='/login'
                      className='text-primary-600 font-bold hover:underline'
                    >
                      sign in
                    </Link>{' '}
                    to write a review
                  </Message>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
