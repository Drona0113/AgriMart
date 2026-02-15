import { Link } from 'react-router-dom';
import { Sprout, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-white border-t mt-12'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='space-y-4'>
            <Link to='/' className='flex items-center gap-2 text-primary-600 font-bold text-2xl'>
              <Sprout size={32} />
              <span>AgriMart</span>
            </Link>
            <p className='text-gray-600 text-sm'>
              Your Farming Essentials - Dedicated to empowering farmers with quality products and expert knowledge.
            </p>
          </div>

          <div>
            <h3 className='font-bold text-lg mb-4'>Categories</h3>
            <ul className='space-y-2 text-gray-600'>
              <li><Link to='/search/seeds' className='hover:text-primary-600'>Seeds</Link></li>
              <li><Link to='/search/fertilizers' className='hover:text-primary-600'>Fertilizers</Link></li>
              <li><Link to='/search/pesticides' className='hover:text-primary-600'>Pesticides</Link></li>
              <li><Link to='/search/tools' className='hover:text-primary-600'>Farming Tools</Link></li>
            </ul>
          </div>

          <div>
            <h3 className='font-bold text-lg mb-4'>Quick Links</h3>
            <ul className='space-y-2 text-gray-600'>
              <li><Link to='/knowledge' className='hover:text-primary-600'>Knowledge Hub</Link></li>
              <li><Link to='/profile' className='hover:text-primary-600'>My Account</Link></li>
              <li><Link to='/cart' className='hover:text-primary-600'>Shopping Cart</Link></li>
            </ul>
          </div>

          <div>
            <h3 className='font-bold text-lg mb-4'>Contact Us</h3>
            <ul className='space-y-3 text-gray-600'>
              <li className='flex items-center gap-2'><Phone size={18} /> +91 1800-AGRI-MART</li>
              <li className='flex items-center gap-2'><Mail size={18} /> support@agrimart.com</li>
              <li className='flex items-center gap-2'><MapPin size={18} /> Rural Empowerment Center, India</li>
            </ul>
          </div>
        </div>

        <div className='border-t mt-12 pt-8 text-center text-gray-500 text-sm'>
          <p>&copy; {currentYear} AgriMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
