import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { register } from '../../fetchers/auth';

import googleImage from '../../assets/svg/google.svg';
import registerImage from '../../assets/svg/register.svg';

import { Input, Checkbox, Button } from '../../components';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    full_name: '',
    email: '',
    password: '',
    conf_password: '',
  });
  const [errorMessage, setErrorMessage] = useState({
    full_name: '',
    email: '',
    password: '',
    conf_password: '',
  });

  const handleChangeInput = (e) => {
    const key = e.target.name;
    setErrorMessage({ ...errorMessage, [key]: '' });
    setUser({ ...user, [key]: e.target.value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user.password !== user.conf_password) {
        setLoading(false);
        setErrorMessage({
          ...errorMessage,
          conf_password: 'Katasandi tidak sama',
        });
        return;
      }

      await register(user);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      if (error.response.status === 400)
        setErrorMessage({ ...errorMessage, ...error.response.data.error });
      else console.log(error);
    }
  };

  return (
    <section id="register-page" className="bg-seasalt dark:bg-richblack">
      <div className="mx-auto grid min-h-screen max-w-7xl py-8 px-4 laptop:grid-cols-2 laptop:gap-20">
        <div className="mx-auto w-full place-self-center rounded-lg bg-white p-6 text-black shadow dark:bg-gunmetal dark:text-white tablet:max-w-xl tablet:p-8">
          <a href="/#" className="mb-4 inline-flex items-center text-xl font-semibold">
            NW Dev
          </a>
          <h1 className="mb-2 text-2xl font-bold">Buat akun anda</h1>
          <p className="text-sm font-light text-stategray dark:text-frenchgray">
            Mulai situs web Anda dalam hitungan detik. Sudah memiliki akun?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Masuk disini
            </Link>
            .
          </p>

          {/* form */}
          <form className="mt-4 tablet:mt-6" onSubmit={handleRegistration}>
            {/* grid system */}
            <div className="grid gap-6 tablet:grid-cols-2">
              <Input
                name="full_name"
                label="Nama Lengkap"
                type="text"
                placeholder="Masukan nama lengkap..."
                required={true}
                errorMessage={errorMessage.full_name}
                value={user.full_name}
                onChange={handleChangeInput}
                disabled={loading}
              />
              <Input
                name="email"
                label="Email"
                type="email"
                placeholder="nama@email.com"
                required={true}
                errorMessage={errorMessage.email}
                value={user.email}
                onChange={handleChangeInput}
                disabled={loading}
              />
              <Input
                name="password"
                label="Katasandi"
                type="password"
                placeholder="*******"
                required={true}
                autoComplete="off"
                errorMessage={errorMessage.password}
                value={user.password}
                onChange={handleChangeInput}
                disabled={loading}
              />
              <Input
                name="conf_password"
                label="Konfirmasi Katasandi"
                type="password"
                placeholder="*******"
                required={true}
                autoComplete="off"
                errorMessage={errorMessage.conf_password}
                value={user.conf_password}
                onChange={handleChangeInput}
                disabled={loading}
              />
            </div>

            {/* line break */}
            <div className="mt-6 flex items-center">
              <div className="h-[.125rem] w-full bg-frenchgray dark:bg-stategray "></div>
              <div className="px-5 text-center text-stategray dark:text-stategray ">
                atau
              </div>
              <div className="h-[.125rem] w-full bg-frenchgray dark:bg-stategray "></div>
            </div>

            {/* button login option  */}
            <div className="mt-6">
              <button
                type="button"
                disabled={loading}
                className="mb-2 inline-flex w-full items-center justify-center rounded-lg border border-frenchgray py-[.625rem] px-5 text-sm font-medium transition duration-200 hover:bg-frenchgray/50 disabled:cursor-not-allowed disabled:opacity-75 dark:border-stategray dark:text-[#9CA3AF] dark:hover:bg-charcoal dark:hover:text-white"
              >
                <img
                  src={googleImage}
                  alt="google"
                  className="mr-2 block h-5 w-5 align-middle"
                />
                Daftar dengan Google
              </button>
            </div>

            {/* privasi and policy */}
            <div className="my-6 ">
              <Checkbox
                name="privasi"
                label="Dengan mendaftar, Anda telah membuat akun, dan Anda menyetujui
                    Ketentuan Penggunaan dan Kebijakan Privasi kami."
                required={true}
              />
              <div className="h-3"></div>
              <Checkbox
                name="email_subscribe"
                label="Email saya tentang pembaruan produk dan informasi."
              />
            </div>

            {/* button submit */}
            <Button block size="md" label="Buat akun" type="submit" disabled={loading} />
          </form>
        </div>

        {/* grid child image*/}
        <div className="mr-auto hidden place-self-center laptop:flex">
          <img src={registerImage} alt="register" className="mx-auto max-w-full" />
        </div>
      </div>
    </section>
  );
};

export default Register;
