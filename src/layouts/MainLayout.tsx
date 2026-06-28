import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar/Navbar';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-surface text-gray-100 font-sans">
      <Navbar />
      <main className="md:ml-20">
        <Outlet />
      </main>
    </div>
  );
}
