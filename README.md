# node-js-ci-cd
![banner](doc/img/unromantic-unsentimental.jpeg)
> Making releases in Node.js projects unromantic and unsentimental since 2021.


This repo encapsulates a [shareable semantic-release configuration](https://semantic-release.gitbook.io/semantic-release/usage/shareable-configurations) for carrying out semantic versioning and release of Node.js/NPM applications. The configs can be overridden in consuming projects, or can be used as is. This package provides sensible defaults, see the `Default Configuration` section for details. One advantage of creating this shareable config is tfhat it reduces the overhead and scaffolding when setting up new Node.js projects. All the configuration and heavy lifting for semantic release has already been done here for you. Plus it helps keep the semantic release process consistent across all projects.

Semantic release relies heavily on [semantic versioning](https://semver.org/), which can be thought of as a common "language" or convention adopted by the Node.js community to communicate and manage dependencies. If you haven't already read [this page](https://semver.org/) to learn more about semantic versioning.

### Pre-requisites
1. ~~Ensure `@exsoinn` NPM scope has been associated with the global NPM registry~~,
   ```shell
   npm config set @exsoinn:registry https://repo.xxxx.com/artifactory/api/npm/npm-local/
   ```
2. :exclamation: _Very important:_ You and your team must adopt Angular style commit message conventions described [here](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit) (see also [this page](https://github.com/semantic-release/semantic-release), search for `Commit message format`). Ensure all your commit messages going forward are formatted according to this guide. If you don't adhere to these commit messages formats then you won't get the expected results. Then also take a look at these [rules](https://github.com/semantic-release/commit-analyzer/blob/master/lib/default-release-rules.js), that determine the release type, which is what then determines the type of bump up in the version (patch or minor or major).

### Install
In your project:
```shell
npm install --save-dev @exsoinn/node-js-ci-cd
```

### Prepare Your Project
1. Create `.releaserc.yml` in the root folder of your project, and add below contents to it:
   ```
   extends: '@exsoinn/node-js-ci-cd'
   branches: ['<target branch>']
   ```
   Replace `<target branch>` with the name of the branch off of which releases will take place, for example `master`.
2. Create an NPM token,
   ```shell
   npm login
   ```
   Running the above will update your `~/.npmrc` file with encrypted credentials that semantic release will use in order to publish your package to the NPM registry.
3. Create a [GitHub personal token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic) if you don't have that already, and set it as an environment variable
   ```shell
   export GH_TOKEN=<your GitHub personal token>
   ```
   This is needed by `@semantic-release/github` to perform GitHub related actions on your behalf.
   

### Running a Release
To do a dry run, which will not actually run the release but show you what would change if you did, run command `npx release-dry-run`.
Once you're happy with the results, you can run the actual release, `npx release`


### Default Configuration
Semantic release works by a running a series of ["steps"](https://github.com/semantic-release/semantic-release) (search for `Release Steps`), with one or more ["plugins"](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/plugins.md) associated with each step. This is loosely similar in concept to [Maven phases and goals](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html#a-build-phase-is-made-up-of-plugin-goals). Below is the list of plugins that we use, the step(s) they're associated with, and the actions they perform. To learn more click on each individual plugin below.
1. [@semantic-release/exec](https://github.com/semantic-release/exec)
    - Step: `verifyConditions`
    - Description: Run unit tests in your project. Unit tests must pass before release can take place.
2. [@semantic-release/commit-analyzer](https://github.com/semantic-release/commit-analyzer)
    - Step: `analyzeCommits`
    - Description: This guy determines the type of release based on the commit message. Hence the reason why it's important to adhere to the commit message format and release rules mentioned earlier, else things won't work as intended.
3. [@semantic-release/release-notes-generator](https://github.com/semantic-release/release-notes-generator)
    - Step: `generateNotes`
    - Description: Generate release notes, which then get include in `CHANGELOG.md` (see below)
4. [@semantic-release/changelog](https://github.com/semantic-release/changelog)
    - Step: `prepare`
    - Description: Create or update `CHANGELOG.md`, including the release notes generated above
5. [@semantic-release/npm](https://github.com/semantic-release/npm)
    - Step:
        * `verifyConditions`: Ensure NPM token exists by logging into npm as described earlier via `npm login...`.
        * `prepare`: Update the version in `package.json` and create the tarball.
        * `publish`: Release the NPM package to the registry.
    - Description: Publishes your NPM package to the registry.
6. [@semantic-release/git](https://github.com/semantic-release/git)
    - Step:
        * `verifyConditions`: Verify access to th Git remote
        * `prepare`: Create a tag in Git with the `CHANGELOG.md` and updated `package.json`.
    - Description: Creates a tag for your project in Git.

### Overriding Configs
In your project's `.releaserc.yml` you can do things like `publish: false`, which would skip/suppress the semantic release altogether, if for example NPM registry publishing does not apply to your project, or you're not ready for that step yet. Similarly you can add/remove plugins associated with a step, simply by redefining that step in your file, for example.

```
...
prepare:
  - path: '@semantic-release/git'
    assets: [ '.releaserc.yml', 'tests', 'lib', '.script' ]
  - path: '@semantic-release/xyz'
    someProp: some Value
...
```
:warning: Semantic release will not merge step plugin definitions, so when redefining steps you need to repeat plugins you want to retain from the default parent config.
   
