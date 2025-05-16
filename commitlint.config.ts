export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复
        'docs', // 文档变更
        'style', // 代码格式
        'refactor', // 重构
        'perf', // 性能优化
        'test', // 增加测试
        'build', // 构建系统
        'ci', // CI 配置
        'chore', // 其他改动
        'revert', // 回退
        'wip', // 开发中
        'types', // 类型修改
        'release', // 发布
      ],
    ],
  },
}
