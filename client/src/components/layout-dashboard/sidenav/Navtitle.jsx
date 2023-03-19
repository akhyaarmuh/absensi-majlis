import { useSelector } from 'react-redux';

const Navtitle = ({ title }) => {
  const sidenav = useSelector((state) => state.tailwind.openSidenav);

  return (
    <h3
      className={`${
        sidenav ? 'block ' : 'hidden '
      }mb-2 mt-4 whitespace-nowrap pl-[10px] text-sm`}
    >
      {title}
    </h3>
  );
};

export default Navtitle;
