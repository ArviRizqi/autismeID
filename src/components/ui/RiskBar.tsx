import { SCORE_THRESHOLDS, levelFromScore, toPercent } from '../../lib/scoring'

/** Pita tiga zona dengan penanda posisi skor. Skor 0..1. */
export function RiskBar({ score }: { score: number }) {
  const pct = toPercent(score)
  const low = SCORE_THRESHOLDS.sedang * 100
  const high = (1 - SCORE_THRESHOLDS.tinggi) * 100
  const mid = 100 - low - high
  return (
    <div role="img" aria-label={`Skor ${pct} persen, level ${levelFromScore(score)}`}>
      <div className="relative pt-6">
        <span
          className="absolute top-0 -translate-x-1/2 text-caption font-bold"
          style={{ left: `${pct}%` }}
        >
          {pct}%
        </span>
        <div className="flex h-4 overflow-hidden rounded-full">
          <div className="bg-risk-low" style={{ width: `${low}%` }} />
          <div className="bg-risk-mid" style={{ width: `${mid}%` }} />
          <div className="bg-risk-high" style={{ width: `${high}%` }} />
        </div>
        <span
          className="absolute top-[1.125rem] h-6 w-1 -translate-x-1/2 rounded-sm bg-ink"
          style={{ left: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 flex justify-between text-caption text-ink-3" aria-hidden="true">
        <span>Rendah</span>
        <span>Sedang</span>
        <span>Tinggi</span>
      </div>
    </div>
  )
}
