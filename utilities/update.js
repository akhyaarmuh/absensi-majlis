import readline from 'readline/promises';
import { spawn, execSync } from 'child_process';
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({ input, output });
const spawnPromise = async (command, options = []) => {
  const child = spawn(command, options);

  let data = '';
  for await (const chunk of child.stdout) {
    console.log(chunk.toString());
    data += chunk;
  }

  let error = '';
  for await (const chunk of child.stderr) {
    console.log('Error: ' + chunk.toString());
    error += chunk;
  }

  const exitCode = await new Promise((resolve) => {
    child.on('close', resolve);
  });

  if (exitCode) {
    throw new Error(`Subprocess error exit ${exitCode}, ${error}`);
  }

  return data;
};

const isUpdate = await rl.question(
  `UPDATE APLIKASI\nPastikan anda terhubung jaringan internet\nTulis Y kemudian tekan Enter jika anda ingin melanjutkan : `
);

if (isUpdate === 'Y') {
  try {
    await spawnPromise('git', ['fetch']);
    await spawnPromise('git', ['pull']);
    console.log('Silakan tunggu beberapa saat...');
    execSync('npm run re-install');

    console.log('\n***************');
    console.log('Update berhasil');
    await rl.question('***************');
  } catch (error) {
    console.log(error);
    console.log('\n************');
    console.log('Update gagal');
    await rl.question('************');
  }
} else {
  console.log('\n**************************');
  console.log('Update berhasil dibatalkan');
  await rl.question('**************************');
}

rl.close();
