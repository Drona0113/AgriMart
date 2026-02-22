import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LogOut, Menu, X, Sprout } from 'lucide-react';
import { useState } from 'react';
import { logout } from '../slices/authSlice';
import { clearCartItems, resetCart } from '../slices/cartSlice';
import SearchBox from './SearchBox';
import LanguageModal from './LanguageModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(resetCart());
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      {showLangModal && <LanguageModal forceShow={true} onClose={() => setShowLangModal(false)} />}
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
            {/* Language Switcher Trigger */}
            <button 
              onClick={() => setShowLangModal(true)}
              className='flex items-center gap-1 p-2 text-gray-600 hover:text-primary-600 font-medium text-sm border rounded-lg hover:bg-gray-50'
            >
              🌐 Language
            </button>

            {userInfo?.isFarmer && (
              <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${userInfo.isVerified ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                {userInfo.isVerified ? (
                  <>✓ Verified Farmer</>
                ) : (
                  <>⏳ Pending Approval</>
                )}
              </div>
            )}

            {userInfo?.isSupplier && (
              <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${userInfo.isVerified ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                {userInfo.isVerified ? (
                  <>✓ Verified Supplier</>
                ) : (
                  <>⏳ Pending Approval</>
                )}
              </div>
            )}

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
                <button className='flex items-center gap-2 p-1 text-gray-600 hover:text-primary-600 font-medium'>
                  {userInfo.image ? (
                    <div className='w-8 h-8 rounded-full overflow-hidden border border-gray-200'>
                      <img src={userInfo.image} alt={userInfo.name} className='w-full h-full object-cover' />
                    </div>
                  ) : (
                    <div className='bg-gray-100 p-1.5 rounded-full'>
                      <User size={20} />
                    </div>
                  )}
                  <span className='hidden sm:inline'>{userInfo.name}</span>
                </button>
                <div className='absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50'>
                  <div className='bg-white border rounded-lg shadow-lg overflow-hidden'>
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
                    {userInfo.isFarmer && !userInfo.isAdmin && userInfo.isVerified && (
                      <>
                        <div className='border-t'></div>
                        <Link to='/farmer/productlist' className='block px-4 py-2 hover:bg-gray-100 font-bold text-green-600 uppercase text-xs tracking-wider'>Farmer Shop</Link>
                        <Link to='/farmer/productlist' className='block px-4 py-2 hover:bg-gray-100'>My Products</Link>
                        <Link to='/farmer/orderlist' className='block px-4 py-2 hover:bg-gray-100'>Farmer Orders</Link>
                      </>
                    )}
                    {userInfo.isSupplier && !userInfo.isAdmin && userInfo.isVerified && (
                      <>
                        <div className='border-t'></div>
                        <Link to='/farmer/productlist' className='block px-4 py-2 hover:bg-gray-100 font-bold text-blue-600 uppercase text-xs tracking-wider'>Supplier Shop</Link>
                        <Link to='/farmer/productlist' className='block px-4 py-2 hover:bg-gray-100'>My Products</Link>
                        <Link to='/farmer/orderlist' className='block px-4 py-2 hover:bg-gray-100'>Supplier Orders</Link>
                      </>
                    )}
                    <div className='border-t'></div>
                    <button onClick={logoutHandler} className='block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600'>Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to='/login' className='flex items-center gap-1 bg-primary-600 text-white px-4 py-2 rounded-full font-bold hover:bg-primary-700 transition-colors'>
                <User size={18} />
                <span>Sign In</span>
              </Link>
            )}
            
            <button className='md:hidden p-2 text-gray-600' onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='md:hidden mt-4 space-y-4 pb-4 animate-in slide-in-from-top-2'>
            <div className='relative'>
              <SearchBox />
            </div>
            <nav className='flex flex-col space-y-2'>
              <Link to='/cart' className='flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg'>
                <ShoppingCart size={20} /> Cart
                <span className='bg-primary-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full ml-auto'>
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              </Link>
              <Link to='/knowledge' className='flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg'>
                <Sprout size={20} /> Knowledge Hub
              </Link>
              {userInfo ? (
                <>
                  <Link to='/profile' className='flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg'>
                    <User size={20} /> Profile
                  </Link>
                  <button onClick={logoutHandler} className='flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-red-600 w-full text-left'>
                    <LogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <Link to='/login' className='flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-primary-600 font-bold'>
                  <User size={20} /> Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
