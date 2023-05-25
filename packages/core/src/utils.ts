export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

// Credit: https://github.com/kentor/flush-promises
export const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

export const convertTimeRangeToArray = (value: TimeRanges) => {
  const result: [number, number][] = []

  for (let index = 0; index < value.length; ++index) {
    result.push([value.start(index), value.end(index)])
  }

  return result
}
