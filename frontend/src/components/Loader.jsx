import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[400px]'>
      <Loader2 className='animate-spin text-primary-600 mb-4' size={48} />
      <p className='text-gray-500 font-medium'>Loading...</p>
    </div>
  );
};

export default Loader;
