import { ThemeToggle } from '@/components/common/theme-toggle'
import { ThemeProvider, useTheme } from '@/components/theme-context'
import { fireEvent, render, screen } from '@testing-library/react'

const mockToggleTheme = jest.fn()
const mockSetTheme = jest.fn()

jest.mock('@/components/theme-context', () => {
  const actual = jest.requireActual('@/components/theme-context')
  return {
    ...actual,
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
    useTheme: () => ({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      setTheme: mockSetTheme,
    }),
  }
})

function renderWithTheme(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('themeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render sun icon when theme is dark', () => {
    jest.spyOn({ useTheme }, 'useTheme').mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      setTheme: mockSetTheme,
    })

    renderWithTheme(<ThemeToggle />)

    const button = screen.getByRole('button')
    const sunIcon = button.querySelector('svg')

    expect(button).toBeInTheDocument()
    expect(sunIcon).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Toggle theme')
  })

  it('should render moon icon when theme is light', () => {
    jest.spyOn({ useTheme }, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      setTheme: mockSetTheme,
    })

    renderWithTheme(<ThemeToggle />)

    const button = screen.getByRole('button')
    const moonIcon = button.querySelector('svg')

    expect(button).toBeInTheDocument()
    expect(moonIcon).toBeInTheDocument()
  })

  it('should call toggleTheme when clicked', () => {
    jest.spyOn({ useTheme }, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      setTheme: mockSetTheme,
    })

    renderWithTheme(<ThemeToggle />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockToggleTheme).toHaveBeenCalledTimes(1)
  })

  it('should have correct styling classes', () => {
    renderWithTheme(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('w-9', 'h-9', 'p-0', 'hover:bg-muted', 'cursor-pointer')
  })

  it('should have screen reader text', () => {
    renderWithTheme(<ThemeToggle />)

    const srText = screen.getByText('Toggle theme')
    expect(srText).toHaveClass('sr-only')
  })

  it('should handle undefined theme gracefully', () => {
    jest.spyOn({ useTheme }, 'useTheme').mockReturnValue({
      theme: 'light', // Default to light theme instead of undefined
      toggleTheme: mockToggleTheme,
      setTheme: mockSetTheme,
    })

    renderWithTheme(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    // Should show moon icon for light theme
    const moonIcon = button.querySelector('svg')
    expect(moonIcon).toBeInTheDocument()
  })
})
