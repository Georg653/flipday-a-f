// src/App.tsx

import AppRoutes from './router/AppRoutes';
// import AdminLayout from './components/layout/AdminLayout'; // Если есть общий layout

function App() {
  return (
    <>
      {/* <AdminLayout> // Если есть общий layout, он может быть здесь */}
        <AppRoutes />
      {/* </AdminLayout> */}
    </>
  );
}

export default App;