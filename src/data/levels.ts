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
  [ACTION_TYPES.rotateFront90Clockwise]:
    'Rotate 90 clockwise while viewing from front',
  [ACTION_TYPES.rotateFront90AntiClockwise]:
    'Rotate 90 anti-clockwise while viewing from front',
  [ACTION_TYPES.rotateFront180]:
    'Rotate 180 while viewing from front',
  [ACTION_TYPES.rotateLeft90Clockwise]:
    'Rotate 90 clockwise while viewing from left',
  [ACTION_TYPES.rotateLeft90AntiClockwise]:
    'Rotate 90 anti-clockwise while viewing from left',
  [ACTION_TYPES.rotateLeft180]:
    'Rotate 180 while viewing from left',
  [ACTION_TYPES.rotateRight90Clockwise]:
    'Rotate 90 clockwise while viewing from right',
  [ACTION_TYPES.rotateRight90AntiClockwise]:
    'Rotate 90 anti-clockwise while viewing from right',
  [ACTION_TYPES.rotateRight180]:
    'Rotate 180 while viewing from right',
  [ACTION_TYPES.rotateTop90Clockwise]:
    'Rotate 90 clockwise while viewing from top',
  [ACTION_TYPES.rotateTop90AntiClockwise]:
    'Rotate 90 anti-clockwise while viewing from top',
  [ACTION_TYPES.rotateTop180]:
    'Rotate 180 while viewing from top',
  [ACTION_TYPES.rotateBottom90Clockwise]:
    'Rotate 90 clockwise while viewing from bottom',
  [ACTION_TYPES.rotateBottom90AntiClockwise]:
    'Rotate 90 anti-clockwise while viewing from bottom',
  [ACTION_TYPES.rotateBottom180]:
    'Rotate 180 while viewing from bottom',
  [ACTION_TYPES.gravityFront]: 'Apply gravity front',
  [ACTION_TYPES.gravityBack]: 'Apply gravity back',
  [ACTION_TYPES.gravityCubeLeft]: 'Apply gravity cube-left',
  [ACTION_TYPES.gravityCubeRight]: 'Apply gravity cube-right',
  [ACTION_TYPES.gravityCubeTop]: 'Apply gravity cube-top',
  [ACTION_TYPES.gravityCubeBottom]: 'Apply gravity cube-bottom',
}

export const ACTION_HELP_TEXT: Record<ActionType, string> = {
  [ACTION_TYPES.rotate90Clockwise]:
    'Rotates the whole shape 90 degrees clockwise around the center.',
  [ACTION_TYPES.rotate90AntiClockwise]:
    'Rotates the whole shape 90 degrees anti-clockwise around the center.',
  [ACTION_TYPES.rotate180]:
    'Rotates the whole shape by 180 degrees.',
  [ACTION_TYPES.mirrorHorizontal]:
    'Flips the whole shape across a horizontal line (top and bottom swap).',
  [ACTION_TYPES.mirrorVertical]:
    'Flips the whole shape across a vertical line (left and right swap).',
  [ACTION_TYPES.mirrorDiagonalBottomLeftToTopRight]:
    'Reflects the shape across the bottom-left to top-right diagonal.',
  [ACTION_TYPES.mirrorDiagonalTopLeftToBottomRight]:
    'Reflects the shape across the top-left to bottom-right diagonal.',
  [ACTION_TYPES.gravityBottom]:
    'Applies gravity downward so movable markers (i.e the smaller shapes attatched to the square) slide down along their attached edge.',
  [ACTION_TYPES.gravityTop]:
    'Applies gravity upward so movable markers (i.e the smaller shapes attatched to the square) slide up along their attached edge.',
  [ACTION_TYPES.gravityLeft]:
    'Applies gravity left so movable markers (i.e the smaller shapes attatched to the square) slide left along their attached edge.',
  [ACTION_TYPES.gravityRight]:
    'Applies gravity right so movable markers (i.e the smaller shapes attatched to the square) slide right along their attached edge.',
  [ACTION_TYPES.rotateFront90Clockwise]:
    'View the cube from the front, then rotate it 90 degrees clockwise.',
  [ACTION_TYPES.rotateFront90AntiClockwise]:
    'View the cube from the front, then rotate it 90 degrees anti-clockwise.',
  [ACTION_TYPES.rotateFront180]:
    'View the cube from the front, then rotate it 180 degrees.',
  [ACTION_TYPES.rotateLeft90Clockwise]:
    'View the cube from the left side, then rotate it 90 degrees clockwise.',
  [ACTION_TYPES.rotateLeft90AntiClockwise]:
    'View the cube from the left side, then rotate it 90 degrees anti-clockwise.',
  [ACTION_TYPES.rotateLeft180]:
    'View the cube from the left side, then rotate it 180 degrees.',
  [ACTION_TYPES.rotateRight90Clockwise]:
    'View the cube from the right side, then rotate it 90 degrees clockwise.',
  [ACTION_TYPES.rotateRight90AntiClockwise]:
    'View the cube from the right side, then rotate it 90 degrees anti-clockwise.',
  [ACTION_TYPES.rotateRight180]:
    'View the cube from the right side, then rotate it 180 degrees.',
  [ACTION_TYPES.rotateTop90Clockwise]:
    'View the cube from the top, then rotate it 90 degrees clockwise.',
  [ACTION_TYPES.rotateTop90AntiClockwise]:
    'View the cube from the top, then rotate it 90 degrees anti-clockwise.',
  [ACTION_TYPES.rotateTop180]:
    'View the cube from the top, then rotate it 180 degrees.',
  [ACTION_TYPES.rotateBottom90Clockwise]:
    'View the cube from the bottom, then rotate it 90 degrees clockwise.',
  [ACTION_TYPES.rotateBottom90AntiClockwise]:
    'View the cube from the bottom, then rotate it 90 degrees anti-clockwise.',
  [ACTION_TYPES.rotateBottom180]:
    'View the cube from the bottom, then rotate it 180 degrees.',
  [ACTION_TYPES.gravityFront]:
    'Applies gravity toward the front of the cube so markers slide within their current face only.',
  [ACTION_TYPES.gravityBack]:
    'Applies gravity toward the back of the cube so markers slide within their current face only.',
  [ACTION_TYPES.gravityCubeLeft]:
    'Applies gravity toward cube-left so markers slide within their current face only.',
  [ACTION_TYPES.gravityCubeRight]:
    'Applies gravity toward cube-right so markers slide within their current face only.',
  [ACTION_TYPES.gravityCubeTop]:
    'Applies gravity toward cube-top so markers slide within their current face only.',
  [ACTION_TYPES.gravityCubeBottom]:
    'Applies gravity toward cube-bottom so markers slide within their current face only.',
}

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Level 1',
    difficulty: 'Easy',
    mode: '2D',
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
    mode: '2D',
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
    mode: '2D',
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
    mode: '2D',
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
  {
    id: 5,
    title: 'Level 5 (Beta)',
    difficulty: 'Medium',
    mode: '3D',
    startImage: '/images/level-5-placeholder.png',
    allowedActions: [
      ACTION_TYPES.rotateFront90Clockwise,
      ACTION_TYPES.rotateFront90AntiClockwise,
      ACTION_TYPES.rotateFront180,
      ACTION_TYPES.rotateLeft90Clockwise,
      ACTION_TYPES.rotateLeft90AntiClockwise,
      ACTION_TYPES.rotateLeft180,
      ACTION_TYPES.rotateRight90Clockwise,
      ACTION_TYPES.rotateRight90AntiClockwise,
      ACTION_TYPES.rotateRight180,
      ACTION_TYPES.rotateTop90Clockwise,
      ACTION_TYPES.rotateTop90AntiClockwise,
      ACTION_TYPES.rotateTop180,
      ACTION_TYPES.rotateBottom90Clockwise,
      ACTION_TYPES.rotateBottom90AntiClockwise,
      ACTION_TYPES.rotateBottom180,
    ],
    actionCount: 5,
  },
  {
    id: 6,
    title: 'Level 6 (Beta)',
    difficulty: 'Hard',
    mode: '3D',
    startImage: '/images/level-6-placeholder.png',
    allowedActions: [
      ACTION_TYPES.rotateFront90Clockwise,
      ACTION_TYPES.rotateFront90AntiClockwise,
      ACTION_TYPES.rotateFront180,
      ACTION_TYPES.rotateLeft90Clockwise,
      ACTION_TYPES.rotateLeft90AntiClockwise,
      ACTION_TYPES.rotateLeft180,
      ACTION_TYPES.rotateRight90Clockwise,
      ACTION_TYPES.rotateRight90AntiClockwise,
      ACTION_TYPES.rotateRight180,
      ACTION_TYPES.rotateTop90Clockwise,
      ACTION_TYPES.rotateTop90AntiClockwise,
      ACTION_TYPES.rotateTop180,
      ACTION_TYPES.rotateBottom90Clockwise,
      ACTION_TYPES.rotateBottom90AntiClockwise,
      ACTION_TYPES.rotateBottom180,
      ACTION_TYPES.gravityFront,
      ACTION_TYPES.gravityBack,
      ACTION_TYPES.gravityCubeLeft,
      ACTION_TYPES.gravityCubeRight,
      ACTION_TYPES.gravityCubeTop,
      ACTION_TYPES.gravityCubeBottom,
    ],
    actionCount: 7,
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
