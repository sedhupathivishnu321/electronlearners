export interface DocSection {
  id: string;
  title: string;
  category: 'Getting Started' | 'Software Setup' | 'Hardware Drivers' | 'Troubleshooting' | 'FAQs';
  content: string;
}

export const DOCUMENTATION_DATA: DocSection[] = [
  {
    id: "doc-1",
    title: "1. Installing Arduino IDE 2.3 & Board Managers",
    category: "Software Setup",
    content: `
### Step-by-Step Arduino IDE Installation

1. Download **Arduino IDE 2.3.2** from the official website [arduino.cc](https://www.arduino.cc/en/software).
2. Run the installer executable and select default installation directory.
3. Open Arduino IDE and navigate to **Tools > Board > Board Manager**.
4. Search for \`esp32\` by Espressif and click **Install**.
5. Connect your Arduino / ESP32 board via USB Type-B or Micro-USB cable.
    `
  },
  {
    id: "doc-2",
    title: "2. CH340 / FTDI USB Serial Driver Installation",
    category: "Hardware Drivers",
    content: `
### CH340 / CH341 Driver Setup for Windows & macOS

If your computer fails to assign a COM port (Windows) or \`/dev/cu.usbserial\` (Mac):
1. Download the CH340 Driver package from JR Learners Downloads page.
2. Run \`SETUP.EXE\` on Windows and click **INSTALL**.
3. Re-plug your Arduino clone or ESP32 board.
4. Verify port assignment in Windows Device Manager under **Ports (COM & LPT)**.
    `
  },
  {
    id: "doc-3",
    title: "3. Troubleshooting 'stk500_getsync()' Upload Errors",
    category: "Troubleshooting",
    content: `
### Common Causes & Fixes:

- **Wrong COM Port**: Go to **Tools > Port** and ensure your connected Arduino COM port is checked.
- **Pin 0 (RX) & Pin 1 (TX) Occupied**: Disconnect Bluetooth (HC-05) or Serial modules from Pins 0 and 1 while uploading code!
- **Wrong Processor Selected**: Select **ATmega328P (Old Bootloader)** under **Tools > Processor** if using older UNO/Nano clones.
    `
  }
];
