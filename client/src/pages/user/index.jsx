import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import { Breadcrumbs, Button } from '../../components';

import { getAllUser, deleteUserById, updateStatusById } from '../../fetchers/user';

const breadList = [{ title: 'Beranda', href: '/' }, { title: 'Pengguna' }];

const User = () => {
  const [user, setUser] = useState({
    data: [],
    page: 0,
    limit: 0,
    rows: 0,
    allPage: 0,
  });
  const [queries, setQueries] = useState({
    page: 0,
    limit: 20,
    sort: 'full_name',
  });
  const [getting, setGetting] = useState(true);

  useEffect(() => {
    const getAll = async () => {
      setGetting(true);
      try {
        const data = await getAllUser(queries);
        setUser(data);
      } catch (error) {
        console.log(error);
      }

      setGetting(false);
    };

    getAll();
  }, [queries]);

  const handleUpdateStatus = ({ _id: id, full_name }) => {
    Swal.fire({
      title: `Perbarui status ${full_name}?`,
      icon: 'question',
      confirmButtonText: 'Ya, perbarui!',
      confirmButtonColor: '#287bff',
      showDenyButton: true,
      denyButtonText: 'Batal',
      denyButtonColor: '#dc3545',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
        return (async () => {
          try {
            await updateStatusById(id);
          } catch (error) {
            Swal.showValidationMessage(error.response?.data?.message || error.message);
            console.log(error);
          }
        })();
      },
    }).then((res) => {
      if (res.isConfirmed) {
        setUser({
          ...user,
          data: user.data.map((user) => {
            if (user._id === id)
              return {
                ...user,
                status: user.status ? 0 : 1,
              };
            return user;
          }),
        });

        Swal.fire({
          icon: 'success',
          title: `Status diperbarui`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleDelete = (deleted) => {
    Swal.fire({
      title: `Hapus pengguna '${deleted.full_name}'?`,
      text: `Anda yakin`,
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
            await deleteUserById(deleted._id);
          } catch (error) {
            Swal.showValidationMessage(error.response?.data?.message || error.message);
          }
        })();
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((res) => {
      if (res.isConfirmed) {
        setUser({
          ...user,
          data: user.data.filter((user) => user._id !== deleted._id),
          rows: user.rows - 1,
        });

        Swal.fire({
          icon: 'success',
          title: `Pengguna berhasil dihapus`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <>
      <Breadcrumbs list={breadList} />

      <div className="my-5 overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead className="text-xs uppercase">
            <tr className="border-y">
              <th className="w-[50px] whitespace-nowrap px-6 py-3 ">No.</th>
              <th className="whitespace-nowrap px-6">Nama Lengkap</th>
              <th className="whitespace-nowrap px-6">Email</th>
              <th className="whitespace-nowrap px-6"></th>
            </tr>
          </thead>
          <tbody>
            {user.data.map((user, i) => (
              <tr
                className={
                  i % 2 === 1 ? 'border-y' : 'border-y bg-neutral-100 dark:bg-transparent'
                }
                key={user._id}
              >
                <td className="whitespace-nowrap px-6 py-3 text-center">
                  {queries.page * queries.limit + (i + 1)}
                </td>
                <td className="whitespace-nowrap px-6">{user.full_name}</td>
                <td className="whitespace-nowrap px-6">{user.email}</td>
                <td className="whitespace-nowrap px-6 text-right">
                  {user.role !== 'admin' && (
                    <>
                      <Button
                        label="Perbarui status"
                        type="success"
                        onClick={() => handleUpdateStatus(user)}
                      />
                      <span className="inline-block w-1"></span>
                      <Button
                        label="Hapus"
                        type="danger"
                        onClick={() => handleDelete(user)}
                      />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <p>Total data: {user.rows}</p>

      {user.rows > 0 && (
        <>
          <p>
            Halaman : {user.page + 1} dari {user.allPage} halaman.
          </p>

          <div className="flex justify-end gap-x-2">
            {user.page > 0 && (
              <Button
                label="Sebelumnya"
                icon={<BsArrowLeftShort className="text-xl" />}
                outline
                disabled={getting}
                onClick={() => setQueries({ ...queries, page: user.page - 1 })}
              />
            )}

            {user.page < user.allPage - 1 && (
              <Button
                label="Selanjutnya"
                icon={<BsArrowRightShort className="text-xl" />}
                reverse
                outline
                disabled={getting}
                onClick={() => setQueries({ ...queries, page: user.page + 1 })}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default User;
