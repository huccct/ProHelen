import 'react-i18next'

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: {
        nav: {
          home: string
          templates: string
          myInstructions: string
          builder: string
        }
        common: {
          save: string
          cancel: string
          delete: string
          edit: string
          create: string
          loading: string
          search: string
          next: string
          previous: string
          continue: string
          skip: string
          done: string
          close: string
          back: string
          advanced: string
          title: string
          description: string
          tags: string
        }
        auth: {
          signIn: string
          signUp: string
          signOut: string
          email: string
          password: string
          confirmPassword: string
          forgotPassword: string
          resetPassword: string
          createAccount: string
          alreadyHaveAccount: string
          dontHaveAccount: string
        }
        home: {
          title: string
          subtitle: string
          getStarted: string
          learnMore: string
        }
        builder: {
          title: string
          addBlock: string
          testPrompt: string
          saveInstruction: string
        }
      }
    }
  }
}
