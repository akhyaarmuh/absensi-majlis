import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { FaUsers, FaMapPin } from 'react-icons/fa';

import Card from './card';
import { toRupiah } from '../../utilities';
import { getAllMember } from '../../fetchers/member';

const Dashboard = () => {
  const regions = useSelector((state) => state.region.data);
  const [members, setMembers] = useState(0);

  useEffect(() => {
    const getAll = async () => {
      try {
        const { rows } = await getAllMember();
        setMembers(rows);
      } catch (error) {
        console.log(error);
      }
    };

    getAll();
  }, []);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-2">
      <Card title="Jumlah Anggota" count={toRupiah(members)} icon={<FaUsers />} />
      <Card
        title="Jumlah Wilayah"
        count={toRupiah(regions.length) || 0}
        icon={<FaMapPin />}
      />
    </div>
  );
};

export default Dashboard;
