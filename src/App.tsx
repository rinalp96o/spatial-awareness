import { useCallback, useEffect, useMemo, useState } from 'react'
import { LevelCard } from './components/LevelCard'
import { ACTION_HELP_TEXT, ACTION_LABELS, LEVELS, getActionSequence } from './data/levels'
import { ACTION_TYPES } from './types/game'
import type { ActionType, Level } from './types/game'

type Matrix2 = [[number, number], [number, number]]
type Matrix3 = [[number, number, number], [number, number, number], [number, number, number]]

interface Point {
  x: number
  y: number
}

interface ShapeState {
  square: Point[]
  triangle: Point[]
  circle?: {
    center: Point
    radius: number
  }
  diamond?: Point[]
  miniSquare?: Point[]
  cubeState?: {
    orientation: Matrix3
  }
}

const CANVAS_SIZE = 220
const CANVAS_CENTER = CANVAS_SIZE / 2

const IDENTITY_MATRIX: Matrix2 = [
  [1, 0],
  [0, 1],
]

const BASE_SQUARE: Point[] = [
  { x: 70, y: 90 },
  { x: 150, y: 90 },
  { x: 150, y: 170 },
  { x: 70, y: 170 },
]

const BASE_TRIANGLE: Point[] = [
  { x: 70, y: 90 },
  { x: 95, y: 90 },
  { x: 82.5, y: 68.349 },
]

const BASE_SHAPE_STATE: ShapeState = {
  square: BASE_SQUARE,
  triangle: BASE_TRIANGLE,
}

const BASE_LEVEL3_STATE: ShapeState = {
  square: BASE_SQUARE,
  triangle: BASE_TRIANGLE,
  circle: {
    center: { x: 165, y: 130 },
    radius: 15,
  },
  diamond: [
    { x: 70, y: 155 },
    { x: 56, y: 141 },
    { x: 42, y: 155 },
    { x: 56, y: 169 },
  ],
}

const BASE_LEVEL4_STATE: ShapeState = {
  ...BASE_LEVEL3_STATE,
  miniSquare: [
    { x: 101, y: 170 },
    { x: 119, y: 170 },
    { x: 119, y: 188 },
    { x: 101, y: 188 },
  ],
}

const IDENTITY_MATRIX3: Matrix3 = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
]

const BASE_LEVEL5_STATE: ShapeState = {
  square: BASE_SQUARE,
  triangle: BASE_TRIANGLE,
  cubeState: {
    orientation: IDENTITY_MATRIX3,
  },
}

const CUBE_VERTICES: Vector3[] = [
  { x: -1, y: 1, z: 1 },
  { x: 1, y: 1, z: 1 },
  { x: 1, y: -1, z: 1 },
  { x: -1, y: -1, z: 1 },
  { x: -1, y: 1, z: -1 },
  { x: 1, y: 1, z: -1 },
  { x: 1, y: -1, z: -1 },
  { x: -1, y: -1, z: -1 },
]

const CUBE_EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
]

const CUBE_FACES: Array<{ vertices: number[]; color: string; normal: Vector3 }> = [
  { vertices: [0, 1, 2, 3], color: '#7aa2d8', normal: { x: 0, y: 0, z: 1 } }, // front
  { vertices: [1, 5, 6, 2], color: '#5f86bf', normal: { x: 1, y: 0, z: 0 } }, // right
  { vertices: [0, 4, 5, 1], color: '#92b5e2', normal: { x: 0, y: 1, z: 0 } }, // top
]

const CUBE_ALL_FACES: Array<{ vertices: number[]; normal: Vector3 }> = [
  { vertices: [0, 1, 2, 3], normal: { x: 0, y: 0, z: 1 } }, // front
  { vertices: [4, 5, 6, 7], normal: { x: 0, y: 0, z: -1 } }, // back
  { vertices: [1, 5, 6, 2], normal: { x: 1, y: 0, z: 0 } }, // right
  { vertices: [0, 4, 7, 3], normal: { x: -1, y: 0, z: 0 } }, // left
  { vertices: [0, 4, 5, 1], normal: { x: 0, y: 1, z: 0 } }, // top
  { vertices: [3, 7, 6, 2], normal: { x: 0, y: -1, z: 0 } }, // bottom
]

const CUBE_VIEW_PRESETS: Array<{
  id: string
  label: string
  right: Vector3
  up: Vector3
  view: Vector3
}> = [
  { id: 'front', label: 'Front', right: { x: 1, y: 0, z: 0 }, up: { x: 0, y: 1, z: 0 }, view: { x: 0, y: 0, z: 1 } },
  { id: 'back', label: 'Back', right: { x: -1, y: 0, z: 0 }, up: { x: 0, y: 1, z: 0 }, view: { x: 0, y: 0, z: -1 } },
  { id: 'left', label: 'Left', right: { x: 0, y: 0, z: 1 }, up: { x: 0, y: 1, z: 0 }, view: { x: -1, y: 0, z: 0 } },
  { id: 'right', label: 'Right', right: { x: 0, y: 0, z: -1 }, up: { x: 0, y: 1, z: 0 }, view: { x: 1, y: 0, z: 0 } },
  { id: 'top', label: 'Top', right: { x: 1, y: 0, z: 0 }, up: { x: 0, y: 0, z: -1 }, view: { x: 0, y: 1, z: 0 } },
  { id: 'bottom', label: 'Bottom', right: { x: 1, y: 0, z: 0 }, up: { x: 0, y: 0, z: 1 }, view: { x: 0, y: -1, z: 0 } },
]

const CUBE_MARKER_DIAMOND: Vector3[] = [
  { x: -0.6667, y: 0.9, z: 1 }, // top
  { x: -0.4333, y: 0.6667, z: 1 }, // right
  { x: -0.6667, y: 0.4333, z: 1 }, // bottom
  { x: -0.9, y: 0.6667, z: 1 }, // left
]

function getBaseShapeStateForLevel(levelId: number | undefined): ShapeState {
  if (levelId === 3) {
    return BASE_LEVEL3_STATE
  }
  if (levelId === 4) {
    return BASE_LEVEL4_STATE
  }
  if (levelId === 5) {
    return BASE_LEVEL5_STATE
  }
  return BASE_SHAPE_STATE
}

const ACTION_MATRICES: Record<ActionType, Matrix2> = {
  [ACTION_TYPES.rotate90Clockwise]: [
    [0, -1],
    [1, 0],
  ],
  [ACTION_TYPES.rotate90AntiClockwise]: [
    [0, 1],
    [-1, 0],
  ],
  [ACTION_TYPES.rotate180]: [
    [-1, 0],
    [0, -1],
  ],
  [ACTION_TYPES.mirrorHorizontal]: [
    [1, 0],
    [0, -1],
  ],
  [ACTION_TYPES.mirrorVertical]: [
    [-1, 0],
    [0, 1],
  ],
  [ACTION_TYPES.mirrorDiagonalBottomLeftToTopRight]: [
    [0, -1],
    [-1, 0],
  ],
  [ACTION_TYPES.mirrorDiagonalTopLeftToBottomRight]: [
    [0, 1],
    [1, 0],
  ],
  [ACTION_TYPES.gravityBottom]: IDENTITY_MATRIX,
  [ACTION_TYPES.gravityTop]: IDENTITY_MATRIX,
  [ACTION_TYPES.gravityLeft]: IDENTITY_MATRIX,
  [ACTION_TYPES.gravityRight]: IDENTITY_MATRIX,
  [ACTION_TYPES.rotateFront90Clockwise]: IDENTITY_MATRIX,
  [ACTION_TYPES.rotateFront90AntiClockwise]: IDENTITY_MATRIX,
  [ACTION_TYPES.rotateFront180]: IDENTITY_MATRIX,
  [ACTION_TYPES.rotateLeft90Clockwise]: IDENTITY_MATRIX,
  [ACTION_TYPES.rotateLeft90AntiClockwise]: IDENTITY_MATRIX,
  [ACTION_TYPES.rotateLeft180]: IDENTITY_MATRIX,
  [ACTION_TYPES.rotateRight90Clockwise]: IDENTITY_MATRIX,
  [ACTION_TYPES.rotateRight90AntiClockwise]: IDENTITY_MATRIX,
  [ACTION_TYPES.rotateRight180]: IDENTITY_MATRIX,
  [ACTION_TYPES.rotateTop90Clockwise]: IDENTITY_MATRIX,
  [ACTION_TYPES.rotateTop90AntiClockwise]: IDENTITY_MATRIX,
  [ACTION_TYPES.rotateTop180]: IDENTITY_MATRIX,
  [ACTION_TYPES.rotateBottom90Clockwise]: IDENTITY_MATRIX,
  [ACTION_TYPES.rotateBottom90AntiClockwise]: IDENTITY_MATRIX,
  [ACTION_TYPES.rotateBottom180]: IDENTITY_MATRIX,
}

function transformPoint(point: Point, matrix: Matrix2): Point {
  const x = point.x - CANVAS_CENTER
  const y = point.y - CANVAS_CENTER
  const tx = matrix[0][0] * x + matrix[0][1] * y
  const ty = matrix[1][0] * x + matrix[1][1] * y
  return { x: tx + CANVAS_CENTER, y: ty + CANVAS_CENTER }
}

function transformShape(points: Point[], matrix: Matrix2): Point[] {
  return points.map((point) => transformPoint(point, matrix))
}

function pointsToSvg(points: Point[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(' ')
}

interface Vector3 {
  x: number
  y: number
  z: number
}

function multiplyMatrix3(a: Matrix3, b: Matrix3): Matrix3 {
  return [
    [
      a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0],
      a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1],
      a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2],
    ],
    [
      a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0],
      a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1],
      a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2],
    ],
    [
      a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0],
      a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1],
      a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2],
    ],
  ]
}

function transformVector3(vector: Vector3, matrix: Matrix3): Vector3 {
  return {
    x: matrix[0][0] * vector.x + matrix[0][1] * vector.y + matrix[0][2] * vector.z,
    y: matrix[1][0] * vector.x + matrix[1][1] * vector.y + matrix[1][2] * vector.z,
    z: matrix[2][0] * vector.x + matrix[2][1] * vector.y + matrix[2][2] * vector.z,
  }
}

function rotationMatrix3(axis: 'x' | 'y' | 'z', degrees: 90 | -90 | 180): Matrix3 {
  if (axis === 'x') {
    if (degrees === 90) return [[1, 0, 0], [0, 0, -1], [0, 1, 0]]
    if (degrees === -90) return [[1, 0, 0], [0, 0, 1], [0, -1, 0]]
    return [[1, 0, 0], [0, -1, 0], [0, 0, -1]]
  }
  if (axis === 'y') {
    if (degrees === 90) return [[0, 0, 1], [0, 1, 0], [-1, 0, 0]]
    if (degrees === -90) return [[0, 0, -1], [0, 1, 0], [1, 0, 0]]
    return [[-1, 0, 0], [0, 1, 0], [0, 0, -1]]
  }
  if (degrees === 90) return [[0, -1, 0], [1, 0, 0], [0, 0, 1]]
  if (degrees === -90) return [[0, 1, 0], [-1, 0, 0], [0, 0, 1]]
  return [[-1, 0, 0], [0, -1, 0], [0, 0, 1]]
}

function getBounds(points: Point[]) {
  const xs = points.map((point) => point.x)
  const ys = points.map((point) => point.y)
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  }
}

function translatePoints(points: Point[], dx: number, dy: number): Point[] {
  return points.map((point) => ({ x: point.x + dx, y: point.y + dy }))
}

type Edge = 'top' | 'right' | 'bottom' | 'left'

const EDGE_EPSILON = 0.01

function getEdgeFromSegment(points: Point[], bounds: ReturnType<typeof getBounds>): Edge {
  const first = points[0]
  const second = points[1]
  const isHorizontal = Math.abs(first.y - second.y) < EDGE_EPSILON

  if (isHorizontal) {
    return Math.abs(first.y - bounds.minY) < Math.abs(first.y - bounds.maxY)
      ? 'top'
      : 'bottom'
  }
  return Math.abs(first.x - bounds.maxX) < Math.abs(first.x - bounds.minX)
    ? 'right'
    : 'left'
}

function getCircleEdge(
  circle: NonNullable<ShapeState['circle']>,
  bounds: ReturnType<typeof getBounds>,
): Edge {
  // Distances are measured from the circle side that would touch each square edge.
  const distanceToTop = Math.abs((circle.center.y + circle.radius) - bounds.minY)
  const distanceToBottom = Math.abs((circle.center.y - circle.radius) - bounds.maxY)
  const distanceToLeft = Math.abs((circle.center.x + circle.radius) - bounds.minX)
  const distanceToRight = Math.abs((circle.center.x - circle.radius) - bounds.maxX)
  const minDistance = Math.min(
    distanceToTop,
    distanceToBottom,
    distanceToLeft,
    distanceToRight,
  )

  if (minDistance === distanceToTop) return 'top'
  if (minDistance === distanceToBottom) return 'bottom'
  if (minDistance === distanceToLeft) return 'left'
  return 'right'
}

function getDiamondEdge(points: Point[], bounds: ReturnType<typeof getBounds>): Edge {
  const distanceToTop = Math.min(...points.map((point) => Math.abs(point.y - bounds.minY)))
  const distanceToBottom = Math.min(...points.map((point) => Math.abs(point.y - bounds.maxY)))
  const distanceToLeft = Math.min(...points.map((point) => Math.abs(point.x - bounds.minX)))
  const distanceToRight = Math.min(...points.map((point) => Math.abs(point.x - bounds.maxX)))
  const minDistance = Math.min(
    distanceToTop,
    distanceToBottom,
    distanceToLeft,
    distanceToRight,
  )

  if (minDistance === distanceToTop) return 'top'
  if (minDistance === distanceToBottom) return 'bottom'
  if (minDistance === distanceToLeft) return 'left'
  return 'right'
}

function getTouchingEdges(points: Point[], bounds: ReturnType<typeof getBounds>): Edge[] {
  const touchesTop = points.some((point) => Math.abs(point.y - bounds.minY) < EDGE_EPSILON)
  const touchesBottom = points.some(
    (point) => Math.abs(point.y - bounds.maxY) < EDGE_EPSILON,
  )
  const touchesLeft = points.some((point) => Math.abs(point.x - bounds.minX) < EDGE_EPSILON)
  const touchesRight = points.some(
    (point) => Math.abs(point.x - bounds.maxX) < EDGE_EPSILON,
  )

  const touching: Edge[] = []
  if (touchesTop) touching.push('top')
  if (touchesBottom) touching.push('bottom')
  if (touchesLeft) touching.push('left')
  if (touchesRight) touching.push('right')
  return touching
}

function chooseEdgeForGravity(
  points: Point[],
  bounds: ReturnType<typeof getBounds>,
  gravityVector: { x: number; y: number },
): Edge {
  const touchingEdges = getTouchingEdges(points, bounds)
  if (!touchingEdges.length) {
    return getDiamondEdge(points, bounds)
  }

  const preferredEdges =
    gravityVector.x !== 0
      ? touchingEdges.filter((edge) => edge === 'top' || edge === 'bottom')
      : touchingEdges.filter((edge) => edge === 'left' || edge === 'right')

  return preferredEdges[0] ?? touchingEdges[0]
}

function getTouchPointOnEdge(
  points: Point[],
  edge: Edge,
  bounds: ReturnType<typeof getBounds>,
): Point {
  const edgeCoordinate =
    edge === 'top'
      ? bounds.minY
      : edge === 'bottom'
        ? bounds.maxY
        : edge === 'left'
          ? bounds.minX
          : bounds.maxX

  return points.reduce((closest, point) => {
    const closestDistance =
      edge === 'top' || edge === 'bottom'
        ? Math.abs(closest.y - edgeCoordinate)
        : Math.abs(closest.x - edgeCoordinate)
    const pointDistance =
      edge === 'top' || edge === 'bottom'
        ? Math.abs(point.y - edgeCoordinate)
        : Math.abs(point.x - edgeCoordinate)
    return pointDistance < closestDistance ? point : closest
  }, points[0])
}

function getSlideDeltaForEdge(
  edge: Edge,
  gravityVector: { x: number; y: number },
  alongMin: number,
  alongMax: number,
  boundMin: number,
  boundMax: number,
): { dx: number; dy: number } {
  if (edge === 'top' || edge === 'bottom') {
    if (gravityVector.x > 0) return { dx: boundMax - alongMax, dy: 0 }
    if (gravityVector.x < 0) return { dx: boundMin - alongMin, dy: 0 }
    return { dx: 0, dy: 0 }
  }

  if (gravityVector.y > 0) return { dx: 0, dy: boundMax - alongMax }
  if (gravityVector.y < 0) return { dx: 0, dy: boundMin - alongMin }
  return { dx: 0, dy: 0 }
}

function hasPointInsideSquare(points: Point[], bounds: ReturnType<typeof getBounds>): boolean {
  return points.some(
    (point) =>
      point.x > bounds.minX + EDGE_EPSILON &&
      point.x < bounds.maxX - EDGE_EPSILON &&
      point.y > bounds.minY + EDGE_EPSILON &&
      point.y < bounds.maxY - EDGE_EPSILON,
  )
}

function moveAttachedPolygonWithGravity(
  points: Point[],
  bounds: ReturnType<typeof getBounds>,
  gravityVector: { x: number; y: number },
): Point[] {
  const edge = chooseEdgeForGravity(points, bounds, gravityVector)
  const touchPoint = getTouchPointOnEdge(points, edge, bounds)
  const along = edge === 'top' || edge === 'bottom' ? touchPoint.x : touchPoint.y
  const alongValues =
    edge === 'top' || edge === 'bottom'
      ? points.map((point) => point.x)
      : points.map((point) => point.y)
  const offsetMin = Math.min(...alongValues.map((value) => value - along))
  const offsetMax = Math.max(...alongValues.map((value) => value - along))
  const rawBoundMin = edge === 'top' || edge === 'bottom' ? bounds.minX : bounds.minY
  const rawBoundMax = edge === 'top' || edge === 'bottom' ? bounds.maxX : bounds.maxY
  const boundMin = rawBoundMin - offsetMin
  const boundMax = rawBoundMax - offsetMax
  const delta = getSlideDeltaForEdge(
    edge,
    gravityVector,
    along,
    along,
    boundMin,
    boundMax,
  )
  const movedPoints = translatePoints(points, delta.dx, delta.dy)
  if (hasPointInsideSquare(movedPoints, bounds)) {
    return points
  }
  return movedPoints
}

function isLevel5Action(action: ActionType): boolean {
  return (
    action === ACTION_TYPES.rotateFront90Clockwise ||
    action === ACTION_TYPES.rotateFront90AntiClockwise ||
    action === ACTION_TYPES.rotateFront180 ||
    action === ACTION_TYPES.rotateLeft90Clockwise ||
    action === ACTION_TYPES.rotateLeft90AntiClockwise ||
    action === ACTION_TYPES.rotateLeft180 ||
    action === ACTION_TYPES.rotateRight90Clockwise ||
    action === ACTION_TYPES.rotateRight90AntiClockwise ||
    action === ACTION_TYPES.rotateRight180 ||
    action === ACTION_TYPES.rotateTop90Clockwise ||
    action === ACTION_TYPES.rotateTop90AntiClockwise ||
    action === ACTION_TYPES.rotateTop180 ||
    action === ACTION_TYPES.rotateBottom90Clockwise ||
    action === ACTION_TYPES.rotateBottom90AntiClockwise ||
    action === ACTION_TYPES.rotateBottom180
  )
}

function getLevel5ActionSpec(action: ActionType): { axis: 'x' | 'y' | 'z'; degrees: 90 | -90 | 180 } | null {
  // IMPORTANT:
  // Clockwise/anti-clockwise here are defined from the *named viewpoint* (front/left/right/top/bottom),
  // not from global world axes. Because of this, the sign for 90-degree rotations is different for some
  // viewpoints (left/right/top/bottom) than a naive global-axis mapping.
  // If you change any mapping below, verify each view manually to avoid CW/CCW regressions.
  switch (action) {
    case ACTION_TYPES.rotateFront90Clockwise:
      return { axis: 'z', degrees: -90 }
    case ACTION_TYPES.rotateFront90AntiClockwise:
      return { axis: 'z', degrees: 90 }
    case ACTION_TYPES.rotateFront180:
      return { axis: 'z', degrees: 180 }
    case ACTION_TYPES.rotateLeft90Clockwise:
      return { axis: 'x', degrees: 90 }
    case ACTION_TYPES.rotateLeft90AntiClockwise:
      return { axis: 'x', degrees: -90 }
    case ACTION_TYPES.rotateLeft180:
      return { axis: 'x', degrees: 180 }
    case ACTION_TYPES.rotateRight90Clockwise:
      return { axis: 'x', degrees: -90 }
    case ACTION_TYPES.rotateRight90AntiClockwise:
      return { axis: 'x', degrees: 90 }
    case ACTION_TYPES.rotateRight180:
      return { axis: 'x', degrees: 180 }
    case ACTION_TYPES.rotateTop90Clockwise:
      return { axis: 'y', degrees: -90 }
    case ACTION_TYPES.rotateTop90AntiClockwise:
      return { axis: 'y', degrees: 90 }
    case ACTION_TYPES.rotateTop180:
      return { axis: 'y', degrees: 180 }
    case ACTION_TYPES.rotateBottom90Clockwise:
      return { axis: 'y', degrees: 90 }
    case ACTION_TYPES.rotateBottom90AntiClockwise:
      return { axis: 'y', degrees: -90 }
    case ACTION_TYPES.rotateBottom180:
      return { axis: 'y', degrees: 180 }
    default:
      return null
  }
}

function applyLevel5RotationAction(state: ShapeState, action: ActionType): ShapeState {
  if (!state.cubeState) {
    return state
  }
  const spec = getLevel5ActionSpec(action)
  if (!spec) {
    return state
  }
  const rotation = rotationMatrix3(spec.axis, spec.degrees)
  return {
    ...state,
    cubeState: {
      orientation: multiplyMatrix3(rotation, state.cubeState.orientation),
    },
  }
}

function applyGravityAction(state: ShapeState, action: ActionType): ShapeState {
  const gravityVectorByAction: Record<ActionType, { x: number; y: number } | null> = {
    [ACTION_TYPES.rotate90Clockwise]: null,
    [ACTION_TYPES.rotate90AntiClockwise]: null,
    [ACTION_TYPES.rotate180]: null,
    [ACTION_TYPES.mirrorHorizontal]: null,
    [ACTION_TYPES.mirrorVertical]: null,
    [ACTION_TYPES.mirrorDiagonalBottomLeftToTopRight]: null,
    [ACTION_TYPES.mirrorDiagonalTopLeftToBottomRight]: null,
    [ACTION_TYPES.gravityTop]: { x: 0, y: -1 },
    [ACTION_TYPES.gravityBottom]: { x: 0, y: 1 },
    [ACTION_TYPES.gravityLeft]: { x: -1, y: 0 },
    [ACTION_TYPES.gravityRight]: { x: 1, y: 0 },
    [ACTION_TYPES.rotateFront90Clockwise]: null,
    [ACTION_TYPES.rotateFront90AntiClockwise]: null,
    [ACTION_TYPES.rotateFront180]: null,
    [ACTION_TYPES.rotateLeft90Clockwise]: null,
    [ACTION_TYPES.rotateLeft90AntiClockwise]: null,
    [ACTION_TYPES.rotateLeft180]: null,
    [ACTION_TYPES.rotateRight90Clockwise]: null,
    [ACTION_TYPES.rotateRight90AntiClockwise]: null,
    [ACTION_TYPES.rotateRight180]: null,
    [ACTION_TYPES.rotateTop90Clockwise]: null,
    [ACTION_TYPES.rotateTop90AntiClockwise]: null,
    [ACTION_TYPES.rotateTop180]: null,
    [ACTION_TYPES.rotateBottom90Clockwise]: null,
    [ACTION_TYPES.rotateBottom90AntiClockwise]: null,
    [ACTION_TYPES.rotateBottom180]: null,
  }

  const gravityVector = gravityVectorByAction[action]
  if (!gravityVector) {
    return state
  }

  const bounds = getBounds(state.square)
  const attachmentStart = state.triangle[0]
  const attachmentEnd = state.triangle[1]
  const triangleEdge = getEdgeFromSegment(state.triangle, bounds)
  const triangleAlongMin =
    triangleEdge === 'top' || triangleEdge === 'bottom'
      ? Math.min(attachmentStart.x, attachmentEnd.x)
      : Math.min(attachmentStart.y, attachmentEnd.y)
  const triangleAlongMax =
    triangleEdge === 'top' || triangleEdge === 'bottom'
      ? Math.max(attachmentStart.x, attachmentEnd.x)
      : Math.max(attachmentStart.y, attachmentEnd.y)
  const triangleDelta = getSlideDeltaForEdge(
    triangleEdge,
    gravityVector,
    triangleAlongMin,
    triangleAlongMax,
    triangleEdge === 'top' || triangleEdge === 'bottom' ? bounds.minX : bounds.minY,
    triangleEdge === 'top' || triangleEdge === 'bottom' ? bounds.maxX : bounds.maxY,
  )

  const nextCircle = state.circle
    ? (() => {
        const edge = getCircleEdge(state.circle!, bounds)
        const along = edge === 'top' || edge === 'bottom' ? state.circle!.center.x : state.circle!.center.y
      const boundMin =
        edge === 'top' || edge === 'bottom'
          ? bounds.minX + state.circle!.radius
          : bounds.minY + state.circle!.radius
      const boundMax =
        edge === 'top' || edge === 'bottom'
          ? bounds.maxX - state.circle!.radius
          : bounds.maxY - state.circle!.radius
        const delta = getSlideDeltaForEdge(
          edge,
          gravityVector,
          along,
          along,
        boundMin,
        boundMax,
        )
        return {
          center: {
            x: state.circle!.center.x + delta.dx,
            y: state.circle!.center.y + delta.dy,
          },
          radius: state.circle!.radius,
        }
      })()
    : undefined

  const nextDiamond = state.diamond
    ? moveAttachedPolygonWithGravity(state.diamond, bounds, gravityVector)
    : undefined

  const nextMiniSquare = state.miniSquare
    ? moveAttachedPolygonWithGravity(state.miniSquare, bounds, gravityVector)
    : undefined

  return {
    ...state,
    triangle: translatePoints(state.triangle, triangleDelta.dx, triangleDelta.dy),
    circle: nextCircle,
    diamond: nextDiamond,
    miniSquare: nextMiniSquare,
  }
}

function applyActionToShapeState(state: ShapeState, action: ActionType): ShapeState {
  if (state.cubeState && isLevel5Action(action)) {
    return applyLevel5RotationAction(state, action)
  }

  if (
    action === ACTION_TYPES.gravityTop ||
    action === ACTION_TYPES.gravityBottom ||
    action === ACTION_TYPES.gravityLeft ||
    action === ACTION_TYPES.gravityRight
  ) {
    return applyGravityAction(state, action)
  }

  const matrix = ACTION_MATRICES[action]
  return {
    square: transformShape(state.square, matrix),
    triangle: transformShape(state.triangle, matrix),
    circle: state.circle
      ? {
          center: transformPoint(state.circle.center, matrix),
          radius: state.circle.radius,
        }
      : undefined,
    diamond: state.diamond ? transformShape(state.diamond, matrix) : undefined,
    miniSquare: state.miniSquare ? transformShape(state.miniSquare, matrix) : undefined,
  }
}

function getShapeStateForActionSequence(
  sequence: ActionType[],
  baseShapeState: ShapeState,
): ShapeState {
  return sequence.reduce((shapeState, action) => {
    return applyActionToShapeState(shapeState, action)
  }, baseShapeState)
}

function getShapeStateProgressionForSequence(
  sequence: ActionType[],
  baseShapeState: ShapeState,
): ShapeState[] {
  let currentState = baseShapeState
  return sequence.map((action) => {
    currentState = applyActionToShapeState(currentState, action)
    return currentState
  })
}

function areShapeStatesEqual(a: ShapeState, b: ShapeState): boolean {
  const EPSILON = 0.01
  const close = (left: number, right: number) => Math.abs(left - right) < EPSILON

  const pointArraysMatch = (left: Point[], right: Point[]) =>
    left.length === right.length &&
    left.every(
      (point, index) =>
        close(point.x, right[index].x) && close(point.y, right[index].y),
    )

  const circlesMatch =
    (!a.circle && !b.circle) ||
    (!!a.circle &&
      !!b.circle &&
      close(a.circle.center.x, b.circle.center.x) &&
      close(a.circle.center.y, b.circle.center.y) &&
      close(a.circle.radius, b.circle.radius))

  const diamondsMatch =
    (!a.diamond && !b.diamond) ||
    (!!a.diamond && !!b.diamond && pointArraysMatch(a.diamond, b.diamond))
  const miniSquaresMatch =
    (!a.miniSquare && !b.miniSquare) ||
    (!!a.miniSquare && !!b.miniSquare && pointArraysMatch(a.miniSquare, b.miniSquare))
  const cubeMatch =
    (!a.cubeState && !b.cubeState) ||
    (!!a.cubeState &&
      !!b.cubeState &&
      a.cubeState.orientation.every((row, rowIndex) =>
        row.every((value, colIndex) => close(value, b.cubeState!.orientation[rowIndex][colIndex])),
      ))

  return (
    pointArraysMatch(a.square, b.square) &&
    pointArraysMatch(a.triangle, b.triangle) &&
    circlesMatch &&
    diamondsMatch &&
    miniSquaresMatch &&
    cubeMatch
  )
}

interface ShapePreviewProps {
  title: string
  matrix?: Matrix2
  shapeState?: ShapeState
  hideTitle?: boolean
}

type SheetResult = 'success' | 'failure'

const RESULTS_WEBHOOK_URL = (import.meta.env.VITE_RESULTS_WEBHOOK_URL ?? '').trim()
const SESSION_PROFILE_KEY = 'spatialAwarenessUserProfile'

interface UserProfile {
  name: string
  age: string
  gender: string
}

const NA_PROFILE: UserProfile = {
  name: 'N/A',
  age: 'N/A',
  gender: 'N/A',
}

const AGE_OPTIONS: string[] = ['--', ...Array.from({ length: 96 }, (_, index) => `${index + 5}`)]

async function logResultToSheet(
  level: string,
  result: SheetResult,
  profile: UserProfile,
): Promise<void> {
  if (!RESULTS_WEBHOOK_URL) {
    console.warn('Sheet logging skipped: VITE_RESULTS_WEBHOOK_URL is not configured.')
    return
  }

  const payload = {
    level,
    result,
    name: profile.name,
    age: profile.age,
    gender: profile.gender,
    timestamp: new Date().toISOString(),
  }

  try {
    console.info('Sheet logging: sending payload', payload)
    const response = await fetch(RESULTS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        // Use text/plain to avoid browser preflight failures with Apps Script.
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '')
      throw new Error(`HTTP ${response.status}: ${errorBody}`)
    }

    const responseText = await response.text().catch(() => '')
    console.info('Sheet logging: success', responseText || '(no response body)')
  } catch (error) {
    // Logging must never block gameplay flow.
    console.error('Failed to log result to sheet:', error)
  }
}

function ShapePreview({
  title,
  matrix = IDENTITY_MATRIX,
  shapeState,
  hideTitle = false,
}: ShapePreviewProps) {
  if (shapeState?.cubeState) {
    const orientation = shapeState.cubeState.orientation
    const transformedVertices = CUBE_VERTICES.map((vertex) =>
      transformVector3(vertex, orientation),
    )
    const transformedMarker = CUBE_MARKER_DIAMOND.map((vertex) =>
      transformVector3(vertex, orientation),
    )

    const projectPoint = (vertex: Vector3): Point => {
      const scale = 34
      return {
        x: CANVAS_CENTER + (vertex.x - vertex.z * 0.55) * scale,
        y: CANVAS_CENTER + (-vertex.y - vertex.z * 0.35) * scale,
      }
    }

    const visibleFaces = CUBE_FACES.map((face) => {
      const transformedNormal = transformVector3(face.normal, orientation)
      const depth = face.vertices.reduce(
        (sum, index) => sum + transformedVertices[index].z,
        0,
      ) / face.vertices.length
      return {
        ...face,
        transformedNormal,
        depth,
      }
    })
      .filter((face) => face.transformedNormal.z > -0.05)
      .sort((left, right) => left.depth - right.depth)

    const markerNormal = transformVector3({ x: 0, y: 0, z: 1 }, orientation)
    const markerIsVisible = markerNormal.z > -0.05
    const projectedVertices = transformedVertices.map(projectPoint)

    const dot = (a: Vector3, b: Vector3) => a.x * b.x + a.y * b.y + a.z * b.z

    const renderOrthographicView = (viewPreset: (typeof CUBE_VIEW_PRESETS)[number]) => {
      const projectOrtho = (vertex: Vector3): Point => {
        const scale = 24
        const px = dot(vertex, viewPreset.right)
        const py = dot(vertex, viewPreset.up)
        return {
          x: CANVAS_CENTER + px * scale,
          y: CANVAS_CENTER - py * scale,
        }
      }

      const visibleFace = CUBE_ALL_FACES.map((face) => ({
        ...face,
        visibility: dot(transformVector3(face.normal, orientation), viewPreset.view),
      }))
        .sort((a, b) => b.visibility - a.visibility)[0]

      const markerVisible = dot(markerNormal, viewPreset.view) > 0.05

      return (
        <div className="cube-view-card" key={viewPreset.id}>
          <p className="cube-view-title">{viewPreset.label}</p>
          <svg
            className="cube-view-canvas"
            viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
            role="img"
            aria-label={`${title} ${viewPreset.label} view`}
          >
            <rect
              x="1"
              y="1"
              width={CANVAS_SIZE - 2}
              height={CANVAS_SIZE - 2}
              rx="10"
              fill="#f8fbff"
              stroke="#d5e3ef"
            />
            <polygon
              points={pointsToSvg(
                visibleFace.vertices.map((vertexIndex) =>
                  projectOrtho(transformedVertices[vertexIndex]),
                ),
              )}
              fill="#7aa2d8"
              stroke="#2f5f9f"
            />
            {markerVisible ? (
              <polygon
                points={pointsToSvg(transformedMarker.map(projectOrtho))}
                fill="#f59d3d"
                stroke="#b96d14"
              />
            ) : null}
          </svg>
        </div>
      )
    }

    return (
      <div className="shape-preview">
        {!hideTitle ? <h4>{title}</h4> : null}
        <div className="cube-preview-layout">
          <svg
            className="shape-canvas cube-main-canvas"
            viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
            role="img"
            aria-label={title}
          >
            <rect
              x="1"
              y="1"
              width={CANVAS_SIZE - 2}
              height={CANVAS_SIZE - 2}
              rx="10"
              fill="#f8fbff"
              stroke="#d5e3ef"
            />
            {visibleFaces.map((face, index) => (
              <polygon
                key={`cube-face-${index}`}
                points={pointsToSvg(
                  face.vertices.map((vertexIndex) => projectedVertices[vertexIndex]),
                )}
                fill={face.color}
                stroke="#2f5f9f"
              />
            ))}
            {CUBE_EDGES.map(([startIndex, endIndex], index) => {
              const start3d = transformedVertices[startIndex]
              const end3d = transformedVertices[endIndex]
              const avgDepth = (start3d.z + end3d.z) / 2
              const start = projectedVertices[startIndex]
              const end = projectedVertices[endIndex]
              const isHidden = avgDepth < 0

              return (
                <line
                  key={`cube-edge-${index}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={isHidden ? '#5f7f9f' : '#244f7a'}
                  strokeOpacity={isHidden ? '0.28' : '0.8'}
                  strokeWidth={isHidden ? '1.0' : '1.5'}
                  strokeDasharray={isHidden ? '3 3' : undefined}
                />
              )
            })}
            {markerIsVisible ? (
              <polygon
                points={pointsToSvg(transformedMarker.map(projectPoint))}
                fill="#f59d3d"
                stroke="#b96d14"
              />
            ) : null}
          </svg>
          <div className="cube-views-grid">{CUBE_VIEW_PRESETS.map(renderOrthographicView)}</div>
        </div>
      </div>
    )
  }

  const square = shapeState ? shapeState.square : transformShape(BASE_SQUARE, matrix)
  const triangle = shapeState
    ? shapeState.triangle
    : transformShape(BASE_TRIANGLE, matrix)
  const circle = shapeState?.circle
    ? shapeState.circle
    : undefined
  const diamond = shapeState?.diamond
    ? shapeState.diamond
    : undefined
  const miniSquare = shapeState?.miniSquare
    ? shapeState.miniSquare
    : undefined

  return (
    <div className="shape-preview">
      {!hideTitle ? <h4>{title}</h4> : null}
      <svg
        className="shape-canvas"
        viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
        role="img"
        aria-label={title}
      >
        <rect
          x="1"
          y="1"
          width={CANVAS_SIZE - 2}
          height={CANVAS_SIZE - 2}
          rx="10"
          fill="#f8fbff"
          stroke="#d5e3ef"
        />
        <polygon points={pointsToSvg(square)} fill="#5d87c9" stroke="#2f5f9f" />
        <polygon points={pointsToSvg(triangle)} fill="#f59d3d" stroke="#b96d14" />
        {circle ? (
          <circle
            cx={circle.center.x}
            cy={circle.center.y}
            r={circle.radius}
            fill="#52b788"
            stroke="#2d6a4f"
          />
        ) : null}
        {diamond ? (
          <polygon points={pointsToSvg(diamond)} fill="#d17dd7" stroke="#8b3f96" />
        ) : null}
        {miniSquare ? (
          <polygon points={pointsToSvg(miniSquare)} fill="#f2c14e" stroke="#9a7b24" />
        ) : null}
      </svg>
    </div>
  )
}

function App() {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [guess, setGuess] = useState('')
  const [resultMessage, setResultMessage] = useState('')
  const [guidedStage, setGuidedStage] = useState<
    'intro' | 'test' | 'answer' | 'result'
  >('intro')
  const [guidedDemoAction, setGuidedDemoAction] = useState<ActionType | null>(
    null,
  )
  const [guidedTestSequence, setGuidedTestSequence] = useState<ActionType[]>([])
  const [guidedActionIndex, setGuidedActionIndex] = useState(0)
  const [guidedGuessShapeState, setGuidedGuessShapeState] =
    useState<ShapeState>(BASE_SHAPE_STATE)
  const [guidedGuessSubmitted, setGuidedGuessSubmitted] = useState(false)
  const [guidedGuessCorrect, setGuidedGuessCorrect] = useState<boolean | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile>(NA_PROFILE)
  const [profileForm, setProfileForm] = useState<UserProfile>({
    name: '',
    age: '--',
    gender: '--',
  })
  const [showProfileModal, setShowProfileModal] = useState(false)

  const actionSequence: ActionType[] = useMemo(() => {
    if (!selectedLevel) {
      return []
    }
    return getActionSequence(selectedLevel)
  }, [selectedLevel])
  const isGuidedLevel =
    selectedLevel?.id === 1 ||
    selectedLevel?.id === 2 ||
    selectedLevel?.id === 3 ||
    selectedLevel?.id === 4 ||
    selectedLevel?.id === 5
  const guidedBaseShapeState = useMemo(
    () => getBaseShapeStateForLevel(selectedLevel?.id),
    [selectedLevel?.id],
  )
  const hideGlobalChrome =
    isGuidedLevel && (guidedStage === 'test' || guidedStage === 'answer')
  const guidedDemoShapeState = useMemo(() => {
    if (!guidedDemoAction) {
      return guidedBaseShapeState
    }
    return applyActionToShapeState(guidedBaseShapeState, guidedDemoAction)
  }, [guidedBaseShapeState, guidedDemoAction])
  const guidedResultShapeState = useMemo(() => {
    if (!guidedTestSequence.length) {
      return guidedBaseShapeState
    }
    return getShapeStateForActionSequence(guidedTestSequence, guidedBaseShapeState)
  }, [guidedBaseShapeState, guidedTestSequence])
  const guidedStepByStepStates = useMemo(() => {
    if (!guidedTestSequence.length) {
      return []
    }
    return getShapeStateProgressionForSequence(guidedTestSequence, guidedBaseShapeState)
  }, [guidedBaseShapeState, guidedTestSequence])
  const isLevel5StepView = useMemo(
    () => guidedStepByStepStates.some((shapeState) => !!shapeState.cubeState),
    [guidedStepByStepStates],
  )
  const currentGuidedAction = useMemo(() => {
    if (guidedStage !== 'test' || !guidedTestSequence.length) {
      return null
    }
    return guidedTestSequence[guidedActionIndex] ?? null
  }, [guidedActionIndex, guidedStage, guidedTestSequence])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const storedValue = window.sessionStorage.getItem(SESSION_PROFILE_KEY)
    if (!storedValue) {
      setShowProfileModal(true)
      return
    }

    try {
      const parsed = JSON.parse(storedValue) as Partial<UserProfile>
      setUserProfile({
        name: parsed.name ?? 'N/A',
        age: parsed.age ?? 'N/A',
        gender: parsed.gender ?? 'N/A',
      })
    } catch {
      setShowProfileModal(true)
    }
  }, [])

  function persistProfile(profile: UserProfile) {
    setUserProfile(profile)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_PROFILE_KEY, JSON.stringify(profile))
    }
    setShowProfileModal(false)
  }

  function handleSubmitProfileForm() {
    const normalizedAge =
      !profileForm.age.trim() || profileForm.age.trim() === '--'
        ? 'N/A'
        : profileForm.age.trim()
    const normalizedGender =
      !profileForm.gender.trim() || profileForm.gender.trim() === '--'
        ? 'N/A'
        : profileForm.gender.trim()

    persistProfile({
      name: profileForm.name.trim() || 'N/A',
      age: normalizedAge,
      gender: normalizedGender,
    })
  }

  function handleSelectLevel(level: Level) {
    setSelectedLevel(level)
    setHasStarted(false)
    setGuess('')
    setResultMessage('')
    setGuidedStage('intro')
    setGuidedDemoAction(null)
    setGuidedTestSequence([])
    setGuidedActionIndex(0)
    setGuidedGuessShapeState(getBaseShapeStateForLevel(level.id))
    setGuidedGuessSubmitted(false)
    setGuidedGuessCorrect(null)
  }

  function handleBackToAllLevels() {
    setSelectedLevel(null)
    setHasStarted(false)
    setGuess('')
    setResultMessage('')
    setGuidedStage('intro')
    setGuidedDemoAction(null)
    setGuidedTestSequence([])
    setGuidedActionIndex(0)
    setGuidedGuessShapeState(BASE_SHAPE_STATE)
    setGuidedGuessSubmitted(false)
    setGuidedGuessCorrect(null)
  }

  function handleStartLevel() {
    if (isGuidedLevel && selectedLevel) {
      setGuidedTestSequence(getActionSequence(selectedLevel))
      setGuidedActionIndex(0)
      setGuidedStage('test')
      setGuidedGuessShapeState(getBaseShapeStateForLevel(selectedLevel.id))
      setGuidedGuessSubmitted(false)
      setGuidedGuessCorrect(null)
      return
    }
    setHasStarted(true)
    setResultMessage('')
  }

  const moveToNextGuidedAction = useCallback(() => {
    if (guidedStage !== 'test') {
      return
    }
    if (guidedActionIndex >= guidedTestSequence.length - 1) {
      setGuidedStage('answer')
      return
    }
    setGuidedActionIndex((index) => index + 1)
  }, [guidedActionIndex, guidedStage, guidedTestSequence.length])

  function handleApplyGuessAction(action: ActionType) {
    setGuidedGuessShapeState((previousState) =>
      applyActionToShapeState(previousState, action),
    )
  }

  function handleResetGuess() {
    setGuidedGuessShapeState(guidedBaseShapeState)
    setGuidedGuessSubmitted(false)
    setGuidedGuessCorrect(null)
  }

  function handleSubmitGuidedGuess() {
    const isCorrect = areShapeStatesEqual(guidedGuessShapeState, guidedResultShapeState)
    setGuidedGuessCorrect(isCorrect)
    setGuidedGuessSubmitted(true)
    setGuidedStage('result')
    void logResultToSheet(
      selectedLevel?.title ?? 'Unknown Level',
      isCorrect ? 'success' : 'failure',
      userProfile,
    )
  }

  useEffect(() => {
    if (!isGuidedLevel || guidedStage !== 'test') {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.code !== 'Space') {
        return
      }
      event.preventDefault()
      moveToNextGuidedAction()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isGuidedLevel, guidedStage, moveToNextGuidedAction])

  useEffect(() => {
    if (guidedStage !== 'test' || !currentGuidedAction || typeof window === 'undefined') {
      return
    }
    if (!('speechSynthesis' in window)) {
      return
    }

    const utterance = new SpeechSynthesisUtterance(
      ACTION_LABELS[currentGuidedAction],
    )
    utterance.rate = 0.95
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [currentGuidedAction, guidedActionIndex, guidedStage])

  function handleSubmitGuess() {
    if (!guess.trim()) {
      setResultMessage('Please enter your final image guess before submitting.')
      return
    }
    if (isGuidedLevel) {
      setResultMessage(
        'Guided level engine is active. Compare your guess with the rendered final shape above.',
      )
      return
    }
    setResultMessage(
      'Result validation is currently implemented only for Level 1 renderer flow.',
    )
  }

  return (
    <main className="app-shell">
      {showProfileModal ? (
        <div className="modal-backdrop" role="presentation">
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
          >
            <h2 id="profile-modal-title">Optional Profile Info</h2>
            <p className="play-meta">
              These fields are optional and used only for data analysis.
            </p>

            <label className="modal-field">
              <span>Name (optional)</span>
              <input
                type="text"
                value={profileForm.name}
                onChange={(event) =>
                  setProfileForm((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
              />
            </label>

            <label className="modal-field">
              <span>Age (optional)</span>
              <select
                value={profileForm.age}
                onChange={(event) =>
                  setProfileForm((previous) => ({
                    ...previous,
                    age: event.target.value,
                  }))
                }
              >
                {AGE_OPTIONS.map((ageOption) => (
                  <option key={ageOption} value={ageOption}>
                    {ageOption}
                  </option>
                ))}
              </select>
            </label>

            <label className="modal-field">
              <span>Gender (optional)</span>
              <select
                value={profileForm.gender}
                onChange={(event) =>
                  setProfileForm((previous) => ({
                    ...previous,
                    gender: event.target.value,
                  }))
                }
              >
                <option value="--">--</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <div className="controls-row">
              <button type="button" onClick={handleSubmitProfileForm}>
                Save and Continue
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {!hideGlobalChrome ? (
        <header className="hero">
          <h1>Spatial Awareness Test</h1>
          <p>
            Pick a level, memorize the starting image, apply the action sequence in
            your head, then submit your final image guess.
          </p>
        </header>
      ) : null}

      {!selectedLevel ? (
        <section className="levels-section">
          <h2>Choose a Level</h2>
          <div className="levels-grid">
            {LEVELS.map((level) => (
              <LevelCard key={level.id} level={level} onSelect={handleSelectLevel} />
            ))}
          </div>
        </section>
      ) : isGuidedLevel ? (
        <section className="play-section">
          {guidedStage !== 'test' && guidedStage !== 'answer' ? (
            <button
              className="secondary-button"
              type="button"
              onClick={handleBackToAllLevels}
            >
              Back to all levels
            </button>
          ) : null}

          {guidedStage === 'intro' ? (
            <>
              <h2>{selectedLevel.title} - Setup</h2>
              <p className="play-meta">Review the starting shape and action behavior.</p>

              <div className="panel">
                <h3>Starting Shape</h3>
                <div className="starting-shape-wrap">
                  <ShapePreview
                    title="Starting Shape"
                    shapeState={guidedBaseShapeState}
                    hideTitle
                  />
                </div>
              </div>

              <div className="panel">
                <h3>Available Actions (click to preview)</h3>
                <div className="action-help-list">
                  {selectedLevel.allowedActions.map((action) => (
                    <div key={action} className="action-help-line">
                      <button
                        type="button"
                        className="action-link"
                        onClick={() => setGuidedDemoAction(action)}
                      >
                        {ACTION_LABELS[action]}
                      </button>
                      <span className="action-help-separator">:</span>
                      <span className="action-help-inline-text">{ACTION_HELP_TEXT[action]}</span>
                    </div>
                  ))}
                </div>
                <div className="action-preview-wrap">
                  {guidedDemoAction ? (
                    <ShapePreview
                      title={`Preview: ${ACTION_LABELS[guidedDemoAction]}`}
                      shapeState={guidedDemoShapeState}
                    />
                  ) : (
                    <div className="shape-note">
                      Click an action above to preview how it transforms the shape.
                    </div>
                  )}
                </div>
              </div>

              <div className="controls-row">
                <button type="button" onClick={handleStartLevel}>
                  Start Test
                </button>
              </div>

              <div className="panel">
                <h3>Notes</h3>
                <ol className="action-list">
                  <li>
                    During the test, each action is spoken aloud so you can close
                    your eyes and follow the steps.
                  </li>
                  <li>
                    You can move to the next step by pressing the <strong>Space</strong>{' '}
                    bar.
                  </li>
                </ol>
              </div>
            </>
          ) : null}

          {guidedStage === 'test' ? (
            <>
              <h2>{selectedLevel.title} - Test in Progress</h2>
              <p className="play-meta">
                Press <strong>Space</strong> to move to the next action.
              </p>

              <div className="panel">
                <h3>
                  Action {guidedActionIndex + 1} : 
                </h3>
                <p className="current-action">
                  {currentGuidedAction ? ACTION_LABELS[currentGuidedAction] : ''}
                </p>
              </div>

              <div className="controls-row">
                <button type="button" onClick={moveToNextGuidedAction}>
                  {guidedActionIndex === guidedTestSequence.length - 1
                    ? 'Finish'
                    : 'Next Action'}
                </button>
              </div>
            </>
          ) : null}

          {guidedStage === 'answer' ? (
            <>
              <h2>{selectedLevel.title} - Level Complete</h2>
              <p className="play-meta">
                Nice work. Build the final image you had in mind, then submit it.
              </p>

              <div className="panel">
                <h3>Your Final Image Guess</h3>
                <div className="starting-shape-wrap">
                  <ShapePreview title="Your Guess" shapeState={guidedGuessShapeState} />
                </div>
              </div>

              <div className="panel">
                <h3>Apply Actions to Build Your Guess</h3>
                <div className="guess-action-grid">
                  {selectedLevel.allowedActions.map((action) => (
                    <button
                      key={`guess-${action}`}
                      type="button"
                      onClick={() => handleApplyGuessAction(action)}
                    >
                      {ACTION_LABELS[action]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="panel guess-actions-panel">
                <h3>Ready to submit?</h3>
                <div className="controls-row">
                  <button
                    type="button"
                    className="warning-button"
                    onClick={handleResetGuess}
                  >
                    Reset Guess
                  </button>
                  <button
                    type="button"
                    className="success-button"
                    onClick={handleSubmitGuidedGuess}
                  >
                    Submit Final Image
                  </button>
                </div>
              </div>
            </>
          ) : null}

          {guidedStage === 'result' ? (
            <>
              <h2>{selectedLevel.title} - Result</h2>
              {guidedGuessSubmitted && guidedGuessCorrect !== null ? (
                <div className="panel">
                  <h3>{guidedGuessCorrect ? 'Correct' : 'Not Quite'}</h3>
                  <p className="play-meta">
                    {guidedGuessCorrect
                      ? 'Your final image guess matches the computed result.'
                      : 'Your guess does not match this run. Check the result and action sequence below.'}
                  </p>
                </div>
              ) : null}

              <div className="panel">
                <h3>Your Guess</h3>
                <ShapePreview
                  title="Your submitted guess"
                  shapeState={guidedGuessShapeState}
                />
              </div>

              <div className="panel">
                <h3>Final Shape</h3>
                <ShapePreview
                  title="Result after all actions"
                  shapeState={guidedResultShapeState}
                />
              </div>

              <div className="panel">
                <h3>Action Sequence</h3>
                <ol className="action-list">
                  {guidedTestSequence.map((action, index) => (
                    <li key={`${action}-${index}`}>{ACTION_LABELS[action]}</li>
                  ))}
                </ol>
              </div>

              <div className="panel">
                <h3>Step-by-Step Result</h3>
                <div
                  className={`result-steps-grid ${
                    isLevel5StepView ? 'result-steps-grid--linear' : ''
                  }`}
                >
                  {guidedStepByStepStates.map((shapeState, index) => (
                    <div className="result-step-card" key={`step-shape-${index}`}>
                      <p className="result-step-title">
                        Step {index + 1}: {ACTION_LABELS[guidedTestSequence[index]]}
                      </p>
                      <ShapePreview
                        title={`After step ${index + 1}`}
                        shapeState={shapeState}
                        hideTitle
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="controls-row">
                <button type="button" onClick={() => setGuidedStage('intro')}>
                  Try Again
                </button>
              </div>
            </>
          ) : null}
        </section>
      ) : (
        <section className="play-section">
          <button
            className="secondary-button"
            type="button"
            onClick={handleBackToAllLevels}
          >
            Back to all levels
          </button>

          <h2>{selectedLevel.title}</h2>
          <p className="play-meta">Difficulty: {selectedLevel.difficulty}</p>
          {!isGuidedLevel ? (
            <p className="play-meta">Starting image: {selectedLevel.startImage}</p>
          ) : null}

          <div className="panel">
            <h3>Starting Image</h3>
            {isGuidedLevel ? (
              <div className="shape-layout">
                <ShapePreview title="Starting Shape" matrix={IDENTITY_MATRIX} />
                {hasStarted ? (
                  <ShapePreview
                    title="Actual Result After Actions"
                    shapeState={guidedResultShapeState}
                  />
                ) : (
                  <div className="shape-note">
                    Click <strong>Start Level</strong> to compute and reveal the final
                    transformed shape.
                  </div>
                )}
              </div>
            ) : (
              <div className="image-placeholder">Starting image placeholder</div>
            )}
          </div>

          <div className="panel">
            <h3>Actions for this run</h3>
            <ol className="action-list">
              {actionSequence.map((action, index) => (
                <li key={`${action}-${index}`}>{ACTION_LABELS[action]}</li>
              ))}
            </ol>
          </div>

          <div className="controls-row">
            <button type="button" onClick={handleStartLevel}>
              {hasStarted ? 'Restart Level' : 'Start Level'}
            </button>
          </div>

          <div className="panel">
            <h3>Your Final Image Guess</h3>
            <textarea
              className="guess-input"
              placeholder="Describe your final image or add your answer notation..."
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
            />
            <div className="controls-row">
              <button type="button" onClick={handleSubmitGuess}>
                Submit Answer
              </button>
            </div>
            {resultMessage ? <p className="result-message">{resultMessage}</p> : null}
          </div>
        </section>
      )}
    </main>
  )
}

export default App
