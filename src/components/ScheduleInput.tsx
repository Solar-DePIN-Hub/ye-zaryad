import {
  blocksToText,
  hourFullyOut,
  removeBlock,
  SAMPLE_SCHEDULE,
  toggleHour,
  type OutageBlock,
  type ParseError,
} from "../domain/parseSchedule";
import { formatClock } from "../domain/time";
import { SCHEDULE_MAX } from "../domain/validate";
import { strings } from "../strings";

interface Props {
  text: string;
  onText: (text: string) => void;
  blocks: OutageBlock[];
  errors: ParseError[];
  nowMin: number;
}

export function ScheduleInput({ text, onText, blocks, errors, nowMin }: Props) {
  const currentHour = Math.floor(nowMin / 60);
  return (
    <section className="panel" aria-labelledby="schedule-title">
      <h2 id="schedule-title">{strings.scheduleTitle}</h2>
      <p className="help">{strings.scheduleHelp}</p>
      <label className="field" htmlFor="schedule-text">
        {strings.scheduleLabel}
      </label>
      <textarea
        id="schedule-text"
        value={text}
        placeholder={strings.schedulePlaceholder}
        onChange={(event) => onText(event.target.value.slice(0, SCHEDULE_MAX))}
        maxLength={SCHEDULE_MAX}
        aria-invalid={errors.length > 0 ? true : undefined}
        spellCheck={false}
      />
      {text.length >= SCHEDULE_MAX && <p className="parse-error">{strings.scheduleTooLong(SCHEDULE_MAX)}</p>}
      <div className="actions-row">
        <button type="button" className="btn" onClick={() => onText(SAMPLE_SCHEDULE)}>
          {strings.useSample}
        </button>
      </div>
      {errors.length > 0 && (
        <div>
          {errors.map((error) => (
            <p className="parse-error" key={`${error.line}-${error.text}`}>
              {strings.parseHint} ({error.text})
            </p>
          ))}
        </div>
      )}
      <ul className="chips" aria-label={strings.outageList}>
        {blocks.map((block) => (
          <li className="chip" key={`${block.startMin}-${block.endMin}`}>
            <span>
              {formatClock(block.startMin)}–{formatClock(block.endMin)}
            </span>
            <button
              type="button"
              onClick={() => onText(blocksToText(removeBlock(blocks, block)))}
              aria-label={`${strings.removeOutage} ${formatClock(block.startMin)}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <p className="help">{strings.tapHelp}</p>
      <div className="hours" role="group" aria-label={strings.scheduleTitle}>
        {Array.from({ length: 24 }, (_, hour) => {
          const on = hourFullyOut(blocks, hour);
          const start = formatClock(hour * 60);
          const end = formatClock((hour + 1) * 60);
          return (
            <button
              key={hour}
              type="button"
              className={hour === currentHour ? "hour now-hour" : "hour"}
              aria-pressed={on}
              aria-label={strings.hourLabel(start, end, on)}
              onClick={() => onText(blocksToText(toggleHour(blocks, hour)))}
            >
              {String(hour).padStart(2, "0")}
            </button>
          );
        })}
      </div>
    </section>
  );
}
