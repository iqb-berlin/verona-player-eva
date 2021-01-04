// packing player files to one

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const { readFileSync } = fs;
const { writeFileSync } = fs;

const applicationFolder = `${__dirname}/../../`;
const args = process.argv;
const sourceFolder = `${applicationFolder}dist/${args[2]}/`;
const targetFileNameJs = `${applicationFolder}src/app/${args[2]}/${args[2]}.js`;
const targetFileNameCss = `${applicationFolder}src/app/${args[2]}/${args[2]}.css`;
let fileContentJs = '';
let fileContentCss = '';

fs.readdirSync(sourceFolder).forEach((file) => {
  const i = file.lastIndexOf('.');
  if (i > 0) {
    const fileExtension = file.substr(i + 1);
    if (fileExtension.toLowerCase() === 'css') {
      const fileContent = readFileSync(`${sourceFolder}${file}`, 'utf8').toString();
      console.log(`reading ${file}`);
      fileContentCss += fileContent;
    } else if (fileExtension.toLowerCase() === 'js') {
      const fileContent = readFileSync(`${sourceFolder}${file}`, 'utf8').toString();
      console.log(`reading ${file}`);
      fileContentJs += fileContent;
    }
  }
});

if (fileContentCss) {
  writeFileSync(targetFileNameCss, fileContentCss, 'utf8');
  console.log(`writing ${targetFileNameCss}`);
}
if (fileContentJs) {
  writeFileSync(targetFileNameJs, fileContentJs, 'utf8');
  console.log(`writing ${targetFileNameJs}`);
}
console.log('finished');
