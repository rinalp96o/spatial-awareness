import { ACTION_TYPES } from '../types/game'
import type { ActionType, Level } from '../types/game'

export const ACTION_LABELS: Record<ActionType, string> = {
  [ACTION_TYPES.rotate90Clockwise]: 'Rotate 90 degrees clockwise',
  [ACTION_TYPES.rotate90AntiClockwise]: 'Rotate 90 degrees anti-clockwise',
  [ACTION_TYPES.rotate180]: 'Rotate 180 degrees',
  [ACTION_TYPES.mirrorHorizontal]: 'Mirror horizontally',
  [ACTION_TYPES.mirrorVertical]: 'Mirror vertically',
  [ACTION_TYPES.mirrorDiagonalBottomLeftToTopRight]:
    'Mirror diagonally (bottom-left to top-right)',
  [ACTION_TYPES.mirrorDiagonalTopLeftToBottomRight]:
    'Mirror diagonally (top-left to bottom-right)',
  [ACTION_TYPES.gravityBottom]: 'Apply gravity down',
  [ACTION_TYPES.gravityTop]: 'Apply gravity up',
  [ACTION_TYPES.gravityLeft]: 'Apply gravity left',
  [ACTION_TYPES.gravityRight]: 'Apply gravity right',
}

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Level 1',
    difficulty: 'Easy',
    startImage: '/images/level-1-placeholder.png',
    allowedActions: [ACTION_TYPES.rotate90Clockwise, 
      ACTION_TYPES.rotate90AntiClockwise,
      ACTION_TYPES.rotate180,
      ACTION_TYPES.mirrorVertical,
      ACTION_TYPES.mirrorHorizontal],
    actionCount: 8,
  },
  {
    id: 2,
    title: 'Level 2',
    difficulty: 'Easy',
    startImage: '/images/level-2-placeholder.png',
    allowedActions: [ACTION_TYPES.rotate90Clockwise, 
      ACTION_TYPES.rotate90AntiClockwise,
      ACTION_TYPES.rotate180,
      ACTION_TYPES.mirrorVertical,
      ACTION_TYPES.mirrorHorizontal,
      ACTION_TYPES.mirrorDiagonalBottomLeftToTopRight,
      ACTION_TYPES.mirrorDiagonalTopLeftToBottomRight,
      ACTION_TYPES.gravityBottom,
      ACTION_TYPES.gravityTop,
      ACTION_TYPES.gravityLeft,
      ACTION_TYPES.gravityRight,
    ],
    actionCount: 8,
  },
  {
    id: 3,
    title: 'Level 3',
    difficulty: 'Medium',
    startImage: '/images/level-3-placeholder.png',
    allowedActions: [ACTION_TYPES.rotate90Clockwise, 
      ACTION_TYPES.rotate90AntiClockwise,
      ACTION_TYPES.rotate180,
      ACTION_TYPES.mirrorVertical,
      ACTION_TYPES.mirrorHorizontal,
      ACTION_TYPES.mirrorDiagonalBottomLeftToTopRight,
      ACTION_TYPES.mirrorDiagonalTopLeftToBottomRight,
      ACTION_TYPES.gravityBottom,
      ACTION_TYPES.gravityTop,
      ACTION_TYPES.gravityLeft,
      ACTION_TYPES.gravityRight,
    ],
    actionCount: 8,
  },
  {
    id: 4,
    title: 'Level 4',
    difficulty: 'Hard',
    startImage: '/images/level-4-placeholder.png',
    allowedActions: [ACTION_TYPES.rotate90Clockwise, 
      ACTION_TYPES.rotate90AntiClockwise,
      ACTION_TYPES.rotate180,
      ACTION_TYPES.mirrorVertical,
      ACTION_TYPES.mirrorHorizontal,
      ACTION_TYPES.mirrorDiagonalBottomLeftToTopRight,
      ACTION_TYPES.mirrorDiagonalTopLeftToBottomRight,
      ACTION_TYPES.gravityBottom,
      ACTION_TYPES.gravityTop,
      ACTION_TYPES.gravityLeft,
      ACTION_TYPES.gravityRight,
    ],
    actionCount: 8,
  },
]

export function getActionSequence(level: Level): ActionType[] {
  const actions: ActionType[] = []
  let previousAction: ActionType | null = null

  for (let i = 0; i < level.actionCount; i += 1) {
    const candidates: ActionType[] =
      previousAction && level.allowedActions.length > 1
        ? level.allowedActions.filter((action) => action !== previousAction)
        : level.allowedActions

    const randomIndex = Math.floor(Math.random() * candidates.length)
    const nextAction: ActionType = candidates[randomIndex]

    actions.push(nextAction)
    previousAction = nextAction
  }
  return actions
}
