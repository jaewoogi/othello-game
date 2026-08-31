export default function GameBoard({ board, validMoves, disabled, lastMove, onMove }) {
  const validSet = new Set(validMoves.map((move) => `${move.row},${move.col}`))
  return (
    <div className="board" role="grid" aria-label="오델로 보드">
      {board.map((row, r) =>
        row.map((cell, c) => {
          const key = `${r},${c}`
          const valid = validSet.has(key)
          const isLast = lastMove?.row === r && lastMove?.col === c
          return (
            <button
              className={`cell ${valid ? 'valid' : ''} ${isLast ? 'last-move' : ''}`}
              key={key}
              role="gridcell"
              disabled={disabled || !valid}
              aria-label={`${r + 1}행 ${c + 1}열${cell ? ` ${cell === 'black' ? '흑돌' : '백돌'}` : valid ? '놓을 수 있음' : '빈 칸'}`}
              onClick={() => onMove(r, c)}
            >
              {cell && <span className={`disc ${cell}`} aria-hidden="true" />}
              {valid && !cell && <span className="valid-dot" aria-hidden="true" />}
            </button>
          )
        }),
      )}
    </div>
  )
}