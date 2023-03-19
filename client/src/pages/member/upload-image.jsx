import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Breadcrumbs, Button } from '../../components';
import { uploadImage, deleteImageById } from '../../fetchers/member';

const breadList = [
  { title: 'Beranda', href: '/' },
  { title: 'Anggota', href: '/member' },
  { title: 'Upload gambar' },
];

const UploadImage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [errorMessage, setErrorMessage] = useState({ image: '' });

  useEffect(() => {
    if (!location.state) return navigate('/member');
    setImage(location.state.image || '');
  }, [location, navigate]);

  const handleChangeImage = (e) => {
    const image = e.target.files[0];
    setImage(image);
    setPreview(URL.createObjectURL(image));
    setErrorMessage({ ...errorMessage, image: '' });
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', image);
      await uploadImage(location.state._id, formData);

      if (location.state.from === 'create') navigate('/member/create');
      else navigate('/member');
    } catch (error) {
      if (error.response.status === 400)
        setErrorMessage({ ...errorMessage, ...error.response.data.error });
      else console.log(error);
    }

    setUploading(false);
  };

  const handleDeleteImage = async () => {
    setUploading(true);

    try {
      await deleteImageById(location.state._id);
      navigate('/member');
    } catch (error) {
      console.log(error);
    }

    setUploading(false);
  };

  return (
    <>
      <Breadcrumbs list={breadList} />

      <form onSubmit={handleUploadImage}>
        <div className="flex w-full items-center justify-center">
          <label
            htmlFor="image"
            className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            {preview ? (
              <figure className="h-[220px]">
                <img src={preview} alt="preview" className="h-full" />
              </figure>
            ) : image ? (
              <figure className="h-[220px]">
                <img
                  src={`${location.state?.url}/${location.state?.image}`}
                  alt="original"
                  className="h-full"
                />
              </figure>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  aria-hidden="true"
                  className="mb-3 h-10 w-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Klik untuk upload</span> gambar{' '}
                  {`'${location.state?.full_name}'`}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  JPG, JPEG, atau PNG (Maksimal. 5MB)
                </p>
              </div>
            )}

            <input
              id="image"
              onChange={handleChangeImage}
              type="file"
              className="hidden"
            />
          </label>
        </div>

        {errorMessage.image && (
          <span className="mt-3 px-1 text-xs italic text-red-500">
            {errorMessage.image}
          </span>
        )}

        <div className="h-5"></div>

        <Button label="Upload" block size="md" disabled={!preview || uploading} />
      </form>

      {location.state?.image && (
        <>
          <div className="h-2"></div>
          <Button
            label="Hapus"
            type="danger"
            block
            size="md"
            disabled={uploading}
            onClick={handleDeleteImage}
          />
        </>
      )}

      {location.state?.from === 'create' && (
        <>
          <div className="h-2"></div>
          <Button
            label="Lewati"
            type="warning"
            block
            size="md"
            disabled={uploading}
            onClick={() => navigate('/member/create')}
          />
        </>
      )}
    </>
  );
};

export default UploadImage;
