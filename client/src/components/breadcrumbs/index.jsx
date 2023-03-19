import { Link } from 'react-router-dom';

const Breadcrumbs = (props) => {
  const { list = [] } = props;

  return (
    <ol className="mb-5 flex">
      {list.map((li, i) => {
        if (i === list.length - 1)
          return (
            <li className="text-neutral-400 dark:text-neutral-500" key={i}>
              {li.title}
            </li>
          );

        return (
          <li key={i}>
            <Link to={li.href} className="text-primary hover:underline">
              {li.title}
            </Link>
            <span className="mx-1 text-neutral-400 dark:text-neutral-500">&gt;</span>
          </li>
        );
      })}
    </ol>
  );
};

export default Breadcrumbs;
