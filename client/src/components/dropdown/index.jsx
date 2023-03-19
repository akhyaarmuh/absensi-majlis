import { useState } from 'react';

const Dropdown = (props) => {
  const { children, list = [] } = props;
  const [menu, setMenu] = useState(false);

  return (
    <div className="relative" onClick={() => setMenu(!menu)}>
      <button className="flex items-center justify-center">{children}</button>
      <ul
        className={`${
          menu ? 'block' : 'hidden'
        } absolute right-0 z-50 float-left m-0 mt-1 min-w-[100px] list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding py-1 shadow-lg dark:bg-charcoal`}
      >
        {list.map((li, i) => (
          <li
            key={i}
            className="block w-full cursor-pointer whitespace-nowrap bg-transparent py-2 px-4 text-sm font-normal text-gray-700 hover:bg-gray-100 dark:text-seasalt dark:hover:bg-gray-600"
            {...li}
          >
            {li.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
