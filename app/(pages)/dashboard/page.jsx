'use client'
import { useEffect, useState, useCallback } from 'react'
import clsx from 'clsx'
import Link from 'next/link';
import { Menu, X, User, UploadCloud, Bookmark, LogOut } from 'lucide-react'
import Signout from '../../(components)/Signout'
import TopbarLayout from '../../(components)/topbar'; 
import { ToastContainer, toast, Zoom } from 'react-toastify';
import UserProfile from '@/app/(components)/dashProfile';
import Uploads from '@/app/(components)/dashUploads';


export default function Dashboard() {
  const [mainState, setMainState] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false); 

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userData, setUserData] = useState({});

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };
  
  const handleResize = useCallback(() => {
    const desktop = window.innerWidth >= 768;
    setIsDesktop(desktop);
    if (desktop) {
      setSidebarOpen(true); 
    } else {
      setSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    handleResize();
    const debouncedHandleResize = debounce(handleResize, 250);
    window.addEventListener('resize', debouncedHandleResize);
    return () => window.removeEventListener('resize', debouncedHandleResize);
  }, [handleResize]);


  const notify = (mess, typ) => toast(mess, {
    theme: "light", transition: Zoom, hideProgressBar: true, autoClose: 3000, type: typ
  });

  useEffect(() => {
    async function getUser() {
      setLoadingProfile(true);
      try {
        const res = await fetch('/api/userdata', {
          method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        });
        const data = await res.json();
        if (data.error) {
          notify(data.error, 'error'); setUserData({});
        } else {
          setUserData(data.user || {});
        }
      } catch (error) {
        notify('Failed to fetch user data', 'error'); setUserData({});
      } finally {
        setLoadingProfile(false);
      }
    }
    getUser();
  }, []);

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  const handleNavClick = (newState) => {
    setMainState(newState);
    localStorage.setItem('dashboard_main_state', newState);
    if (!isDesktop) { 
      setSidebarOpen(false);
    }
  };

  const TOPBAR_HEIGHT_MOBILE = '52px'; 
  const TOPBAR_HEIGHT_DESKTOP = '60px'; 

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopbarLayout />
      <ToastContainer position="top-center"/>

      <div className="flex flex-1" style={{ paddingTop: isDesktop ? TOPBAR_HEIGHT_DESKTOP : TOPBAR_HEIGHT_MOBILE }}>
        {!isDesktop && (
          <button
            onClick={handleSidebarToggle}
            className="fixed p-2 text-gray-700 bg-white rounded-md shadow-md"
            style={{ top: `calc(${TOPBAR_HEIGHT_MOBILE} + 10px)`, left: '10px', zIndex: 45 }} 
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        <aside
          className={clsx(
            'fixed md:static inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out print:hidden',
            'overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100',
            `md:pt-0 pt-[${TOPBAR_HEIGHT_MOBILE}]`,
            isDesktop
              ? (sidebarOpen ? 'w-60 lg:w-64' : 'w-20') 
              : (sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full')
          )}
          style={isDesktop ? { top: TOPBAR_HEIGHT_DESKTOP } : { top: 0, height: '100vh' }} 
        >
          <div className={clsx(
            "flex items-center p-3 border-b border-gray-200",
            sidebarOpen && isDesktop ? "justify-end" : "justify-center",
            !isDesktop && "justify-between" 
          )}>
            {!isDesktop && sidebarOpen && <span className="font-semibold text-lg">Menu</span>}
            <button
              onClick={handleSidebarToggle}
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isDesktop ? <Menu size={22} /> : (sidebarOpen ? <X size={22} /> : <Menu size={22} />) }
            </button>
          </div>

          <nav className="flex-1 px-2 py-3 space-y-1.5">
            {[
              { name: 'Profile', state: 'profile', icon: User },
              { name: 'Uploaded Books', state: 'uploaded', icon: UploadCloud },
            ].map((item) => (
              <Link
                key={item.name}
                href="#"
                onClick={() => handleNavClick(item.state)}
                title={item.name}
                className={clsx(
                  "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  "hover:bg-gray-100 hover:text-gray-900",
                  mainState === item.state ? 'bg-gray-200 text-gray-900' : 'text-gray-700',
                  !sidebarOpen && isDesktop && "justify-center" 
                )}
              >
                <item.icon size={18} className={clsx( (sidebarOpen || !isDesktop) && "mr-3" )} />
                {(sidebarOpen || !isDesktop) && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>

          <div className={clsx("px-2 py-3 mt-auto border-t border-gray-200", !sidebarOpen && isDesktop && "px-0")}>
            <Signout isIconOnly={!sidebarOpen && isDesktop} />
          </div>
        </aside>

        <main
          className={clsx(
            'flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-white md:bg-gray-50',
            'transition-all duration-300 ease-in-out',
            isDesktop && (sidebarOpen ? 'md:ml-10 lg:ml-14' : 'md:ml-14')
          )}
        >
          {mainState === "profile" && (
            <div className='w-full'>
              {loadingProfile ? <p>Loading Profile...</p> :
               userData?.email ? <UserProfile userData={userData} /> : <p>User data not available.</p>
              }
            </div>
          )}
          {mainState === "uploaded" && <Uploads />}
        </main>

        {!isDesktop && sidebarOpen && (
          <div
            onClick={handleSidebarToggle}
            className="fixed inset-0 z-30 bg-black opacity-50"
          ></div>
        )}
      </div>
    </div>
  );
}
