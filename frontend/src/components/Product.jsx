import { Link } from 'react-router-dom';
import Rating from './Rating';
import { ShoppingCart, Star } from 'lucide-react';

const Product = ({ product }) => {
  return (
    <div className='card group'>
      <Link to={`/product/${product._id}`}>
        <div className='aspect-square overflow-hidden bg-gray-100'>
          <img
            src={product.image}
            alt={product.name}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
          />
        </div>
      </Link>

      <div className='p-4'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-xs font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-2 py-1 rounded'>
            {product.category}
          </span>
          <div className='flex items-center gap-1 text-sm font-medium text-gray-600'>
            <Star size={16} className='text-yellow-400 fill-current' />
            {product.rating}
          </div>
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className='font-bold text-lg text-gray-800 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1'>
            {product.name}
          </h3>
        </Link>

        <p className='text-gray-500 text-sm mb-4 line-clamp-2'>
          {product.description}
        </p>

        <div className='flex items-center justify-between mt-auto'>
          <span className='text-xl font-extrabold text-gray-900'>
            ₹{product.price}
          </span>
          <Link
            to={`/product/${product._id}`}
            className='p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm'
          >
            <ShoppingCart size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
