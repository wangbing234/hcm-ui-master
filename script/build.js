const env = require('./utils');
const child = require('child_process');
const chalk = require('chalk');

const { spawn } = child;

const childProcess = spawn('cross-env', [
  'NODE_ENV=production',
  `DEPLOY_ENV=${env.DEPLOY_ENV}`,
  'webpack',
  '--config',
  'internals/webpack/webpack.prod.babel.js',
  '--color',
  '-p',
  '--progress',
  '--hide-modules',
  '--display-optimization-bailout',
]);

childProcess.stdout.on('data', (data) => {
  process.stdout.write(`stdout: ${data}\n`);
});

childProcess.stderr.on('data', (data) => {
  process.stdout.write(`stderr: ${data}\n`);
});

childProcess.on('close', (code) => {
  let msg = '';
  if (code === 1) {
    msg = `${chalk.red('build fail: ')} child process exited with code ${code}\n`;
  } else {
    msg = `${chalk.green('build success!')}\n`;
  }
  process.stdout.write(msg);
});
