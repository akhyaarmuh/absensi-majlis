import Swal from 'sweetalert2';
import { useState } from 'react';

import { restoreDatabase } from '../../fetchers/database';
import { Input, Breadcrumbs, Button } from '../../components';

const breadList = [{ title: 'Beranda', href: '/' }, { title: 'Pulihkan database' }];

const Restore = () => {
  const [uploading, setUploading] = useState(false);
  const [backup, setBackup] = useState('');
  const [error, setError] = useState({ file: '' });

  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    setBackup(file);
    setError({ ...error, file: '' });
  };

  const handleUploadFile = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('backup', backup);
      await restoreDatabase(formData);
      Swal.fire({
        icon: 'success',
        title: `Database telah dipulihkan`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      if (error.response.status === 400)
        setError({ ...error, ...error.response.data.error });
      else console.log(error);
    }

    setUploading(false);
  };

  return (
    <>
      <Breadcrumbs list={breadList} />

      <form onSubmit={handleUploadFile}>
        <Input
          type="file"
          required={true}
          label="File Backup"
          name="file"
          onChange={handleChangeFile}
          errorMessage={error.file}
          disabled={uploading}
        />

        <Button label="Upload File" block disabled={uploading} />
      </form>
    </>
  );
};

export default Restore;
