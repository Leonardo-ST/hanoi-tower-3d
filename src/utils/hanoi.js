export const DISK_COUNT = 5

export function createInitialTowers(diskCount = DISK_COUNT) {
  return [Array.from({ length: diskCount }, (_, index) => diskCount - index), [], []]
}

export function getMinimumMoves(diskCount) {
  return 2 ** diskCount - 1
}

export function getTopDisk(tower) {
  return tower.at(-1)
}

export function isValidMove(towers, sourceIndex, destinationIndex) {
  if (
    sourceIndex === destinationIndex || sourceIndex < 0 || destinationIndex < 0 ||
    !towers[sourceIndex] || !towers[destinationIndex]
  ) return false

  const movingDisk = getTopDisk(towers[sourceIndex])
  const destinationDisk = getTopDisk(towers[destinationIndex])
  return movingDisk !== undefined && (destinationDisk === undefined || movingDisk < destinationDisk)
}

export function moveDisk(towers, sourceIndex, destinationIndex) {
  if (!isValidMove(towers, sourceIndex, destinationIndex)) return towers
  const nextTowers = towers.map((tower) => [...tower])
  const movingDisk = nextTowers[sourceIndex].pop()
  nextTowers[destinationIndex].push(movingDisk)
  return nextTowers
}

export function hasWon(towers, diskCount = DISK_COUNT) {
  return towers[2].length === diskCount
}
