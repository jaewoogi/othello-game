export const BOARD_SIZE = 8
export const EMPTY = null
export const BLACK = 'black'
export const WHITE = 'white'

export const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],   [1, 1],
]

export const DIFFICULTIES = {
  easy: { label: '하', description: '가능한 수 중 하나를 무작위로 선택합니다.' },
  medium: { label: '중', description: '즉시 얻는 돌 수가 많은 수를 우선합니다.' },
  hard: { label: '상', description: '코너·기동성·안정성을 고려해 수를 탐색합니다.' },
}

export const otherPlayer = (player) => (player === BLACK ? WHITE : BLACK)
