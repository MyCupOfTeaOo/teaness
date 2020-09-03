const fs = require('fs');
const signale = require('signale');

signale.config({
  displayFilename: true,
  displayTimestamp: true,
});

const path = require('path');
if (fs.existsSync(path.resolve(__dirname, './pushDoc.local.js'))) {
  signale.pending('发现本地脚本,执行');
  require('./pushDoc.local');
}
