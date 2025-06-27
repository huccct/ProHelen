import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {

      nav: {
        home: 'Home',
        templates: 'Templates',
        myInstructions: 'My Instructions',
        builder: 'Builder',
      },

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
        reset: 'Reset',
      },

      auth: {

        signInButton: 'Sign In',
        signUpButton: 'Sign Up',
        signOut: 'Sign Out',
        createAccount: 'Create Account',
        alreadyHaveAccount: 'Already have an account?',
        dontHaveAccount: 'Don\'t have an account?',
        forgotPasswordLink: 'Forgot Password',
        resetPasswordLink: 'Reset Password',

        emailAddress: 'Email address',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        fullName: 'Full Name',

        emailPlaceholder: 'Enter your email',
        passwordPlaceholder: 'Enter your password',
        fullNamePlaceholder: 'Enter your name',
        confirmPasswordPlaceholder: 'Confirm your password',

        creatingAccount: 'Creating account...',

        accountCreated: 'Account created successfully! Redirecting to login...',

        passwordTooShort: 'Password must be at least 8 characters long',
        passwordNoUppercase: 'Password must contain at least one uppercase letter',
        passwordNoLowercase: 'Password must contain at least one lowercase letter',
        passwordNoNumber: 'Password must contain at least one number',
        passwordsDoNotMatch: 'Passwords do not match',
        failedToRegister: 'Failed to register',

        eightCharacters: 'At least 8 characters',
        uppercaseLetter: 'One uppercase letter',
        lowercaseLetter: 'One lowercase letter',
        oneNumber: 'One number',

        orContinueWith: 'Or continue with',
        byContinuing: 'By continuing, you agree to our',
        and: 'and',
        termsOfService: 'Terms of Service',
        privacyPolicy: 'Privacy Policy',

        forgotPassword: {
          title: 'Reset your password',
          subtitle: 'Enter your email address and we\'ll send you instructions to reset your password.',
          subtitleSent: 'Check your email for a link to reset your password.',
          sendingResetLink: 'Sending reset link...',
          sendResetLink: 'Send reset link',
          resetLinkSent: 'Reset link sent to your email',
          failedToSendResetLink: 'Failed to send reset link',
          sentTo: 'We\'ve sent a password reset link to',
          tryAnotherEmail: 'Try another email',
          rememberPassword: 'Remember your password?',
        },

        resetPassword: {
          title: 'Reset your password',
          subtitle: 'Please enter your new password below.',
          newPassword: 'New Password',
          confirmNewPassword: 'Confirm New Password',
          newPasswordPlaceholder: 'Enter your new password',
          confirmNewPasswordPlaceholder: 'Confirm your new password',
          resettingPassword: 'Resetting password...',
          resetPasswordButton: 'Reset password',
          invalidResetLink: 'Invalid Reset Link',
          invalidResetLinkMessage: 'This password reset link is invalid or has expired.',
          requestNewResetLink: 'Request New Reset Link',
          passwordResetSuccessfully: 'Password reset successfully',
          failedToResetPassword: 'Failed to reset password',
          passwordRequirementsNotMet: 'Password does not meet requirements',
          invalidResetLinkError: 'Invalid reset link',
          loading: 'Loading...',
          verifyingResetLink: 'Please wait while we verify your reset link.',
        },

        signIn: {
          title: 'Welcome Back',
          subtitle: 'Sign in to continue building your AI assistant',
          signingIn: 'Signing in...',
          redirecting: 'Redirecting to login...',
          success: 'Signed in successfully',
          errors: {
            invalidCredentials: 'Invalid email or password',
            somethingWrong: 'Something went wrong',
            failedToSignIn: 'Failed to sign in',
          },
        },

        signUp: {
          title: 'Create your account',
          subtitle: 'Start building your personalized AI assistant',
        },
      },

      home: {
        title: 'Welcome to ProHelen',
        subtitle: 'A Web-Based Tool for Customising LLM Behaviour Using Visual Instruction Generation',
        getStarted: 'Get Started',
        learnMore: 'Learn More',

        hero: {
          badge: 'ProHelen v1.0',
          mainTitle: 'The Future of',
          typewriter: {
            visualPromptDesign: 'Visual Prompt Design',
            aiBehaviorControl: 'AI Behavior Control',
            smartInstructions: 'Smart Instructions',
            llmCustomization: 'LLM Customization',
          },
          description: 'Transform how you interact with AI through <strong>intuitive visual building blocks</strong>. Create sophisticated LLM instructions without coding.',
          startCreating: 'Start Creating',
          exploreTemplates: 'Explore Templates',
          features: {
            noCoding: 'No coding required',
            realTime: 'Real-time preview',
            freeStart: 'Free to start',
          },
        },

        workflow: {
          dragDrop: 'Drag & Drop',
          visualBlocks: 'Visual Blocks',
          generate: 'Generate',
          smartPrompts: 'Smart Prompts',
          deploy: 'Deploy',
          instantly: 'Instantly',
        },

        features: {
          title: 'Powerful Features',
          subtitle: 'Everything you need to build, manage, and deploy sophisticated AI instructions',
          visualBlockSystem: {
            title: 'Visual Block System',
            description: 'Intuitive drag-and-drop interface with intelligent block connections. Build complex AI behaviors using our comprehensive library of pre-designed components.',
            highlight: 'Core Feature',
          },
          smartTemplates: {
            title: 'Smart Templates',
            description: 'Pre-built instruction templates for common AI tasks. Educational, productivity, and creative use cases with customizable parameters and examples.',
            highlight: 'Popular',
          },
          realTimePreview: {
            title: 'Real-time Preview',
            description: 'See your AI\'s behavior change instantly as you modify instructions. Live testing environment with immediate feedback and iteration.',
            highlight: 'Pro',
          },
          instructionManagement: {
            title: 'Instruction Management',
            description: 'Organize, categorize, and version your AI instructions. Advanced search, favorites, and sharing capabilities with team collaboration features.',
          },
          exportIntegration: {
            title: 'Export & Integration',
            description: 'Export your instructions in multiple formats. Direct API integration with popular AI models and platforms for seamless deployment.',
          },
          analyticsInsights: {
            title: 'Analytics & Insights',
            description: 'Track usage patterns, performance metrics, and optimization suggestions. Data-driven insights to improve your AI instruction effectiveness.',
          },
        },

        useCases: {
          title: 'Perfect For',
          subtitle: 'Whether you\'re an educator, developer, or AI enthusiast',
          developers: {
            title: 'Developers & Engineers',
            description: 'Rapid prototyping of AI-powered features, API prompt optimization, and integration testing',
          },
          contentCreators: {
            title: 'Content Creators',
            description: 'Custom writing assistants, content generation workflows, and creative AI collaborations',
          },
          educators: {
            title: 'Educators & Trainers',
            description: 'Interactive learning experiences, automated grading systems, and personalized tutoring',
          },
          startups: {
            title: 'Startup Teams',
            description: 'MVP development, customer support automation, and product feature enhancement',
          },
          analysts: {
            title: 'Business Analysts',
            description: 'Data analysis workflows, report generation, and decision support systems',
          },
          researchers: {
            title: 'AI Researchers',
            description: 'Prompt engineering experiments, behavior analysis, and model comparison studies',
          },
        },

        stats: {
          blockTypes: {
            value: '30+',
            label: 'Block Types',
            description: 'Versatile components',
          },
          templates: {
            value: '25+',
            label: 'Templates',
            description: 'Ready-to-use patterns',
          },
          instructions: {
            value: '500+',
            label: 'Instructions',
            description: 'Community created',
          },
          responseTime: {
            value: '<100ms',
            label: 'Response Time',
            description: 'Lightning fast',
          },
        },

        cta: {
          title: 'Ready to start your <span class="text-primary font-medium">AI prompt design</span> journey?',
          startButton: 'Start Creating Now',
          subtitle: 'Create your account and start building intelligent AI prompts',
        },

        playground: {
          title: 'Try it Live',
          subtitle: 'Experience the power of visual prompt building with our interactive playground',
          canvas: {
            title: 'Interactive Canvas',
            subtitle: 'Drag blocks around, click to select, and see how easy prompt building can be',
          },
          selectAll: 'Select All',
          generatePrompt: 'Generate Prompt',
          preview: {
            selectedBlocks: 'Selected Blocks',
            noBlocks: 'Click blocks on the canvas to select them',
            generatedPrompt: 'Generated Prompt',
            clickGenerate: 'Select blocks and click "Generate Prompt" to see the result',
            instructions: 'Try This',
            dragInstruction: 'Drag blocks to rearrange',
            doubleClickInstruction: 'Double-click to edit content',
            generateInstruction: 'Click "Generate" to see prompt',
          },
          tryFullBuilder: 'Try Full Builder',
          fullBuilderDescription: 'Access 15+ block types, templates, and advanced features',
          demoBlocks: {
            roleDefinition: {
              title: 'Role Definition',
              content: 'You are a helpful AI writing assistant with expertise in content creation and storytelling.',
            },
            contextSetting: {
              title: 'Context Setting',
              content: 'Focus on creating engaging, informative blog content for a general audience interested in technology and innovation.',
            },
            communicationStyle: {
              title: 'Communication Style',
              content: 'Write in a friendly, conversational tone that is approachable yet professional, using clear examples and avoiding jargon.',
            },
          },
        },

        footer: {
          privacy: 'Privacy',
          terms: 'Terms',
          documentation: 'Documentation',
          support: 'Support',
          copyright: '© 2025 ProHelen. Revolutionizing AI instruction design for everyone.',
        },
      },

      templates: {
        title: 'Templates',
        subtitle: 'Choose from our pre-built templates to quickly create customized instructions for different educational and productivity needs.',
        searchPlaceholder: 'Search templates...',
        categories: {
          all: 'All',
          goalSetting: 'Goal Setting',
          education: 'Education',
          career: 'Career',
          productivity: 'Productivity',
          technology: 'Technology',
          business: 'Business',
          marketing: 'Marketing',
          analytics: 'Analytics',
          design: 'Design',
          innovation: 'Innovation',
          finance: 'Finance',
        },
        filter: {
          loading: 'Loading categories...',
        },
        list: {
          loading: 'Loading templates...',
          error: 'Failed to load templates',
          tryAgain: 'Try Again',
          noResults: 'No templates found for your search criteria.',
          premium: 'Premium',
        },
        stats: {
          rating: 'Rating',
          reviews: 'reviews',
          usage: 'Used',
          times: 'times',
          favorites: 'favorites',
        },
        actions: {
          viewDetails: 'View Details',
          useTemplate: 'Use Template',
          favorite: 'Add to Favorites',
        },
        pagination: {
          previous: 'Previous',
          next: 'Next',
          page: 'Page',
          of: 'of',
        },
      },

      templateDetail: {
        loading: 'Loading template...',
        error: 'Failed to load template',
        tryAgain: 'Try Again',
        backToTemplates: 'Back to templates',
        share: 'Share',
        useTemplate: 'Use Template',
        overview: 'Overview',
        features: 'Features',
        examples: 'Examples',
        examplesDescription: 'See how this template can be applied in real scenarios',
        templatePreview: 'Template Preview',
        noPreviewContent: 'No template content available for preview.',
        relatedTemplates: 'Related Templates',
        viewAllTemplates: 'View All Templates',
        ratingsReviews: 'Ratings & Reviews',
        reviews: 'reviews',
        yourReview: 'Your Review',
        rateTemplate: 'Rate This Template',
        rating: 'Rating',
        comment: 'Comment (optional)',
        commentPlaceholder: 'Share your thoughts about this template...',
        submitReview: 'Submit Review',
        updateReview: 'Update Review',
        submitting: 'Submitting...',
        signInToRate: 'Please sign in to rate this template',
        selectRating: 'Please select a rating',
        reviewSubmitted: 'Review submitted!',
        reviewUpdated: 'Review updated!',
        reviewFailed: 'Failed to submit review',
        signInToReview: 'Sign in to leave a review',
        noReviews: 'No reviews yet',
        showAllReviews: 'Show all reviews',
        showLessReviews: 'Show less',
        ago: 'ago',
        now: 'now',
        timeUnits: {
          minute: 'minute',
          minutes: 'minutes',
          hour: 'hour',
          hours: 'hours',
          day: 'day',
          days: 'days',
          month: 'month',
          months: 'months',
          year: 'year',
          years: 'years',
        },
      },

      myInstructions: {
        title: 'My Instructions',
        createNewInstruction: 'Create New Instruction',
        searchPlaceholder: 'Search instructions...',
        dateCreated: 'Date Created',
        mostUsed: 'Most Used',
        noMatchingInstructions: 'No matching instructions found',
        noInstructionsYet: 'You haven\'t created any instructions yet',
        tryAgain: 'Try Again',
        failedToLoad: 'Failed to load instructions',

        published: 'Published',
        noDescription: 'No description',
        usedTimes: 'Used {{count}} times',
        edit: 'Edit',
        duplicate: 'Duplicate',
        addToFavorites: 'Add to favorites',
        removeFromFavorites: 'Remove from favorites',
        publishToLibrary: 'Publish to template library',
        unpublishFromLibrary: 'Unpublish from library',
        delete: 'Delete',

        instructionDeleted: 'Instruction deleted successfully',
        deleteFailed: 'Failed to delete, please try again',
        addedToFavorites: 'Added to favorites',
        removedFromFavorites: 'Removed from favorites',
        favoriteOperationFailed: 'Operation failed, please try again',
        instructionDuplicated: 'Instruction duplicated successfully',
        duplicateFailed: 'Failed to duplicate, please try again',
        instructionPublished: 'Instruction published to template library',
        publishFailed: 'Failed to publish, please try again',
        instructionUnpublished: 'Instruction unpublished from template library',
        unpublishFailed: 'Failed to unpublish, please try again',

        deleteInstruction: {
          title: 'Delete Instruction',
          description: 'Are you sure you want to delete this instruction? This action cannot be undone.',
          confirm: 'Delete',
          cancel: 'Cancel',
        },
        publishInstruction: {
          title: 'Publish to Template Library',
          description: 'Are you sure you want to publish this instruction to the template library? Other users will be able to see and use it.',
          confirm: 'Publish',
          cancel: 'Cancel',
        },
        unpublishInstruction: {
          title: 'Unpublish from Template Library',
          description: 'Are you sure you want to unpublish this instruction from the template library? It will no longer be available to other users.',
          confirm: 'Unpublish',
          cancel: 'Cancel',
        },
      },

      builder: {
        title: 'Instruction Builder',
        untitledInstruction: 'Untitled Instruction',
        addDescription: 'Add a description...',
        simpleMode: 'Simple Mode',
        switchToSimpleMode: 'Switch to simple mode',
        simpleModeTip: 'Question-based instruction creation',
        getHelp: 'Get help and shortcuts',
        helpTip: 'Press F1 or click for help',

        quickSetup: {
          title: 'Quick Setup',
          subtitle: 'Answer a few simple questions to get started',
          advancedMode: 'Advanced Mode',
          purpose: {
            title: 'What should your AI assistant help you with?',
            description: 'Choose a primary purpose and we\'ll recommend the right configuration',
            learning: {
              label: '🎓 Learning Assistant',
              description: 'Help me learn new knowledge, answer questions, practice skills',
            },
            writing: {
              label: '✍️ Writing Assistant',
              description: 'Help me write articles, emails, creative content',
            },
            work: {
              label: '💼 Work Assistant',
              description: 'Improve productivity, analyze data, solve business problems',
            },
            personal: {
              label: '🏠 Personal Assistant',
              description: 'Daily decisions, health advice, personal planning',
            },
          },
          tone: {
            title: 'What communication style do you prefer?',
            description: 'Choose how you want the AI to interact with you',
            professional: {
              label: '🎯 Professional & Formal',
              description: 'Authoritative and rigorous, like an expert',
            },
            friendly: {
              label: '😊 Friendly & Casual',
              description: 'Warm and approachable, like a friend',
            },
            encouraging: {
              label: '💪 Encouraging & Supportive',
              description: 'Motivating and positive, like a coach',
            },
            direct: {
              label: '⚡ Direct & Concise',
              description: 'Straight to the point, no fluff',
            },
          },
          expertise: {
            title: 'What\'s your experience level?',
            description: 'Let the AI know how to adjust its explanations for you',
            beginner: {
              label: '🌱 Complete Beginner',
              description: 'I\'m new to this, need basic explanations',
            },
            intermediate: {
              label: '🌿 Some Experience',
              description: 'I know some basics, but need guidance',
            },
            advanced: {
              label: '🌳 Quite Experienced',
              description: 'I\'m skilled, just need advanced advice',
            },
          },
          goal: {
            title: 'What specific goal do you want to achieve?',
            description: 'Describe your objective in detail so the AI can better understand your needs',
            placeholder: 'Type your goal here...',
          },
          steps: {
            previous: 'Previous',
            next: 'Next',
            createInstructions: 'Create Instructions',
          },
        },
        analyzer: {
          title: 'AI Assistant Smart Analysis',
          subtitle: 'Tell me your needs, I\'ll help you automatically create AI instructions',
          switchToAdvanced: 'Advanced Mode',

          steps: {
            describe: 'Describe Needs',
            confirm: 'Confirm Plan',
          },

          input: {
            title: 'Tell me what kind of AI assistant you want',
            description: 'Describe your needs in natural language, such as purpose, style, professional domain, etc.',
            placeholder: 'For example: I want an AI assistant to help me prepare for technical interviews, focusing on JavaScript and React, should be friendly and patient... (Press Enter to analyze, Shift+Enter for new line)',
            analyzing: 'Analyzing...',
            analyze: 'Start Analysis',
            characterLimit: '{{count}}/500',
          },

          examples: {
            title: 'Don\'t know how to describe? Try these examples',
            learning: {
              title: '🎓 Learning Assistant',
              text: 'I want an AI assistant to help me prepare for technical interviews, focusing on JavaScript and React, being friendly and patient',
            },
            work: {
              title: '💼 Work Assistant',
              text: 'Create a code review assistant that can analyze code quality and provide improvement suggestions',
            },
            writing: {
              title: '✍️ Writing Assistant',
              text: 'I need a writing partner to improve my articles and make them more persuasive',
            },
            personal: {
              title: '🏠 Personal Assistant',
              text: 'Help me create an English learning tutor who can correct grammar errors and explain usage',
            },
          },

          results: {
            intent: 'I understand your needs',
            extracted: 'Extracted the following functional modules for you',
            extractedDescription: 'I automatically identified these modules based on your description, you can adjust the selection',
            suggested: 'Suggested additional functional modules',
            suggestedDescription: 'These modules can make your AI assistant work better',
            confidence: '{{percent}}% match',
            reasoning: 'Identification reason: {{reason}}',
            impact: {
              high: 'High Impact',
              medium: 'Medium Impact',
              low: 'Low Impact',
            },
            reanalyze: 'Re-analyze',
            confirm: 'Confirm and Create',
          },

          errors: {
            emptyPrompt: 'Please enter your needs description',
            analysisFailed: 'Analysis failed, please try again later',
          },

          defaults: {
            generatedByAnalysis: 'Created through AI analysis',
            defaultAssistantTitle: 'AI Assistant',
          },
        },

        guided: {
          welcome: {
            title: 'Guided Setup',
            subtitle: 'Create powerful AI instructions step-by-step',
            description: 'We\'ll guide you through building your first instruction with helpful tips and recommendations.',
            getStarted: 'Get Started',
            backToAnalyzer: 'Back to Smart Analysis',
            skipToAdvanced: 'Skip to Advanced',
          },
          steps: {
            arrange: 'Arrange Blocks',
            customize: 'Customize Content',
            test: 'Test & Refine',
          },
          header: {
            next: 'Next Step',
            previous: 'Previous',
            switchToAdvanced: 'Switch to Advanced',
          },
          canvas: {

            arrangeCards: 'Arrange Your Cards',
            arrangeMessage: 'Drag the instruction cards to organize them visually. The connections are automatically created based on logical flow.',
            arrangeTip: 'Arrange cards in a clear visual layout for better readability - the connections are smart and automatic.',
            customizeContent: 'Customize Content',
            customizeMessage: 'Click on any card to edit its content. Make it specific to get better AI responses.',
            customizeTip: 'The more detailed your instructions, the better your AI will perform.',
            readyToTest: 'Ready to Try It',
            readyMessage: 'Your instruction flow is complete! Time to see how it works.',
            readyTip: 'Test early and often to refine your instructions.',
            arrangeComplete: 'Great! Your cards are automatically connected in a logical flow. Try moving them around to see how the layout affects readability.',
            customizeComplete: 'Perfect! You\'ve customized {{count}} card{{s}}. Your AI assistant is getting smarter!',

            noBlocks: 'No Blocks Yet',
            noBlocksMessage: 'First, you need to add some instruction blocks from the left panel.',
            noBlocksAction: 'Click a block type on the left to add it',
            dragToArrange: 'Drag to Arrange',
            dragMessage: 'Great! Now drag these blocks around to organize them in a logical order.',
            dragAction: 'Grab and drag any block to move it',
            dragHint: 'Drag me!',
            clickToEdit: 'Click to Edit Content',
            clickMessage: 'Now click on the highlighted block to add your specific instructions.',
            clickAction: 'Click the highlighted block to edit it',
            clickHint: 'Click Edit!',
            allCustomized: 'All Blocks Customized!',
            allCustomizedMessage: 'Excellent! You\'ve customized all {{count}} blocks with your specific instructions.',
            allCustomizedAction: 'Ready to test your AI assistant',
            testReady: 'Ready to Test!',
            testReadyMessage: 'Your AI instruction flow is complete and ready for testing.',
            testReadyAction: 'Look at the preview panel on the right',
            lookRight: 'Look at the preview panel on the right →',
            progress: 'Progress',
            allDone: 'All Done!',
          },
        },

        components: {
          blockPicker: {
            title: 'Add Instruction Block',
            description: 'Choose a block type to add to your prompt',
            searchPlaceholder: 'Search blocks...',
            helpText: 'Click to add instantly or drag to position on canvas',
            categories: {
              quickStart: 'Quick Start',
              all: 'All',
              roleContext: 'Role & Context',
              interactionStyle: 'Interaction Style',
              taskControl: 'Task Control',
              thinkingLogic: 'Thinking & Logic',
              skillsDevelopment: 'Skills & Development',
            },
            quickStart: {
              title: 'Get Started Quickly',
              subtitle: 'Choose a pre-built template with 2-3 essential blocks to jump-start your AI assistant',
              addAll: 'Add All Blocks',
              tutor: {
                label: 'AI Tutor',
                description: 'Perfect for educational assistance with personalized learning approach',
              },
              businessConsultant: {
                label: 'Business Consultant',
                description: 'Professional advice with structured, persuasive communication',
              },
              creativeAssistant: {
                label: 'Creative Assistant',
                description: 'Innovative thinking with engaging personality for creative projects',
              },
              stepByStepGuide: {
                label: 'Step-by-Step Guide',
                description: 'Clear, structured instructions broken down into manageable steps',
              },
            },
            blocks: {

              roleDefinition: {
                label: 'Role Definition',
                description: 'Define AI assistant role and expertise',
              },
              contextSetting: {
                label: 'Context Setting',
                description: 'Set conversation context and background',
              },
              outputFormat: {
                label: 'Output Format',
                description: 'Specify response format and structure',
              },

              goalSetting: {
                label: 'Goal Setting',
                description: 'Set SMART learning goals',
              },
              learningStyle: {
                label: 'Learning Style',
                description: 'Customize learning approach',
              },
              subjectFocus: {
                label: 'Subject Focus',
                description: 'Subject specific instructions',
              },
              difficultyLevel: {
                label: 'Difficulty Level',
                description: 'Set appropriate complexity level',
              },

              communicationStyle: {
                label: 'Communication Style',
                description: 'Set tone and communication approach',
              },
              feedbackStyle: {
                label: 'Feedback Style',
                description: 'Customize feedback approach',
              },
              personalityTraits: {
                label: 'Personality',
                description: 'Add personality characteristics',
              },

              stepByStep: {
                label: 'Step-by-Step',
                description: 'Break down into sequential steps',
              },
              timeManagement: {
                label: 'Time Management',
                description: 'Plan study schedule and timing',
              },
              prioritization: {
                label: 'Prioritization',
                description: 'Set priorities and importance levels',
              },

              conditionalLogic: {
                label: 'Conditional Logic',
                description: 'Add if-then conditional responses',
              },
              creativeThinking: {
                label: 'Creative Thinking',
                description: 'Encourage creative problem solving',
              },
              errorHandling: {
                label: 'Error Handling',
                description: 'Handle mistakes and corrections',
              },

              careerPlanning: {
                label: 'Career Planning',
                description: 'Career development guidance',
              },
              skillAssessment: {
                label: 'Skill Assessment',
                description: 'Evaluate current skills and gaps',
              },
            },
          },
          customNode: {
            clickToAdd: 'Click to add instructions...',
            enterInstructions: 'Enter {{label}} instructions...',
            confirmDelete: {
              title: 'Delete Block',
              description: 'Are you sure you want to delete this block? This action cannot be undone.',
              confirm: 'Delete',
              cancel: 'Cancel',
            },
          },
          toolbar: {
            undo: 'Undo last action',
            redo: 'Redo last action',
            clearCanvas: 'Clear canvas',
            zoomIn: 'Zoom in',
            zoomOut: 'Zoom out',
            fullscreen: 'Fullscreen',
            undone: 'Undone',
            redone: 'Redone',
            enteredFullscreen: 'Entered fullscreen mode',
            exitedFullscreen: 'Exited fullscreen mode',
            fullscreenNotSupported: 'Fullscreen not supported',
            canvasCleared: 'Canvas cleared',
            zoomError: 'Please enter a zoom value between 10% and 500%',
            shortcuts: {
              ctrlZ: 'Ctrl+Z',
              ctrlY: 'Ctrl+Y',
            },
          },

          promptPreview: {
            title: 'Prompt Preview',
            formats: {
              customInstructions: 'Custom Instructions',
              systemPrompt: 'System Prompt',
              rawText: 'Raw Text',
            },
            actions: {
              copy: 'Copy',
              export: 'Export',
              test: 'Try it',
              save: 'Save',
            },
            placeholder: 'Start building your custom instructions by adding blocks to the canvas...',
            systemPromptPlaceholder: 'No system prompt configured yet. Add instruction blocks to generate a system prompt.',
            rawTextPlaceholder: 'No content to display',
            messages: {
              copied: 'Prompt copied to clipboard!',
              copyFailed: 'Failed to copy prompt',
              exported: 'Prompt exported successfully!',
              addContentBeforeTest: 'Please add some content to your prompt before testing',
              addContentBeforeSave: 'Please add some content to your prompt before saving',
              systemPromptCopied: 'System prompt copied to clipboard!',
            },
            stats: {
              blocks: '{{count}} block(s) configured',
              tokens: '~{{count}} tokens',
            },
            helpText: 'Add instruction blocks to your canvas to see the generated prompt here',
          },
          emptyStateGuide: {
            title: 'Ready to build your AI assistant?',
            description: 'Start by adding instruction blocks to the canvas. They\'ll automatically connect in a logical flow, making prompt creation simple and intuitive.',
            addFirstBlock: 'Add Your First Block',
            takeTour: 'Take the Tour',
            helpButton: 'Need help? View guide',
            features: {
              addBlocks: {
                title: 'Add Blocks',
                description: 'Choose from 15+ instruction types',
              },
              autoConnect: {
                title: 'Auto-Connect',
                description: 'Smart connections create logical flow',
              },
              customize: {
                title: 'Customize',
                description: 'Edit content to fit your needs',
              },
            },
          },
          flowCanvas: {
            addBlock: 'Add Block',
            addBlockTooltip: 'Browse and add instruction blocks to your canvas',
            addBlockTooltipSub: '18 different block types available',
            smartSuggestions: 'Smart Suggestions',
            smartSuggestionsTooltip: 'Get AI-powered block recommendations',
            smartSuggestionsTooltipSub: 'Based on your current blocks and best practices',
          },
          valueDemonstration: {
            title: 'Your Blocks in Action',
            subtitle: 'See how each building block improves your AI\'s responses',
            showImpact: 'See Impact',
            beforeTitle: 'Basic AI Response',
            afterTitle: 'Enhanced Response',
            beforeResponse: 'Hello! I\'m an AI assistant. How can I help you today? I\'ll do my best to provide useful information.',
            afterDescription: 'Using {{count}} building blocks, AI provides more professional, personalized, and structured responses',
            blocksTitle: 'Specific Improvements from Each Block',
            cumulativeTitle: 'Cumulative Effect',
            blocksCount: '{{count}} building blocks',
            qualityImprovement: '{{percent}}% quality improvement',
            professionalFeatures: '{{count}} professional features',
            addMoreBlocks: 'Continue adding more blocks',
            keepBuilding: 'Each additional block makes your AI more precise and professional',
            blocks: {
              roleDefinition: 'Role Definition',
              communicationStyle: 'Communication Style',
              outputFormat: 'Output Format',
              learningStyle: 'Learning Style',
              goalSetting: 'Goal Setting',
              contextSetting: 'Context Setting',
            },
            improvements: {
              personalizedApproach: 'Personalized approach and professional identity',
              professionalTone: 'Consistent communication style',
              structuredFormat: 'Organized and structured responses',
              structuredLearning: 'Adapted learning methodology',
              goalOriented: 'Clear goal-oriented guidance',
              tailoredResponse: 'Tailored response approach',
              proactiveSupport: 'Proactive support and suggestions',
              actionableContent: 'Actionable and practical content',
            },
            before: 'Before adding:',
            after: 'After adding:',
            blockExamples: {
              roleDefinition: {
                before: 'Hello, how can I help you?',
                afterTemplate: 'As your {{role}}, I will provide professional assistance.',
                afterWithIdentity: '{{identity}}. I will provide professional assistance.',
              },
              communicationStyle: {
                before: 'I will try my best to help you solve the problem.',
                afterTemplate: 'I will communicate with you using {{style}} approach, ensuring you can easily understand my responses.',
              },
              outputFormat: {
                before: 'Here is some information...',
                afterTemplate: '📋 Structured Response\n{{format}}\n\nMaking information clearer and easier to understand.',
              },
              learningStyle: {
                before: 'This concept is...',
                afterTemplate: '📚 Learning Method: {{style}}\nI will adjust my explanation based on your learning preferences.',
              },
              goalSetting: {
                before: 'I will try my best to answer your questions.',
                afterTemplate: '🎯 Goal-Oriented: {{goal}}\nLet\'s work step by step to achieve your objectives.',
              },
              contextSetting: {
                before: 'I am here to help you.',
                afterTemplate: '🔧 Context Background: {{context}}\nBased on this background, I can provide more accurate advice.',
              },
            },
          },
          helpPanel: {
            title: 'ProHelen Help Center',
            tabs: {
              guide: 'Block Guide',
              shortcuts: 'Shortcuts',
              faq: 'FAQ',
            },
            tourCta: {
              title: 'New to ProHelen?',
              description: 'Take a guided tour to learn the basics in 2 minutes!',
              button: 'Start Tour',
            },
            guide: {
              understandingBlocks: {
                title: 'Understanding Blocks',
                description: 'Blocks are the building pieces of your AI instructions. Each block serves a specific purpose and can be combined to create powerful, customized prompts.',
              },
              bestPractices: {
                title: 'Best Practices',
                tips: {
                  startWithRole: 'Start with a Role Definition block to establish the AI\'s perspective',
                  useContext: 'Use Context Setting early to provide necessary background information',
                  addOutputFormat: 'Add Output Format blocks to ensure consistent response structure',
                  testFrequently: 'Test your instructions frequently using the Preview panel',
                  useSmartSuggestions: 'Use Smart Suggestions to discover complementary blocks',
                },
              },
            },
            blockGuide: {
              roleContext: {
                title: 'Role & Context',
                description: 'AI identity, background, and work environment',
                blocks: {
                  roleDefinition: {
                    name: 'Role Definition',
                    use: 'Define what role the AI should take (teacher, assistant, expert, etc.)',
                  },
                  contextSetting: {
                    name: 'Context Setting',
                    use: 'Provide background information and situational context',
                  },
                  personalityTraits: {
                    name: 'Personality',
                    use: 'Add character traits and behavioral patterns',
                  },
                  subjectFocus: {
                    name: 'Subject Focus',
                    use: 'Specify the subject area and level of detail needed',
                  },
                },
              },
              interactionStyle: {
                title: 'Interaction Style',
                description: 'Communication patterns and feedback approaches',
                blocks: {
                  communicationStyle: {
                    name: 'Communication Style',
                    use: 'Set tone, formality, and conversation approach',
                  },
                  feedbackStyle: {
                    name: 'Feedback Style',
                    use: 'Define how the AI should provide corrections and guidance',
                  },
                  learningStyle: {
                    name: 'Learning Style',
                    use: 'Customize approach based on learning preferences',
                  },
                },
              },
              taskControl: {
                title: 'Task Control',
                description: 'Goal setting, output formatting, and task management',
                blocks: {
                  goalSetting: {
                    name: 'Goal Setting',
                    use: 'Define specific learning objectives and outcomes',
                  },
                  outputFormat: {
                    name: 'Output Format',
                    use: 'Specify how you want the AI to structure its responses',
                  },
                  difficultyLevel: {
                    name: 'Difficulty Level',
                    use: 'Set appropriate complexity level',
                  },
                  timeManagement: {
                    name: 'Time Management',
                    use: 'Plan study schedule and timing',
                  },
                  prioritization: {
                    name: 'Prioritization',
                    use: 'Set priorities and importance levels',
                  },
                },
              },
              thinkingLogic: {
                title: 'Thinking & Logic',
                description: 'Cognitive processes and reasoning patterns',
                blocks: {
                  stepByStep: {
                    name: 'Step-by-Step',
                    use: 'Break down into sequential steps',
                  },
                  conditionalLogic: {
                    name: 'Conditional Logic',
                    use: 'Add if-then conditional responses',
                  },
                  creativeThinking: {
                    name: 'Creative Thinking',
                    use: 'Encourage creative problem solving',
                  },
                  errorHandling: {
                    name: 'Error Handling',
                    use: 'Handle mistakes and corrections',
                  },
                },
              },
              skillsDevelopment: {
                title: 'Skills & Development',
                description: 'Professional growth and skill assessment',
                blocks: {
                  careerPlanning: {
                    name: 'Career Planning',
                    use: 'Career development guidance',
                  },
                  skillAssessment: {
                    name: 'Skill Assessment',
                    use: 'Evaluate current skills and gaps',
                  },
                },
              },
            },
            shortcuts: {
              title: 'Keyboard Shortcuts',
              description: 'Speed up your workflow with these keyboard shortcuts.',
              undo: 'Undo last action',
              redo: 'Redo last action',
              openHelp: 'Open help panel',
              closeDialogs: 'Close dialogs and panels',
              moveBlocks: 'Move blocks on canvas',
              getSuggestions: 'Get smart suggestions',
              editBlock: 'Edit block content',
              confirmDialogs: 'Confirm in dialogs',
              zoom: 'Zoom in/out on canvas',
            },
            mouseActions: {
              title: 'Mouse Actions',
              panCanvas: 'Pan canvas',
              panCanvasHow: 'Click and drag on empty space',
              connectBlocks: 'Connect blocks',
              connectBlocksHow: 'Drag from output to input handle',
              selectMultiple: 'Select multiple blocks',
              selectMultipleHow: 'Ctrl + click',
              zoom: 'Zoom',
              zoomHow: 'Mouse wheel or zoom controls',
            },
            faqs: {
              autoConnect: {
                question: 'How do blocks connect automatically?',
                answer: 'Blocks are connected automatically based on logical flow and best practices. The system analyzes block types and creates the most appropriate connections for effective prompt building.',
              },
              whyAutomatic: {
                question: 'Why are connections automatic?',
                answer: 'Automatic connections make the tool easier to use, especially for non-technical users. The system ensures proper flow and sequence based on proven prompt engineering patterns.',
              },
              deleteBlock: {
                question: 'What happens when I delete a block?',
                answer: 'When you delete a block, the remaining blocks are automatically reconnected to maintain a logical flow. The generated prompt updates automatically.',
              },
              reuseBlocks: {
                question: 'Can I reuse blocks I\'ve created?',
                answer: 'Yes! Save your instruction as a template or copy content from one block to another. You can also duplicate existing blocks by copying them.',
              },
              improvePrompts: {
                question: 'How do I improve my prompts?',
                answer: 'Add specific content to each block, test your prompts regularly, and use the Smart Suggestions feature to discover relevant blocks you might have missed.',
              },
            },
            faq: {
              title: 'Frequently Asked Questions',
            },
            support: {
              title: 'Still need help?',
              description: 'Can\'t find what you\'re looking for? We\'re here to help!',
              contactButton: 'Contact Support',
              tourAgainButton: 'Take Tour Again',
            },
          },
          onboardingTour: {
            steps: {
              welcome: {
                title: 'Welcome to ProHelen!',
                content: 'ProHelen is a visual prompt design tool that helps you create custom AI instructions using drag-and-drop blocks. Let\'s take a quick tour!',
              },
              titleInput: {
                title: 'Name Your Creation',
                content: 'Start by giving your instruction a descriptive title and optional description to help organize your work.',
              },
              addBlock: {
                title: 'Add Building Blocks',
                content: 'Click "Add Block" to choose from 18 different instruction blocks. Each block serves a specific purpose in building your AI prompt.',
              },
              canvas: {
                title: 'Visual Canvas',
                content: 'This is your workspace! Drag blocks here, connect them, and watch your instruction come to life. You can drag blocks around and connect them to create complex flows.',
              },
              smartSuggestions: {
                title: 'Smart Suggestions',
                content: 'Get AI-powered recommendations for blocks that work well together. Our system learns from successful prompt combinations.',
              },
              previewPanel: {
                title: 'Live Preview',
                content: 'See your instruction generated in real-time! Switch between different formats and test your prompts instantly.',
              },
              toolbar: {
                title: 'Powerful Tools',
                content: 'Use undo/redo, zoom controls, and layout tools to perfect your design. Pro tip: Try Ctrl+Z for undo!',
              },
            },
            progress: {
              step: 'Step',
              of: 'of',
              steps: '',
            },
            buttons: {
              skip: 'Skip Tour',
              next: 'Next',
              back: 'Back',
              done: 'Done!',
            },
          },
          recommendationPanel: {
            title: 'Smart Suggestions',
            emptyState: 'Add some blocks to get\npersonalized suggestions',
            tip: '💡 Suggestions improve as you use the app more',
          },
          progressIndicator: {
            completeness: 'Completeness',
            blocks: 'blocks',
            tooltip: 'Click to see detailed progress analysis',
            detailTitle: 'Build Progress Analysis',
            overallScore: 'Overall Score',
            status: {
              excellent: 'Excellent! Your AI assistant is highly optimized',
              good: 'Good progress! Your assistant is well-configured',
              fair: 'Making progress! Add more components for better results',
              starting: 'Just getting started! Keep building to improve',
            },
            starting: 'Getting Started',
            complete: 'Complete',
            improvementChecklist: 'Improvement Checklist',
            points: 'pts',
            totalBlocks: 'Total Blocks',
            categories: 'Categories',
            customized: 'Customized',
            nextSteps: 'Next Steps',
            checklist: {
              roleDefinition: 'Define AI assistant role and expertise',
              contextSetting: 'Provide context and background information',
              outputFormat: 'Specify response format and structure',
              taskClarity: 'Define clear tasks and objectives',
              communicationStyle: 'Set tone and communication approach',
              customContent: 'Add custom content to most blocks',
              examples: 'Include examples and demonstrations',
              diversity: 'Use blocks from different categories',
            },
            suggestions: {
              addCore: 'Start by adding essential blocks: Role Definition, Context Setting, and Output Format to establish your AI\'s foundation.',
              addContent: 'Great foundation! Now add specific content and examples to make your AI more effective and reliable.',
              refine: 'Excellent progress! Fine-tune your content, add more examples, and consider advanced blocks for specialized behaviors.',
            },
          },
        },
        modals: {
          confirmClear: {
            title: 'Clear Canvas',
            message: 'Are you sure you want to clear the canvas? This will remove all blocks and connections.',
            warning: '⚠️ This action cannot be undone.',
            cancel: 'Cancel',
            confirm: 'Clear Canvas',
          },
          saveInstruction: {
            title: 'Save Instruction',
            titleLabel: 'Title *',
            titlePlaceholder: 'Enter instruction title...',
            descriptionLabel: 'Description',
            descriptionPlaceholder: 'Describe what this instruction does...',
            categoryLabel: 'Category',
            tagsLabel: 'Tags',
            tagsPlaceholder: 'Add tags...',
            tagsPlaceholderImproved: 'Type and press Enter or comma to add tags...',
            tagsHint: '💡 Tip: Press Enter or comma to quickly add tags',
            addTag: 'Add',
            removeTag: 'Remove tag',
            cancel: 'Cancel',
            save: 'Save Instruction',
            saving: 'Saving...',
            categories: {
              general: 'General',
              academic: 'Academic',
              writing: 'Writing',
              programming: 'Programming',
              dataAnalysis: 'Data Analysis',
              creative: 'Creative',
              productivity: 'Productivity',
              research: 'Research',
              education: 'Education',
              business: 'Business',
            },
          },
          saveTemplate: {
            title: 'Save as Template',
            titleLabel: 'Title',
            titlePlaceholder: 'Enter template title...',
            descriptionLabel: 'Description',
            descriptionPlaceholder: 'Describe what this template does...',
            categoryLabel: 'Category',
            tagsLabel: 'Tags',
            tagsPlaceholder: 'Add tags...',
            addTag: 'Add',
            makePublic: 'Make this template public (others can discover and use it)',
            cancel: 'Cancel',
            save: 'Save Template',
            saving: 'Saving...',
            titleRequired: 'Please enter a title',
            descriptionRequired: 'Please enter a description',
            categories: {
              goalSetting: 'Goal Setting',
              education: 'Education',
              career: 'Career',
              productivity: 'Productivity',
              communication: 'Communication',
              planning: 'Planning',
              other: 'Other',
            },
          },
          testPrompt: {
            title: 'Try Your AI',
            emptyState: 'Type a message below to chat with your AI',
            thinking: 'Thinking...',
            inputPlaceholder: 'Type your test message... (Press Enter to send)',
            autoMessage: 'Hello! Please introduce yourself and explain what you can help me with.',
            copied: 'Copied to clipboard',
            newConversation: 'New Conversation',
          },
        },
      },
    },
  },
  zh: {
    translation: {

      nav: {
        home: '首页',
        templates: '模板',
        myInstructions: '我的指令',
        builder: '构建器',
      },

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
        reset: '重置',
      },

      auth: {

        signInButton: '登录',
        signUpButton: '注册',
        signOut: '退出登录',
        createAccount: '创建账户',
        alreadyHaveAccount: '已有账户？',
        dontHaveAccount: '还没有账户？',
        forgotPasswordLink: '忘记密码',
        resetPasswordLink: '重置密码',

        emailAddress: '邮箱地址',
        password: '密码',
        confirmPassword: '确认密码',
        fullName: '全名',

        emailPlaceholder: '请输入邮箱',
        passwordPlaceholder: '请输入密码',
        fullNamePlaceholder: '输入您的名字',
        confirmPasswordPlaceholder: '确认密码',

        creatingAccount: '创建账户中...',

        accountCreated: '账户创建成功！正在跳转登录...',

        passwordTooShort: '密码必须至少8个字符长',
        passwordNoUppercase: '密码必须包含至少一个大写字母',
        passwordNoLowercase: '密码必须包含至少一个小写字母',
        passwordNoNumber: '密码必须包含至少一个数字',
        passwordsDoNotMatch: '密码不匹配',
        failedToRegister: '注册失败',

        eightCharacters: '至少8个字符',
        uppercaseLetter: '至少一个大写字母',
        lowercaseLetter: '至少一个小写字母',
        oneNumber: '至少一个数字',

        orContinueWith: '或者使用以下方式继续',
        byContinuing: '继续使用即表示您同意我们的',
        and: '和',
        termsOfService: '服务条款',
        privacyPolicy: '隐私政策',

        forgotPassword: {
          title: '重置您的密码',
          subtitle: '输入您的邮箱地址，我们将向您发送重置密码的说明。',
          subtitleSent: '请检查您的邮箱以获取重置密码的链接。',
          sendingResetLink: '发送重置链接中...',
          sendResetLink: '发送重置链接',
          resetLinkSent: '重置链接已发送到您的邮箱',
          failedToSendResetLink: '发送重置链接失败',
          sentTo: '我们已向以下邮箱发送密码重置链接：',
          tryAnotherEmail: '尝试其他邮箱',
          rememberPassword: '记起密码了？',
        },

        resetPassword: {
          title: '重置您的密码',
          subtitle: '请输入您的新密码。',
          newPassword: '新密码',
          confirmNewPassword: '确认新密码',
          newPasswordPlaceholder: '输入您的新密码',
          confirmNewPasswordPlaceholder: '确认新密码',
          resettingPassword: '重置密码中...',
          resetPasswordButton: '重置密码',
          invalidResetLink: '无效的重置链接',
          invalidResetLinkMessage: '此重置链接无效或已过期。',
          requestNewResetLink: '请求新的重置链接',
          passwordResetSuccessfully: '密码重置成功',
          failedToResetPassword: '重置密码失败',
          passwordRequirementsNotMet: '密码不符合要求',
          invalidResetLinkError: '无效的重置链接',
          loading: '加载中...',
          verifyingResetLink: '请稍候我们验证您的重置链接。',
        },

        signIn: {
          title: '欢迎回来',
          subtitle: '登录以继续构建您的 AI 助手',
          signingIn: '登录中...',
          redirecting: '正在跳转登录...',
          success: '登录成功',
          errors: {
            invalidCredentials: '邮箱或密码错误',
            somethingWrong: '出现了问题',
            failedToSignIn: '登录失败',
          },
        },

        signUp: {
          title: '创建您的账户',
          subtitle: '开始构建您的个性化 AI 助手',
        },
      },

      home: {
        title: '欢迎来到 ProHelen',
        subtitle: '基于可视化指令生成定制大语言模型行为的网络工具',
        getStarted: '开始使用',
        learnMore: '了解更多',

        hero: {
          badge: 'ProHelen v1.0',
          mainTitle: '未来的',
          typewriter: {
            visualPromptDesign: '可视化提示设计',
            aiBehaviorControl: 'AI 行为控制',
            smartInstructions: '智能指令',
            llmCustomization: 'LLM 定制',
          },
          description: '通过<strong>直观的可视化构建模块</strong>改变您与 AI 的交互方式。无需编码即可创建复杂的 LLM 指令。',
          startCreating: '开始创建',
          exploreTemplates: '探索模板',
          features: {
            noCoding: '无需编码',
            realTime: '实时预览',
            freeStart: '免费开始',
          },
        },

        workflow: {
          dragDrop: '拖拽',
          visualBlocks: '可视化模块',
          generate: '生成',
          smartPrompts: '智能提示',
          deploy: '部署',
          instantly: '即时',
        },

        features: {
          title: '强大功能',
          subtitle: '构建、管理和部署复杂 AI 指令所需的一切',
          visualBlockSystem: {
            title: '可视化模块系统',
            description: '具有智能模块连接的直观拖放界面。使用我们的综合预设组件库构建复杂的 AI 行为。',
            highlight: '核心功能',
          },
          smartTemplates: {
            title: '智能模板',
            description: '针对常见 AI 任务的预构建指令模板。教育、生产力和创意用例，具有可定制参数和示例。',
            highlight: '热门',
          },
          realTimePreview: {
            title: '实时预览',
            description: '在修改指令时即时查看 AI 行为变化。具有即时反馈和迭代的实时测试环境。',
            highlight: '专业版',
          },
          instructionManagement: {
            title: '指令管理',
            description: '组织、分类和版本化您的 AI 指令。高级搜索、收藏和共享功能，支持团队协作。',
          },
          exportIntegration: {
            title: '导出与集成',
            description: '以多种格式导出您的指令。与流行的 AI 模型和平台直接 API 集成，实现无缝部署。',
          },
          analyticsInsights: {
            title: '分析与洞察',
            description: '跟踪使用模式、性能指标和优化建议。数据驱动的洞察来提高您的 AI 指令效果。',
          },
        },

        useCases: {
          title: '完美适用于',
          subtitle: '无论您是教育工作者、开发者还是 AI 爱好者',
          developers: {
            title: '开发者与工程师',
            description: 'AI 功能的快速原型开发、API 提示优化和集成测试',
          },
          contentCreators: {
            title: '内容创作者',
            description: '自定义写作助手、内容生成工作流程和创意 AI 协作',
          },
          educators: {
            title: '教育工作者与培训师',
            description: '交互式学习体验、自动评分系统和个性化辅导',
          },
          startups: {
            title: '初创团队',
            description: 'MVP 开发、客户支持自动化和产品功能增强',
          },
          analysts: {
            title: '业务分析师',
            description: '数据分析工作流程、报告生成和决策支持系统',
          },
          researchers: {
            title: 'AI 研究人员',
            description: '提示工程实验、行为分析和模型比较研究',
          },
        },

        stats: {
          blockTypes: {
            value: '30+',
            label: '模块类型',
            description: '多功能组件',
          },
          templates: {
            value: '25+',
            label: '模板',
            description: '即用模式',
          },
          instructions: {
            value: '500+',
            label: '指令',
            description: '社区创建',
          },
          responseTime: {
            value: '<100ms',
            label: '响应时间',
            description: '闪电般快速',
          },
        },

        cta: {
          title: '准备好开始你的<span class="text-primary font-medium"> AI 提示设计</span>之旅了吗？',
          startButton: '立即开始创建',
          subtitle: '创建账户，开始构建智能 AI 提示词',
        },

        playground: {
          title: '立即体验',
          subtitle: '通过交互式演示体验可视化提示词构建的强大功能',
          canvas: {
            title: '交互式画布',
            subtitle: '拖拽移动块，点击选择，体验提示词构建的简易性',
          },
          selectAll: '全选',
          generatePrompt: '生成提示词',
          preview: {
            selectedBlocks: '已选择的块',
            noBlocks: '点击画布上的块来选择它们',
            generatedPrompt: '生成的提示词',
            clickGenerate: '选择块并点击"生成提示词"查看结果',
            instructions: '试试这些',
            dragInstruction: '拖拽块来重新排列',
            doubleClickInstruction: '双击编辑内容',
            generateInstruction: '点击"生成"查看提示词',
          },
          tryFullBuilder: '试用完整构建器',
          fullBuilderDescription: '体验15+种块类型、模板和高级功能',
          demoBlocks: {
            roleDefinition: {
              title: '角色定义',
              content: '你是一个在内容创作和叙事方面有专业知识的有用AI写作助手。',
            },
            contextSetting: {
              title: '上下文设置',
              content: '专注于为对技术和创新感兴趣的普通受众创建引人入胜、信息丰富的博客内容。',
            },
            communicationStyle: {
              title: '沟通风格',
              content: '以友好、对话式的语调写作，既平易近人又专业，使用清晰的例子并避免专业术语。',
            },
          },
        },

        footer: {
          privacy: '隐私政策',
          terms: '服务条款',
          documentation: '文档',
          support: '支持',
          copyright: '© 2025 ProHelen. 为每个人革新 AI 指令设计。',
        },
      },

      templates: {
        title: '模板',
        subtitle: '从我们预建的模板中选择，快速创建适用于不同教育和生产力需求的自定义指令。',
        searchPlaceholder: '搜索模板...',
        categories: {
          all: '全部',
          goalSetting: '目标设定',
          education: '教育',
          career: '职业',
          productivity: '生产力',
          technology: '技术',
          business: '商业',
          marketing: '营销',
          analytics: '数据分析',
          design: '设计',
          innovation: '创新',
          finance: '金融',
        },
        filter: {
          loading: '加载分类中...',
        },
        list: {
          loading: '加载模板中...',
          error: '加载模板失败',
          tryAgain: '重试',
          noResults: '未找到符合搜索条件的模板。',
          premium: '高级版',
        },
        stats: {
          rating: '评分',
          reviews: '评价',
          usage: '使用',
          times: '次',
          favorites: '收藏',
        },
        actions: {
          viewDetails: '查看详情',
          useTemplate: '使用模板',
          favorite: '添加到收藏',
        },
        pagination: {
          previous: '上一页',
          next: '下一页',
          page: '第',
          of: '页，共',
        },
      },

      templateDetail: {
        loading: '加载模板中...',
        error: '加载模板失败',
        tryAgain: '重试',
        backToTemplates: '返回模板',
        share: '分享',
        useTemplate: '使用模板',
        overview: '概述',
        features: '功能特点',
        examples: '示例',
        examplesDescription: '查看此模板在实际场景中的应用',
        templatePreview: '模板预览',
        noPreviewContent: '暂无模板内容可供预览。',
        relatedTemplates: '相关模板',
        viewAllTemplates: '查看所有模板',
        ratingsReviews: '评分与评价',
        reviews: '评价',
        yourReview: '您的评价',
        rateTemplate: '为此模板评分',
        rating: '评分',
        comment: '评论（可选）',
        commentPlaceholder: '分享您对此模板的想法...',
        submitReview: '提交评价',
        updateReview: '更新评价',
        submitting: '提交中...',
        signInToRate: '请登录后为此模板评分',
        selectRating: '请选择评分',
        reviewSubmitted: '评价已提交！',
        reviewUpdated: '评价已更新！',
        reviewFailed: '提交评价失败',
        signInToReview: '登录后发表评价',
        noReviews: '暂无评价',
        showAllReviews: '显示所有评价',
        showLessReviews: '收起',
        ago: '前',
        now: '刚刚',
        timeUnits: {
          minute: '分钟',
          minutes: '分钟',
          hour: '小时',
          hours: '小时',
          day: '天',
          days: '天',
          month: '个月',
          months: '个月',
          year: '年',
          years: '年',
        },
      },

      myInstructions: {
        title: '我的指令',
        createNewInstruction: '创建新指令',
        searchPlaceholder: '搜索指令...',
        dateCreated: '创建日期',
        mostUsed: '最常使用',
        noMatchingInstructions: '未找到匹配的指令',
        noInstructionsYet: '您还没有创建任何指令',
        tryAgain: '重试',
        failedToLoad: '加载指令失败',

        published: '已发布',
        noDescription: '无描述',
        usedTimes: '使用了 {{count}} 次',
        edit: '编辑',
        duplicate: '复制',
        addToFavorites: '添加到收藏',
        removeFromFavorites: '取消收藏',
        publishToLibrary: '发布到模板库',
        unpublishFromLibrary: '取消发布',
        delete: '删除',

        instructionDeleted: '指令删除成功',
        deleteFailed: '删除失败，请重试',
        addedToFavorites: '已添加到收藏',
        removedFromFavorites: '已取消收藏',
        favoriteOperationFailed: '操作失败，请重试',
        instructionDuplicated: '指令复制成功',
        duplicateFailed: '复制失败，请重试',
        instructionPublished: '指令已发布到模板库',
        publishFailed: '发布失败，请重试',
        instructionUnpublished: '指令已从模板库取消发布',
        unpublishFailed: '取消发布失败，请重试',

        deleteInstruction: {
          title: '删除指令',
          description: '您确定要删除这个指令吗？此操作无法撤销。',
          confirm: '删除',
          cancel: '取消',
        },
        publishInstruction: {
          title: '发布到模板库',
          description: '您确定要将此指令发布到模板库吗？其他用户将能够查看和使用它。',
          confirm: '发布',
          cancel: '取消',
        },
        unpublishInstruction: {
          title: '取消发布',
          description: '您确定要从模板库取消发布此指令吗？其他用户将无法再查看和使用它。',
          confirm: '取消发布',
          cancel: '取消',
        },
      },

      builder: {
        title: '指令构建器',
        untitledInstruction: '未命名指令',
        addDescription: '添加描述...',
        simpleMode: '简单模式',
        switchToSimpleMode: '切换到简单模式',
        simpleModeTip: '基于问题的指令创建',
        getHelp: '获取帮助和快捷键',
        helpTip: '按 F1 或点击获取帮助',

        quickSetup: {
          title: '快速设置',
          subtitle: '回答几个简单问题即可开始',
          advancedMode: '高级模式',
          purpose: {
            title: '您希望AI助手帮助您做什么？',
            description: '选择主要用途，我们会推荐合适的配置',
            learning: {
              label: '🎓 学习助手',
              description: '帮我学习新知识、回答问题、练习技能',
            },
            writing: {
              label: '✍️ 写作助手',
              description: '帮我写文章、邮件、创意内容',
            },
            work: {
              label: '💼 工作助手',
              description: '提高工作效率、分析数据、解决业务问题',
            },
            personal: {
              label: '🏠 个人助手',
              description: '日常决策、健康建议、个人规划',
            },
          },
          tone: {
            title: '您偏好什么沟通风格？',
            description: '选择您希望AI与您交互的方式',
            professional: {
              label: '🎯 专业正式',
              description: '权威严谨，像专家一样',
            },
            friendly: {
              label: '😊 友好随和',
              description: '温暖亲近，像朋友一样',
            },
            encouraging: {
              label: '💪 鼓励支持',
              description: '激励积极，像教练一样',
            },
            direct: {
              label: '⚡ 直接简洁',
              description: '直奔主题，无废话',
            },
          },
          expertise: {
            title: '您的经验水平如何？',
            description: '让AI了解如何为您调整解释方式',
            beginner: {
              label: '🌱 完全初学者',
              description: '我是新手，需要基础解释',
            },
            intermediate: {
              label: '🌿 有一些经验',
              description: '我了解一些基础，但需要指导',
            },
            advanced: {
              label: '🌳 相当有经验',
              description: '我很熟练，只需要高级建议',
            },
          },
          goal: {
            title: '您想实现什么具体目标？',
            description: '详细描述您的目标，以便AI更好地了解您的需求',
            placeholder: '在这里输入您的目标...',
          },
          steps: {
            previous: '上一步',
            next: '下一步',
            createInstructions: '创建指令',
          },
        },

        analyzer: {
          title: 'AI助手智能分析',
          subtitle: '告诉我您的需求，我来帮您自动创建AI指令',
          switchToAdvanced: '高级模式',

          steps: {
            describe: '描述需求',
            confirm: '确认方案',
          },

          input: {
            title: '告诉我您想要什么样的AI助手',
            description: '用自然语言描述您的需求，比如用途、风格、专业领域等',
            placeholder: '例如：我想要一个帮我准备技术面试的AI助手，重点是JavaScript和React，要友好耐心...（按回车键分析，Shift+回车换行）',
            analyzing: '正在分析...',
            analyze: '开始分析',
            characterLimit: '{{count}}/500',
          },

          examples: {
            title: '不知道怎么描述？试试这些示例',
            learning: {
              title: '🎓 学习助手',
              text: '我想要一个帮我准备技术面试的AI助手，重点是JavaScript和React，要友好耐心',
            },
            work: {
              title: '💼 工作助手',
              text: '创建一个代码审查助手，能够分析代码质量并给出改进建议',
            },
            writing: {
              title: '✍️ 写作助手',
              text: '我需要一个写作伙伴来改进我的文章，让文章更有说服力',
            },
            personal: {
              title: '🏠 个人助手',
              text: '帮我创建一个英语学习导师，能够纠正语法错误并解释用法',
            },
          },

          results: {
            intent: '我理解了您的需求',
            extracted: '为您提取出以下功能模块',
            extractedDescription: '我根据您的描述自动识别出这些模块，您可以调整选择',
            suggested: '建议添加的功能模块',
            suggestedDescription: '这些模块可以让您的AI助手效果更好',
            confidence: '{{percent}}% 匹配',
            reasoning: '识别原因：{{reason}}',
            impact: {
              high: '高影响',
              medium: '中影响',
              low: '低影响',
            },
            reanalyze: '重新分析',
            confirm: '确认并创建',
          },

          errors: {
            emptyPrompt: '请输入您的需求描述',
            analysisFailed: '分析失败，请稍后重试',
          },

          defaults: {
            generatedByAnalysis: '通过AI分析创建的指令',
            defaultAssistantTitle: 'AI助手',
          },
        },

        promptPreview: {
          title: 'AI指令预览',
          blocksConfigured: '{{count}} 个模块已配置',
          helpText: '添加指令模块来查看AI指令预览',
          actions: {
            copy: '复制',
            export: '导出',
            test: '试用',
            save: '保存',
          },
        },

        guided: {
          welcome: {
            title: '引导设置',
            subtitle: '逐步创建强大的AI指令',
            description: '我们将引导您构建第一个指令，提供有用的提示和建议。',
            getStarted: '开始',
            backToAnalyzer: '返回智能分析',
            skipToAdvanced: '跳转到高级模式',
          },
          steps: {
            arrange: '排列模块',
            customize: '自定义内容',
            test: '测试优化',
          },
          header: {
            next: '下一步',
            previous: '上一步',
            switchToAdvanced: '切换到高级模式',
          },
          canvas: {

            arrangeCards: '排列您的卡片',
            arrangeMessage: '拖拽指令卡片来可视化组织它们。连接会根据逻辑流程自动创建。',
            arrangeTip: '将卡片排列成清晰的可视化布局以提高可读性 - 连接是智能和自动的。',
            customizeContent: '自定义内容',
            customizeMessage: '点击任何卡片来编辑其内容。让它更具体以获得更好的AI响应。',
            customizeTip: '您的指令越详细，您的AI表现就越好。',
            readyToTest: '准备试一下',
            readyMessage: '您的指令流程已完成！现在该看看它如何工作了。',
            readyTip: '经常测试以完善您的指令。',
            arrangeComplete: '太好了！您的卡片已自动连接成逻辑流程。试着移动它们看看布局如何影响可读性。',
            customizeComplete: '完美！您已自定义了 {{count}} 张卡片{{s}}。您的AI助手正在变得更聪明！',

            noBlocks: '还没有模块',
            noBlocksMessage: '首先，您需要从左侧面板添加一些指令模块。',
            noBlocksAction: '点击左侧的模块类型来添加',
            dragToArrange: '拖拽排列',
            dragMessage: '太好了！现在拖拽这些模块来按逻辑顺序组织它们。',
            dragAction: '抓住并拖拽任何模块来移动它',
            dragHint: '拖拽我！',
            clickToEdit: '点击编辑内容',
            clickMessage: '现在点击高亮的模块来添加您的具体指令。',
            clickAction: '点击高亮的模块来编辑它',
            clickHint: '点击编辑！',
            allCustomized: '所有模块已自定义！',
            allCustomizedMessage: '太棒了！您已经用具体指令自定义了所有 {{count}} 个模块。',
            allCustomizedAction: '准备测试您的AI助手',
            testReady: '准备测试！',
            testReadyMessage: '您的AI指令流程已完成并准备好测试。',
            testReadyAction: '查看右侧的预览面板',
            lookRight: '查看右侧的预览面板 →',
            progress: '进度',
            allDone: '全部完成！',
          },
        },

        components: {
          blockPicker: {
            title: '添加指令模块',
            description: '选择要添加到提示中的模块类型',
            searchPlaceholder: '搜索模块...',
            helpText: '点击立即添加或拖拽到画布上定位',
            categories: {
              quickStart: '快速开始',
              all: '全部',
              roleContext: '角色与上下文',
              interactionStyle: '交互风格',
              taskControl: '任务控制',
              thinkingLogic: '思维与逻辑',
              skillsDevelopment: '技能发展',
            },
            quickStart: {
              title: '快速开始',
              subtitle: '选择预设模板，包含2-3个核心模块，快速启动您的AI助手',
              addAll: '添加所有模块',
              tutor: {
                label: 'AI导师',
                description: '专为教育辅助设计，提供个性化学习方法',
              },
              businessConsultant: {
                label: '商业顾问',
                description: '专业建议，结构化且有说服力的沟通风格',
              },
              creativeAssistant: {
                label: '创意助手',
                description: '创新思维，富有魅力的个性，适合创意项目',
              },
              stepByStepGuide: {
                label: '分步指导',
                description: '清晰的结构化指令，分解为易管理的步骤',
              },
            },
            blocks: {

              roleDefinition: {
                label: '角色定义',
                description: '定义AI助手角色和专业知识',
              },
              contextSetting: {
                label: '上下文设置',
                description: '设置对话上下文和背景',
              },
              outputFormat: {
                label: '输出格式',
                description: '指定响应格式和结构',
              },

              goalSetting: {
                label: '目标设定',
                description: '设置SMART学习目标',
              },
              learningStyle: {
                label: '学习风格',
                description: '自定义学习方法',
              },
              subjectFocus: {
                label: '学科焦点',
                description: '特定学科指令',
              },
              difficultyLevel: {
                label: '难度级别',
                description: '设置适当的复杂度级别',
              },

              communicationStyle: {
                label: '沟通风格',
                description: '设置语调和沟通方式',
              },
              feedbackStyle: {
                label: '反馈风格',
                description: '自定义反馈方式',
              },
              personalityTraits: {
                label: '个性特征',
                description: '添加个性特征',
              },

              stepByStep: {
                label: '逐步指导',
                description: '分解为顺序步骤',
              },
              timeManagement: {
                label: '时间管理',
                description: '规划学习时间表和时机',
              },
              prioritization: {
                label: '优先级排序',
                description: '设置优先级和重要性级别',
              },

              conditionalLogic: {
                label: '条件逻辑',
                description: '添加if-then条件响应',
              },
              creativeThinking: {
                label: '创意思维',
                description: '鼓励创造性问题解决',
              },
              errorHandling: {
                label: '错误处理',
                description: '处理错误和纠正',
              },

              careerPlanning: {
                label: '职业规划',
                description: '职业发展指导',
              },
              skillAssessment: {
                label: '技能评估',
                description: '评估当前技能和差距',
              },
            },
          },
          customNode: {
            clickToAdd: '点击添加指令...',
            enterInstructions: '输入{{label}}指令...',
            confirmDelete: {
              title: '删除模块',
              description: '您确定要删除这个模块吗？此操作无法撤销。',
              confirm: '删除',
              cancel: '取消',
            },
          },
          toolbar: {
            undo: '撤销上一个操作',
            redo: '重做上一个操作',
            clearCanvas: '清空画布',
            zoomIn: '放大',
            zoomOut: '缩小',
            fullscreen: '全屏',
            undone: '已撤销',
            redone: '已重做',
            enteredFullscreen: '已进入全屏模式',
            exitedFullscreen: '已退出全屏模式',
            fullscreenNotSupported: '不支持全屏',
            canvasCleared: '画布已清空',
            zoomError: '请输入10%到500%之间的缩放值',
            shortcuts: {
              ctrlZ: 'Ctrl+Z',
              ctrlY: 'Ctrl+Y',
            },
          },

          promptPreview: {
            title: '提示预览',
            formats: {
              customInstructions: '自定义指令',
              systemPrompt: '系统提示',
              rawText: '原始文本',
            },
            actions: {
              copy: '复制',
              export: '导出',
              test: '开始',
              save: '保存',
            },
            placeholder: '通过在画布上添加模块来开始构建您的自定义指令...',
            systemPromptPlaceholder: '尚未配置系统提示。添加指令模块来生成系统提示。',
            rawTextPlaceholder: '无内容显示',
            messages: {
              copied: '提示已复制到剪贴板！',
              copyFailed: '复制提示失败',
              exported: '提示导出成功！',
              addContentBeforeTest: '请在测试前添加一些内容到您的提示中',
              addContentBeforeSave: '请在保存前添加一些内容到您的提示中',
              systemPromptCopied: '系统提示已复制到剪贴板！',
            },
            stats: {
              blocks: '已配置 {{count}} 个模块',
              tokens: '约{{count}}个令牌',
            },
            helpText: '在画布上添加指令模块以在此处查看生成的提示',
          },
          emptyStateGuide: {
            title: '准备好构建您的AI助手了吗？',
            description: '首先向画布添加指令块。它们会自动以逻辑流程连接，让提示词创建变得简单直观。',
            addFirstBlock: '添加您的第一个块',
            takeTour: '开始导览',
            helpButton: '需要帮助？查看指南',
            features: {
              addBlocks: {
                title: '添加块',
                description: '从15+种指令类型中选择',
              },
              autoConnect: {
                title: '自动连接',
                description: '智能连接创建逻辑流程',
              },
              customize: {
                title: '自定义',
                description: '编辑内容以满足您的需求',
              },
            },
          },
          flowCanvas: {
            addBlock: '添加块',
            addBlockTooltip: '浏览并向画布添加指令块',
            addBlockTooltipSub: '18种不同的块类型可用',
            smartSuggestions: '智能建议',
            smartSuggestionsTooltip: '获取AI驱动的块推荐',
            smartSuggestionsTooltipSub: '基于您当前的块和最佳实践',
          },
          valueDemonstration: {
            title: '构建块效果展示',
            subtitle: '看看你添加的每个构建块如何改进AI的回答质量',
            showImpact: '查看效果',
            beforeTitle: '基础AI回答',
            afterTitle: '优化后的AI回答',
            beforeResponse: '你好！我是AI助手，有什么可以帮助你的吗？我会尽力为你提供有用的信息和建议。',
            afterDescription: '使用 {{count}} 个构建块后，AI提供更专业、个性化和结构化的回答',
            blocksTitle: '每个构建块的具体改进',
            cumulativeTitle: '累积效果',
            blocksCount: '{{count}}个构建块',
            qualityImprovement: '{{percent}}%回答质量提升',
            professionalFeatures: '{{count}}个专业特性',
            addMoreBlocks: '继续添加更多构建块',
            keepBuilding: '每多添加一个构建块，AI的回答就会更加精准和专业',
            blocks: {
              roleDefinition: '角色定义',
              communicationStyle: '沟通风格',
              outputFormat: '输出格式',
              learningStyle: '学习风格',
              goalSetting: '目标设定',
              contextSetting: '上下文设置',
            },
            improvements: {
              personalizedApproach: '个性化方法和专业身份',
              professionalTone: '一致的沟通风格',
              structuredFormat: '组织化和结构化的回答',
              structuredLearning: '适应性学习方法',
              goalOriented: '清晰的目标导向指导',
              tailoredResponse: '定制化回答方法',
              proactiveSupport: '主动支持和建议',
              actionableContent: '可操作的实用内容',
            },
            before: '添加前:',
            after: '添加后:',
            blockExamples: {
              roleDefinition: {
                before: '你好，有什么可以帮助你的吗？',
                afterTemplate: '作为你的{{role}}，我将为你提供专业的帮助。',
                afterWithIdentity: '{{identity}}。我将为你提供专业的帮助。',
              },
              communicationStyle: {
                before: '我会尽力帮助你解决问题。',
                afterTemplate: '我会采用{{style}}的方式与你交流，确保你能轻松理解我的回答。',
              },
              outputFormat: {
                before: '这里是一些信息...',
                afterTemplate: '📋 结构化回答\n{{format}}\n\n让信息更清晰易懂。',
              },
              learningStyle: {
                before: '这个概念是...',
                afterTemplate: '📚 学习方法：{{style}}\n我会根据你的学习偏好来调整解释方式。',
              },
              goalSetting: {
                before: '我会尽量回答你的问题。',
                afterTemplate: '🎯 目标导向：{{goal}}\n让我们一步步实现你的目标。',
              },
              contextSetting: {
                before: '我来帮助你。',
                afterTemplate: '🔧 上下文背景：{{context}}\n基于这个背景，我能提供更准确的建议。',
              },
            },
          },

          helpPanel: {
            title: 'ProHelen Help Center',
            tabs: {
              guide: '块指南',
              shortcuts: '快捷键',
              faq: '常见问题',
            },
            tourCta: {
              title: '初次使用ProHelen？',
              description: '进行2分钟的引导教程，学习基础知识！',
              button: '开始教程',
            },
            guide: {
              understandingBlocks: {
                title: '理解块',
                description: '块是您AI指令的构建组件。每个块都有特定的用途，可以组合创建强大的自定义提示词。',
              },
              bestPractices: {
                title: '最佳实践',
                tips: {
                  startWithRole: '从角色定义块开始，建立AI的视角',
                  useContext: '尽早使用上下文设置提供必要的背景信息',
                  addOutputFormat: '添加输出格式块确保响应结构一致',
                  testFrequently: '使用预览面板频繁测试您的指令',
                  useSmartSuggestions: '使用智能建议发现互补的块',
                },
              },
            },
            blockGuide: {
              roleContext: {
                title: '角色与上下文',
                description: 'AI身份、背景和工作环境',
                blocks: {
                  roleDefinition: {
                    name: '角色定义',
                    use: '定义AI应该扮演的角色（老师、助手、专家等）',
                  },
                  contextSetting: {
                    name: '上下文设置',
                    use: '提供背景信息和情境上下文',
                  },
                  personalityTraits: {
                    name: '个性特征',
                    use: '添加性格特征和行为模式',
                  },
                  subjectFocus: {
                    name: '主题焦点',
                    use: '指定主题领域和所需的详细程度',
                  },
                },
              },
              interactionStyle: {
                title: '交互风格',
                description: '沟通模式和反馈方式',
                blocks: {
                  communicationStyle: {
                    name: '沟通风格',
                    use: '设置语调、正式程度和对话方式',
                  },
                  feedbackStyle: {
                    name: '反馈风格',
                    use: '定义AI应如何提供纠正和指导',
                  },
                  learningStyle: {
                    name: '学习风格',
                    use: '基于学习偏好自定义方法',
                  },
                },
              },
              taskControl: {
                title: '任务控制',
                description: '目标设定、输出格式和任务管理',
                blocks: {
                  goalSetting: {
                    name: '目标设定',
                    use: '定义具体的学习目标和成果',
                  },
                  outputFormat: {
                    name: '输出格式',
                    use: '指定您希望AI如何构建其响应',
                  },
                  difficultyLevel: {
                    name: '难度级别',
                    use: '设置适当的复杂度级别',
                  },
                  timeManagement: {
                    name: '时间管理',
                    use: '规划学习时间表和时机',
                  },
                  prioritization: {
                    name: '优先级排序',
                    use: '设置优先级和重要性级别',
                  },
                },
              },
              thinkingLogic: {
                title: '思维与逻辑',
                description: '认知过程和推理模式',
                blocks: {
                  stepByStep: {
                    name: '逐步指导',
                    use: '分解为顺序步骤',
                  },
                  conditionalLogic: {
                    name: '条件逻辑',
                    use: '添加if-then条件响应',
                  },
                  creativeThinking: {
                    name: '创意思维',
                    use: '鼓励创造性问题解决',
                  },
                  errorHandling: {
                    name: '错误处理',
                    use: '处理错误和纠正',
                  },
                },
              },
              skillsDevelopment: {
                title: '技能发展',
                description: '专业成长和技能评估',
                blocks: {
                  careerPlanning: {
                    name: '职业规划',
                    use: '职业发展指导',
                  },
                  skillAssessment: {
                    name: '技能评估',
                    use: '评估当前技能和差距',
                  },
                },
              },
            },
            shortcuts: {
              title: '键盘快捷键',
              description: '使用这些键盘快捷键加速您的工作流程。',
              undo: '撤销上一个操作',
              redo: '重做上一个操作',
              openHelp: '打开帮助面板',
              closeDialogs: '关闭对话框和面板',
              moveBlocks: '在画布上移动块',
              getSuggestions: '获取智能建议',
              editBlock: '编辑块内容',
              confirmDialogs: '在对话框中确认',
              zoom: '在画布上缩放',
            },
            mouseActions: {
              title: '鼠标操作',
              panCanvas: '平移画布',
              panCanvasHow: '在空白处点击并拖拽',
              connectBlocks: '连接块',
              connectBlocksHow: '从输出拖拽到输入句柄',
              selectMultiple: '选择多个块',
              selectMultipleHow: 'Ctrl + 点击',
              zoom: '缩放',
              zoomHow: '鼠标滚轮或缩放控件',
            },
            faqs: {
              autoConnect: {
                question: '块如何自动连接？',
                answer: '块基于逻辑流程和最佳实践自动连接。系统分析块类型并创建最适合有效提示词构建的连接。',
              },
              whyAutomatic: {
                question: '为什么连接是自动的？',
                answer: '自动连接使工具更容易使用，特别是对非技术用户。系统基于经过验证的提示词工程模式确保适当的流程和序列。',
              },
              deleteBlock: {
                question: '删除块时会发生什么？',
                answer: '当您删除一个块时，剩余的块会自动重新连接以保持逻辑流程。生成的提示词会自动更新。',
              },
              reuseBlocks: {
                question: '我可以重用我创建的块吗？',
                answer: '是的！将您的指令保存为模板或将内容从一个块复制到另一个块。您也可以通过复制来复制现有块。',
              },
              improvePrompts: {
                question: '如何改进我的提示词？',
                answer: '为每个块添加具体内容，定期测试您的提示词，并使用智能建议功能发现您可能遗漏的相关块。',
              },
            },
            faq: {
              title: '常见问题',
            },
            support: {
              title: '仍需要帮助？',
              description: '找不到您要找的内容？我们在这里帮助您！',
              contactButton: '联系支持',
              tourAgainButton: '重新开始教程',
            },
          },
          onboardingTour: {
            steps: {
              welcome: {
                title: '欢迎使用ProHelen！',
                content: 'ProHelen是一个可视化提示词设计工具，帮助您使用拖放块创建自定义AI指令。让我们快速浏览一下！',
              },
              titleInput: {
                title: '命名您的创作',
                content: '首先为您的指令提供一个描述性标题和可选描述，以帮助组织您的工作。',
              },
              addBlock: {
                title: '添加构建块',
                content: '点击"添加块"从18种不同的指令块中选择。每个块在构建您的AI提示词中都有特定用途。',
              },
              canvas: {
                title: '可视化画布',
                content: '这是您的工作空间！将块拖到这里，连接它们，看着您的指令变得生动。您可以拖动块并连接它们以创建复杂的流程。',
              },
              smartSuggestions: {
                title: '智能建议',
                content: '获取AI驱动的块推荐，这些块能很好地协同工作。我们的系统从成功的提示词组合中学习。',
              },
              previewPanel: {
                title: '实时预览',
                content: '实时查看您生成的指令！在不同格式之间切换并立即测试您的提示词。',
              },
              toolbar: {
                title: '强大的工具',
                content: '使用撤销/重做、缩放控件和布局工具完善您的设计。专业提示：尝试Ctrl+Z撤销！',
              },
            },
            progress: {
              step: '第',
              of: '步，共',
              steps: '步',
            },
            buttons: {
              skip: '跳过教程',
              next: '下一步',
              back: '返回',
              done: '完成！',
            },
          },
          recommendationPanel: {
            title: '智能建议',
            emptyState: '添加一些块以获得\n个性化建议',
            tip: '💡 随着您更多使用应用，建议会不断改进',
          },
          progressIndicator: {
            completeness: '完整度',
            blocks: '个模块',
            tooltip: '点击查看详细进度分析',
            detailTitle: '构建进度分析',
            overallScore: '总体评分',
            status: {
              excellent: '优秀！您的AI助手经过高度优化',
              good: '进度很好！您的助手配置良好',
              fair: '正在进步！添加更多组件以获得更好效果',
              starting: '刚开始！继续构建以改进',
            },
            starting: '开始阶段',
            complete: '完成',
            improvementChecklist: '改进清单',
            points: '分',
            totalBlocks: '总模块数',
            categories: '类别数',
            customized: '已定制',
            nextSteps: '下一步',
            checklist: {
              roleDefinition: '定义AI助手角色和专业知识',
              contextSetting: '提供上下文和背景信息',
              outputFormat: '指定响应格式和结构',
              taskClarity: '定义明确的任务和目标',
              communicationStyle: '设置语调和沟通方式',
              customContent: '为大部分模块添加自定义内容',
              examples: '包含示例和演示',
              diversity: '使用不同类别的模块',
            },
            suggestions: {
              addCore: '首先添加核心模块：角色定义、上下文设置和输出格式，建立AI的基础框架。',
              addContent: '基础很好！现在添加具体内容和示例，让您的AI更有效、更可靠。',
              refine: '进展优秀！优化您的内容，添加更多示例，并考虑高级模块来实现专门行为。',
            },
          },
        },
        modals: {
          confirmClear: {
            title: '清空画布',
            message: '您确定要清空画布吗？这将删除所有块和连接。',
            warning: '⚠️ 此操作不能撤销。',
            cancel: '取消',
            confirm: '清空画布',
          },
          saveInstruction: {
            title: '保存指令',
            titleLabel: '标题 *',
            titlePlaceholder: '输入指令标题...',
            descriptionLabel: '描述',
            descriptionPlaceholder: '描述这个指令的功能...',
            categoryLabel: '分类',
            tagsLabel: '标签',
            tagsPlaceholder: '添加标签...',
            tagsPlaceholderImproved: '输入标签后按 Enter 或逗号添加...',
            tagsHint: '💡 提示：按 Enter 或逗号快速添加标签',
            addTag: '添加',
            removeTag: '删除标签',
            cancel: '取消',
            save: '保存指令',
            saving: '保存中...',
            categories: {
              general: '通用',
              academic: '学术',
              writing: '写作',
              programming: '编程',
              dataAnalysis: '数据分析',
              creative: '创意',
              productivity: '效率',
              research: '研究',
              education: '教育',
              business: '商务',
            },
          },
          saveTemplate: {
            title: '保存为模板',
            titleLabel: '标题',
            titlePlaceholder: '输入模板标题...',
            descriptionLabel: '描述',
            descriptionPlaceholder: '描述这个模板的功能...',
            categoryLabel: '分类',
            tagsLabel: '标签',
            tagsPlaceholder: '添加标签...',
            addTag: '添加',
            makePublic: '公开此模板（其他人可以发现和使用它）',
            cancel: '取消',
            save: '保存模板',
            saving: '保存中...',
            titleRequired: '请输入标题',
            descriptionRequired: '请输入描述',
            categories: {
              goalSetting: '目标设定',
              education: '教育',
              career: '职业',
              productivity: '效率',
              communication: '沟通',
              planning: '规划',
              other: '其他',
            },
          },
          testPrompt: {
            title: '试用您的AI',
            emptyState: '在下方输入消息与您的AI聊天',
            thinking: '思考中...',
            inputPlaceholder: '输入您的测试消息...（按Enter发送）',
            autoMessage: '你好！请介绍一下你自己，并说明你可以帮助我做什么。',
            copied: '已复制到剪贴板',
            newConversation: '新对话',
          },
        },
      },
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en',

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    debug: typeof window !== 'undefined' && window.location.hostname === 'localhost',
  })

export default i18n
