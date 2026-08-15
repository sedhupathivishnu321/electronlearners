export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isFreePreview?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface STEMCourse {
  id: string;
  title: string;
  slug: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  lessonsCount: number;
  rating: number;
  studentsEnrolled: number;
  instructor: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  whatYouWillLearn: string[];
  modules: CourseModule[];
  recommendedHardwareId: string;
}

export const COURSES_DATA: STEMCourse[] = [
  {
    id: "course-1",
    title: "Basic Electronics Mastery",
    slug: "basic-electronics-mastery",
    category: "Electronics",
    level: "Beginner",
    durationHours: 12,
    lessonsCount: 15,
    rating: 4.9,
    studentsEnrolled: 1840,
    instructor: "LetsGetEngagedin Team",
    price: 0,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    description: "Understand Ohm's law, resistors, capacitors, transistors, and passive components. Learn circuit troubleshooting and breadboard prototyping from the ground up without coding.",
    whatYouWillLearn: [
      "Calculate resistance, voltage drop, and electrical current flow",
      "Understand transistor switching and voltage dividers",
      "Build astable multi-vibrators using NE555 Timer ICs",
      "Read circuit diagrams and configure multi-meters safely"
    ],
    recommendedHardwareId: "prod-2",
    modules: [
      {
        id: "mod-1",
        title: "Module 1: Principles of Electricity",
        lessons: [
          { id: "les-1", title: "1. Current, Voltage, and Ohm's Law Basics", duration: "12:45", videoUrl: "https://www.youtube.com/watch?v=8q-p09yI6bM", isFreePreview: true },
          { id: "les-2", title: "2. Setting Up Solderless Breadboards", duration: "10:15", videoUrl: "https://www.youtube.com/watch?v=8q-p09yI6bM" }
        ]
      },
      {
        id: "mod-2",
        title: "Module 2: Key Active Components",
        lessons: [
          { id: "les-3", title: "3. Capacitor Charging Curves & Filters", duration: "14:30", videoUrl: "https://www.youtube.com/watch?v=8q-p09yI6bM" },
          { id: "les-4", title: "4. NPN & PNP BJT Transistor Switching", duration: "16:20", videoUrl: "https://www.youtube.com/watch?v=8q-p09yI6bM" }
        ]
      }
    ]
  },
  {
    id: "course-2",
    title: "Arduino Fundamentals",
    slug: "arduino-fundamentals",
    category: "Arduino",
    level: "Beginner",
    durationHours: 18,
    lessonsCount: 24,
    rating: 4.9,
    studentsEnrolled: 3420,
    instructor: "LetsGetEngagedin Team",
    price: 0,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
    description: "Write C++ programs in the Arduino IDE and build projects. Learn GPIO control, analog/digital sensor reading, motor driving, and serial port communication.",
    whatYouWillLearn: [
      "Program microcontrollers in Arduino IDE using basic C++ functions",
      "Interface analog inputs, registers, and digital relays",
      "Control DC Motors, SG90 servo turrets, and standard I2C LCD screens",
      "Construct complete sensory systems with custom libraries"
    ],
    recommendedHardwareId: "prod-1",
    modules: [
      {
        id: "mod-1",
        title: "Module 1: Getting Started with Arduino IDE",
        lessons: [
          { id: "les-1", title: "1. Arduino IDE Installation & USB CH340 Driver setup", duration: "14:02", videoUrl: "https://www.youtube.com/watch?v=nL34zDTPkcs", isFreePreview: true },
          { id: "les-2", title: "2. Coding Structure: Setup vs Loop functions", duration: "18:22", videoUrl: "https://www.youtube.com/watch?v=nL34zDTPkcs" }
        ]
      },
      {
        id: "mod-2",
        title: "Module 2: Interfacing Outputs",
        lessons: [
          { id: "les-3", title: "3. Driving Servos and DC H-Bridge Shields", duration: "19:15", videoUrl: "https://www.youtube.com/watch?v=nL34zDTPkcs" },
          { id: "les-4", title: "4. Printing data on 16x2 Liquid Crystal Displays", duration: "15:40", videoUrl: "https://www.youtube.com/watch?v=nL34zDTPkcs" }
        ]
      }
    ]
  },
  {
    id: "course-3",
    title: "Sensors & Modules",
    slug: "sensors-modules",
    category: "Sensors",
    level: "Beginner",
    durationHours: 10,
    lessonsCount: 18,
    rating: 4.8,
    studentsEnrolled: 1540,
    instructor: "LetsGetEngagedin Team",
    price: 0,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
    description: "Learn how to read signals from 37+ modules. Master ADC readings, temperature, motion, distance sensors, rain monitoring, and gas detectors.",
    whatYouWillLearn: [
      "Understand ADC (Analog-to-Digital Converter) resolution thresholds",
      "Calibrate sensor data ranges in software scripts",
      "Read distance using Ultrasonic HC-SR04 sound timing",
      "Design alert systems utilizing active sensors and buzzers"
    ],
    recommendedHardwareId: "prod-5",
    modules: [
      {
        id: "mod-1",
        title: "Module 1: Analog Sensor Principles",
        lessons: [
          { id: "les-1", title: "1. ADC Read Resolution & Voltage Dividers", duration: "12:50", videoUrl: "https://www.youtube.com/watch?v=k_jHw7b-J3s", isFreePreview: true }
        ]
      },
      {
        id: "mod-2",
        title: "Module 2: Motion & Distance Arrays",
        lessons: [
          { id: "les-2", title: "2. Sound Speed Calibration with Ultrasonic Transceivers", duration: "16:10", videoUrl: "https://www.youtube.com/watch?v=k_jHw7b-J3s" }
        ]
      }
    ]
  },
  {
    id: "course-4",
    title: "Embedded Systems Fundamentals",
    slug: "embedded-systems-fundamentals",
    category: "Embedded",
    level: "Advanced",
    durationHours: 22,
    lessonsCount: 30,
    rating: 4.9,
    studentsEnrolled: 980,
    instructor: "LetsGetEngagedin Team",
    price: 0,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    description: "Write bare-metal register programs, configure UART, SPI, and I2C buses, and handle hardware interrupts. Perfect for university electrical engineering students.",
    whatYouWillLearn: [
      "Read memory mappings and write direct register masks",
      "Manage ISR hardware interrupts and watchdog timers",
      "Implement PWM configurations for high-speed motor steering",
      "Analyze signals using logic analyzers and serial debuggers"
    ],
    recommendedHardwareId: "prod-7",
    modules: [
      {
        id: "mod-1",
        title: "Module 1: Register Maps & Direct Memory",
        lessons: [
          { id: "les-1", title: "1. Microcontroller Internals & DDR/PORT Registers", duration: "22:10", videoUrl: "https://www.youtube.com/watch?v=J_7_s_v4_8k", isFreePreview: true }
        ]
      }
    ]
  },
  {
    id: "course-5",
    title: "IoT with ESP32",
    slug: "iot-with-esp32",
    category: "IoT",
    level: "Intermediate",
    durationHours: 15,
    lessonsCount: 20,
    rating: 4.9,
    studentsEnrolled: 2110,
    instructor: "LetsGetEngagedin Team",
    price: 0,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    description: "Build Wi-Fi connected telemetry systems. Host web servers on the ESP32 chip, connect sensors to Blynk, MQTT databases, and configure Alexa/Google assistant.",
    whatYouWillLearn: [
      "Manage dual-core ESP32 chip settings in Arduino environment",
      "Deploy responsive web-servers inside Wi-Fi Access Points",
      "Publish sensor logs to thingspeak over MQTT telemetry client",
      "Integrate voice alarms with Sinric Pro & Google Home"
    ],
    recommendedHardwareId: "prod-6",
    modules: [
      {
        id: "mod-1",
        title: "Module 1: WiFi Networks & Web Servers",
        lessons: [
          { id: "les-1", title: "1. ESP32 Wi-Fi Station Modes & Host Local Pages", duration: "16:40", videoUrl: "https://www.youtube.com/watch?v=3q-v_q3rXqY", isFreePreview: true }
        ]
      }
    ]
  }
];
