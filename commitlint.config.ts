export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // new feature
        'fix', // bug fix
        'docs', // documentation
        'style', // code style
        'refactor', // refactor
        'perf', // performance optimization
        'test', // add test
        'build', // build system
        'ci', // CI configuration
        'chore', // other changes
        'revert', // revert
        'wip', // development in progress
        'types', // type change
        'release', // release
      ],
    ],
  },
}
