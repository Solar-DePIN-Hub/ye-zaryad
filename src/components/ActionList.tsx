import { actionDetail, actionHeadline, actionsToIcs } from "../domain/actions";
import type { ChargeAction } from "../domain/simulate";
import { strings } from "../strings";

interface Props {
  actions: ChargeAction[];
  checked: string[];
  onToggle: (id: string) => void;
  today: Date;
  hasOutage: boolean;
}

export function ActionList({ actions, checked, onToggle, today, hasOutage }: Props) {
  function download() {
    const text = actionsToIcs(actions, today);
    const blob = new Blob([text], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ye-zaryad.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="panel" aria-labelledby="actions-title">
      <h2 id="actions-title">{strings.actionsTitle}</h2>
      <p className="help">{strings.actionsHelp}</p>
      {actions.length === 0 ? (
        <p className="muted">{hasOutage ? strings.nothingToCharge : strings.noOutageActions}</p>
      ) : (
        <ul className="action-list">
          {actions.map((action) => {
            const done = checked.includes(action.id);
            return (
              <li key={action.id} className={done ? "action done" : "action"}>
                <input
                  type="checkbox"
                  checked={done}
                  aria-label={strings.markDone(action.name)}
                  onChange={() => onToggle(action.id)}
                />
                <div>
                  <strong>{actionHeadline(action)}</strong>
                  <p className="muted">{actionDetail(action)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="actions-row">
        <button type="button" className="btn primary" onClick={download} disabled={actions.length === 0}>
          {strings.addCalendar}
        </button>
      </div>
      <p className="help">{strings.calendarHelp}</p>
    </section>
  );
}
