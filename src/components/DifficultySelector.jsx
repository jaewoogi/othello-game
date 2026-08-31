import { DIFFICULTIES } from '../game/constants'

export default function DifficultySelector({ difficulty, onChange, onNext }) {
  return (
    <main className="screen-card">
      <div className="brand-mark">●</div>
      <p className="eyebrow">OTHELLO</p>
      <h1>오델로</h1>
      <p className="lead">AI와 즐기는 클래식 전략 보드게임</p>

      <fieldset className="difficulty-list">
        <legend>난이도를 선택하세요</legend>
        {Object.entries(DIFFICULTIES).map(([key, item]) => (
          <label className={`difficulty-option ${difficulty === key ? 'selected' : ''}`} key={key}>
            <input
              type="radio"
              name="difficulty"
              value={key}
              checked={difficulty === key}
              onChange={() => onChange(key)}
            />
            <span className="radio-dot" aria-hidden="true" />
            <span>
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </span>
          </label>
        ))}
      </fieldset>

      <button className="primary-button" onClick={onNext}>동전 던지기</button>
    </main>
  )
}