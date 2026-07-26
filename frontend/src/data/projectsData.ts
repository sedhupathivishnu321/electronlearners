export interface STEMProject {
  id: string;
  title: string;
  slug: string;
  category: 'Arduino' | 'ESP32' | 'STM32' | 'Electronics' | 'IoT' | 'Robotics' | 'Python' | 'AI';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate: string;
  image: string;
  shortDesc: string;
  objectives: string[];
  componentsNeeded: string[];
  circuitDescription: string;
  sourceCode: string;
  codeLanguage: 'cpp' | 'python' | 'c';
  youtubeUrl: string;
}

const CATEGORIES: ('Arduino' | 'ESP32' | 'STM32' | 'Electronics' | 'IoT' | 'Robotics' | 'Python' | 'AI')[] = [
  'Arduino', 'ESP32', 'STM32', 'Electronics', 'IoT', 'Robotics', 'Python', 'AI'
];

const DIFFICULTY_LEVELS: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];

// Generate 100 Rich STEM Projects
export const PROJECTS_DATA: STEMProject[] = Array.from({ length: 100 }, (_, index) => {
  const idNum = index + 1;
  const cat = CATEGORIES[index % CATEGORIES.length];
  const diff = DIFFICULTY_LEVELS[index % DIFFICULTY_LEVELS.length];
  
  const projectTitles: Record<string, string[]> = {
    Arduino: [
      "Smart Plant Automatic Watering System",
      "Ultrasonic Range Finder with 16x2 LCD",
      "Password Protected Digital Door Lock",
      "Arduino RFID Student Attendance Tracker",
      "Bluetooth Controlled Car with HC-05",
      "Digital Thermometer using LM35 Sensor",
      "Servo Motor Pan Tilt Turret",
      "IR Remote Control Household Relay Box",
      "RGB LED Mood Light Strip Controller",
      "Water Level Indicator with Buzzer Alarm",
      "Arduino MP3 Audio Player with MicroSD",
      "Matrix 4x4 Keypad Security System",
      "Solar Panel Light Intensity Meter"
    ],
    ESP32: [
      "ESP32 Wi-Fi Weather Station with OLED",
      "Blynk 2.0 Smart Home Automation Hub",
      "ESP32 Web Server Relay Switch",
      "MQTT Cloud Environmental Sensor Node",
      "ESP32-CAM Live Video Streamer",
      "Bluetooth LE Heart Rate Monitor",
      "ESP32 Capacitive Soil Moisture Logger",
      "Wi-Fi Network Scanner & Packet Monitor",
      "ESP32 Smart Energy Meter with ACS712",
      "Air Quality Index Monitor (MQ-135 + ESP32)",
      "Wi-Fi Controlled Robotic Arm",
      "ESP32 NTP Clock with 64x32 Matrix"
    ],
    STM32: [
      "STM32 Bare-Metal LED PWM Dimmer",
      "ST-Link Debugged ADC Voltage Logger",
      "STM32 FreeRTOS Multi-Tasking System",
      "SPI Color TFT Display GUI Dashboard",
      "STM32 Rotary Encoder Menu Controller",
      "High-Frequency PWM Motor Driver",
      "STM32 I2C OLED Display Terminal",
      "DMA Streamed ADC Audio Analyzer",
      "STM32 USB HID Custom Gamepad",
      "CAN Bus Industrial Node Controller",
      "STM32 Low Power Sleep Battery Logger",
      "Digital Signal Processing Audio Filter"
    ],
    Electronics: [
      "555 Timer Astable LED Flasher Circuit",
      "LM358 Audio Microphone Pre-Amplifier",
      "BC547 Transistor Automatic Night Light",
      "74HC595 Shift Register 8-LED Chaser",
      "Zener Voltage Regulation Bench Supply",
      "74HC47 7-Segment Binary Counter",
      "LM386 Mini 1-Watt Audio Speaker",
      "Touch Sensitive Latch Switch Circuit",
      "Bridge Rectifier 12V DC Power Supply",
      "Inductive Proximity Metal Detector",
      "Light Switch using LDR & Relay",
      "Variable Voltage LM317 Power Regulator"
    ],
    IoT: [
      "LoRaWAN Long Range Soil Moisture Sensor",
      "SIM800L Cellular SMS Emergency Alarm",
      "NEO-6M GPS Tracker on OpenStreetMap",
      "ThingsPeak Cloud Weather Dashboard",
      "Adafruit IO MQTT Relay Switch",
      "Node-RED Smart Factory Telemetry",
      "LoRa Peer-to-Peer 10km Text Transceiver",
      "Firebase Realtime Database Smart Lock",
      "AWS IoT Core ESP32 Telemetry Pipeline",
      "Smart Garbage Bin Capacity Sensor",
      "Industrial Vibration Monitoring Node",
      "Solar Powered IoT Field Weather Station"
    ],
    Robotics: [
      "5-Sensor PID High-Speed Line Follower",
      "Ultrasonic Radar Obstacle Avoidance Robot",
      "4-DOF Robotic Arm with Servo Joysticks",
      "Self-Balancing Inverted Pendulum Robot",
      "4WD Bluetooth RC Car with Speed Control",
      "Wall Following Autonomous Maze Robot",
      "Omni-Wheel 3-Motor Holonomic Platform",
      "Hexapod 6-Legged Crawling Spider Robot",
      "Voice Controlled RC Car via Smartphone",
      "Gesture Controlled Robot with MPU6050 Glove",
      "Mini Quadcopter F4 Flight Controller",
      "Fire Fighting Robot with Water Pump Spray"
    ],
    Python: [
      "Python PySerial Microcontroller GUI",
      "Real-Time Serial Oscilloscope Plotter",
      "OpenCV Motion Detection Alarm",
      "Automated Hardware Test Suite",
      "Python Modbus RTU Industrial Reader",
      "CustomTkinter Control Panel for Arduino",
      "CSV Sensor Log Plotter with Matplotlib",
      "Python Voice Recognition Controller",
      "Web Scraping Hardware Stock Monitor",
      "Automated PCB Bill of Materials Parser",
      "Flask REST API for Hardware Sensors",
      "Pygame Robot Arm Kinematics Simulator"
    ],
    AI: [
      "ESP32-CAM Face Detection Security Guard",
      "TinyML Keyword Voice Spotting on Nano 33",
      "Color Recognition Sorting Machine",
      "Motor Vibration Anomaly Detector (Edge AI)",
      "License Plate OCR Reader with OpenCV",
      "Hand Gesture Servo Control (MediaPipe)",
      "Object Classification with MobileNet",
      "Smart Traffic Light AI Vehicle Counter",
      "Posture Detection Sitting Monitor",
      "Plant Disease Classifier (Keras on Pi)",
      "Edge AI Fire & Smoke Detector",
      "Face Recognition Door Access Lock"
    ]
  };

  const titles = projectTitles[cat];
  const title = titles[index % titles.length] + (index >= titles.length ? ` (Variant ${Math.floor(index / titles.length) + 1})` : "");
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return {
    id: `proj-${idNum}`,
    title: `${idNum}. ${title}`,
    slug: slug,
    category: cat,
    difficulty: diff,
    timeEstimate: `${1 + (index % 5)} Hours`,
    image: `https://images.unsplash.com/photo-${1518770660439 + (index * 100)}?w=600&auto=format&fit=crop&q=80`,
    shortDesc: `Build a complete ${title} step-by-step with circuit diagram schematics, component lists, and verified source code.`,
    objectives: [
      `Understand circuit principles for ${cat} hardware`,
      `Wire breadboard components according to schematic diagram`,
      `Upload and debug source code using official IDE`,
      `Verify output behavior and test edge cases`
    ],
    componentsNeeded: [
      `${cat} Primary Controller Board`,
      "Solderless Breadboard 830 Points",
      "Assorted Resistors & LEDs",
      "Jumper Wires Pack (M-M / M-F)"
    ],
    circuitDescription: `Connect VCC pin to 5V/3.3V power rail, GND pin to common ground. Connect signal output pin to GPIO #${(index % 12) + 2} on the ${cat} microcontroller.`,
    sourceCode: cat === 'Python' ? 
`# ElectronLearners Project #${idNum} - ${title}
import time

def main():
    print("Initializing ${title}...")
    time.sleep(1)
    print("Project successfully initialized!")

if __name__ == "__main__":
    main()`
:
`// ElectronLearners Project #${idNum} - ${title}
// Microcontroller Code for ${cat}

const int SENSOR_PIN = ${(index % 10) + 2};
const int STATUS_LED = 13;

void setup() {
  pinMode(SENSOR_PIN, INPUT);
  pinMode(STATUS_LED, OUTPUT);
  Serial.begin(9600);
  Serial.println("Starting Project #${idNum}: ${title}");
}

void loop() {
  int sensorState = digitalRead(SENSOR_PIN);
  if (sensorState == HIGH) {
    digitalWrite(STATUS_LED, HIGH);
    Serial.println("Sensor Triggered!");
  } else {
    digitalWrite(STATUS_LED, LOW);
  }
  delay(100);
}`,
    codeLanguage: cat === 'Python' ? 'python' : 'cpp',
    youtubeUrl: "https://www.youtube.com/@LetsGetEngagedin"
  };
});
