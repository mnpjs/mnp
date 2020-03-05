export {}

/* typal types/index.xml namespace */
/**
 * @typedef {_mnp.Settings} Settings
 * @typedef {Object} _mnp.Settings
 * @prop {string} token The `GitHub` [personal access token](https://github.com/settings/tokens).
 * @prop {string} org The `GitHub` organisation name to create repositories for. For personal accounts, the username should be used.
 * @prop {string} scope The NPM scope with which to create packages.
 * @prop {string} [template="mnpjs/package"] The default template. Default `mnpjs/package`.
 * @prop {string} name The author's name to set in the `package.json` file, and in the project directory's git config (default is looked up in global git config).
 * @prop {string} email The author's email to set in the `package.json` file, and in the project directory's git config (default is looked up in global git config).
 * @prop {string} website The link location in the copyright section of the _README_ file.
 * @prop {string} trademark The display text for the website link in the _README_.
 * @prop {string} legalName The official legal name for placement in the _LICENSE_ file.
 * @prop {string} manager Package manager, such as `yarn` or `npm`.
 */

/**
 * @typedef {Object} Question
 * @prop {boolean} [confirm] Whether this is a confirmation question.
 * @prop {string} [text] The text to show to the user.
 * @prop {(api: API, answer: string|boolean, settings: Object) => Promise<void>} [afterQuestions] Logic to execute after questions are asked.
 */

/**
 * @typedef {(settings: Settings, api: API) => Promise<void>} PreUpdate
 */

/**
 * @typedef {import('../src/lib/api').default} API
 */