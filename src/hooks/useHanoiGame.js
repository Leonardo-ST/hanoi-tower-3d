import { useCallback, useEffect, useRef, useState } from 'react'
import { createInitialTowers, DISK_COUNT, getMinimumMoves, getTopDisk, hasWon, isValidMove, moveDisk } from '../utils/hanoi.js'
import { createTimerState, finishTimer, getElapsedTime, pauseTimer, resumeTimer, startTimer } from '../utils/gameTimer.js'

export default function useHanoiGame({ diskCount = DISK_COUNT, timerPaused = false } = {}) {
  const [towers, setTowers] = useState(() => createInitialTowers(diskCount))
  const [selectedTower, setSelectedTower] = useState(null)
  const [moves, setMoves] = useState(0)
  const [animation, setAnimation] = useState(null)
  const [invalidFeedback, setInvalidFeedback] = useState(null)
  const [won, setWon] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [finalTime, setFinalTime] = useState(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const feedbackTimer = useRef(null)
  const feedbackId = useRef(0)
  const animationTimer = useRef(null)
  const animationRef = useRef(null)
  const towersRef = useRef(towers)
  const timerRef = useRef(createTimerState())

  const applyTimerState = useCallback((nextTimer, now = performance.now()) => {
    timerRef.current = nextTimer
    setElapsedTime(getElapsedTime(nextTimer, now))
    setFinalTime(nextTimer.finalTime)
    setIsTimerRunning(nextTimer.isRunning)
  }, [])

  useEffect(() => () => {
    clearTimeout(feedbackTimer.current)
    clearTimeout(animationTimer.current)
  }, [])

  useEffect(() => {
    if (!isTimerRunning) return undefined
    const updateElapsedTime = () => setElapsedTime(getElapsedTime(timerRef.current, performance.now()))
    const interval = setInterval(updateElapsedTime, 250)
    return () => clearInterval(interval)
  }, [isTimerRunning])

  useEffect(() => {
    const now = performance.now()
    const currentTimer = timerRef.current
    const nextTimer = timerPaused ? pauseTimer(currentTimer, now) : resumeTimer(currentTimer, now)
    if (nextTimer !== currentTimer) applyTimerState(nextTimer, now)
  }, [applyTimerState, timerPaused])

  const completeMove = useCallback(() => {
    const currentAnimation = animationRef.current
    if (!currentAnimation) return

    animationRef.current = null
    clearTimeout(animationTimer.current)

    try {
      const nextTowers = moveDisk(
        towersRef.current,
        currentAnimation.from,
        currentAnimation.to,
      )
      towersRef.current = nextTowers
      setTowers(nextTowers)
      setMoves((currentMoves) => currentMoves + 1)
      const didWin = hasWon(nextTowers, diskCount)
      setWon(didWin)
      if (didWin) {
        const now = performance.now()
        applyTimerState(finishTimer(timerRef.current, now), now)
      }
    } finally {
      setSelectedTower(null)
      setAnimation(null)
    }
  }, [applyTimerState, diskCount])

  const showInvalidFeedback = useCallback((sourceIndex, destinationIndex) => {
    clearTimeout(feedbackTimer.current)
    feedbackId.current += 1
    setInvalidFeedback({ id: feedbackId.current, source: sourceIndex, destination: destinationIndex })
    feedbackTimer.current = setTimeout(() => setInvalidFeedback(null), 300)
  }, [])

  const selectTower = useCallback((towerIndex) => {
    if (animation || won) return
    if (selectedTower === null) {
      if (towers[towerIndex].length > 0) setSelectedTower(towerIndex)
      else showInvalidFeedback(null, towerIndex)
      return
    }
    if (selectedTower === towerIndex) {
      setSelectedTower(null)
      return
    }
    if (!isValidMove(towers, selectedTower, towerIndex)) {
      showInvalidFeedback(selectedTower, towerIndex)
      return
    }
    const nextAnimation = {
      disk: getTopDisk(towers[selectedTower]), from: selectedTower, to: towerIndex,
      sourceLevel: towers[selectedTower].length - 1, destinationLevel: towers[towerIndex].length,
    }
    const now = performance.now()
    const nextTimer = startTimer(timerRef.current, now)
    if (nextTimer !== timerRef.current) applyTimerState(nextTimer, now)
    animationRef.current = nextAnimation
    setAnimation(nextAnimation)
    animationTimer.current = setTimeout(completeMove, 1800)
    clearTimeout(feedbackTimer.current)
    setInvalidFeedback(null)
    setSelectedTower(null)
  }, [animation, applyTimerState, completeMove, selectedTower, showInvalidFeedback, towers, won])

  const reset = useCallback(() => {
    clearTimeout(feedbackTimer.current)
    clearTimeout(animationTimer.current)
    animationRef.current = null
    const initialTowers = createInitialTowers(diskCount)
    towersRef.current = initialTowers
    setTowers(initialTowers)
    setSelectedTower(null)
    setMoves(0)
    setAnimation(null)
    setInvalidFeedback(null)
    setWon(false)
    applyTimerState(createTimerState())
  }, [applyTimerState, diskCount])

  return { towers, selectedTower, moves, minimumMoves: getMinimumMoves(diskCount), animation, invalidFeedback, won, elapsedTime, finalTime, isTimerRunning, selectTower, completeMove, reset }
}
