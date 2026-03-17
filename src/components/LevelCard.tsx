import type { Level } from '../types/game'

interface LevelCardProps {
  level: Level
  onSelect: (level: Level) => void
}

export function LevelCard({ level, onSelect }: LevelCardProps) {
  return (
    <button className="level-card" type="button" onClick={() => onSelect(level)}>
      <div className="level-card__header">
        <h3>{level.title}</h3>
        <span className="difficulty-pill">{level.difficulty}</span>
      </div>
    </button>
  )
}
