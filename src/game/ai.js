import { BLACK, otherPlayer } from './constants'
import { countDiscs } from './board'
import { applyMove, getValidMoves } from './rules'

const CORNERS = [[0, 0], [0, 7], [7, 0], [7, 7]]
const CORNER_ADJACENT = new Set([
  '0,1', '1,0', '1,1', '0,6', '1,6', '1,7', '6,0', '6,1', '7,1',
  '6,6', '6,7', '7,6',
])

const POSITION_WEIGHTS = [
  [120, -25, 20, 5, 5, 20, -25, 120],
  [-25, -45, 1, 1, 1, 1, -45, -25],
  [20, 1, 15, 3, 3, 15, 1, 20],
  [5, 1, 3, 3, 3, 3, 1, 5],
  [5, 1, 3, 3, 3, 3, 1, 5],
  [20, 1, 15, 3, 3, 15, 1, 20],
  [-25, -45, 1, 1, 1, 1, -45, -25],
  [120, -25, 20, 5, 5, 20, -25, 120],
]

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function moveScore(board, player, move) {
  const next = applyMove(board, player, move)
  const counts = countDiscs(next)
  return player === BLACK
    ? counts.black - counts.white
    : counts.white - counts.black
}

function positionalScore(board, player) {
  const opponent = otherPlayer(player)
  let score = 0
  for (let r = 0; r < 8; r += 1) {
    for (let c = 0; c < 8; c += 1) {
      if (board[r][c] === player) score += POSITION_WEIGHTS[r][c]
      if (board[r][c] === opponent) score -= POSITION_WEIGHTS[r][c]
    }
  }
  return score
}

function cornerScore(board, player) {
  const opponent = otherPlayer(player)
  let score = 0
  for (const [r, c] of CORNERS) {
    if (board[r][c] === player) score += 1
    if (board[r][c] === opponent) score -= 1
  }
  return score
}

function mobilityScore(board, player) {
  return getValidMoves(board, player).length - getValidMoves(board, otherPlayer(player)).length
}

function stabilityScore(board, player) {
  const opponent = otherPlayer(player)
  let score = 0
  for (const [r, c] of CORNERS) {
    if (board[r][c] === player) {
      const directions = [[0, 1], [1, 0]]
      for (const [dr, dc] of directions) {
        let rr = r + dr
        let cc = c + dc
        while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && board[rr][cc] === player) {
          score += 1
          rr += dr
          cc += dc
        }
      }
    } else if (board[r][c] === opponent) {
      score -= 1
    }
  }
  return score
}

function evaluate(board, player) {
  const counts = countDiscs(board)
  const own = player === BLACK ? counts.black : counts.white
  const opp = player === BLACK ? counts.white : counts.black
  const discDiff = own - opp
  return (
    positionalScore(board, player) * 1.0 +
    cornerScore(board, player) * 120 +
    mobilityScore(board, player) * 12 +
    stabilityScore(board, player) * 8 +
    discDiff * 2
  )
}

function minimax(board, rootPlayer, turnPlayer, depth, alpha, beta) {
  const moves = getValidMoves(board, turnPlayer)
  const opponent = otherPlayer(turnPlayer)

  if (depth === 0) return evaluate(board, rootPlayer)
  if (moves.length === 0) {
    if (getValidMoves(board, opponent).length === 0) {
      const counts = countDiscs(board)
      const rootCount = rootPlayer === BLACK ? counts.black : counts.white
      const oppCount = rootPlayer === BLACK ? counts.white : counts.black
      if (rootCount > oppCount) return 100000
      if (rootCount < oppCount) return -100000
      return 0
    }
    return minimax(board, rootPlayer, opponent, depth - 1, alpha, beta)
  }

  const maximizing = turnPlayer === rootPlayer
  let best = maximizing ? -Infinity : Infinity

  for (const move of moves) {
    const next = applyMove(board, turnPlayer, move)
    const value = minimax(next, rootPlayer, opponent, depth - 1, alpha, beta)
    if (maximizing) {
      best = Math.max(best, value)
      alpha = Math.max(alpha, best)
    } else {
      best = Math.min(best, value)
      beta = Math.min(beta, best)
    }
    if (beta <= alpha) break
  }
  return best
}

export function chooseAiMove(board, player, difficulty = 'medium') {
  const moves = getValidMoves(board, player)
  if (moves.length === 0) return null

  if (difficulty === 'easy') return randomItem(moves)

  if (difficulty === 'medium') {
    const scored = moves.map((move) => ({ move, score: moveScore(board, player, move) }))
    const bestScore = Math.max(...scored.map((item) => item.score))
    return randomItem(scored.filter((item) => item.score === bestScore)).move
  }

  const scored = moves.map((move) => {
    const next = applyMove(board, player, move)
    let score = minimax(next, player, otherPlayer(player), 1, -Infinity, Infinity)
    score += evaluate(next, player) * 0.25
    if (CORNERS.some(([r, c]) => r === move.row && c === move.col)) score += 10000
    if (CORNER_ADJACENT.has(`${move.row},${move.col}`)) score -= 150
    return { move, score }
  })
  const bestScore = Math.max(...scored.map((item) => item.score))
  return randomItem(scored.filter((item) => item.score === bestScore)).move
}