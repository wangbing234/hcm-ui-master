const OSS = require('ali-oss');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');

const rootDir = path.resolve(__dirname, '../build');
const client = new OSS(env.ossConfig);

async function getAllFiles(bucket) {
  client.useBucket(bucket);
  const result = await client.list({
    'max-keys': 1000,
  });
  return result.objects || [];
}

async function cleanOSS(bucket) {
  try {
    const files = await getAllFiles(bucket);
    const filenames = files.map(file => {
      return file.name;
    });
    const result = await client.deleteMulti(filenames);
    return result;
  } catch (err) {
    return err;
  }
}

async function putFiles(files) {
  return Object.keys(files).map(async filename => {
    const result = await client.put(filename, files[filename]);
    return result;
  });
}

function generateAssetFiles(rootPath, filePath = rootPath, assetFiles = {}) {
  const abPath = path.resolve(filePath);
  if (isDir(abPath)) {
    return fs.readdirSync(abPath).reduce((result, basename) => {
      return generateAssetFiles(rootPath, path.resolve(abPath, basename), result);
    }, assetFiles);
  } else {
    return Object.assign(assetFiles, {
      [path.relative(rootPath, abPath)]: abPath,
    });
  }
}

function isDir(file) {
  const stats = fs.statSync(file);
  return stats.isDirectory();
}

async function deployDistToOSS() {
  await cleanOSS(env.ossConfig.bucket);
  const assetFiles = generateAssetFiles(rootDir);
  await putFiles(assetFiles);
}

deployDistToOSS();
