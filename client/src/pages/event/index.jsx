import Swal from 'sweetalert2';
import { ImBoxAdd } from 'react-icons/im';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import { parseDate } from '../../utilities';
import { Breadcrumbs, Button } from '../../components';

import { getAllEvent, deleteEventById, updateStatusById } from '../../fetchers/event';

const breadList = [{ title: 'Beranda', href: '/' }, { title: 'Kegiatan' }];
const displayDate = (date) => {
  const { dateWithZero, monthString, year } = parseDate(date);

  return `${dateWithZero} ${monthString} ${year}`;
};
const displayTime = (date) => {
  const { hourWithZero, minuteWithZero, secondWithZero } = parseDate(date);

  return `${hourWithZero}:${minuteWithZero}:${secondWithZero}`;
};

const Event = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    data: [],
    page: 0,
    limit: 0,
    rows: 0,
    allPage: 0,
  });
  const [queries, setQueries] = useState({
    name: '',
    type: '',
    created_at: '',
    page: 0,
    limit: 20,
    sort: '-created_at',
  });
  const [getting, setGetting] = useState(true);

  useEffect(() => {
    const getAll = async () => {
      setGetting(true);
      try {
        const data = await getAllEvent(queries);
        setEvent(data);
      } catch (error) {
        console.log(error);
      }

      setGetting(false);
    };

    getAll();
  }, [queries]);

  const handleUpdateStatus = ({ _id: id, type }) => {
    Swal.fire({
      title: `Apakah kegiatan ini sudah selesai?`,
      text: `Anda yakin, tindakan ini tidak bisa dikembalikan`,
      icon: 'question',
      confirmButtonText: 'Ya, selesai!',
      confirmButtonColor: '#287bff',
      showDenyButton: true,
      denyButtonText: 'Batal',
      denyButtonColor: '#dc3545',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
        return (async () => {
          try {
            await updateStatusById(
              id,
              type === 'dzikiran' ? 'absent_dzikiran' : 'absent_kematian'
            );
          } catch (error) {
            Swal.showValidationMessage(error.response?.data?.message || error.message);
            console.log(error);
          }
        })();
      },
    }).then((res) => {
      if (res.isConfirmed) {
        setEvent({
          ...event,
          data: event.data.map((event) => {
            if (event._id === id)
              return {
                ...event,
                status: 0,
              };
            return event;
          }),
        });

        Swal.fire({
          icon: 'success',
          title: `Kegiatan selesai`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleDelete = (deleted) => {
    Swal.fire({
      title: `Hapus kegiatan ${
        deleted.type === 'kematian' ? 'kifayah' : 'dzikiran di '
      } ${deleted.name}?`,
      text: `Anda yakin, tindakan ini tidak bisa dikembalikan`,
      icon: 'question',
      confirmButtonText: 'Ya, hapus!',
      confirmButtonColor: '#287bff',
      showDenyButton: true,
      denyButtonText: 'Batal',
      denyButtonColor: '#dc3545',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return (async () => {
          try {
            await deleteEventById(deleted._id);
          } catch (error) {
            Swal.showValidationMessage(error.response?.data?.message || error.message);
          }
        })();
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((res) => {
      if (res.isConfirmed) {
        setEvent({
          ...event,
          data: event.data.filter((event) => event._id !== deleted._id),
          rows: event.rows - 1,
        });

        Swal.fire({
          icon: 'success',
          title: `Kegiatan berhasil dihapus`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <>
      <Breadcrumbs list={breadList} />

      <Button
        label="Tambah Kegiatan"
        icon={<ImBoxAdd className="text-lg" />}
        size="md"
        onClick={() => navigate('/event/create')}
      />

      <div className="my-5 overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead className="text-xs uppercase">
            <tr className="border-y">
              <th className="whitespace-nowrap px-6 py-3">Tanggal</th>
              <th className="whitespace-nowrap px-6">Jenis Kegiatan</th>
              <th className="whitespace-nowrap px-6">Nama / Tempat</th>
              <th className="whitespace-nowrap px-6">Keterangan</th>
              <th className="whitespace-nowrap px-6"></th>
            </tr>
          </thead>
          <tbody>
            {event.data.map((event, i) => (
              <tr
                className={
                  i % 2 === 1 ? 'border-y' : 'border-y bg-neutral-100 dark:bg-transparent'
                }
                key={event._id}
              >
                <td className="whitespace-nowrap px-6 py-3">
                  {displayDate(event.created_at)}
                  <br />
                  {displayTime(event.created_at)}
                </td>
                <td className="whitespace-nowrap px-6">{event.type.toUpperCase()}</td>
                <td className="whitespace-nowrap px-6">{event.name}</td>
                <td className="px-6">{event.description}</td>
                <td className="whitespace-nowrap px-6 text-right">
                  {event.status === 1 ? (
                    <>
                      <Button
                        label="Buat Buku Hadir"
                        type="success"
                        outline
                        onClick={() =>
                          navigate(`/event/${event._id}/create-present`, { state: event })
                        }
                      />
                      <span className="inline-block w-1"></span>
                      <Button
                        label="Tutup Absen"
                        type="warning"
                        outline
                        onClick={() => handleUpdateStatus(event)}
                      />
                      <span className="inline-block w-1"></span>
                    </>
                  ) : (
                    <>
                      <Button
                        label="Detail"
                        type="success"
                        outline
                        onClick={() =>
                          navigate(`/event/${event._id}/detail`, { state: event })
                        }
                      />
                      <span className="inline-block w-1"></span>
                    </>
                  )}

                  <Button
                    label="Ubah"
                    outline
                    onClick={() =>
                      navigate(`/event/${event._id}/update`, { state: event })
                    }
                  />
                  <span className="inline-block w-1"></span>
                  <Button
                    label="Hapus"
                    type="danger"
                    outline
                    onClick={() => handleDelete(event)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <p>Total data: {event.rows}</p>

      {event.rows > 0 && (
        <>
          <p>
            Halaman : {event.page + 1} dari {event.allPage} halaman.
          </p>

          <div className="flex justify-end gap-x-2">
            {event.page > 0 && (
              <Button
                label="Sebelumnya"
                icon={<BsArrowLeftShort className="text-xl" />}
                outline
                disabled={getting}
                onClick={() => setQueries({ ...queries, page: event.page - 1 })}
              />
            )}

            {event.page < event.allPage - 1 && (
              <Button
                label="Selanjutnya"
                icon={<BsArrowRightShort className="text-xl" />}
                reverse
                outline
                disabled={getting}
                onClick={() => setQueries({ ...queries, page: event.page + 1 })}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Event;
