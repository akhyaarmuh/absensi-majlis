import Select from 'react-select';

const Input = (props) => {
  const { name, label, errorMessage, preventEnter, type, ...rest } = props;
  if (preventEnter)
    rest.onKeyDown = (e) => {
      if (e.key === 'Enter') e.preventDefault();
    };

  return (
    <div className="flex justify-center">
      {/* desktop:w-96 */}
      <div className="mb-3 w-full">
        {label && (
          <label htmlFor={name} className="mb-2 block text-sm font-medium">
            {label}
          </label>
        )}
        {type === 'select' ? (
          <Select
            id={name}
            name={name}
            className="my-react-select-container"
            classNamePrefix="my-react-select"
            menuPosition="fixed"
            {...rest}
          />
        ) : (
          <input
            {...rest}
            id={name}
            name={name}
            type={type || 'text'}
            className="m-0 block w-full rounded-lg border border-frenchgray bg-white bg-clip-padding p-[.625rem] focus:border-primary focus:outline focus:outline-primary dark:border-[#4B5563] dark:bg-charcoal tablet:text-sm"
          />
        )}

        {errorMessage && (
          <p className="mt-3 px-1 text-xs italic text-red-500">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Input;
