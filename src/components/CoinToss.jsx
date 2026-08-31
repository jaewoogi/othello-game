import { useState } from 'react'
import { BLACK, WHITE } from '../game/constants'

export default function CoinToss({ onStart, onBack }) {
  const [result, setResult] = useState(null)

  const toss = () => setResult(Math.random() < 0.5 ? BLACK : WHITE)
  const label = result === BLACK ? '흑' : '백'

  return (
    <main className="screen-card coin-screen">
      <p className="eyebrow">READY</p>
      <h1>선공을 결정합니다</h1>
      <p className="lead">동전을 던져 당신의 돌 색상을 무작위로 정합니다.</p>

      <button className={`coin ${result ? 'flipped' : ''}`} onClick={toss} aria-label="동전 던지기">
        <span>{result ? label : '?'}</span>
      </button>

      <div className="coin-result" aria-live="polite">
        {result
          ? <><strong>당신은 {label}입니다.</strong><span>{result === BLACK ? '당신이 먼저 시작합니다.' : 'AI가 먼저 시작합니다.'}</span></>
          : '동전을 눌러 시작하세요.'}
      </div>

      <div className="button-row">
        <button className="secondary-button" onClick={onBack}>난이도 다시 선택</button>
        {result && <button className="primary-button" onClick={() => onStart(result)}>대국 시작</button>}
      </div>
    </main>
  )
}