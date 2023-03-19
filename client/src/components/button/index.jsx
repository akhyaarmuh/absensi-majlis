const getColor = (color, outline) => {
  let theme = '';
  switch (color) {
    case 'danger':
      theme = outline
        ? 'border border-red-500 text-red-500 hover:shadow-red-500 hover:text-white'
        : 'bg-red-500 text-white';
      break;
    case 'success':
      theme = outline
        ? 'border border-green-500 text-green-500 hover:shadow-green-500 hover:text-white'
        : 'bg-green-500 text-white';
      break;
    case 'warning':
      theme = outline
        ? 'border border-orange-500 text-orange-500 hover:shadow-orange-500 hover:text-white'
        : 'bg-orange-500 text-white';
      break;

    default:
      theme = outline
        ? 'border border-primary text-primary hover:shadow-primary hover:text-white'
        : 'bg-primary text-white';
      break;
  }

  return theme;
};

const getSize = (size) => {
  let theme = '';
  switch (size) {
    case 'md':
      theme = 'rounded-lg text-sm p-2 gap-2';
      break;
    case 'lg':
      theme = 'rounded-lg text-sm p-3 gap-2';
      break;

    default:
      theme = 'rounded-md text-xs p-1 gap-1';
      break;
  }

  return theme;
};

const Button = (props) => {
  const { label, outline, size, type, block, icon, children, reverse, ...rest } = props;
  const colorSelected = getColor(type, outline);
  const sizeSelected = getSize(size);

  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center font-medium transition duration-200 hover:shadow-[0_0_0_30px_rgba(0,0,0,.15)_inset] disabled:cursor-not-allowed disabled:opacity-75 ${colorSelected} ${sizeSelected}${
        block ? ' w-full' : ''
      }${reverse ? ' flex-row-reverse' : ''}`}
    >
      {children}
      {icon && icon}
      {label || 'label'}
    </button>
  );
};

export default Button;
