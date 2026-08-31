import { describe, expect, it } from 'vitest'
import { BLACK, WHITE } from './constants'
import { createInitialBoard } from './board'
import { applyMove, getFlipsForMove, getValidMoves, getWinner } from './rules'

describe('Othello rules', () => {
  it('creates the standard initial board', () => {
    const board = createInitialBoard()
    expect(getValidMoves(board, BLACK)).toHaveLength(4)
    expect(getValidMoves(board, WHITE)).toHaveLength(4)
  })

  it('rejects occupied and invalid cells', () => {
    const board = createInitialBoard()
    expect(getFlipsForMove(board, BLACK, 3, 3)).toEqual([])
    expect(getFlipsForMove(board, BLACK, 0, 0)).toEqual([])
  })

  it('flips a disc in one direction', () => {
    const board = createInitialBoard()
    const move = getValidMoves(board, BLACK).find((m) => m.row === 2 && m.col === 3)
    const next = applyMove(board, BLACK, move)
    expect(next[3][3]).toBe(BLACK)
    expect(next[2][3]).toBe(BLACK)
  })

  it('flips all applicable directions', () => {
    const board = [
      [null, null, null, null, null, null, null, null],
      [null, 'white', 'white', 'white', null, null, null, null],
      [null, 'white', 'black', 'white', null, null, null, null],
      [null, 'white', 'white', 'white', null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
    ]
    const move = { row: 2, col: 0 }
    const next = applyMove(board, BLACK, move)
    expect(next[2][1]).toBe(BLACK)
  })

  it('determines winner correctly', () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(BLACK))
    expect(getWinner(board)).toBe(BLACK)
    board[0][0] = WHITE
    expect(getWinner(board)).toBe(BLACK)
  })
})