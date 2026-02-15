import { Link, useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { ChevronLeft, ChevronRight, Sprout } from 'lucide-react';

const HomePage = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      <Meta />
      {!keyword ? (
        <section className='mb-12 bg-primary-600 rounded-3xl p-8 md:p-16 text-white relative overflow-hidden'>
          <div className='relative z-10 max-w-2xl'>
            <h1 className='text-4xl md:text-6xl font-extrabold mb-6'>
              Grow Better with AgriMart
            </h1>
            <p className='text-lg md:text-xl opacity-90 mb-8'>
              High-quality seeds, fertilizers, and tools delivered right to your farm. Expert advice at your fingertips.
            </p>
            <div className='flex flex-wrap gap-4'>
              <Link to='/search/seeds' className='bg-white text-primary-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors'>
                Shop Seeds
              </Link>
              <Link to='/knowledge' className='bg-primary-700 text-white px-6 py-3 rounded-full font-bold hover:bg-primary-800 transition-colors'>
                Expert Tips
              </Link>
            </div>
          </div>
          <div className='absolute right-0 bottom-0 opacity-20 hidden lg:block'>
            <Sprout size={400} />
          </div>
        </section>
      ) : (
        <Link to='/' className='inline-flex items-center gap-2 text-primary-600 font-medium mb-6 hover:underline'>
          <ChevronLeft size={20} /> Back to Home
        </Link>
      )}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-800'>
              {keyword ? `Search results for "${keyword}"` : 'Latest Products'}
            </h2>
            <div className='flex gap-2'>
              {/* Category Filters could go here */}
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {data.products.map((product) => (
              <div key={product._id}>
                <Product product={product} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className='flex justify-center mt-12 gap-2'>
              {[...Array(data.pages).keys()].map((x) => (
                <Link
                  key={x + 1}
                  to={
                    !keyword
                      ? `/page/${x + 1}`
                      : `/search/${keyword}/page/${x + 1}`
                  }
                  className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                    x + 1 === data.page
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-primary-50'
                  }`}
                >
                  {x + 1}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default HomePage;
