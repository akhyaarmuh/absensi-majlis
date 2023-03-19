import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { verifyPassword } from '../../fetchers/auth';
import { Input, Breadcrumbs, Button } from '../../components';
import { getUserById, updatePasswordById, updateUserById } from '../../fetchers/user';

const breadList = [{ title: 'Beranda', href: '/' }, { title: 'Pengaturan User' }];
const forms = [
  {
    type: 'text',
    required: true,
    autoComplete: 'off',
    label: 'Nama Lengkap',
    placeholder: 'Masukan nama anda...',
    name: 'full_name',
  },
  {
    type: 'email',
    required: true,
    autoComplete: 'off',
    label: 'Email',
    placeholder: 'Masukan email anda...',
    name: 'email',
  },
];
const formsResetPassword = [
  {
    type: 'password',
    required: true,
    autoComplete: 'off',
    label: 'Katasandi',
    placeholder: 'Katasandi...',
    name: 'password',
  },
  {
    type: 'password',
    required: true,
    autoComplete: 'off',
    label: 'Ulangi Katasandi',
    placeholder: 'Ulangi katasandi...',
    name: 'conf_password',
  },
];

const User = () => {
  const idUser = useSelector((state) => state.user._id);
  const [resetPassword, setResetPassword] = useState(false);
  const [saving, setSaving] = useState(true);
  const [user, setUser] = useState({ full_name: '', email: '' });
  const [error, setError] = useState({ full_name: '', email: '' });

  useEffect(() => {
    const getDataUser = async () => {
      if (!resetPassword) {
        try {
          const user = await getUserById(idUser);
          setUser(user);
        } catch (error) {
          console.log(error);
        }
      }else{
        setUser({ password:'',conf_password:''})
      }

      setSaving(false);
    };

    getDataUser();
  }, [idUser, resetPassword]);

  const handleChangeInput = (e) => {
    const key = e.target.name;
    setUser({ ...user, [key]: e.target.value });
    setError({ ...error, [key]: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if(!resetPassword){

        await updateUserById(user);
        Swal.fire({
          icon: 'success',
          title: `Data telah diperbarui`,
          timer: 1500,
          showConfirmButton: false,
        });
      }else{
        await updatePasswordById(idUser, user.password);
        setResetPassword(false)
        Swal.fire({
          icon: 'success',
          title: `Katasandi telah diperbarui`,
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

  const handleChangePassword = () => {
    Swal.fire({
      title: 'Masukkan katasandi anda saat ini',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off',
      },
      confirmButtonText: 'Konfirmasi',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: (password) => {
        return (async () => {
          try {
            await verifyPassword(password);
          } catch (error) {
            Swal.showValidationMessage(error.response?.data?.message || error.message);
          }
        })();
      },
    }).then((res) => {
      if (res.isConfirmed) {
        setResetPassword(true)
      }
    });
  };

  return (
    <>
      <Breadcrumbs list={breadList} />

      <form onSubmit={handleSave}>
        <div className="grid gap-5">
          {!resetPassword ? forms.map(({ name, ...props }, i) => (
            <Input
              key={i}
              {...props}
              preventEnter
              disabled={saving}
              name={name}
              value={user[name]}
              errorMessage={error[name]}
              onChange={handleChangeInput}
            />
          )) : formsResetPassword.map(({ name, ...props }, i) => {
            if(name === 'conf_password')
              return (
                <Input
                  key={i}
                  {...props}
                  pattern={user.password}
                  preventEnter
                  disabled={saving}
                  name={name}
                  value={user[name]}
                  errorMessage={error[name]}
                  onChange={handleChangeInput}
                />
              )
            return (
              <Input
                key={i}
                {...props}
                preventEnter
                disabled={saving}
                name={name}
                value={user[name]}
                errorMessage={error[name]}
                onChange={handleChangeInput}
              />
            )
          }
          )}
          
        </div>
        <div className="h-5"></div>
        <Button label={resetPassword ? "Set Katasandi" : "Simpan"} size="md" disabled={saving} block />
      </form>
      <div className="h-3"></div>
      <Button
        label={resetPassword ? "Batal" : "Ubah Katasandi"}
        type="danger"
        disabled={saving}
        block size="md"
        onClick={resetPassword ? () => setResetPassword(false) : handleChangePassword}
      />
    </>
  );
};

export default User;
