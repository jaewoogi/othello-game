import { useState } from 'react'
import DifficultySelector from './components/DifficultySelector'
import CoinToss from './components/CoinToss'
import GameBoard from './components/GameBoard'
import GameInfo from './components/GameInfo'
import GameResultModal from './components/GameResultModal'
import { DIFFICULTIES } from './game/constants'
import { useOthelloGame } from './hooks/useOthelloGame'

export default function App() {
  const [screen, setScreen] = useState('difficulty')
  const [difficulty, setDifficulty] = useState('medium')
  const game = useOthelloGame()

  const startGame = (color) => {
    game.startGame(color, difficulty)
    setScreen('game')
  }

  if (screen === 'difficulty') {
    return (
      <div className="app-shell">
        <DifficultySelector
          difficulty={difficulty}
          onChange={setDifficulty}
          onNext={() => setScreen('coin')}
        />
      </div>
    )
  }

  if (screen === 'coin') {
    return (
      <div className="app-shell">
        <CoinToss
          onStart={startGame}
          onBack={() => setScreen('difficulty')}
        />
      </div>
    )
  }

  const { state, scores, validMoves, placeDisc } = game
  const humanColor = state.humanColor
  const isFinished = state.status === 'finished'

  return (
    <div className="app-shell game-shell">
      <div className="game-layout">
        <GameInfo
          scores={scores}
          humanColor={humanColor}
          currentPlayer={state.currentPlayer}
          difficulty={state.difficulty}
          status={state.status}
          passMessage={state.passMessage}
          onNewGame={() => setScreen('difficulty')}
        />
        <GameBoard
          board={state.board}
          validMoves={validMoves}
          disabled={state.status !== 'human-turn'}
          lastMove={state.lastMove}
          onMove={placeDisc}
        />
        <p className="rules-note">오델로는 상대 돌을 하나 이상의 방향에서 사이에 끼워 뒤집는 게임입니다.</p>
      </div>

      {isFinished && (
        <GameResultModal
          winner={state.winner}
          scores={scores}
          humanColor={humanColor}
          onRestart={game.restartGame}
          onChangeDifficulty={() => setScreen('difficulty')}
          onLeave={() => {
            game.leaveGame()
            setScreen('difficulty')
          }}
        />
      )}
      <span className="sr-only">{DIFFICULTIES[state.difficulty].label}</span>
    </div>
  )
}