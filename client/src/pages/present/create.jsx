import Swal from 'sweetalert2';
import Barcode from 'react-barcode';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { parseDate } from '../../utilities';
import { Breadcrumbs } from '../../components';
import dummyProfile from '../../assets/images/profile.jpg';
import { createPresent } from '../../fetchers/present-book';

const breadList = [
  { title: 'Beranda', href: '/' },
  { title: 'Kegiatan', href: '/event' },
  { title: 'Absen hadir' },
];
const displayBirth = (date) => {
  if (!date) return '-';

  const { dateWithZero, monthString, year } = parseDate(date);
  return `${dateWithZero} ${monthString} ${year}`;
};

const Create = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState({});
  const [member, setMember] = useState({});

  useEffect(() => {
    if (!location.state) return navigate('/event');
    setEvent(location.state);
  }, [location, navigate]);

  const handleAbsent = async (e) => {
    const value = e.target.value;

    if (e.key === 'Enter' && value) {
      try {
        const member = await createPresent({
          no_induk: value,
          event: event._id,
          type: event.type,
        });
        setMember(member);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: `${error.response?.data?.message || error.message}`,
          timer: 1500,
          showConfirmButton: false,
        });
      }

      document.querySelector('input[name="noInduk"]').value = '';
    }
  };

  return (
    <>
      <Breadcrumbs list={breadList} />

      <h3 className="text-lg">
        Buku hadir{' '}
        {event.type === 'kematian'
          ? `kifayah ${event.name}`
          : `dzikiran di ${event.name}`}
      </h3>

      <input
        className="my-5 w-full appearance-none rounded border py-2 px-3 text-sm leading-tight text-gray-700 shadow focus:outline-none dark:border-[#4B5563] dark:bg-charcoal dark:text-white tablet:w-[300px]"
        placeholder="Masukkan no. induk..."
        name="noInduk"
        autoComplete="off"
        autoFocus
        onKeyUp={handleAbsent}
      />

      {member.full_name && (
        <div className="flex">
          <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-lg dark:bg-neutral-700 tablet:max-w-2xl tablet:flex-row">
            <img
              className="h-96 w-full self-center object-cover tablet:h-full tablet:w-48"
              src={member.image ? `${member.image}` : dummyProfile}
              alt=""
            />
            <div className="flex flex-1 flex-col justify-center p-6">
              <h5 className="mb-3 self-center font-['Uthmanic'] text-2xl font-medium text-neutral-800 dark:text-neutral-50">
                المصطفى الأمين
              </h5>
              <p className="flex text-base text-neutral-600 dark:text-neutral-200">
                <span className="inline-block w-[105px]">Nama</span>
                <span className="mr-2">:</span>
                <span>{member.full_name}</span>
              </p>
              <p className="flex text-base text-neutral-600 dark:text-neutral-200">
                <span className="inline-block w-[105px]">Bin/Binti</span>
                <span className="mr-2">:</span>
                <span>{member.parent_name}</span>
              </p>
              <p className="flex text-base text-neutral-600 dark:text-neutral-200">
                <span className="inline-block w-[105px]">Alamat</span>
                <span className="mr-2">:</span>
                <span className="flex-1">{member.address}</span>
              </p>
              <p className="flex text-base text-neutral-600 dark:text-neutral-200">
                <span className="inline-block w-[105px]">Tanggal Lahir</span>
                <span className="mr-2">:</span>
                <span>{displayBirth(member.birth)}</span>
              </p>
              <p className="flex text-base text-neutral-600 dark:text-neutral-200">
                <span className="inline-block w-[105px]">Wilayah</span>
                <span className="mr-2">:</span>
                <span>{member.region?.name}</span>
              </p>

              <div className="mt-3 self-center">
                <Barcode
                  value={member.no_induk || 'no_set'}
                  height={25}
                  fontSize={15}
                  background="rgba(0,0,0,0)"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Create;
