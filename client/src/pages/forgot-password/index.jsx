import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPassword } from '../../fetchers/auth';
import registerImage from '../../assets/svg/register.svg';
import { Input, Checkbox, Button } from '../../components';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({ email: '' });

  const handleChangeInput = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(payload);
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <section id="forgot_password-page" className="bg-seasalt dark:bg-richblack">
      <div className="mx-auto grid min-h-screen max-w-7xl py-8 px-4 laptop:grid-cols-2 laptop:gap-20">
        <div className="mx-auto w-full place-self-center rounded-lg bg-white p-6 text-black shadow dark:bg-gunmetal dark:text-white tablet:max-w-xl tablet:p-8">
          <h1 className="mb-4 inline-flex items-center text-right font-['Uthmanic'] text-2xl">
            {process.env.REACT_APP_NAME}
          </h1>
          <h2 className="mb-2 text-2xl font-bold">Tidak ingat katasandi?</h2>
          <p className="text-sm font-light text-stategray dark:text-frenchgray">
            Jangan khawatir! Cukup ketik email Anda dan kami akan mengirimkan kode untuk
            mengatur ulang katasandi Anda!
          </p>

          {/* form */}
          <form className="mt-4 tablet:mt-6" onSubmit={handleReset}>
            {/* grid system */}
            <div className="grid gap-6 tablet:grid-cols-2">
              <Input
                name="email"
                label="Email"
                type="email"
                placeholder="nama@email.com"
                required={true}
                disabled={loading}
                onChange={handleChangeInput}
              />
            </div>

            {/* privasi and policy */}
            <div className="my-6 flex justify-between">
              <Checkbox
                name="term"
                label="Saya menerima syarat dan ketentuan yang berlaku"
                required={true}
              />
            </div>

            {/* button submit */}
            <Button
              block
              size="md"
              label="Setel ulang katasandi"
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

export default ForgotPassword;
