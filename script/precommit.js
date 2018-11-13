const { exec } = require('child_process');
const _ = require('lodash');
const chalk = require('chalk');

const whiteList = ['goaheadhj@qq.com'];

const configLockFiles = ['config'];

function hasIntersectionInArray(array1, array2) {
  return _.reduce(
    array1,
    (result, a1Item) => {
      return (
        result ||
        _.reduce(
          array2,
          (has, a2Item) => {
            return has || a1Item.indexOf(a2Item) >= 0;
          },
          false
        )
      );
    },
    false
  );
}

function hasFiles(files, lockFiles) {
  return hasIntersectionInArray(files, lockFiles);
}

function checkLockFiles() {
  exec(`git diff HEAD --name-only --diff-filter=ACMR`, (error, stdout) => {
    if (stdout) {
      const diffFiles = stdout.split('\n'); // 通过切割换行，拿到文件列表
      diffFiles.pop(); // 去掉最后一个换行符号
      if (hasFiles(diffFiles, configLockFiles)) {
        printError(diffFiles, configLockFiles);
        process.exit(1);
      }
    }
  });
}

function checkCommitUser(userList) {
  exec(`git config user.email`, (error, stdout) => {
    if (stdout) {
      const emails = stdout.split('\n');
      emails.pop();
      if (!hasIntersectionInArray(userList, emails)) {
        checkLockFiles();
      }
    }
  });
}

function printError(files, lockFiles) {
  process.stdout.write(`${chalk.red(files)} \n${chalk.magenta("has locked files, you can't commit file in")} \n${chalk.magenta(lockFiles)}`);
}

checkCommitUser(whiteList);
