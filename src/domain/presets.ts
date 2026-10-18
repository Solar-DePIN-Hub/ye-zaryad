import type { KitItem } from "./types";
import { mahToWh } from "./units";

export interface Preset {
  id: string;
  label: string;
  item: Omit<KitItem, "id" | "presetId">;
}

const powerBankWh = mahToWh(20000);

export const presets: Preset[] = [
  {
    id: "router",
    label: "Router",
    item: {
      name: "Router",
      capacityWh: 0,
      chargeW: 0,
      drawW: 12,
      soc: 1,
      sharesPower: false,
    },
  },
  {
    id: "laptop",
    label: "Laptop",
    item: {
      name: "Laptop",
      capacityWh: 60,
      chargeW: 60,
      drawW: 45,
      soc: 0.45,
      sharesPower: false,
    },
  },
  {
    id: "phone",
    label: "Phone",
    item: {
      name: "Phone",
      capacityWh: 12,
      chargeW: 18,
      drawW: 3,
      soc: 0.4,
      sharesPower: false,
    },
  },
  {
    id: "flashlight",
    label: "Flashlight",
    item: {
      name: "Flashlight",
      capacityWh: 8,
      chargeW: 5,
      drawW: 3,
      soc: 0.7,
      sharesPower: false,
    },
  },
  {
    id: "power-bank",
    label: "Power bank",
    item: {
      name: "Power bank",
      capacityWh: round1(powerBankWh),
      chargeW: 60,
      drawW: 0,
      soc: 0.3,
      sharesPower: true,
      capacityNote: "20 000 mAh at 3.7 V × 0.85 ≈ 62.9 Wh.",
    },
  },
  {
    id: "station",
    label: "Charging station",
    item: {
      name: "Charging station",
      capacityWh: 512,
      chargeW: 300,
      drawW: 0,
      soc: 0.8,
      sharesPower: true,
      capacityNote: "Portable station, about 512 Wh.",
    },
  },
];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export const typicalKitIds = ["router", "laptop", "phone", "flashlight", "power-bank"];

export function presetById(id: string): Preset | undefined {
  return presets.find((preset) => preset.id === id);
}
