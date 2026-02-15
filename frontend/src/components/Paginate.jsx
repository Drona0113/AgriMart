import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <div className='flex justify-center mt-12'>
        <div className='flex gap-2 p-2 bg-white rounded-2xl shadow-sm border border-gray-100'>
          {[...Array(pages).keys()].map((x) => (
            <Link
              key={x + 1}
              to={
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${x + 1}`
                    : `/page/${x + 1}`
                  : `/admin/productlist/${x + 1}`
              }
              className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold transition-all ${
                x + 1 === page
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {x + 1}
            </Link>
          ))}
        </div>
      </div>
    )
  );
};

export default Paginate;
