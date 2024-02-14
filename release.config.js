const branch = process.env.GO_MATERIAL_BRANCH_GIT;

const config = {
  branches: [
    // { name: '2.x', range: '2.x', channel: 'swipejobs' }, // Only after the `2.x` is created in the repo
    { name: 'develop' },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        parserOpts: {
          headerPattern: /^(?:\w+-\d+\s)?(\w*)(?:\((.*)\))?: (.*)$/,
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'angular',
        parserOpts: {
          headerPattern: /^(?:\w+-\d+\s)?(\w*)(?:\((.*)\))?: (.*)$/,
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
        writerOpts: {
          commitsSort: ['subject', 'scope'],
        },
      },
    ],
  ],
};

const sem_npm = [
  '@semantic-release/npm',
  {
    npmPublish: true,
    tarballDir: 'sync',
  },
];

const sem_exec = [
  '@semantic-release/exec',
  {
    successCmd: 'aws s3 sync --exclude "*" --include "*.tgz" ./sync/ s3://verda-mig-autosync-test/',
  },
];

const sem_slack = [
  'semantic-release-slack-bot',
  {
    notifyOnSuccess: true,
    notifyOnFail: true,
    markdownReleaseNotes: true,
  },
];

if (branch === 'develop') {
  changelogFilename = 'CHANGELOG.md';
  git_assets = [changelogFilename, 'package.json', 'package-lock.json'];
}

config.plugins.push(
  [
    '@semantic-release/changelog',
    {
      changelogFile: changelogFilename,
    },
  ],
  sem_npm,
  // '@semantic-release/npm',
  [
    '@semantic-release/git',
    {
      assets: git_assets,
    },
  ],
  sem_slack,
  sem_exec,
);

// console.log(JSON.stringify(config, null, ' '))

module.exports = config;
