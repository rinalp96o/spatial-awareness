export const ACTION_TYPES = {
  rotate90Clockwise: 'rotate90Clockwise',
  rotate90AntiClockwise: 'rotate90AntiClockwise',
  rotate180: 'rotate180',
  mirrorHorizontal: 'mirrorHorizontal',
  mirrorVertical: 'mirrorVertical',
  mirrorDiagonalBottomLeftToTopRight: 'mirrorDiagonalBottomLeftToTopRight',
  mirrorDiagonalTopLeftToBottomRight: 'mirrorDiagonalTopLeftToBottomRight',
  gravityBottom: 'gravityBottom',
  gravityTop: 'gravityTop',
  gravityLeft: 'gravityLeft',
  gravityRight: 'gravityRight',
  rotateFront90Clockwise: 'rotateFront90Clockwise',
  rotateFront90AntiClockwise: 'rotateFront90AntiClockwise',
  rotateFront180: 'rotateFront180',
  rotateLeft90Clockwise: 'rotateLeft90Clockwise',
  rotateLeft90AntiClockwise: 'rotateLeft90AntiClockwise',
  rotateLeft180: 'rotateLeft180',
  rotateRight90Clockwise: 'rotateRight90Clockwise',
  rotateRight90AntiClockwise: 'rotateRight90AntiClockwise',
  rotateRight180: 'rotateRight180',
  rotateTop90Clockwise: 'rotateTop90Clockwise',
  rotateTop90AntiClockwise: 'rotateTop90AntiClockwise',
  rotateTop180: 'rotateTop180',
  rotateBottom90Clockwise: 'rotateBottom90Clockwise',
  rotateBottom90AntiClockwise: 'rotateBottom90AntiClockwise',
  rotateBottom180: 'rotateBottom180',
} as const

export type ActionType = (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES]

export const ACTION_TYPE_LIST: ActionType[] = Object.values(ACTION_TYPES)

export interface Level {
  id: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  startImage: string
  allowedActions: ActionType[]
  actionCount: number
}
