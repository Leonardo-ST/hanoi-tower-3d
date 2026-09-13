export function createTimerState() {
  return {
    startedAt: null,
    elapsedTime: 0,
    isRunning: false,
    finalTime: null,
    hasStarted: false,
  }
}

export function getElapsedTime(timer, now) {
  if (!timer.isRunning || timer.startedAt === null) return timer.elapsedTime
  return timer.elapsedTime + Math.max(0, now - timer.startedAt)
}

export function startTimer(timer, now) {
  if (timer.hasStarted || timer.finalTime !== null) return timer
  return { ...timer, startedAt: now, isRunning: true, hasStarted: true }
}

export function pauseTimer(timer, now) {
  if (!timer.isRunning) return timer
  return { ...timer, startedAt: null, elapsedTime: getElapsedTime(timer, now), isRunning: false }
}

export function resumeTimer(timer, now) {
  if (!timer.hasStarted || timer.isRunning || timer.finalTime !== null) return timer
  return { ...timer, startedAt: now, isRunning: true }
}

export function finishTimer(timer, now) {
  if (timer.finalTime !== null) return timer
  const finalTime = getElapsedTime(timer, now)
  return { ...timer, startedAt: null, elapsedTime: finalTime, isRunning: false, finalTime }
}

export function formatElapsedTime(milliseconds) {
  const totalSeconds = Math.floor(Math.max(0, milliseconds) / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
