// src/router/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const authToken = localStorage.getItem('authToken');

  // Если токена нет, не пускаем дальше. Сразу на логин.
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  // Токен есть? Рендерим вложенный контент (твою админку).
  return <Outlet />;
};

export default PrivateRoute;