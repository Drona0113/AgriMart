import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text, color = 'text-yellow-400' }) => {
  return (
    <div className='flex items-center gap-2'>
      <div className='flex items-center'>
        {[1, 2, 3, 4, 5].map((index) => (
          <span key={index}>
            {value >= index ? (
              <Star size={18} className={`${color} fill-current`} />
            ) : value >= index - 0.5 ? (
              <StarHalf size={18} className={`${color} fill-current`} />
            ) : (
              <Star size={18} className='text-gray-300' />
            )}
          </span>
        ))}
      </div>
      {text && <span className='text-sm font-medium text-gray-500'>{text}</span>}
    </div>
  );
};

export default Rating;
