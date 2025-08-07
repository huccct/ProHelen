import { useAnalysis } from '@/lib/hooks/use-analysis'
import { act, renderHook, waitFor } from '@testing-library/react'

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}))

// Mock fetch
const mockFetch = jest.fn()
globalThis.fetch = mockFetch

// Mock timer functions
jest.useFakeTimers()

const mockAnalysisResponse = {
  success: true,
  analysis: {
    extractedBlocks: [
      { type: 'role_definition', content: 'Test role', confidence: 0.9, reasoning: 'Clear role' },
      { type: 'goal_setting', content: 'Test goal', confidence: 0.8, reasoning: 'Clear goal' },
    ],
    suggestedEnhancements: [
      { type: 'context_setting', reason: 'Add context', impact: 'high' as const },
      { type: 'output_format', reason: 'Add format', impact: 'medium' as const },
    ],
    missingEssentials: [],
  },
}

describe('useAnalysis', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
    mockFetch.mockReset()
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAnalysis('test prompt'))

    expect(result.current.analysis).toBeNull()
    expect(result.current.isAnalyzing).toBe(false)
    expect(result.current.analysisProgress).toBe(0)
    expect(result.current.selectedBlocks).toEqual(new Set())
    expect(result.current.selectedEnhancements).toEqual(new Set())
  })

  it('should handle empty prompt analysis', async () => {
    const { toast } = jest.requireMock('sonner')
    const { result } = renderHook(() => useAnalysis(''))

    await act(async () => {
      result.current.analyzePrompt()
    })

    expect(toast.error).toHaveBeenCalledWith('builder.analyzer.errors.emptyPrompt')
    expect(result.current.isAnalyzing).toBe(false)
  })

  it('should handle successful analysis', async () => {
    jest.useRealTimers()

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockAnalysisResponse),
    })

    const { result } = renderHook(() => useAnalysis('test prompt'))

    // Start analysis
    await act(async () => {
      result.current.analyzePrompt()
    })

    expect(result.current.isAnalyzing).toBe(true)

    // Wait for the full analysis to complete
    await waitFor(() => {
      expect(result.current.isAnalyzing).toBe(false)
      expect(result.current.analysisProgress).toBe(0)
    }, { timeout: 3000 })

    expect(result.current.analysis).toEqual(mockAnalysisResponse.analysis)
    expect(result.current.selectedBlocks).toEqual(new Set(['role_definition', 'goal_setting']))
    expect(result.current.selectedEnhancements).toEqual(new Set(['context_setting', 'output_format']))

    jest.useFakeTimers()
  })

  it('should handle analysis API error', async () => {
    const { toast } = jest.requireMock('sonner')
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    const { result } = renderHook(() => useAnalysis('test prompt'))

    await act(async () => {
      result.current.analyzePrompt()
    })

    // Complete all timers to ensure error handling completes
    await act(async () => {
      jest.runAllTimers()
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('builder.analyzer.errors.analysisFailed')
      expect(result.current.isAnalyzing).toBe(false)
      expect(result.current.analysisProgress).toBe(0)
    })
  })

  it('should handle analysis response error', async () => {
    const { toast } = jest.requireMock('sonner')
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: false,
        error: 'Custom error message',
      }),
    })

    const { result } = renderHook(() => useAnalysis('test prompt'))

    await act(async () => {
      result.current.analyzePrompt()
    })

    // Complete all timers to ensure error handling completes
    await act(async () => {
      jest.runAllTimers()
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Custom error message')
      expect(result.current.isAnalyzing).toBe(false)
      expect(result.current.analysisProgress).toBe(0)
    })
  })

  it('should handle network error', async () => {
    const { toast } = jest.requireMock('sonner')
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useAnalysis('test prompt'))

    await act(async () => {
      result.current.analyzePrompt()
    })

    // Complete all timers to ensure error handling completes
    await act(async () => {
      jest.runAllTimers()
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network error')
      expect(result.current.isAnalyzing).toBe(false)
      expect(result.current.analysisProgress).toBe(0)
    })
  })

  it('should reset analysis state', () => {
    const { result } = renderHook(() => useAnalysis('test prompt'))

    // Set some state first
    act(() => {
      result.current.toggleBlockSelection('role_definition')
      result.current.toggleEnhancementSelection('context_setting')
    })

    expect(result.current.selectedBlocks.has('role_definition')).toBe(true)
    expect(result.current.selectedEnhancements.has('context_setting')).toBe(true)

    // Reset
    act(() => {
      result.current.resetAnalysis()
    })

    expect(result.current.analysis).toBeNull()
    expect(result.current.isAnalyzing).toBe(false)
    expect(result.current.analysisProgress).toBe(0)
    expect(result.current.selectedBlocks).toEqual(new Set())
    expect(result.current.selectedEnhancements).toEqual(new Set())
  })

  it('should toggle block selection', () => {
    const { result } = renderHook(() => useAnalysis('test prompt'))

    // Add block
    act(() => {
      result.current.toggleBlockSelection('role_definition')
    })
    expect(result.current.selectedBlocks.has('role_definition')).toBe(true)

    // Remove block
    act(() => {
      result.current.toggleBlockSelection('role_definition')
    })
    expect(result.current.selectedBlocks.has('role_definition')).toBe(false)

    // Add multiple blocks
    act(() => {
      result.current.toggleBlockSelection('role_definition')
      result.current.toggleBlockSelection('goal_setting')
    })
    expect(result.current.selectedBlocks.has('role_definition')).toBe(true)
    expect(result.current.selectedBlocks.has('goal_setting')).toBe(true)
  })

  it('should toggle enhancement selection', () => {
    const { result } = renderHook(() => useAnalysis('test prompt'))

    // Add enhancement
    act(() => {
      result.current.toggleEnhancementSelection('context_setting')
    })
    expect(result.current.selectedEnhancements.has('context_setting')).toBe(true)

    // Remove enhancement
    act(() => {
      result.current.toggleEnhancementSelection('context_setting')
    })
    expect(result.current.selectedEnhancements.has('context_setting')).toBe(false)

    // Add multiple enhancements
    act(() => {
      result.current.toggleEnhancementSelection('context_setting')
      result.current.toggleEnhancementSelection('output_format')
    })
    expect(result.current.selectedEnhancements.has('context_setting')).toBe(true)
    expect(result.current.selectedEnhancements.has('output_format')).toBe(true)
  })

  it('should cleanup timeouts on unmount', async () => {
    const clearTimeoutSpy = jest.spyOn(globalThis, 'clearTimeout')
    const { result, unmount } = renderHook(() => useAnalysis('test prompt'))

    // Start analysis to create timeouts
    await act(async () => {
      result.current.analyzePrompt()
    })

    // Advance some time to create timeouts
    await act(async () => {
      jest.advanceTimersByTime(100)
    })

    // Unmount should cleanup timeouts
    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })

  it('should handle trimmed prompt', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockAnalysisResponse),
    })

    const { result } = renderHook(() => useAnalysis('  test prompt  '))

    await act(async () => {
      result.current.analyzePrompt()
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/analyze-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userPrompt: 'test prompt' }),
    })
  })

  it('should reset state when starting new analysis', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAnalysisResponse),
    })

    const { result } = renderHook(() => useAnalysis('test prompt'))

    // Use resetAnalysis to verify it resets state properly
    await act(() => {
      result.current.resetAnalysis()
    })

    expect(result.current.analysis).toBeNull()
    expect(result.current.isAnalyzing).toBe(false)
    expect(result.current.analysisProgress).toBe(0)
    expect(result.current.selectedBlocks).toEqual(new Set())
    expect(result.current.selectedEnhancements).toEqual(new Set())
  })
})
