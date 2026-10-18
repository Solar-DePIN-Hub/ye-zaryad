export interface KitItem {
  id: string;
  presetId?: string;
  name: string;
  capacityWh: number;
  chargeW: number;
  drawW: number;
  /** 0 to 1, how full it is before the plan starts. */
  soc: number;
  sharesPower: boolean;
  capacityNote?: string;
}
