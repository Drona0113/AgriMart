import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FarmerRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && (userInfo.isFarmer || userInfo.isSupplier || userInfo.isAdmin) ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace />
  );
};
export default FarmerRoute;
