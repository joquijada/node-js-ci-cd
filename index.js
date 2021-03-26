module.exports = {
  branches: ['master'],
  // Put here global configs for all plugins
  parserOpts: {
    noteKeywords: ['BREAKING']
  },
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
    '@semantic-release/exec'
  ],
  verifyConditions: [
    {
      path: '@semantic-release/exec',
      verifyConditionsCmd: 'npm test',
    },
    '@semantic-release/npm',
    '@semantic-release/git'
  ],
  prepare: [
    {
      path: '@semantic-release/changelog',
      changelogTitle: "# Changelog"
    },
    '@semantic-release/npm',
    '@semantic-release/git'
  ],
  //publish: false,
  success: false, // TODO: Slack to notify of success or failure, see if there's a NPM package for that already
  fail: false
}
