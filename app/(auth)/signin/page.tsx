'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FaGithub, FaMicrosoft } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const buttonVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
}

export default function SignIn() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="border-b border-gray-800"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold cursor-pointer"
              onClick={() => router.push('/')}
            >
              ProHelen
            </motion.div>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
          <motion.div
            className="w-full max-w-md space-y-8"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <div className="text-center space-y-4">
              <motion.h2
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                Welcome Back
              </motion.h2>
              <motion.p
                className="text-gray-400"
                variants={fadeIn}
              >
                Sign in to continue building your AI assistant
              </motion.p>
            </div>

            <motion.div
              className="space-y-4"
              variants={fadeIn}
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
              >
                <Button
                  variant="outline"
                  className="flex justify-start items-center gap-2 w-full h-12 bg-white text-black hover:bg-gray-100 border-none transition-all duration-200 cursor-pointer"
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                >
                  <span className="w-8" />
                  <FcGoogle className="mr-2 h-5 w-5" />
                  Continue with Google
                </Button>
              </motion.div>

              <motion.div
                variants={buttonVariants}
                whileHover="hover"
              >
                <Button
                  variant="outline"
                  className="flex justify-start items-center gap-2 w-full h-12 bg-[#24292F] text-white hover:bg-[#2d333b] border-none transition-all duration-200 cursor-pointer"
                  onClick={() => signIn('github', { callbackUrl: '/' })}
                >
                  <span className="w-8" />
                  <FaGithub className="mr-2 h-5 w-5" />
                  Continue with GitHub
                </Button>
              </motion.div>

              <motion.div
                variants={buttonVariants}
                whileHover="hover"
              >
                <Button
                  variant="outline"
                  className="flex justify-start items-center gap-2 w-full h-12 bg-[#2F2F2F] text-white hover:bg-[#3b3b3b] border-none transition-all duration-200 cursor-pointer"
                  onClick={() => signIn('azure-ad', { callbackUrl: '/' })}
                >
                  <span className="w-8" />
                  <FaMicrosoft className="mr-2 h-5 w-5" />
                  Continue with Microsoft
                </Button>
              </motion.div>

              {/* <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex justify-start items-center gap-2 w-full h-12 bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all duration-200 cursor-pointer"
                  >
                    <span className="w-8" />
                    <MdEmail className="mr-2 h-5 w-5" />
                    Continue with Email
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sign in with Email</DialogTitle>
                  </DialogHeader>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="mb-4"
                  />
                  <DialogFooter>
                    <Button
                      onClick={async () => {
                        await signIn('email', { email, callbackUrl: '/' })
                        // 你可以加个 toast
                      }}
                    >
                      Send Magic Link
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog> */}
            </motion.div>

            <motion.p
              className="text-center text-sm text-gray-500"
              variants={fadeIn}
            >
              By continuing, you agree to our Terms of Service and Privacy Policy
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
