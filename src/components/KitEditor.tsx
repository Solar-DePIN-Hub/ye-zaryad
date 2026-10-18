import { presetById, presets, typicalKitIds } from "../domain/presets";
import type { KitItem } from "../domain/types";
import { strings } from "../strings";

interface Props {
  items: KitItem[];
  onChange: (items: KitItem[]) => void;
}

function newId(): string {
  return crypto.randomUUID();
}

export function KitEditor({ items, onChange }: Props) {
  function addPreset(id: string) {
    if (items.some((item) => item.presetId === id)) return;
    const preset = presetById(id);
    if (!preset) return;
    onChange([...items, { ...preset.item, id: newId(), presetId: preset.id }]);
  }

  function addTypical() {
    const next = [...items];
    for (const id of typicalKitIds) {
      if (next.some((item) => item.presetId === id)) continue;
      const preset = presetById(id);
      if (!preset) continue;
      next.push({ ...preset.item, id: newId(), presetId: preset.id });
    }
    onChange(next);
  }

  function update(id: string, patch: Partial<KitItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [row] = next.splice(index, 1);
    next.splice(target, 0, row);
    onChange(next);
  }

  return (
    <section className="panel" aria-labelledby="kit-title">
      <h2 id="kit-title">{strings.kitTitle}</h2>
      <p className="help">{strings.kitHelp}</p>
      <div className="actions-row">
        <button type="button" className="btn primary" onClick={addTypical}>
          {strings.addTypical}
        </button>
        <button type="button" className="btn" onClick={() => addPreset("station")}>
          {strings.addStation}
        </button>
      </div>
      <div className="preset-row">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="btn"
            onClick={() => addPreset(preset.id)}
            disabled={items.some((item) => item.presetId === preset.id)}
          >
            {preset.label}
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <p className="muted">{strings.emptyKit}</p>
      ) : (
        <ol className="kit">
          {items.map((item, index) => (
            <li className="kit-row" key={item.id}>
              <div className="kit-top">
                <label className="field">
                  {strings.name}
                  <input
                    type="text"
                    value={item.name}
                    onChange={(event) => update(item.id, { name: event.target.value })}
                  />
                </label>
              </div>
              {item.presetId && <span className="estimate">{strings.estimate}</span>}
              {item.capacityNote && <p className="note">{item.capacityNote}</p>}
              <div className="grid-2">
                <label>
                  {strings.holds}
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={item.capacityWh}
                    onChange={(event) =>
                      update(item.id, { capacityWh: numberOrZero(event.target.value) })
                    }
                  />
                </label>
                <label>
                  {strings.chargesAt}
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={item.chargeW}
                    onChange={(event) =>
                      update(item.id, { chargeW: numberOrZero(event.target.value) })
                    }
                  />
                </label>
                <label>
                  {strings.uses}
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={item.drawW}
                    onChange={(event) => update(item.id, { drawW: numberOrZero(event.target.value) })}
                  />
                </label>
                <label>
                  {strings.full}
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round(item.soc * 100)}
                    onChange={(event) =>
                      update(item.id, { soc: clampPercent(numberOrZero(event.target.value)) })
                    }
                  />
                </label>
              </div>
              <label className="check">
                <input
                  type="checkbox"
                  checked={item.sharesPower}
                  onChange={(event) => update(item.id, { sharesPower: event.target.checked })}
                />
                {strings.shares}
              </label>
              <div className="row-actions">
                <div>
                  <button type="button" className="btn" onClick={() => move(index, -1)} disabled={index === 0}>
                    {strings.moveUp}
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                  >
                    {strings.moveDown}
                  </button>
                </div>
                <button
                  type="button"
                  className="btn"
                  onClick={() => onChange(items.filter((candidate) => candidate.id !== item.id))}
                >
                  {strings.remove}
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function numberOrZero(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value)) / 100;
}
