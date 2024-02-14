module.exports = {
  extends: ['@commitlint/config-angular'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(?:\w+-\d+\s)?(\w*)(?:\((.*)\))?: (.*)$/,
    },
  },
};
