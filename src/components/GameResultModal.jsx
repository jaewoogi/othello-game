export default function GameResultModal({ winner, scores, humanColor, onRestart, onChangeDifficulty, onLeave }) {
  const humanScore = humanColor === 'black' ? scores.black : scores.white
  const aiScore = humanColor === 'black' ? scores.white : scores.black
  const title = winner === 'draw' ? '무승부' : winner === humanColor ? '승리했습니다!' : 'AI가 승리했습니다'
  const detail = winner === 'draw'
    ? '두 색의 돌 수가 같습니다.'
    : `${winner === 'black' ? '흑' : '백'}이 ${winner === humanColor ? '더 많은' : '더 많은'} 돌을 차지했습니다.`

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="result-title">
      <div className="result-modal">
        <p className="eyebrow">GAME OVER</p>
        <h2 id="result-title">{title}</h2>
        <p>{detail}</p>
        <div className="final-score"><strong>{humanScore}</strong><span>:</span><strong>{aiScore}</strong></div>
        <div className="result-label">당신 · AI</div>
        <div className="modal-actions">
          <button className="primary-button" onClick={onRestart}>같은 설정으로 다시 시작</button>
          <button className="secondary-button" onClick={onChangeDifficulty}>난이도 변경</button>
          <button className="text-button" onClick={onLeave}>게임 종료 후 나가기</button>
        </div>
      </div>
    </div>
  )
}