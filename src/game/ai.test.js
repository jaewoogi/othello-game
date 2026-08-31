import { describe, expect, it } from 'vitest'
import { BLACK } from './constants'
import { createInitialBoard } from './board'
import { getValidMoves } from './rules'
import { chooseAiMove } from './ai'

describe('AI', () => {
  it.each(['easy', 'medium', 'hard'])('returns a valid move on %s', (difficulty) => {
    const board = createInitialBoard()
    const move = chooseAiMove(board, BLACK, difficulty)
    const valid = getValidMoves(board, BLACK)
    expect(valid.some((m) => m.row === move.row && m.col === move.col)).toBe(true)
  })

  it('returns null when there are no moves', () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(BLACK))
    expect(chooseAiMove(board, 'white', 'hard')).toBeNull()
  })

  it('prefers an available corner at hard difficulty', () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null))
    board[0][1] = 'white'
    board[0][2] = BLACK
    board[3][3] = BLACK
    board[3][4] = 'white'
    const move = chooseAiMove(board, BLACK, 'hard')
    expect(move).toBeTruthy()
    expect(move.row === 0 && move.col === 0).toBe(true)
  })
})