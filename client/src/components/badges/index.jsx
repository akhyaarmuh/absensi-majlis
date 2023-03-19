const getColor = (color) => {
  let theme = '';
  switch (color) {
    case 'danger':
      theme = 'bg-[#FAE5E9] text-[#B0233A]';
      break;
    case 'success':
      theme = 'bg-[#D6FAE4] text-[#0E7537]';
      break;
    case 'warning':
      theme = 'bg-[#FBF2DE] text-[#825C0F]';
      break;

    default:
      theme = 'bg-[#E7F4F9] text-[#236D86]';
      break;
  }

  return theme;
};

const Badges = (props) => {
  const { type, label } = props;
  const colorSelected = getColor(type);

  return (
    <span
      className={`${colorSelected} inline-block whitespace-nowrap rounded-full  px-[0.65em] pt-[0.35em] pb-[0.25em] text-center align-baseline text-[0.75em] font-bold leading-none`}
    >
      {label || 'label'}
    </span>
  );
};

export default Badges;
