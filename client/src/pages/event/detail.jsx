import Select from 'react-select';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import { Breadcrumbs, Button } from '../../components';

const breadList = [
  { title: 'Beranda', href: '/' },
  { title: 'Kegiatan', href: '/event' },
  { title: 'Anggota tidak hadir' },
];

const filtering = (members, queries) => {
  let filtered = members;

  if (queries.no_induk) {
    const singleData = filtered.find((member) => member.no_induk === queries.no_induk);
    filtered = singleData ? [singleData] : [];
  }

  if (queries.full_name)
    filtered = filtered.filter((member) =>
      member.full_name.toLowerCase().includes(queries.full_name)
    );

  if (queries.region)
    filtered = filtered.filter((member) => member.region._id === queries.region);

  return filtered;
};

const Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const regions = useSelector((state) => state.region.data);
  const attendance = location.state.attendance || 0;
  const [members] = useState(location.state.absent || []);
  const [allPage, setAllPage] = useState(0);
  const [show, setShow] = useState([]);
  const [queries, setQueries] = useState({
    no_induk: '',
    full_name: '',
    region: '',
    page: 0,
  });

  useEffect(() => {
    if (!location.state) return navigate('/event');
  }, [location, navigate]);

  useEffect(() => {
    const filtered = filtering(members, queries);
    console.log(filtered);

    setAllPage(Math.ceil(filtered.length / 20));
    setShow(filtered.slice(queries.page * 20, queries.page * 20 + 20));
  }, [queries, members]);

  const changeInputQueries = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (e.key === 'Enter' || (value === '' && queries[name] !== ''))
      setQueries({ ...queries, [name]: value, page: 0 });
  };

  const handlePrintPDF = async () => {
    // const { data } = await getAllMember({
    //   absent: location.state._id,
    //   region: queries.region,
    //   sort: 'region full_name',
    // });
    const filtered = filtering(members, queries);

    navigate(`/event/${location.state._id}/pdf-preview`, { state: filtered });
  };

  return (
    <>
      <Breadcrumbs list={breadList} />

      <Button
        label="Download PDF"
        icon={<AiOutlineFilePdf className="text-lg" />}
        size="md"
        onClick={handlePrintPDF}
      />

      {/* table */}
      <div className="my-5 overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead className="text-xs uppercase">
            <tr>
              <th className="min-w-[185px] py-3 pr-4">
                <input
                  className="w-full appearance-none rounded border py-2 px-3 text-sm leading-tight text-gray-700 shadow focus:outline-none dark:border-[#4B5563] dark:bg-charcoal dark:text-white"
                  placeholder="Masukkan no. induk..."
                  name="no_induk"
                  autoComplete="off"
                  autoFocus
                  onKeyUp={changeInputQueries}
                />
              </th>
              <th className="pr-4">
                <input
                  className="w-full appearance-none rounded border py-2 px-3 text-sm leading-tight text-gray-700 shadow focus:outline-none dark:border-[#4B5563] dark:bg-charcoal dark:text-white"
                  placeholder="Masukkan nama anggota..."
                  name="full_name"
                  autoComplete="off"
                  onKeyUp={changeInputQueries}
                />
              </th>

              <th></th>
              <th className="min-w-[190px] pr-4">
                <Select
                  className="my-react-select-container"
                  classNamePrefix="my-react-select"
                  menuPosition="fixed"
                  placeholder="Semua wilayah..."
                  name="region"
                  isClearable
                  options={regions}
                  onChange={(e) =>
                    setQueries({ ...queries, region: e?.value || '', page: 0 })
                  }
                />
              </th>
            </tr>

            <tr className="border-y">
              <th className="whitespace-nowrap px-6 py-3">No. Induk</th>
              <th className="whitespace-nowrap px-6">Nama Lengkap</th>
              <th className="whitespace-nowrap px-6">Bin/binti</th>
              <th className="whitespace-nowrap px-6">Wilayah</th>
            </tr>
          </thead>

          <tbody>
            {show.map((member, i) => (
              <tr
                className={
                  i % 2 === 1 ? 'border-y' : 'border-y bg-neutral-100 dark:bg-transparent'
                }
                key={member._id}
              >
                <td className="whitespace-nowrap px-6 py-3">{member.no_induk}</td>
                <td className="whitespace-nowrap px-6">{member.full_name}</td>
                <td className="whitespace-nowrap px-6">{member.parent_name}</td>
                <td className="whitespace-nowrap px-6">{member.region.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <p>Total tidak hadir: {members.length}</p>
      <p>Total hadir: {attendance}</p>

      {show.length > 0 && (
        <>
          <p>
            Halaman : {queries.page + 1} dari {allPage} halaman.
          </p>

          <div className="flex justify-end gap-x-2">
            {queries.page > 0 && (
              <Button
                label="Sebelumnya"
                icon={<BsArrowLeftShort className="text-xl" />}
                outline
                onClick={() => setQueries({ ...queries, page: queries.page - 1 })}
              />
            )}

            {queries.page < allPage - 1 && (
              <Button
                label="Selanjutnya"
                icon={<BsArrowRightShort className="text-xl" />}
                reverse
                outline
                onClick={() => setQueries({ ...queries, page: queries.page + 1 })}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Detail;
