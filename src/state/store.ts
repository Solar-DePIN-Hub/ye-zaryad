import type { KitItem } from "../domain/types";
import { KIT_MAX, SCHEDULE_MAX, sanitizeItem } from "../domain/validate";

export interface SavedPlan {
  version: 1;
  scheduleText: string;
  items: KitItem[];
  checkedActionIds: string[];
}

export const STORAGE_KEY = "ye-zaryad:v1";

function isItem(value: unknown): value is KitItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<KitItem>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.capacityWh === "number" &&
    typeof item.chargeW === "number" &&
    typeof item.drawW === "number" &&
    typeof item.soc === "number" &&
    typeof item.sharesPower === "boolean"
  );
}

export function loadPlan(storage: Storage | null = safeStorage()): SavedPlan | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<SavedPlan>;
    if (data.version !== 1 || typeof data.scheduleText !== "string" || !Array.isArray(data.items)) {
      return null;
    }
    return {
      version: 1,
      scheduleText: data.scheduleText.slice(0, SCHEDULE_MAX),
      items: data.items.filter(isItem).slice(0, KIT_MAX).map(sanitizeItem),
      checkedActionIds: Array.isArray(data.checkedActionIds)
        ? data.checkedActionIds.filter((id): id is string => typeof id === "string")
        : [],
    };
  } catch {
    return null;
  }
}

export function savePlan(plan: SavedPlan, storage: Storage | null = safeStorage()): void {
  if (!storage) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

function safeStorage(): Storage | null {
  try {
    return localStorage;
  } catch {
    return null;
  }
}
