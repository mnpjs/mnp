"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = request;
exports.createRepository = createRepository;
exports.starRepository = starRepository;
exports.deleteRepository = deleteRepository;

var _rqt = _interopRequireDefault(require("rqt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function request({
  data,
  token,
  method,
  u
}) {
  const h = {
    Authorization: `token ${token}`,
    'User-Agent': 'Mozilla/5.0 mnp Node.js'
  };
  const url = `https://api.github.com/${u}`;
  const {
    body,
    headers
  } = await (0, _rqt.default)(url, {
    headers: h,
    data,
    method,
    returnHeaders: true
  });

  if (Array.isArray(body.errors)) {
    const reduced = body.errors.reduce((acc, error) => {
      const errMsg = `${error.resource}: ${error.message}`;
      return `${errMsg}\n${acc}`;
    }, '').trim();
    throw new Error(reduced);
  } else if (body.message == 'Bad credentials') {
    throw new Error(body.message);
  }

  return {
    body,
    headers
  };
}
/**
 * Create a new github repository.
 * @param {string} token github access token
 * @param {string} name Name of the new package and directory to create
 * @param {string} [org] Organisation
 * @param {string} [description] Description for github
 */


async function createRepository(token, name, org, description) {
  const u = `${org ? `orgs/${org}` : 'user'}/repos`;
  const {
    body
  } = await request({
    data: {
      description,
      name,
      auto_init: true,
      gitignore_template: 'Node',
      license_template: 'mit'
    },
    token,
    u
  });
  return body;
}

async function starRepository(token, name, org) {
  const u = `user/starred/${org}/${name}`;
  const {
    headers
  } = await request({
    token,
    u,
    method: 'PUT',
    data: {}
  });

  if (headers.status != '204 No Content') {
    console.log('Could not star the %s/%s repository', org, name);
  }
}

async function deleteRepository(token, name, org) {
  const u = `repos/${org}/${name}`;
  const {
    headers,
    body
  } = await request({
    token,
    u,
    method: 'DELETE',
    data: {}
  });

  if (headers.status != '204 No Content') {
    throw new Error(`Could not delete ${org}/${name}: ${body.message}.`);
  }
}
//# sourceMappingURL=github.js.map