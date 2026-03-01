import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className='relative w-full'>
      <input
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='Search seeds, tools, fresh produce...'
        className='w-full px-4 py-2 pl-10 rounded-lg border-2 border-gray-100 focus:border-primary-500 focus:outline-none transition-colors'
      />
      <Search className='absolute left-3 top-2.5 text-gray-400' size={20} />
      <button
        type='submit'
        className='absolute right-2 top-1.5 bg-primary-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors'
      >
        Search
      </button>
    </form>
  );
};

export default SearchBox;
