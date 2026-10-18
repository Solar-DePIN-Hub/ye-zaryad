import type { SimResult } from "../domain/simulate";
import { MINUTES_PER_DAY } from "../domain/time";
import type { KitItem } from "../domain/types";
import { strings } from "../strings";

const COLORS = ["#FFB547", "#F4EFE6", "#3DDC97", "#E8872A", "#9AD7FF", "#D2B4FF"];

interface Props {
  result: SimResult;
  items: KitItem[];
}

export function BatteryChart({ result, items }: Props) {
  const batteries = items.filter((item) => item.capacityWh > 0);
  return (
    <section className="panel" aria-labelledby="battery-title">
      <h2 id="battery-title">{strings.batteryTitle}</h2>
      {batteries.length === 0 ? (
        <p className="muted">{strings.noBattery}</p>
      ) : (
        <>
          <svg className="chart" viewBox="0 0 320 140" role="img" aria-label={strings.batteryTitle}>
            <line x1="28" y1="12" x2="28" y2="112" stroke="#2A384F" />
            <line x1="28" y1="112" x2="308" y2="112" stroke="#2A384F" />
            <text x="0" y="16">100</text>
            <text x="8" y="114">0</text>
            {batteries.map((item, index) => {
              const points = result.steps
                .map((step) => {
                  const x = 28 + (step.offsetMin / MINUTES_PER_DAY) * 280;
                  const soc = step.socById[item.id] ?? 0;
                  const y = 112 - soc * 100;
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                })
                .join(" ");
              return (
                <polyline
                  key={item.id}
                  className="draw"
                  fill="none"
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth="2"
                  points={points}
                />
              );
            })}
          </svg>
          <div className="legend">
            {batteries.map((item, index) => (
              <span key={item.id}>
                <i className="swatch" style={{ background: COLORS[index % COLORS.length] }} />
                {item.name}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
