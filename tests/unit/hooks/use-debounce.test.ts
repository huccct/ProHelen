import { useDebounce } from '@/lib/hooks/use-debounce'
import { act, renderHook } from '@testing-library/react'

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } },
    )

    // Change value immediately
    rerender({ value: 'changed', delay: 500 })
    expect(result.current).toBe('initial') // Should still be initial value

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current).toBe('changed') // Should now be changed value
  })

  it('should cancel previous timeout on new value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } },
    )

    // Change value multiple times quickly
    rerender({ value: 'first', delay: 500 })
    rerender({ value: 'second', delay: 500 })
    rerender({ value: 'third', delay: 500 })

    expect(result.current).toBe('initial') // Should still be initial

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current).toBe('third') // Should be the last value, not intermediate ones
  })

  it('should work with different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } },
    )

    rerender({ value: 'changed', delay: 1000 })

    // Should not change before delay
    act(() => {
      jest.advanceTimersByTime(500)
    })
    expect(result.current).toBe('initial')

    // Should change after delay
    act(() => {
      jest.advanceTimersByTime(500)
    })
    expect(result.current).toBe('changed')
  })

  it('should work with number values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 300 } },
    )

    rerender({ value: 42, delay: 300 })

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe(42)
  })

  it('should work with object values', () => {
    const initialObj = { name: 'initial', count: 0 }
    const changedObj = { name: 'changed', count: 1 }

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 200 } },
    )

    rerender({ value: changedObj, delay: 200 })

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(result.current).toEqual(changedObj)
  })

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } },
    )

    rerender({ value: 'changed', delay: 0 })

    // With zero delay, should change after a tick
    act(() => {
      jest.advanceTimersByTime(0)
    })
    expect(result.current).toBe('changed')
  })

  it('should handle negative delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: -100 } },
    )

    rerender({ value: 'changed', delay: -100 })

    // With negative delay, should change after a tick
    act(() => {
      jest.advanceTimersByTime(0)
    })
    expect(result.current).toBe('changed')
  })
})
