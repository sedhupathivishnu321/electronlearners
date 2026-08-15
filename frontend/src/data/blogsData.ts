export interface STEMBlog {
  id: string;
  title: string;
  slug: string;
  category: 'Arduino' | 'Electronics' | 'Embedded' | 'IoT' | 'Robotics' | 'Sensors' | 'AI' | 'Engineering';
  author: string;
  date: string;
  readTime: string;
  image: string;
  summary: string;
  tags: string[];
  contentMarkdown: string;
}

const BLOG_CATEGORIES: ('Arduino' | 'Electronics' | 'Embedded' | 'IoT' | 'Robotics' | 'Sensors' | 'AI' | 'Engineering')[] = [
  'Arduino', 'Electronics', 'Embedded', 'IoT', 'Robotics', 'Sensors', 'AI', 'Engineering'
];

export const BLOGS_DATA: STEMBlog[] = Array.from({ length: 100 }, (_, index) => {
  const idNum = index + 1;
  const cat = BLOG_CATEGORIES[index % BLOG_CATEGORIES.length];
  
  const articleTitles: Record<string, string[]> = {
    Arduino: [
      "Top 10 Arduino Mistakes Beginners Make and How to Avoid Them",
      "Understanding Interrupts vs Polling in Arduino Programming",
      "How to Optimize Arduino RAM Usage with the F() Macro",
      "Arduino UNO R3 vs ESP32: Which One Should You Buy in 2026?",
      "Interfacing I2C OLED Displays with Arduino Step-by-Step",
      "Demystifying PWM (Pulse Width Modulation) in Microcontrollers",
      "How to Drive High Current DC Motors Safely with Arduino",
      "Using SoftwareSerial vs Hardware UART on Microcontrollers",
      "EEPROM Storage in Arduino: Preserving Settings After Power Off",
      "Debugging Arduino Code with Serial Monitor & Plotter"
    ],
    Electronics: [
      "Ohm's Law Demystified: Voltage, Current, and Resistance Explained",
      "How to Read Resistor Color Codes Like an Electrical Engineer",
      "Understanding 555 Timer IC Modes: Astable, Monostable & Bistable",
      "Transistor Switches: NPN vs PNP Current Flow Guide",
      "Active vs Passive Filters: Low-Pass, High-Pass & Band-Pass",
      "Zener Diode Voltage Regulator Design & Calculations",
      "Op-Amp Basics: Inverting vs Non-Inverting Amplifiers",
      "Decoupling Capacitors: Why Every IC Needs Power Filtering",
      "How to Choose the Right AC to DC Power Supply",
      "Understanding AC Ripple Voltage & Smoothing Electrolytic Caps"
    ],
    Embedded: [
      "Bare-Metal C vs Arduino Framework: Pros, Cons, and Performance",
      "AVR Register Manipulation: DDRB, PORTB, and PINB Decoded",
      "Introduction to FreeRTOS: Real-Time Multitasking for Embedded C",
      "STM32 HAL vs Low-Layer (LL) Drivers Comparison",
      "Understanding Direct Memory Access (DMA) in 32-Bit MCUs",
      "How USB Logic Analyzers Debug I2C and SPI Bus Failures",
      "Writing Portable C Code for Microcontrollers",
      "Handling Floating Point Math Efficiently on Embedded Processors",
      "Microcontroller Sleep Modes & Ultra-Low Power Battery Optimization",
      "Bootloaders Explained: How Firmware Flashing Works Over UART"
    ],
    IoT: [
      "MQTT Protocol Tutorial: Publish, Subscribe, and Broker Architecture",
      "LoRaWAN vs Cellular IoT vs Wi-Fi: Choosing the Right Wireless Tech",
      "Building Secure IoT Web Servers with HTTPS & ESP32",
      "Introduction to Node-RED for Industrial Automation Dashboards",
      "How Blynk 2.0 Simplifies Mobile IoT App Development",
      "AWS IoT Core vs ThingsPeak vs Adafruit IO Platform Benchmark",
      "Over-The-Air (OTA) Firmware Updates for ESP32 & ESP8266",
      "Designing Solar-Powered Remote IoT Telemetry Nodes",
      "Understanding SIM800L GSM AT Commands for SMS & GPRS Data",
      "NEO-6M GPS NMEA Sentence Parsing Guide"
    ],
    Robotics: [
      "PID Control Loop Tuning: Proportional, Integral & Derivative Math",
      "Differential Drive Robot Kinematics: Wheel Velocity Vectors",
      "Optical Quadrature Encoders: Measuring Motor Speed & Position",
      "H-Bridge Motor Driver ICs: L298N vs TB6612FNG vs VNH2SP30",
      "Ultrasonic Radar Pan-Tilt Turret Navigation Algorithms",
      "How Robotic Arms Solve Inverse Kinematics",
      "Designing Self-Balancing Inverted Pendulum Robots",
      "Floodfill Algorithm for Autonomous Maze Solving Robots",
      "Brushless DC Motors (BLDC) vs Stepper Motors vs DC Motors",
      "RC Radio Telemetry Transmitters & PPM/SBUS Receivers"
    ],
    Sensors: [
      "Interfacing MPU6050 Accelerometer & Gyroscope with Complementary Filter",
      "DHT11 vs DHT22 vs BME280: Environmental Sensor Comparison",
      "Calibrating Capacitive Soil Moisture Sensors for Precision Farming",
      "How Ultrasonic HC-SR04 Distance Sensors Work",
      "MQ-2 and MQ-135 Gas Sensors: Calibration & Resistance Ratios",
      "Infrared TCRT5000 Reflectance Sensors for Line Tracking",
      "PIR Motion Detection Sensors: Fresnel Lenses & Pyroelectric Tech",
      "INA219 High-Side DC Current & Power Sensor Guide",
      "MFRC522 RFID Card Reader Security & SPI Protocol",
      "Pulse Heart Rate Bio-Sensors for Wearable Electronics"
    ],
    AI: [
      "TinyML on Microcontrollers: Deploying TensorFlow Lite on ARM",
      "ESP32-CAM Computer Vision with Python OpenCV & Flask",
      "Face Recognition on Edge AI: Kendryte K210 KPU Acceleration",
      "Industrial Motor Anomaly Detection with Edge Impulse ML",
      "OpenCV Color Tracking & HSV Thresholding Tutorial",
      "Convolutional Neural Networks (CNN) Explained for Hardware Devs",
      "Hand Gesture Recognition using MediaPipe & MicroPython",
      "Speech Keyword Spotting on Microcontrollers without Internet",
      "AI Vision vs Ultrasonic Sensors for Autonomous Robot Obstacles",
      "Building a Plant Disease Classifier on Raspberry Pi"
    ],
    Engineering: [
      "KiCad 8 PCB Design Checklist Before Ordering Gerber Files",
      "How to Solder Surface Mount SMD 0805 Components Easily",
      "Essential Benchtop Equipment Every Electronics Lab Needs",
      "Understanding Heat Sinking & Thermal Dissipation in Power ICs",
      "ESD (Electrostatic Discharge) Protection in Circuit Layout",
      "Reverse Polarity & Overvoltage Protection Circuit Techniques",
      "How to Read Microcontroller Datasheets Like a Senior Engineer",
      "Noise Reduction Strategies in High-Gain Analog Circuits",
      "Building a Career in Embedded Systems & Robotics Engineering",
      "JR Learners STEM Education Ecosystem Roadmap 2026"
    ]
  };

  const categoryTitles = articleTitles[cat];
  const title = categoryTitles[index % categoryTitles.length] + (index >= categoryTitles.length ? ` - Part ${Math.floor(index / categoryTitles.length) + 1}` : "");
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return {
    id: `blog-${idNum}`,
    title: `${idNum}. ${title}`,
    slug: slug,
    category: cat,
    author: index % 2 === 0 ? "Eng. Sedhu" : "JR Learners STEM Editorial",
    date: `2026-0${(index % 6) + 1}-15`,
    readTime: `${4 + (index % 6)} min read`,
    image: `https://images.unsplash.com/photo-${1518770660439 + (index * 80)}?w=600&auto=format&fit=crop&q=80`,
    summary: `Discover expert insights on ${title}. Step-by-step engineering tutorial, schematics, and practical recommendations from JR Learners.`,
    tags: [cat, "Tutorial", "Engineering", "STEM", "HandsOn"],
    contentMarkdown: `
# ${title}

*Published by JR Learners Engineering Team*

In this comprehensive guide, we explore the core fundamentals of **${title}**. Whether you are a STEM student, educator, or maker, mastering these engineering principles will elevate your technical capabilities.

---

## Key Takeaways

1. Understand the theoretical foundation of **${cat}**.
2. Learn practical circuit wiring and firmware practices.
3. Avoid common rookie mistakes when designing embedded hardware.
4. Download working source code snippets directly tested on physical STEM kits.

---

## Deep Dive Explanation

When working with microcontrollers and analog circuits, proper power distribution and noise suppression are paramount. Always place a **0.1µF ceramic decoupling capacitor** close to the VCC and GND pins of your ICs to suppress high-frequency switching transients.

\`\`\`cpp
// Example Initialization Code Snippet
void setup() {
  Serial.begin(115200);
  Serial.println("JR Learners STEM Article #${idNum}");
}
\`\`\`

---

## Conclusion

By applying these practical guidelines, your electronics and robotics projects will achieve greater reliability and performance. Explore our 20 STEM Product Kits and YouTube channel [@LetsGetEngagedin](https://www.youtube.com/@LetsGetEngagedin) for full video walkthroughs!
`
  };
});
