/** Convert milliamp-hours at a cell voltage into watt-hours, after an efficiency factor. */
export function mahToWh(mah: number, volts = 3.7, efficiency = 0.85): number {
  return (mah / 1000) * volts * efficiency;
}
