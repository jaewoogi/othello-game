import { useCallback, useEffect, useReducer, useRef } from 'react'
import { BLACK, otherPlayer } from '../game/constants'
import { createInitialBoard, countDiscs } from '../game/board'
import { applyMove, getValidMoves, getWinner } from '../game/rules'
import { chooseAiMove } from '../game/ai'

const initialState = (difficulty = 'medium') => ({
  board: createInitialBoard(),
  currentPlayer: BLACK,
  humanColor: null,
  status: 'ready',
  winner: null,
  difficulty,
  passMessage: '',
  lastMove: null,
})

function reducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState(action.difficulty ?? state.difficulty),
        humanColor: action.humanColor,
        status: action.humanColor === BLACK ? 'human-turn' : 'ai-thinking',
      }

    case 'PLACE_DISC': {
      if (state.status !== 'human-turn') return state
      if (state.currentPlayer !== state.humanColor) return state
      const move = getValidMoves(state.board, state.humanColor)
        .find((item) => item.row === action.row && item.col === action.col)
      if (!move) return state
      const nextBoard = applyMove(state.board, state.humanColor, move)
      const nextPlayer = otherPlayer(state.humanColor)
      if (getValidMoves(nextBoard, nextPlayer).length > 0) {
        return {
          ...state,
          board: nextBoard,
          currentPlayer: nextPlayer,
          status: 'ai-thinking',
          passMessage: '',
          lastMove: { row: action.row, col: action.col, color: state.humanColor },
        }
      }
      if (getValidMoves(nextBoard, state.humanColor).length === 0) {
        return {
          ...state,
          board: nextBoard,
          status: 'finished',
          winner: getWinner(nextBoard),
          passMessage: `${nextPlayer === BLACK ? '흑' : '백'}은 둘 곳이 없어 게임이 종료됩니다.`,
          lastMove: { row: action.row, col: action.col, color: state.humanColor },
        }
      }
      return {
        ...state,
        board: nextBoard,
        currentPlayer: state.humanColor,
        status: 'human-turn',
        passMessage: `${nextPlayer === BLACK ? '흑' : '백'}은 둘 곳이 없어 자동 패스했습니다.`,
        lastMove: { row: action.row, col: action.col, color: state.humanColor },
      }
    }

    case 'AI_TURN_START':
      return { ...state, status: 'ai-thinking', passMessage: '' }

    case 'AI_TURN_END': {
      if (state.status !== 'ai-thinking') return state
      if (!action.move) {
        const humanMoves = getValidMoves(state.board, state.humanColor)
        if (humanMoves.length === 0) {
          return { ...state, status: 'finished', winner: getWinner(state.board), passMessage: '양쪽 모두 둘 곳이 없어 게임이 종료됩니다.' }
        }
        return { ...state, currentPlayer: state.humanColor, status: 'human-turn', passMessage: 'AI는 둘 곳이 없어 자동 패스했습니다.' }
      }
      const nextBoard = applyMove(state.board, otherPlayer(state.humanColor), action.move)
      const humanMoves = getValidMoves(nextBoard, state.humanColor)
      if (humanMoves.length > 0) {
        return {
          ...state,
          board: nextBoard,
          currentPlayer: state.humanColor,
          status: 'human-turn',
          passMessage: '',
          lastMove: { row: action.move.row, col: action.move.col, color: otherPlayer(state.humanColor) },
        }
      }
      const aiMoves = getValidMoves(nextBoard, otherPlayer(state.humanColor))
      if (aiMoves.length === 0) {
        return {
          ...state,
          board: nextBoard,
          status: 'finished',
          winner: getWinner(nextBoard),
          passMessage: '양쪽 모두 둘 곳이 없어 게임이 종료됩니다.',
          lastMove: { row: action.move.row, col: action.move.col, color: otherPlayer(state.humanColor) },
        }
      }
      return {
        ...state,
        board: nextBoard,
        currentPlayer: otherPlayer(state.humanColor),
        status: 'ai-thinking',
        passMessage: '당신은 둘 곳이 없어 자동 패스했습니다.',
        lastMove: { row: action.move.row, col: action.move.col, color: otherPlayer(state.humanColor) },
      }
    }

    case 'RESTART_GAME':
      return {
        ...initialState(state.difficulty),
        humanColor: state.humanColor,
        status: state.humanColor === BLACK ? 'human-turn' : 'ai-thinking',
      }

    case 'CHANGE_DIFFICULTY':
      return initialState(action.difficulty)

    case 'LEAVE_GAME':
      return initialState(state.difficulty)

    default:
      return state
  }
}

export function useOthelloGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () => initialState())
  const timerRef = useRef(null)

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
  }, [])

  const startGame = useCallback((humanColor, difficulty) => {
    dispatch({ type: 'START_GAME', humanColor, difficulty })
  }, [])

  const placeDisc = useCallback((row, col) => {
    dispatch({ type: 'PLACE_DISC', row, col })
  }, [])

  useEffect(() => {
    if (state.status !== 'ai-thinking' || !state.humanColor) return undefined

    timerRef.current = window.setTimeout(() => {
      const aiColor = otherPlayer(state.humanColor)
      const move = chooseAiMove(state.board, aiColor, state.difficulty)
      dispatch({ type: 'AI_TURN_END', move })
    }, 350)

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [state.status, state.board, state.humanColor, state.difficulty])

  const scores = countDiscs(state.board)
  const validMoves = state.status === 'human-turn'
    ? getValidMoves(state.board, state.humanColor)
    : []

  return {
    state,
    scores,
    validMoves,
    startGame,
    placeDisc,
    restartGame: () => dispatch({ type: 'RESTART_GAME' }),
    changeDifficulty: (difficulty) => dispatch({ type: 'CHANGE_DIFFICULTY', difficulty }),
    leaveGame: () => dispatch({ type: 'LEAVE_GAME' }),
  }
}