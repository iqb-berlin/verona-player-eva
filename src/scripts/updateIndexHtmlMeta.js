const fs = require('fs');
const applicationFolder = `${__dirname}/../../`;
const packageJsonData = JSON.parse(fs.readFileSync(`${applicationFolder}package.json`).toString());

let indexHtmlContent = fs.readFileSync(`${applicationFolder}src/index.html`).toString();

const regexAppNameMatch = /name="application-name"[^]+content="(\S+)"/gi.exec(indexHtmlContent);
let changed = false;
if (regexAppNameMatch[1] !== packageJsonData.name) {
  changed = true;
  indexHtmlContent = indexHtmlContent.replace(`content="${regexAppNameMatch[1]}"`, `content="${packageJsonData.name}"`)
}

const regexAppVersionMatch = /name="application-name"[^]+data-version="(\S+)"/gi.exec(indexHtmlContent);
if (regexAppVersionMatch[1] !== packageJsonData.version) {
  changed = true;
  indexHtmlContent = indexHtmlContent.replace(`data-version="${regexAppVersionMatch[1]}"`, `data-version="${packageJsonData.version}"`)
}

const regexAppRepoMatch = /name="application-name"[^]+data-repository-url="(\S+)"/gi.exec(indexHtmlContent);
if (regexAppRepoMatch[1] !== packageJsonData.repository.url) {
  changed = true;
  indexHtmlContent = indexHtmlContent.replace(`data-repository-url="${regexAppRepoMatch[1]}"`, `data-repository-url="${packageJsonData.repository.url}"`)
}

if (changed) {
  fs.writeFileSync(`${applicationFolder}src/index.html`, indexHtmlContent, 'utf8');
  console.log('index.html changed (application name/version/repo)');
} else {
  console.log('index.html checked (application name/version/repo)');
}
