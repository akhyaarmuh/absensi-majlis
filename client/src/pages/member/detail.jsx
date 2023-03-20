import Swal from 'sweetalert2';
import Barcode from 'react-barcode';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { parseDate } from '../../utilities';
import dummyProfile from '../../assets/images/profile.jpg';
import { Button, Breadcrumbs, Badges } from '../../components';
import { updateStatusById, resetAbsentById } from '../../fetchers/member';

const breadList = [
  { title: 'Beranda', href: '/' },
  { title: 'Anggota', href: '/member' },
  { title: 'Detail Member' },
];
const displayBirth = (date) => {
  if (!date) return '-';

  const { dateWithZero, monthString, year } = parseDate(date);
  return `${dateWithZero} ${monthString} ${year}`;
};

const Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [member, setMember] = useState({
    status: 0,
    image: '',
    attend_dzikiran: [],
    absent_kematian: [],
  });

  useEffect(() => {
    if (!location.state) return navigate('/member');
    setMember(location.state);
  }, [location, navigate]);

  const updateStatus = () => {
    Swal.fire({
      title: `Ubah status anggota ${member.full_name}?`,
      text: 'Anda yakin',
      icon: 'question',
      confirmButtonText: 'Ya, ubah!',
      confirmButtonColor: '#287bff',
      showDenyButton: true,
      denyButtonText: 'Batal',
      denyButtonColor: '#dc3545',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
        return (async () => {
          try {
            await updateStatusById(member._id);
          } catch (error) {
            Swal.showValidationMessage(error.response?.data?.message || error.message);
          }
        })();
      },
    }).then((res) => {
      if (res.isConfirmed) {
        setMember({
          ...member,
          status: member.status ? 0 : 1,
        });

        Swal.fire({
          icon: 'success',
          title: `Status berhasil diperbarui`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const resetAbsent = async () => {
    Swal.fire({
      title: `Set ulang absensi ${member.full_name}?`,
      text: 'Anda yakin',
      icon: 'question',
      confirmButtonText: 'Ya, set ulang!',
      confirmButtonColor: '#287bff',
      showDenyButton: true,
      denyButtonText: 'Batal',
      denyButtonColor: '#dc3545',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
        return (async () => {
          try {
            await resetAbsentById(member._id);
          } catch (error) {
            Swal.showValidationMessage(error.response?.data?.message || error.message);
          }
        })();
      },
    }).then((res) => {
      if (res.isConfirmed) {
        setMember({
          ...member,
          attend_dzikiran: [],
          attend_kematian: [],
          absent_dzikiran: [],
          absent_kematian: [],
        });

        Swal.fire({
          icon: 'success',
          title: `Absensi berhasil diset ulang`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <>
      <Breadcrumbs list={breadList} />

      <div className="flex justify-center">
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-lg dark:bg-neutral-700 tablet:max-w-2xl tablet:flex-row">
          <img
            className="h-96 w-full self-center object-cover tablet:h-full tablet:w-48"
            src={member.image ? `${member.url}/${member.image}` : dummyProfile}
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
      <h3 className="mt-3 text-xl">Detail Info :</h3>
      <p>
        Status :{' '}
        {!member.status ? (
          <Badges label="Baru" />
        ) : member.absent_kematian.length > 2 ? (
          <Badges label="Tidak Aktif" type="warning" />
        ) : (
          <Badges label="Aktif" type="success" />
        )}
      </p>
      <div className="h-1"></div>
      <Button label="Perbarui Status" outline onClick={updateStatus} />

      {(!member.status || member.absent_kematian.length >= 3) && (
        <p className="mt-3">
          Hadir Dzikiran : {member.attend_dzikiran.length} kali berturut-turut
        </p>
      )}
      <p className="mt-3">Absen Kematian : {member.absent_kematian.length} kali</p>
      <Button label="Set Ulang Absen" type="danger" outline onClick={resetAbsent} />
    </>
  );
};

export default Detail;
