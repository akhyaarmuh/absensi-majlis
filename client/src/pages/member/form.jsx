import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { parseDate } from '../../utilities';
import { Breadcrumbs, Input, Button } from '../../components';

import { createMember, updateMemberById } from '../../fetchers/member';

const forms = [
  {
    type: 'text',
    required: true,
    autoComplete: 'off',
    label: 'Nomor Induk',
    placeholder: 'Masukan no. induk...',
    name: 'no_induk',
  },
  {
    type: 'text',
    required: true,
    autoComplete: 'off',
    label: 'Nama Lengkap',
    placeholder: 'Masukan nama anggota...',
    name: 'full_name',
  },
  {
    type: 'text',
    required: true,
    autoComplete: 'off',
    label: 'Nama Orangtua',
    placeholder: 'Masukan nama orangtua...',
    name: 'parent_name',
  },
  {
    type: 'date',
    required: true,
    autoComplete: 'off',
    label: 'Tanggal Lahir',
    placeholder: 'Masukan tanggal lahir...',
    name: 'birth',
  },
  {
    type: 'select',
    required: true,
    label: 'Wilayah',
    placeholder: 'Masukan wilayah...',
    name: 'region',
  },
  {
    type: 'text',
    required: true,
    autoComplete: 'off',
    label: 'Alamat Lengkap',
    placeholder: 'Masukan alamat...',
    name: 'address',
  },
];

const Form = (props) => {
  const { type } = props;
  const breadList = [
    { title: 'Beranda', href: '/' },
    { title: 'Anggota', href: -1 },
    { title: type === 'create' ? 'Buat' : 'Perbarui' },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const regions = useSelector((state) => state.region.data);
  const [region, setRegion] = useState([]);
  const [payload, setPayload] = useState({
    no_induk: '',
    full_name: '',
    birth: '',
    parent_name: '',
    address: '',
    region: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState({
    no_induk: '',
    full_name: '',
    birth: '',
    parent_name: '',
    address: '',
    region: '',
  });

  useEffect(() => {
    if (type === 'update') {
      if (!location.state) return navigate('/member');
      const { year, monthWithZero, dateWithZero } = parseDate(location.state.birth);
      setPayload({
        ...location.state,
        region: location.state.region._id,
        birth: `${year}-${monthWithZero}-${dateWithZero}`,
      });
      setRegion({ value: location.state.region._id, label: location.state.region.name });
    }
  }, [type, location, navigate]);

  useEffect(() => {
    if (!saving) document.querySelector('input[name="no_induk"]').focus();
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
        await updateMemberById(payload);
        navigate(-1);
      } else {
        const newMember = await createMember(payload);
        Swal.fire({
          icon: 'success',
          title: `${newMember.full_name} berhasil dibuat`,
          timer: 1500,
          showConfirmButton: false,
        });

        // navigate upload image
        navigate(`/member/${newMember._id}/upload-image`, {
          state: { ...newMember, from: 'create' },
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
        <div className="grid gap-5 tablet:grid-cols-2">
          {forms.map(({ name, ...props }, i) => {
            if (props.type === 'select')
              return (
                <Input
                  key={i}
                  {...props}
                  disabled={saving}
                  name={name}
                  value={region}
                  errorMessage={error[name]}
                  options={regions}
                  onChange={(e) => {
                    setRegion(e);
                    setPayload({ ...payload, region: e.value });
                    setError({ ...error, region: '' });
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
          block
          size="md"
          disabled={saving}
          label={type === 'create' ? 'Simpan' : 'Perbarui'}
        />
      </form>

      {type === 'update' && (
        <>
          <div className="h-2"></div>
          <Button
            block
            size="md"
            type="success"
            disabled={saving}
            label="Upload Gambar"
            onClick={() =>
              navigate(`/member/${payload._id}/upload-image`, {
                state: { ...payload, from: 'update' },
              })
            }
          />
        </>
      )}
    </>
  );
};

export default Form;
