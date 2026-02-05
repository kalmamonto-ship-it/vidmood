// Script to install dependencies
const { exec } = require('child_process');
const fs = require('fs');

console.log('Installing dependencies...');

// Check if node_modules exists
if (!fs.existsSync('./node_modules')) {
  console.log('node_modules directory not found, running npm install...');
  
  const installProcess = exec('npm install', (error, stdout, stderr) => {
    if (error) {
      console.error(`Installation error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    console.log('Dependencies installed successfully!');
  });
  
  installProcess.stdout.on('data', (data) => {
    console.log(data);
  });
  
  installProcess.stderr.on('data', (data) => {
    console.error(data);
  });
} else {
  console.log('node_modules directory already exists.');
}