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
