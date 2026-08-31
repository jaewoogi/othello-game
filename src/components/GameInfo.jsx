import { DIFFICULTIES } from '../game/constants'

export default function GameInfo({ scores, humanColor, currentPlayer, difficulty, status, passMessage, onNewGame }) {
  const currentLabel = currentPlayer === 'black' ? '흑' : '백'
  const humanLabel = humanColor === 'black' ? '흑' : '백'
  const statusText = status === 'ai-thinking'
    ? 'AI가 생각 중입니다…'
    : status === 'human-turn'
      ? '당신의 차례입니다'
      : '대국 준비'

  return (
    <section className="game-info">
      <div className="topline">
        <div>
          <p className="eyebrow">OTHELLO</p>
          <h1>오델로</h1>
        </div>
        <button className="ghost-button" onClick={onNewGame}>새 게임</button>
      </div>

      <div className="score-card">
        <div className="player-score">
          <span className="score-disc black" aria-hidden="true" />
          <span><small>당신 · {humanLabel}</small><strong>{humanColor === 'black' ? scores.black : scores.white}</strong></span>
        </div>
        <div className="vs">VS</div>
        <div className="player-score ai">
          <span className="score-disc white" aria-hidden="true" />
          <span><small>AI · {humanColor === 'black' ? '백' : '흑'}</small><strong>{humanColor === 'black' ? scores.white : scores.black}</strong></span>
        </div>
      </div>

      <div className={`turn-banner ${status}`}>
        <strong>{statusText}</strong>
        <span>현재 차례: {currentLabel} · 난이도: {DIFFICULTIES[difficulty].label}</span>
      </div>

      <div className="message" aria-live="polite">
        {passMessage || (status === 'human-turn' ? '빛나는 점이 있는 칸에 돌을 놓으세요.' : '잠시 기다려 주세요.')}
      </div>
    </section>
  )
}