import { IoAccessibility } from 'react-icons/io5';

import Card from './card';

const Dashboard = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-2">
      <Card title="Jumlah Anggota" count={1314} icon={<IoAccessibility />} />
    </div>
  );
};

export default Dashboard;
