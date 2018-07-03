"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cloneSource;

var _path = require("path");

var _wrote = require("wrote");

var _camelCase = _interopRequireDefault(require("camel-case"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDefaultCreateDate() {
  const d = new Date();
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

async function cloneSource(from, to, {
  org,
  packageName,
  year,
  website,
  issuesUrl = `https://github.com/${org}/${packageName}/issues`,
  readmeUrl = `https://github.com/${org}/${packageName}#readme`,
  authorName,
  authorEmail,
  gitUrl = `git+https://github.com/${org}/${packageName}.git`,
  keywords = [packageName],
  description,
  createDate = getDefaultCreateDate(),
  legalName,
  trademark
} = {}) {
  const keywordsReplacement = keywords.map(k => `"${k}"`).join(', ').replace(/^"/, '').replace(/"$/, '');
  const regexes = [{
    re: /myNewPackage/g,
    replacement: (0, _camelCase.default)(packageName)
  }, {
    re: /(my-new-package|{{ package-name }})/g,
    replacement: packageName
  }, {
    re: /{{ year }}/g,
    replacement: year
  }, {
    re: /{{ org }}/g,
    replacement: org
  }, {
    re: /{{ legal_name }}/g,
    replacement: legalName
  }, {
    re: /{{ trademark }}/g,
    replacement: trademark
  }, {
    re: /{{ website }}/g,
    replacement: website
  }, {
    re: /{{ issues_url }}/g,
    replacement: issuesUrl
  }, {
    re: /{{ readme_url }}/g,
    replacement: readmeUrl
  }, {
    re: /{{ author_name }}/g,
    replacement: authorName
  }, {
    re: /{{ author_email }}/g,
    replacement: authorEmail
  }, {
    re: /{{ keywords }}/g,
    replacement: keywordsReplacement
  }, {
    re: /{{ git_url }}/g,
    replacement: gitUrl
  }, {
    re: /{{ description }}/g,
    replacement: description
  }, {
    re: /{{ create_date }}/g,
    replacement: createDate
  }];
  const res = await (0, _wrote.clone)({
    to,
    from,
    regexes
  });

  try {
    const packageJson = (0, _path.resolve)(to, 'package.json');
    const p = await (0, _wrote.readJSON)(packageJson);
    Object.assign(p, {
      name: packageName,
      description,
      repository: {
        type: 'git',
        url: gitUrl
      },
      keywords,
      author: `${authorName} <${authorEmail}>`,
      bugs: {
        url: issuesUrl
      },
      homepage: readmeUrl
    });
    await (0, _wrote.writeJSON)(packageJson, p, {
      space: 2
    });
  } catch (err) {
    /* no package.json */
  }

  return res;
}
//# sourceMappingURL=clone-source.js.map