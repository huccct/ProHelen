import sanitizeHtml from 'sanitize-html'

const sanitizeConfig = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: 'recursiveEscape' as const,
  allowedSchemes: [],
  allowProtocolRelative: false,
  enforceHtmlBoundary: true,
  parseStyleAttributes: false,
  allowedStyles: {},
  allowedClasses: {},
  allowedIframeHostnames: [],
  allowedIframeDomains: [],
  transformTags: {},
  exclusiveFilter: () => false,
  textFilter: (text: string) => text,
  allowedFilters: [],
  allowedNamespaces: [],
  nonTextTags: ['script', 'style', 'textarea', 'noscript'],
}

/**
 * sanitize html content
 * @param input - the html content to sanitize
 * @returns the sanitized html content
 */
export function sanitizeHtmlContent(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  return sanitizeHtml(input, sanitizeConfig)
}

/**
 * sanitize text
 * @param input - the text to sanitize
 * @returns the sanitized text
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  let cleaned = input.replace(/<[^>]*>/g, '')

  cleaned = cleaned.replace(/javascript:/gi, '')
  cleaned = cleaned.replace(/on\w+\s*=/gi, '')
  cleaned = cleaned.replace(/<script/gi, '')
  cleaned = cleaned.replace(/<\/script>/gi, '')
  cleaned = cleaned.replace(/<iframe/gi, '')
  cleaned = cleaned.replace(/<\/iframe>/gi, '')
  cleaned = cleaned.replace(/<object/gi, '')
  cleaned = cleaned.replace(/<\/object>/gi, '')
  cleaned = cleaned.replace(/<embed/gi, '')
  cleaned = cleaned.replace(/<\/embed>/gi, '')

  cleaned = cleaned.replace(/[<>]/g, '')

  return cleaned.trim()
}

/**
 * sanitize user input
 * @param input - the user input to sanitize
 * @returns the sanitized user input
 */
export function sanitizeUserInput(input: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value)
    }
    else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeUserInput(value)
    }
    else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * sanitize email
 * @param email - the email to sanitize
 * @returns the sanitized email
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return ''
  }

  const emailRegex = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
  const cleaned = email.toLowerCase().trim()

  if (!emailRegex.test(cleaned)) {
    return ''
  }

  return cleaned
}

/**
 * sanitize password
 * @param password - the password to sanitize
 * @returns the sanitized password
 */
export function sanitizePassword(password: string): string {
  if (typeof password !== 'string') {
    return ''
  }

  return password.split('').filter(char => char.charCodeAt(0) >= 32 && char.charCodeAt(0) !== 127).join('')
}
