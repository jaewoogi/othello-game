import { BOARD_SIZE, EMPTY, BLACK, WHITE } from './constants'

export function createInitialBoard() {
  const board = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(EMPTY),
  )
  const mid = BOARD_SIZE / 2
  board[mid - 1][mid - 1] = WHITE
  board[mid - 1][mid] = BLACK
  board[mid][mid - 1] = BLACK
  board[mid][mid] = WHITE
  return board
}

export function cloneBoard(board) {
  return board.map((row) => [...row])
}

export function isInside(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
}

export function countDiscs(board) {
  return board.flat().reduce(
    (counts, cell) => {
      if (cell === BLACK) counts.black += 1
      if (cell === WHITE) counts.white += 1
      return counts
    },
    { black: 0, white: 0 },
  )
}

export function isBoardFull(board) {
  return board.every((row) => row.every((cell) => cell !== EMPTY))
}