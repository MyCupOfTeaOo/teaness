const { execSync } = require('child_process');
const inquirer = require('inquirer');

const fs = require('fs');

inquirer
  .prompt({
    type: 'input',
    message: 'commit',
    name: 'commit',
    default: '版本更新', // 默认值
  })
  .then(answer => {
    console.log('准备构建文档');
    execSync('npm run build:doc', { stdio: 'inherit' });

    console.log('提交到版本库');
    execSync('git add -A', { stdio: 'inherit' });
    execSync(`git commit -m"${answer.commit}"`, { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });

    console.log('finish');
  });
