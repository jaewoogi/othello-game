import {
  BOARD_SIZE,
  EMPTY,
  DIRECTIONS,
  otherPlayer,
} from './constants'
import { cloneBoard, isInside, isBoardFull } from './board'

export function getFlipsForMove(board, player, row, col) {
  if (!isInside(row, col) || board[row][col] !== EMPTY) return []

  const opponent = otherPlayer(player)
  const flips = []

  for (const [dr, dc] of DIRECTIONS) {
    const line = []
    let r = row + dr
    let c = col + dc

    while (isInside(r, c) && board[r][c] === opponent) {
      line.push([r, c])
      r += dr
      c += dc
    }

    if (line.length > 0 && isInside(r, c) && board[r][c] === player) {
      flips.push(...line)
    }
  }

  return flips
}

export function getValidMoves(board, player) {
  const moves = []
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const flips = getFlipsForMove(board, player, row, col)
      if (flips.length > 0) moves.push({ row, col, flips })
    }
  }
  return moves
}

export function applyMove(board, player, move) {
  const flips = move.flips ?? getFlipsForMove(board, player, move.row, move.col)
  if (flips.length === 0) return null

  const next = cloneBoard(board)
  next[move.row][move.col] = player
  for (const [row, col] of flips) next[row][col] = player
  return next
}

export function getWinner(board) {
  const flat = board.flat()
  const black = flat.filter((cell) => cell === 'black').length
  const white = flat.filter((cell) => cell === 'white').length
  if (black === white) return 'draw'
  return black > white ? 'black' : 'white'
}

export function shouldEndGame(board, currentPlayer) {
  if (isBoardFull(board)) return true
  const currentMoves = getValidMoves(board, currentPlayer)
  if (currentMoves.length > 0) return false
  return getValidMoves(board, otherPlayer(currentPlayer)).length === 0
}