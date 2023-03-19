const Checkbox = (props) => {
  const { label, name, ...rest } = props;
  return (
    <div className="flex items-start">
      <div className="flex h-5 items-center">
        <input
          {...rest}
          id={name}
          name={name}
          type="checkbox"
          className="mr-2 h-4 w-4 cursor-pointer appearance-none rounded-[.25rem] border border-frenchgray bg-white bg-contain bg-center bg-no-repeat transition duration-200 checked:border-blue-500 checked:bg-blue-500 checked:bg-[url('../svg/check.svg')] focus:outline-none dark:border-[#4B5563] dark:bg-charcoal"
        />
      </div>
      {label && (
        <div className="ml-1 text-sm">
          <label htmlFor={name} className="text-stategray dark:text-frenchgray">
            {label}
          </label>
        </div>
      )}
    </div>
  );
};

export default Checkbox;
