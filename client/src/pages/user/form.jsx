import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Breadcrumbs, Input, Button } from '../../components';

import { createEvent, updateEventById } from '../../fetchers/event';

const forms = [
  {
    type: 'text',
    required: true,
    autoComplete: 'off',
    label: 'Nama / Tempat Kegiatan',
    placeholder: '(nama atau tempat) kegiatan...',
    name: 'name',
  },
  {
    type: 'select',
    required: true,
    label: 'Jenis Kegiatan',
    placeholder: 'Pilih jenis kegiatan...',
    name: 'type',
  },
  {
    type: 'text',
    autoComplete: 'off',
    label: 'Keterangan Kegiatan',
    placeholder: 'Masukan keterangan...',
    name: 'description',
  },
];

const Form = (props) => {
  const { type } = props;
  const breadList = [
    { title: 'Beranda', href: '/' },
    { title: 'Kegiatan', href: '/event' },
    { title: type === 'create' ? 'Buat' : 'Perbarui' },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const [typeEvent, setTypeEvent] = useState([]);
  const [payload, setPayload] = useState({ name: '', type: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState({ name: '', type: '', description: '' });

  useEffect(() => {
    if (type === 'update') {
      if (!location.state) return navigate('/event');
      setPayload(location.state);
      setTypeEvent({ value: location.state.type, label: location.state.type });
    }
  }, [type, location, navigate]);

  useEffect(() => {
    if (!saving) document.querySelector('input[name="name"]').focus();
  }, [saving]);

  const handleChangeInput = (e) => {
    const key = e.target.name;
    setPayload({ ...payload, [key]: e.target.value });
    setError({ ...error, [key]: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (type === 'update') {
        await updateEventById(payload);
        navigate('/event');
      } else {
        await createEvent(payload);
        setPayload({ name: '', type: '', description: '' });
        setTypeEvent([]);
        Swal.fire({
          icon: 'success',
          title: `Kegiatan berhasil dibuat`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      if (error.response.status === 400)
        setError({ ...error, ...error.response.data.error });
      else
        Swal.fire({
          icon: 'error',
          title: error.response?.data?.message || error.message,
          timer: 1500,
          showConfirmButton: false,
        });
    }

    setSaving(false);
  };

  return (
    <>
      <Breadcrumbs list={breadList} />

      <form onSubmit={handleSave}>
        <div className="grid gap-5 tablet:grid-cols-2">
          {forms.map(({ name, ...props }, i) => {
            if (props.type === 'select')
              return (
                <Input
                  key={i}
                  {...props}
                  disabled={saving}
                  name={name}
                  value={typeEvent}
                  errorMessage={error[name]}
                  options={[
                    { value: 'kematian', label: 'Kematian' },
                    { value: 'dzikiran', label: 'Dzikiran' },
                  ]}
                  onChange={(e) => {
                    setTypeEvent(e);
                    setPayload({ ...payload, type: e.value });
                    setError({ ...error, type: '' });
                  }}
                />
              );
            return (
              <Input
                key={i}
                {...props}
                preventEnter
                disabled={saving}
                name={name}
                value={payload[name]}
                errorMessage={error[name]}
                onChange={handleChangeInput}
              />
            );
          })}
        </div>
        <div className="h-5"></div>
        <Button
          label={type === 'create' ? 'Simpan' : 'Perbarui'}
          size="md"
          block
          disabled={saving}
        />
      </form>
    </>
  );
};

export default Form;
