export const getInterval = (
  stabilityRation: number,
  threshold: number,
): number => {
  return Math.round(-stabilityRation * Math.log(threshold) * 24 * 60)
}

export const getStabilityRatio = (
  step: number,
  growthRation: number,
  initialMemoryPersistence: number,
): number => {
  return initialMemoryPersistence * (1 + growthRation) ** step
}

test('getInterval', () => {
  expect(getInterval(0.6, 0.9)).toBe(91)
  expect(getInterval(0.6, 0.6)).toBe(441)
})

test('adds 1 + 2 to equal 3', () => {
  expect(getStabilityRatio(0, 0.6, 2)).toBe(2)
  expect(getStabilityRatio(1, 0.6, 2)).toBe(3.2)
  expect(getStabilityRatio(2, 0.6, 2)).toBe(5.12)
})
