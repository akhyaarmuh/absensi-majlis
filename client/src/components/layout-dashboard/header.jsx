import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { IoMenuOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

import { Dropdown } from '../';

import { logout } from '../../fetchers/auth';

import profileImage from '../../assets/images/profile.png';

import { toggleSidenav } from '../../features/tailwind';
import { logout as logoutCLient } from '../../features/user';

const Header = () => {
  const dispatch = useDispatch();
  const full_name = useSelector((state) => state.user.full_name);

  useEffect(() => {
    window.onscroll = () => {
      const header = document.querySelector('header');
      const offsetTop = header.offsetTop;
      if (offsetTop > 0) {
        header.classList.add(
          'shadow-[0_-1px_0_0_#d1d5db_inset]',
          'dark:shadow-[0_-1px_0_0_#374151_inset]'
        );
      } else {
        header.classList.remove(
          'shadow-[0_-1px_0_0_#d1d5db_inset]',
          'dark:shadow-[0_-1px_0_0_#374151_inset]'
        );
      }
    };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Anda yakin ingin keluar?',
      icon: 'question',
      confirmButtonText: 'Ya, keluar!',
      confirmButtonColor: '#287bff',
      showDenyButton: true,
      denyButtonText: 'Batal',
      denyButtonColor: '#dc3545',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return (async () => {
          try {
            await logout();
            dispatch(logoutCLient());
          } catch (error) {
            Swal.showValidationMessage(error.response?.data?.message || error.message);
          }
        })();
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 text-stategray backdrop-blur-[5px] dark:text-white">
      <button
        className="text-2xl hover:opacity-75"
        onClick={() => dispatch(toggleSidenav())}
      >
        <IoMenuOutline />
      </button>
      <div className="flex items-center gap-2">
        <h5 className="hidden max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap tablet:inline-block ">
          {full_name}
        </h5>
        <Dropdown list={[{ title: 'Keluar', onClick: handleLogout }]}>
          <div className="flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-full">
            <img src={profileImage} alt="profile" className="w-full" />
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
