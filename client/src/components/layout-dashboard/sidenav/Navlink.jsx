import { Link } from 'react-router-dom';

const Navlink = (props) => {
  const { icon, to, title, active } = props;

  return (
    <Link to={to}>
      <li
        className={`${
          active
            ? "pointer-events-none rounded-l-[30px] bg-seasalt text-primary before:absolute before:right-0 before:-top-[50px] before:h-[50px] before:w-[50px] before:rounded-full before:bg-transparent before:shadow-[35px_35px_0_10px] before:shadow-seasalt before:content-[''] after:absolute after:right-0 after:-bottom-[50px] after:h-[50px] after:w-[50px] after:rounded-full after:bg-transparent after:shadow-[35px_-35px_0_10px] after:shadow-seasalt after:content-[''] dark:bg-richblack dark:before:shadow-richblack dark:after:shadow-richblack "
            : 'z-10 '
        }relative flex h-[50px] items-center transition-all duration-100 hover:ml-[10px]`}
      >
        <span className="inline-flex w-[60px] flex-none justify-center text-xl">
          {icon}
        </span>
        <p className="flex h-full flex-1 items-center whitespace-nowrap px-[10px] text-lg font-light">
          {title}
        </p>
      </li>
    </Link>
  );
};

export default Navlink;
