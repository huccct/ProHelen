import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

// 语言资源
const resources = {
  en: {
    translation: {
      // 导航
      nav: {
        home: 'Home',
        templates: 'Templates',
        myInstructions: 'My Instructions',
        builder: 'Builder',
      },
      // 通用
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        loading: 'Loading...',
        search: 'Search',
        next: 'Next',
        previous: 'Previous',
        continue: 'Continue',
        skip: 'Skip',
        done: 'Done',
        close: 'Close',
        back: 'Back',
        advanced: 'Advanced',
        title: 'Title',
        description: 'Description',
        tags: 'Tags',
      },
      // 认证
      auth: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signOut: 'Sign Out',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        forgotPassword: 'Forgot Password',
        resetPassword: 'Reset Password',
        createAccount: 'Create Account',
        alreadyHaveAccount: 'Already have an account?',
        dontHaveAccount: 'Don\'t have an account?',
      },
      // 首页
      home: {
        title: 'Welcome to ProHelen',
        subtitle: 'A Web-Based Tool for Customising LLM Behaviour Using Visual Instruction Generation',
        getStarted: 'Get Started',
        learnMore: 'Learn More',
      },
      // 构建器
      builder: {
        title: 'AI Instruction Builder',
        addBlock: 'Add Block',
        testPrompt: 'Test Prompt',
        saveInstruction: 'Save Instruction',
      },
    },
  },
  zh: {
    translation: {
      // 导航
      nav: {
        home: '首页',
        templates: '模板',
        myInstructions: '我的指令',
        builder: '构建器',
      },
      // 通用
      common: {
        save: '保存',
        cancel: '取消',
        delete: '删除',
        edit: '编辑',
        create: '创建',
        loading: '加载中...',
        search: '搜索',
        next: '下一步',
        previous: '上一步',
        continue: '继续',
        skip: '跳过',
        done: '完成',
        close: '关闭',
        back: '返回',
        advanced: '高级',
        title: '标题',
        description: '描述',
        tags: '标签',
      },
      // 认证
      auth: {
        signIn: '登录',
        signUp: '注册',
        signOut: '退出登录',
        email: '邮箱',
        password: '密码',
        confirmPassword: '确认密码',
        forgotPassword: '忘记密码',
        resetPassword: '重置密码',
        createAccount: '创建账户',
        alreadyHaveAccount: '已有账户？',
        dontHaveAccount: '还没有账户？',
      },
      // 首页
      home: {
        title: '欢迎来到 ProHelen',
        subtitle: '基于可视化指令生成定制大语言模型行为的网络工具',
        getStarted: '开始使用',
        learnMore: '了解更多',
      },
      // 构建器
      builder: {
        title: 'AI 指令构建器',
        addBlock: '添加模块',
        testPrompt: '测试提示',
        saveInstruction: '保存指令',
      },
    },
  },
}

i18n
  .use(LanguageDetector) // 自动检测用户语言
  .use(initReactI18next) // 绑定 react-i18next
  .init({
    resources,
    fallbackLng: 'en', // 默认语言
    lng: 'en', // 初始语言

    // 语言检测配置
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React 已经默认转义
    },

    // 调试模式 (开发环境)
    debug: typeof window !== 'undefined' && window.location.hostname === 'localhost',
  })

export default i18n
