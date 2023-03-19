import { CgUserlane } from 'react-icons/cg';
import { GoDatabase } from 'react-icons/go';
import { IoCalendar } from 'react-icons/io5';
import { SiGooglemaps } from 'react-icons/si';
import { useLocation } from 'react-router-dom';
import { FaMosque, FaUserEdit } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { IoMdClose, IoIosPeople } from 'react-icons/io';

import Navlink from './Navlink';
import Navtitle from './Navtitle';
import { toggleSidenav } from '../../../features/tailwind';

const dataSidenav = [
  {
    type: 'navigation',
    title: 'Beranda',
    to: '/',
    icon: <FaMosque />,
    page: '',
  },
  
  {
    type: 'title',
    title: 'Data Master',
  },
  
  {
    type: 'navigation',
    title: 'Wilayah',
    to: '/region',
    icon: <SiGooglemaps />,
    page: 'region',
  },
  {
    type: 'navigation',
    title: 'Anggota',
    to: '/member',
    icon: <IoIosPeople />,
    page: 'member',
  },
  {
    type: 'navigation',
    title: 'Kegiatan',
    to: '/event',
    icon: <IoCalendar />,
    page: 'event',
  },
  {
    type: 'navigation',
    title: 'Pengguna',
    to: '/user',
    icon: <CgUserlane />,
    page: 'user',
  },
  {
    type: 'title',
    title: 'Pengaturan',
  },
  {
    type: 'navigation',
    title: 'User',
    to: '/user-setting',
    icon: <FaUserEdit />,
    page: 'user-setting',
  },
  {
    type: 'navigation',
    title: 'Pulihkan',
    to: '/restore',
    icon: <GoDatabase />,
    page: 'restore',
  },
];

const Sidenav = () => {
  const dispatch = useDispatch();
  const path = useLocation().pathname.split('/')[1];
  const sidenav = useSelector((state) => state.tailwind.openSidenav);

  return (
    <aside
      className={`${
        sidenav
          ? 'w-full border-l-[10px] laptop:w-[300px]'
          : 'w-0 laptop:w-[80px] laptop:border-l-[10px]'
      } fixed top-0 bottom-0 z-20 overflow-x-hidden border-primary bg-primary text-white transition-all duration-500 dark:border-gunmetal dark:bg-gunmetal`}
    >
      {/* brand */}
      <div className="flex h-[60px] items-center">
        <span className="inline-flex w-[60px] flex-none justify-center py-3 text-4xl">
          <FaMosque />
          {/* <img src={img_src} alt="logo" className="w-full" /> */}
        </span>
        <h1 className="flex-1 whitespace-nowrap pl-[10px] font-['Uthmanic'] text-3xl">
          المصطفى الأمين
        </h1>
        <button
          className="mr-[20px] text-2xl font-bold tablet:mr-4 laptop:hidden"
          onClick={() => dispatch(toggleSidenav())}
        >
          <IoMdClose />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-5">
        <ul>
          {dataSidenav.map((nav, i) => {
            if (nav.type === 'title') return <Navtitle title={nav.title} key={i} />;
            if (nav.page === path)
              return (
                <Navlink title={nav.title} to={nav.to} icon={nav.icon} key={i} active />
              );

            return <Navlink title={nav.title} to={nav.to} icon={nav.icon} key={i} />;
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidenav;
