const Card = (props) => {
  const { title, count, percentage, icon } = props;
  return (
    <div className="shadow-soft-xl relative flex justify-between rounded-2xl bg-white bg-clip-border p-4 dark:bg-gunmetal dark:text-frenchgray">
      <div className="self-center px-3">
        <p className="text-sm font-semibold leading-normal">{title}</p>
        <h5 className="font-bold">
          {count}
          <span className="font-weight-bolder text-sm leading-normal text-primary">
            {percentage}
          </span>
        </h5>
      </div>
      <div className="flex items-center px-3 py-4 text-2xl text-primary">{icon}</div>
    </div>
  );
};

export default Card;
