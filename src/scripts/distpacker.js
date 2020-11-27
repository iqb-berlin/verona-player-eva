
// possible improvements:
// - ignore comments when matching regex

const fs = require('fs')
const existsSync = fs.existsSync;
const readFileSync = fs.readFileSync;
const writeFileSync = fs.writeFileSync;

const folderseperator = '/';
const debug = true;

let folder = process.argv[2];

function logDebug(str) {
  if (debug) {
    console.log(str);
  }
}

function base64Encode(file) {
  return readFileSync(file, 'base64');
}

function getExtension(filename) {
  const i = filename.lastIndexOf('.');
  return (i < 0) ? '' : filename.substr(i + 1);
}

/** replace img with base64 in css url */
function replaceUrlInCss(jsString) {
  const regexUrl = /\burl\([^)]+\)/gi; // rebuild regex
  return jsString.replace(regexUrl, (a, b) => {
    console.log('Replacing URL: ', a);
    // skip material icons ?
    if (a.search('#') > -1) {
      return a;
    }
    const regexFile = /\((.*?)\)/ig;
    const src = regexFile.exec(a)[1].replace(/\'/gi, '').replace(/\"/gi, '').replace('./', '');
    const ext = getExtension(src);
    const file = folder + src;
    if (existsSync(file)) {
      const base64Str = base64Encode(file);
      return `url(data:image/${ext};base64,${base64Str})`; // ATTENTION with " & '
    }
    logDebug(`file ${file} not found. Skipping replacement.`);
    return a;
  });
}

/** replace img with base64 in img-tags with src-attribute */
function replaceLinkedAssetsInJS(jsString) {
  // RH: old variant. Prefixes "asstes" with "./". Dont know why.
  // const regexAssets = /['|"]\.\/assets(.*?)['|"]/gi;
  const regexAssets = /['|"]assets(.*?)['|"]/gi;
  return jsString.replace(regexAssets, (a, b) => {
    logDebug(`Replacing linked assets in JS: ${a}`);

    const firstSign = a[0];
    const src = a.replace(/\'/gi, "").replace(/\"/gi, "").replace("./", "");
    const ext = getExtension(b);

    try {
      const file = folder + src;
      if (existsSync(file)) {
        const base64Str = base64Encode(folder + src);
        if (firstSign === '"') {
          return '"data:image/' + ext + ';base64,' + base64Str + '"'; // ATTENTION with " & '
        }
        return "'data:image/" + ext + ";base64," + base64Str + "'"; // ATTENTION with " & '
      }
      return a;
    } catch (e) {
      logDebug('error in replaceLinkedAssetsInJS');
      logDebug(e);
      return a;
    }
  });
}

function replaceFavicon(htmlString) {
  const regexCss = /<link.*href="(.*?.ico)".*?>/gi;
  return htmlString.replace(regexCss, (a, b) => {
    const file = folder + b;
    logDebug(`Replacing favicon: ${file}`);
    const base64Str = base64Encode(file);
    return `<link type="image/x-icon" href="data:image/x-icon;base64,${base64Str}" />`;
  });
}

/** replace existing link-tags with manipulated style-tags */
function replaceCSSLinks(htmlString) {
  const regexCss = /<link.*href="(.*?.css)".*?>/gi;
  return htmlString.replace(regexCss, (a, b) => {
    let cssString = readFileSync(folder + b, 'utf8').toString();
    logDebug(`Replacing CSS: ${a}`);
    cssString = replaceUrlInCss(cssString);
    return `<style>${cssString}</style>`;
  });
}

/** replace existing script-tags (linked) with manipulated script-tags (embedded) */
function replaceScriptTags(htmlString) {
  // RH: Changed regex to exclude script content without src attribute, i.e. real code
  // const regexJS = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gim;
  const regexJS = /<script\s*.*?<\/script>/gim;
  return htmlString.replace(regexJS, (a, b) => {
    console.log('Replacing Script Tag: ', a);
    const regexSRC = /src="(.*?)"/ig; // Attention, global declaration is wrong, because of pointer
    const filename = regexSRC.exec(a)[1];
    let fileContent = readFileSync(folder + filename, 'utf8').toString();
    fileContent = replaceUrlInCss(fileContent); // first because works with url-pattern
    fileContent = replaceLinkedAssetsInJS(fileContent);
    return "<script type='text/javascript'>" + fileContent + "\n" + "</script>";
  });
}

// /** Replace the base tag <base href="/"> with a dynmaic value based on the
// location of the document */
function replaceBaseHREF(htmlString) {
  const regexJS = /<base href="\/">/gim;
  return htmlString.replace(regexJS, (a, b) => {
    console.log('Replacing Base Href: ', a);
    return "<script>document.write('<base href=\"' + document.location + '\" />');</script>";
  });
}

if (!folder.endsWith(folderseperator)) {
  folder += folderseperator;
}

console.log(`run iqb-distpacker in ${folder}`);

let htmlString = readFileSync(`${folder}index.html`, 'utf8').toString();

htmlString = replaceFavicon(htmlString);
htmlString = replaceCSSLinks(htmlString);
htmlString = replaceScriptTags(htmlString);

htmlString = replaceBaseHREF(htmlString);

// write new index.html
writeFileSync(`${folder}index_packed2.html`, htmlString, 'utf8');
console.log(`finished, wrote packed index_packed2.html to:${folder}`);
