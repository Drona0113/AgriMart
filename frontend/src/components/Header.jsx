import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LogOut, Menu, X, Sprout } from 'lucide-react';
import { useState } from 'react';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between gap-4'>
          <Link to='/' className='flex items-center gap-2 text-primary-600 font-bold text-2xl'>
            <Sprout size={32} />
            <span className='hidden sm:inline'>AgriMart</span>
          </Link>

          <div className='hidden md:block flex-grow max-w-xl'>
            <SearchBox />
          </div>

          <div className='flex items-center gap-4'>
            <Link to='/cart' className='relative p-2 text-gray-600 hover:text-primary-600'>
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className='absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full'>
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>

            <Link to='/knowledge' className='hidden sm:block text-gray-600 hover:text-primary-600 font-medium'>
              Knowledge Hub
            </Link>

            {userInfo ? (
              <div className='relative group'>
                <button className='flex items-center gap-1 p-2 text-gray-600 hover:text-primary-600'>
                  <User size={24} />
                  <span className='hidden sm:inline font-medium'>{userInfo.name}</span>
                </button>
                <div className='absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg hidden group-hover:block overflow-hidden'>
                  <Link to='/profile' className='block px-4 py-2 hover:bg-gray-100'>Profile</Link>
                  {userInfo.isAdmin && (
                    <>
                      <div className='border-t'></div>
                      <Link to='/admin/productlist' className='block px-4 py-2 hover:bg-gray-100 font-bold text-primary-600 uppercase text-xs tracking-wider'>Admin Panel</Link>
                      <Link to='/admin/productlist' className='block px-4 py-2 hover:bg-gray-100'>Manage Products</Link>
                      <Link to='/admin/orderlist' className='block px-4 py-2 hover:bg-gray-100'>Manage Orders</Link>
                      <Link to='/admin/userlist' className='block px-4 py-2 hover:bg-gray-100'>Manage Users</Link>
                      <Link to='/admin/knowledgelist' className='block px-4 py-2 hover:bg-gray-100'>Manage Knowledge</Link>
                    </>
                  )}
                  {userInfo.isFarmer && !userInfo.isAdmin && (
                    <>
                      <div className='border-t'></div>
                      <Link to='/farmer/productlist' className='block px-4 py-2 hover:bg-gray-100 font-bold text-green-600 uppercase text-xs tracking-wider'>Farmer Shop</Link>
                      <Link to='/farmer/productlist' className='block px-4 py-2 hover:bg-gray-100'>My Products</Link>
                    </>
                  )}
                  <div className='border-t'></div>
                  <button onClick={logoutHandler} className='w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600'>
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to='/login' className='btn-primary py-2 px-4'>Login</Link>
            )}

            <button className='md:hidden p-2' onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        {isMenuOpen && (
          <div className='md:hidden mt-4 pb-4 space-y-4 animate-in fade-in slide-in-from-top-4'>
            <SearchBox />
            <nav className='flex flex-col gap-2'>
              <Link to='/knowledge' className='p-2 hover:bg-gray-100 rounded'>Knowledge Hub</Link>
              {!userInfo && <Link to='/login' className='p-2 hover:bg-gray-100 rounded'>Login</Link>}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
