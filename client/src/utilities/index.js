export const parseDate = (waktu) => {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const objDate = new Date(waktu);

  const year = objDate.getFullYear();
  const month = objDate.getMonth();
  const date = objDate.getDate();
  const hour = objDate.getHours();
  const minute = objDate.getMinutes();
  const second = objDate.getSeconds();

  const monthString = months[month];
  const dayString = days[objDate.getDay()];

  const monthWithZero = month + 1 < 10 ? `0${month + 1}` : month + 1;
  const dateWithZero = date < 10 ? `0${date}` : date;
  const hourWithZero = hour < 10 ? `0${hour}` : hour;
  const minuteWithZero = minute < 10 ? `0${minute}` : minute;
  const secondWithZero = second < 10 ? `0${second}` : second;

  return {
    year,
    month,
    date,
    hour,
    minute,
    second,

    monthString,
    dayString,

    monthWithZero,
    dateWithZero,
    hourWithZero,
    minuteWithZero,
    secondWithZero,
  };
};
