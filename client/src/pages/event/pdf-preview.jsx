import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PDFPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) return navigate('/event');
    window.print();
  }, [location, navigate]);

  return (
    <>
      <h5 className="text-center text-2xl">Data Absen Jamaah</h5>

      <div className="my-5 overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead className="text-xs uppercase">
            <tr className="border-y">
              <th className="whitespace-nowrap px-6 py-3">No. Induk</th>
              <th className="whitespace-nowrap px-6">Nama Lengkap</th>
              <th className="whitespace-nowrap px-6">Bin/binti</th>
              <th className="whitespace-nowrap px-6">Wilayah</th>
            </tr>
          </thead>

          <tbody>
            {location.state.map((member, i) => (
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
    </>
  );
};

export default PDFPreview;
