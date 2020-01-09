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
    console.log('准备构建组件');
    execSync('father-build', { stdio: 'inherit' });

    const package = JSON.parse(fs.readFileSync('./package.json'));
    const version = package.version.split('.');
    version[2] = parseInt(version[2]) + 1;
    package.version = version.join('.');
    fs.writeFileSync('./package.json', JSON.stringify(package, null, 2), {
      encoding: 'utf8',
    });
    
    console.log('clean tgz');
    execSync('rimraf ./*tgz', { stdio: 'inherit' });

    console.log('发布');
    execSync('npm pack', { stdio: 'inherit' });
    execSync('npm publish', { stdio: 'inherit' });

    console.log('提交到版本库');
    execSync('git add -A', { stdio: 'inherit' });
    execSync(`git commit -m"${answer.commit}"`, { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });

    console.log('finish');
  });
