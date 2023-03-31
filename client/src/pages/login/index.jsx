import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { login } from '../../fetchers/auth';

import googleImage from '../../assets/svg/google.svg';
import registerImage from '../../assets/svg/register.svg';

import { Input, Checkbox, Button } from '../../components';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.form?.pathname || '/';
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState({ email: '', password: '' });

  const handleChangeInput = (e) => {
    const key = e.target.name;

    setErrorMessage({ ...errorMessage, [key]: '' });
    setPayload({ ...payload, [key]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(payload);
      navigate(from, { replace: true });
    } catch (error) {
      if (error.response.status === 400)
        setErrorMessage({ ...errorMessage, ...error.response.data.error });
      else console.log(error);
    }
    setLoading(false);
  };

  return (
    <section id="login-page" className="bg-seasalt dark:bg-richblack">
      <div className="mx-auto grid min-h-screen max-w-7xl py-8 px-4 laptop:grid-cols-2 laptop:gap-20">
        <div className="mx-auto w-full place-self-center rounded-lg bg-white p-6 text-black shadow dark:bg-gunmetal dark:text-white tablet:max-w-xl tablet:p-8">
          <h1 className="mb-4 inline-flex items-center text-right font-['Uthmanic'] text-2xl">
            {process.env.REACT_APP_NAME}
          </h1>
          <h2 className="mb-2 text-2xl font-bold">Selamat datang kembali</h2>
          <p className="text-sm font-light text-stategray dark:text-frenchgray">
            Kelola absensi anda dengan mudah. Belum memiliki akun?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Daftar disini
            </Link>
            .
          </p>

          {/* form */}
          <form className="mt-4 tablet:mt-6" onSubmit={handleLogin}>
            {/* grid system */}
            <div className="grid gap-6 tablet:grid-cols-2">
              <Input
                name="email"
                label="Email"
                type="text"
                placeholder="nama@email.com"
                required={true}
                value={payload.email}
                onChange={handleChangeInput}
                errorMessage={errorMessage.email}
                disabled={loading}
              />
              <Input
                name="password"
                label="Katasandi"
                type="password"
                placeholder="*******"
                required={true}
                value={payload.password}
                onChange={handleChangeInput}
                errorMessage={errorMessage.password}
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
                Masuk dengan Google
              </button>
            </div>

            {/* privasi and policy */}
            <div className="my-6 flex justify-between">
              <Checkbox name="remember_me" label="Ingat saya" />
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Lupa katasandi?
              </Link>
            </div>

            {/* button submit */}
            <Button
              block
              size="md"
              label="Masuk ke akun anda"
              type="submit"
              disabled={loading}
            />
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

export default Login;
