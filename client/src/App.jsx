import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/login';
import Signup from './pages/signup';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';

function LayoutWithSidebar({ children }) {
  const location = useLocation();
  const showSidebarOn = ['/dashboard', '/signup'];

  const shouldShowSidebar = showSidebarOn.includes(location.pathname);

  return (
    <div className="flex">
      {shouldShowSidebar && <Sidebar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}

function App() {
  return (
    <SidebarProvider defaultOpen={false}>
      <BrowserRouter>
        <LayoutWithSidebar>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </LayoutWithSidebar>
      </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;
