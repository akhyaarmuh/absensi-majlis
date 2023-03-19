import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Breadcrumbs, Input, Button } from '../../components';

import { setRegion } from '../../features/region';

import { createRegion, updateRegionById, getAllRegion } from '../../fetchers/region';

const Form = (props) => {
  const { type } = props;
  const breadList = [
    { title: 'Beranda', href: '/' },
    { title: 'Wilayah', href: '/region' },
    { title: type === 'create' ? 'Buat' : 'Perbarui' },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState({ name: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState({ name: '' });

  useEffect(() => {
    if (type === 'update') {
      if (!location.state) return navigate('/region');
      setPayload(location.state);
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
        await updateRegionById(payload);
        const { data } = await getAllRegion({ sort: 'name' });
        dispatch(setRegion(data.map((reg) => ({ value: reg._id, label: reg.name }))));
        navigate('/region');
      } else {
        const newRegion = await createRegion(payload);
        const { data } = await getAllRegion({ sort: 'name' });
        dispatch(setRegion(data.map((reg) => ({ value: reg._id, label: reg.name }))));
        setPayload({ name: '' });
        Swal.fire({
          icon: 'success',
          title: `${newRegion.name} berhasil dibuat`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      if (error.response.status === 400)
        setError({ ...error, ...error.response.data.error });
      else console.log(error);
    }

    setSaving(false);
  };

  return (
    <>
      <Breadcrumbs list={breadList} />

      <form onSubmit={handleSave}>
        <Input
          required={true}
          disabled={saving}
          autoComplete="off"
          label="Nama Wilayah"
          placeholder="Masukkan nama wilayah baru..."
          name="name"
          value={payload.name}
          errorMessage={error.name}
          onChange={handleChangeInput}
        />
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
