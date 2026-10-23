/**
 * All user-facing copy, in English and Ukrainian.
 * The language comes from ?lang=uk|en, then the saved choice, then the browser language.
 */
const en = {
  latinName: "Ye Zaryad",
  appName: "Є заряд",
  tagline: "What will go dead, and what to charge by when.",
  scheduleTitle: "Outage hours",
  scheduleHelp: "Paste a schedule, or tap the hours the power is off.",
  scheduleLabel: "Schedule text",
  schedulePlaceholder: "08:00–12:00\nз 16:00 до 20:00",
  useSample: "Use sample schedule (SAMPLE)",
  outageList: "Outages",
  removeOutage: "Remove",
  parseHint: "Couldn't read this line. Try 08:00–12:00 or 8-12.",
  tapHelp: "Tap an hour to mark it off. Tap again to clear it.",
  hourLabel: (start: string, end: string, on: boolean) =>
    `${start} to ${end}, ${on ? "outage" : "power on"}`,
  kitTitle: "Your kit",
  kitHelp: "Higher in the list is kept on first. Numbers are typical estimates, not measurements.",
  addTypical: "Add typical kit (estimates)",
  addStation: "Add charging station (estimate)",
  estimate: "Typical estimate",
  holds: "Holds, Wh",
  chargesAt: "Charges at, W",
  uses: "Uses during an outage, W",
  full: "Full now, %",
  shares: "Other devices can draw from this",
  moveUp: "Move up",
  moveDown: "Move down",
  remove: "Remove",
  name: "Name",
  emptyKit: "Add what you need to keep on: phone, router, laptop, a power bank.",
  warningTitle: "What will die",
  needHours: "Add outage hours first. The page will not invent a blackout.",
  needKit: "Add what you own. Then this page can say what runs out.",
  allClear: "Nothing runs out in the next 24 hours.",
  runsOut: (name: string, time: string) => `${name} runs out at ${time}.`,
  chargeFirst: (name: string) => `Charge this first: ${name}.`,
  offNow: (back: string) => `The power is off now. It is due back at ${back}, so nothing can charge before then.`,
  offAllDay: "The power is off for the next 24 hours, so nothing can charge.",
  chargeFirstWhenBack: (name: string) => `When the power is back, charge this first: ${name}.`,
  alsoRunsOut: (name: string, time: string) => `${name} also runs out at ${time}.`,
  dayTitle: "The next 24 hours",
  now: "Now",
  gridOn: "Power on",
  gridOff: "Outage",
  chargeWindow: "Plug in",
  batteryTitle: "Battery level",
  noBattery: "Add something that holds a charge to see the line.",
  breakdownTitle: "This outage",
  getsThrough: (name: string) => `${name} gets through.`,
  lowest: (name: string, pct: string) => `${name} drops to ${pct}.`,
  actionsTitle: "What to charge",
  actionsHelp: "A ready list. Tick a line when it is done.",
  chargeBy: (name: string, time: string) => `Charge ${name} by ${time}`,
  chargeNow: (name: string) => `Charge ${name} now`,
  needsFull: (duration: string, outage: string) =>
    `Needs ${duration} to be full before the ${outage} outage.`,
  needsShort: (duration: string, outage: string) =>
    `Needs ${duration}. It will not be full before the ${outage} outage.`,
  nothingToCharge: "Nothing to charge for the outages in the next 24 hours.",
  noOutageActions: "No outage coming, so there is nothing to schedule a charge for.",
  markDone: (name: string) => `Mark ${name} done`,
  addCalendar: "Add reminders to calendar",
  calendarHelp: "Downloads a calendar file. Your phone adds the reminders.",
  footer: "Typical estimates only. The sample schedule is not from a power company.",
  offlineReady: "Saved on this phone. After the first load, this page opens without internet.",
  hourShort: "h",
  minuteShort: "min",
  switchLanguage: "Українською",
  switchLanguageLabel: "Switch the page to Ukrainian",
  presetNames: {
    router: "Router",
    laptop: "Laptop",
    phone: "Phone",
    flashlight: "Flashlight",
    "power-bank": "Power bank",
    station: "Charging station",
  } as Record<string, string>,
};

export type Strings = typeof en;

const uk: Strings = {
  latinName: "Ye Zaryad",
  appName: "Є заряд",
  tagline: "Що сяде і що до котрої зарядити.",
  scheduleTitle: "Години відключень",
  scheduleHelp: "Встав графік або натисни години, коли світла немає.",
  scheduleLabel: "Текст графіка",
  schedulePlaceholder: "08:00–12:00\nз 16:00 до 20:00",
  useSample: "Взяти приклад графіка (ПРИКЛАД)",
  outageList: "Відключення",
  removeOutage: "Прибрати",
  parseHint: "Не вдалося прочитати рядок. Спробуй 08:00–12:00 або 8-12.",
  tapHelp: "Натисни годину, щоб позначити відключення. Ще раз, щоб зняти.",
  hourLabel: (start: string, end: string, on: boolean) =>
    `${start}–${end}, ${on ? "відключення" : "світло є"}`,
  kitTitle: "Що в тебе є",
  kitHelp: "Те, що вище в списку, тримається першим. Цифри типові, не виміряні.",
  addTypical: "Додати типовий набір (оцінка)",
  addStation: "Додати зарядну станцію (оцінка)",
  estimate: "Типова оцінка",
  holds: "Ємність, Вт·год",
  chargesAt: "Заряджається, Вт",
  uses: "Споживає без світла, Вт",
  full: "Заряджено зараз, %",
  shares: "Інші пристрої можуть від цього живитися",
  moveUp: "Вище",
  moveDown: "Нижче",
  remove: "Прибрати",
  name: "Назва",
  emptyKit: "Додай те, що треба тримати увімкненим: телефон, роутер, ноутбук, павербанк.",
  warningTitle: "Що сяде",
  needHours: "Спершу додай години відключень. Сторінка не вигадує блекаут.",
  needKit: "Додай свої пристрої. Тоді сторінка скаже, що сяде.",
  allClear: "За наступні 24 години нічого не сяде.",
  runsOut: (name: string, time: string) => `${name} сяде о ${time}.`,
  chargeFirst: (name: string) => `Спершу заряди: ${name}.`,
  offNow: (back: string) => `Світла зараз немає. За графіком воно буде о ${back}, тож до того нічого не зарядиш.`,
  offAllDay: "Світла не буде наступні 24 години, тож зарядити нічого не вийде.",
  chargeFirstWhenBack: (name: string) => `Коли дадуть світло, спершу заряди: ${name}.`,
  alsoRunsOut: (name: string, time: string) => `${name} теж сяде о ${time}.`,
  dayTitle: "Наступні 24 години",
  now: "Зараз",
  gridOn: "Світло є",
  gridOff: "Відключення",
  chargeWindow: "Заряджай",
  batteryTitle: "Рівень заряду",
  noBattery: "Додай щось, що тримає заряд, щоб побачити лінію.",
  breakdownTitle: "Це відключення",
  getsThrough: (name: string) => `${name} протримається.`,
  lowest: (name: string, pct: string) => `${name} опуститься до ${pct}.`,
  actionsTitle: "Що зарядити",
  actionsHelp: "Готовий список. Познач рядок, коли зроблено.",
  chargeBy: (name: string, time: string) => `Заряди до ${time}: ${name}`,
  chargeNow: (name: string) => `Заряди зараз: ${name}`,
  needsFull: (duration: string, outage: string) =>
    `Треба ${duration}, щоб повністю зарядити до відключення о ${outage}.`,
  needsShort: (duration: string, outage: string) =>
    `Треба ${duration}. До відключення о ${outage} повністю не зарядиться.`,
  nothingToCharge: "На наступні 24 години нічого заряджати не треба.",
  noOutageActions: "Відключень не видно, тож нагадувати немає про що.",
  markDone: (name: string) => `Позначити: ${name} готово`,
  addCalendar: "Додати нагадування в календар",
  calendarHelp: "Завантажує файл календаря. Телефон додасть нагадування.",
  footer: "Лише типові оцінки. Приклад графіка не від обленерго.",
  offlineReady: "Збережено на цьому телефоні. Після першого відкриття сторінка працює без інтернету.",
  hourShort: "год",
  minuteShort: "хв",
  switchLanguage: "English",
  switchLanguageLabel: "Перемкнути сторінку на англійську",
  presetNames: {
    router: "Роутер",
    laptop: "Ноутбук",
    phone: "Телефон",
    flashlight: "Ліхтарик",
    "power-bank": "Павербанк",
    station: "Зарядна станція",
  },
};

export type Lang = "en" | "uk";
export const LANG_KEY = "ye-zaryad:lang";

export function pickLang(search: string, saved: string | null, browser: string | undefined): Lang {
  const fromUrl = new URLSearchParams(search).get("lang");
  if (fromUrl === "uk" || fromUrl === "en") return fromUrl;
  if (saved === "uk" || saved === "en") return saved;
  return browser?.toLowerCase().startsWith("uk") ? "uk" : "en";
}

function detectLang(): Lang {
  if (typeof window === "undefined") return "en";
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem(LANG_KEY);
  } catch {
    saved = null;
  }
  return pickLang(window.location.search, saved, window.navigator?.language);
}

export const dictionaries: Record<Lang, Strings> = { en, uk };
export const lang: Lang = detectLang();
export const strings: Strings = dictionaries[lang];

export function switchLanguage(): void {
  const next: Lang = lang === "uk" ? "en" : "uk";
  try {
    window.localStorage.setItem(LANG_KEY, next);
  } catch {
    // Private mode: the URL parameter below still switches.
  }
  const url = new URL(window.location.href);
  url.searchParams.set("lang", next);
  window.location.assign(url.toString());
}
