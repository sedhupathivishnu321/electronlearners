// The 400 guided projects of the 8-level kit series. The compact index (name, tier, short description) is loaded from
// /kit-projects/index.json; the full record (parts, circuit notes, Arduino sketch) from /kit-projects/kit{N}.json.
export type Tier = 'Basic' | 'Intermediate' | 'Advanced';

export interface KitProjectIndexItem {
  id: string;        // k8-01
  simId: string;     // id of the same project in the ArduinoForge simulator
  kit: number;
  num: number;
  tier: Tier;
  name: string;
  desc: string;
  parts: string[];
}

export interface KitProjectFull extends KitProjectIndexItem {
  parts: any;
  circuit: string[];
  sketch: string;
  nodeSketch?: string;   // second board (NodeMCU) sketch in Kit 7 projects
}

export const KIT_NAMES: Record<number, string> = {
  1: 'Foundations', 2: 'Sensing the World', 3: 'Displays & Interfaces', 4: 'Motion & Distance',
  5: 'Motors & Power Control', 6: 'Smart Safety & Environment', 7: 'Wireless & Remote Control', 8: 'Smart Systems Capstone',
};
export const KIT_FOCUS: Record<number, string> = {
  1: 'Digital I/O, PWM, analog read, serial', 2: 'Analog and digital sensors, thresholds, calibration', 3: 'Output devices, shift registers, human input',
  4: 'Ranging, presence and position sensing, first servo', 5: 'Transistors, H-bridges, relays, steppers', 6: 'Hazard detection, data sensing, alarms and actuation',
  7: 'Bluetooth, 2.4 GHz radio, IR, Wi-Fi, 3.3 V interfacing', 8: 'Access control, data logging, power monitoring, IMU, pulse sensing',
};
export const TIER_DIFFICULTY: Record<Tier, string> = { Basic: 'Beginner', Intermediate: 'Intermediate', Advanced: 'Advanced' };

export const simulatorLink = (simId: string) => `/arduinoforge/?example=${encodeURIComponent(simId)}`;

let indexCache: Promise<KitProjectIndexItem[]> | null = null;
export function loadProjectIndex(): Promise<KitProjectIndexItem[]> {
  if (!indexCache) indexCache = fetch('/kit-projects/index.json').then((r) => { if (!r.ok) throw new Error('index'); return r.json(); });
  return indexCache;
}
export async function loadKitProjects(kit: number): Promise<KitProjectFull[]> {
  const r = await fetch(`/kit-projects/kit${kit}.json`);
  if (!r.ok) throw new Error('kit');
  return r.json();
}
