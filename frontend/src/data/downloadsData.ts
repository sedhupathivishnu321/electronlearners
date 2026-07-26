export interface ResourceDownload {
  id: string;
  title: string;
  category: 'PDF Manuals' | 'Circuit Diagrams' | 'Arduino Code' | 'Libraries' | 'Datasheets' | 'PCB Gerber' | '3D Models';
  fileType: string;
  size: string;
  downloadsCount: number;
  url: string;
  description: string;
}

export const DOWNLOADS_DATA: ResourceDownload[] = [
  {
    id: "dl-1",
    title: "Arduino UNO Starter Kit 15-Project Manual",
    category: "PDF Manuals",
    fileType: "PDF",
    size: "14.2 MB",
    downloadsCount: 3420,
    url: "/downloads/manuals/Arduino_Starter_Kit_Guide.pdf",
    description: "Complete 120-page full-color assembly guide with wiring diagrams and C++ code explanation."
  },
  {
    id: "dl-2",
    title: "ESP32 NodeMCU Pinout & Schematic Reference",
    category: "Circuit Diagrams",
    fileType: "PNG",
    size: "2.8 MB",
    downloadsCount: 4890,
    url: "/downloads/schematics/ESP32_Pinout_HD.png",
    description: "High-resolution pinout mapping for ESP32 WROOM-32 (GPIO, ADC, PWM, SPI, I2C, Touch)."
  },
  {
    id: "dl-3",
    title: "ATmega328P Microcontroller Official Microchip Datasheet",
    category: "Datasheets",
    fileType: "PDF",
    size: "8.5 MB",
    downloadsCount: 1950,
    url: "/downloads/datasheets/ATmega328P_Datasheet.pdf",
    description: "Full electrical characteristics, register maps, and pin configurations for ATmega328P."
  },
  {
    id: "dl-4",
    title: "555 LED Flasher KiCad 8 Gerber Fabrication Files",
    category: "PCB Gerber",
    fileType: "ZIP",
    size: "450 KB",
    downloadsCount: 1240,
    url: "/downloads/pcb/555_Flasher_Gerber.zip",
    description: "Ready-to-order Gerber ZIP file compatible with JLCPCB, PCBWay, and PCB Power."
  },
  {
    id: "dl-5",
    title: "2WD Robotic Chassis 3D Printable STL Files",
    category: "3D Models",
    fileType: "STL / ZIP",
    size: "18.4 MB",
    downloadsCount: 890,
    url: "/downloads/3d/2WD_Robot_Chassis_STL.zip",
    description: "3D printable replacement chassis, sensor brackets, and battery holder mounts."
  },
  {
    id: "dl-6",
    title: "ElectronLearners Master Code Repository Bundle",
    category: "Arduino Code",
    fileType: "ZIP",
    size: "24.1 MB",
    downloadsCount: 6100,
    url: "/downloads/code/ElectronLearners_All_Projects_Code.zip",
    description: "Includes source code for all 20 STEM Kits, 100 Projects, and YouTube tutorials."
  }
];
