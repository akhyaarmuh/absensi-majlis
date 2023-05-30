import Swal from 'sweetalert2';
import { ImBoxAdd } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import { toRupiah } from '../../utilities';
import { deleteRegion } from '../../features/region';
import { Breadcrumbs, Button } from '../../components';
import { getAllRegion, deleteRegionById } from '../../fetchers/region';

const breadList = [{ title: 'Beranda', href: '/' }, { title: 'Wilayah' }];

const Region = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [region, setRegion] = useState({
    data: [],
    page: 0,
    limit: 0,
    rows: 0,
    allPage: 0,
  });
  const [queries, setQueries] = useState({
    name: '',
    page: 0,
    limit: 20,
  });
  const [getting, setGetting] = useState(true);

  useEffect(() => {
    const getAll = async () => {
      setGetting(true);
      try {
        const data = await getAllRegion(queries);
        setRegion(data);
      } catch (error) {
        console.log(error);
      }

      setGetting(false);
    };

    getAll();
  }, [queries]);

  const changeInputQueries = (e) => {
    if (getting) return;

    const name = e.target.name;
    const value = e.target.value;

    if (e.key === 'Enter' || (value === '' && queries[name] !== ''))
      setQueries({ ...queries, [name]: value, page: 0 });
  };

  const handleDelete = (deleted) => {
    Swal.fire({
      title: `Hapus wilayah ${deleted.name}?`,
      text: `Semua anggota dengan wilayah ${deleted.name} akan ikut terhapus`,
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
            await deleteRegionById(deleted._id);
          } catch (error) {
            Swal.showValidationMessage(error.response?.data?.message || error.message);
          }
        })();
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((res) => {
      if (res.isConfirmed) {
        setRegion({
          ...region,
          data: region.data.filter((region) => region._id !== deleted._id),
          rows: region.rows - 1,
        });

        dispatch(deleteRegion(deleted._id));

        Swal.fire({
          icon: 'success',
          title: `${deleted.name} berhasil dihapus`,
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
        label="Tambah Wilayah"
        icon={<ImBoxAdd className="text-lg" />}
        size="md"
        onClick={() => navigate('/region/create')}
      />

      <div className="my-5 overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead className="text-xs uppercase">
            <tr>
              <th className="py-3 pr-4" colSpan={2}>
                <input
                  className="w-full appearance-none rounded border py-2 px-3 text-sm leading-tight text-gray-700 shadow focus:outline-none dark:border-[#4B5563] dark:bg-charcoal dark:text-white"
                  placeholder="Masukkan nama wilayah..."
                  name="name"
                  autoComplete="off"
                  autoFocus
                  onKeyUp={changeInputQueries}
                />
              </th>
            </tr>

            <tr className="border-y">
              <th className="w-[60px] whitespace-nowrap px-6 py-3 text-center">No.</th>
              <th className="w-[250px] whitespace-nowrap px-6">Nama Wilayah</th>
              <th className="whitespace-nowrap px-6"></th>
            </tr>
          </thead>
          <tbody>
            {region.data.map((region, i) => (
              <tr
                className={
                  i % 2 === 1 ? 'border-y' : 'border-y bg-neutral-100 dark:bg-transparent'
                }
                key={region._id}
              >
                <td className="whitespace-nowrap px-6 py-3 text-center">
                  {queries.page * queries.limit + (i + 1)}
                </td>
                <td className="whitespace-nowrap px-6">{region.name}</td>
                <td className="whitespace-nowrap px-6 text-right">
                  <Button
                    label="Ubah"
                    outline
                    onClick={() =>
                      navigate(`/region/${region._id}/update`, { state: region })
                    }
                  />
                  <span className="inline-block w-1"></span>
                  <Button
                    label="Hapus"
                    type="danger"
                    outline
                    onClick={() => handleDelete(region)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <p>Total data: {toRupiah(region.rows)}</p>

      {region.rows > 0 && (
        <>
          <p>
            Halaman: {toRupiah(region.page + 1)} dari {toRupiah(region.allPage)} halaman.
          </p>

          <div className="flex justify-end gap-x-2">
            {region.page > 0 && (
              <Button
                label="Sebelumnya"
                icon={<BsArrowLeftShort className="text-xl" />}
                outline
                disabled={getting}
                onClick={() => setQueries({ ...queries, page: region.page - 1 })}
              />
            )}

            {region.page < region.allPage - 1 && (
              <Button
                label="Selanjutnya"
                icon={<BsArrowRightShort className="text-xl" />}
                reverse
                outline
                disabled={getting}
                onClick={() => setQueries({ ...queries, page: region.page + 1 })}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Region;
