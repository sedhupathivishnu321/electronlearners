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
}

export const COURSES_DATA: STEMCourse[] = [
  {
    id: "course-1",
    title: "Complete Electronics & Circuit Design Masterclass",
    slug: "electronics-circuit-design-masterclass",
    category: "Electronics",
    level: "Beginner",
    durationHours: 18,
    lessonsCount: 32,
    rating: 4.9,
    studentsEnrolled: 1420,
    instructor: "Eng. Sedhu (JR Learners Lead)",
    price: 0,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    description: "Master analog and digital circuit design from zero! Learn components, schematics, Breadboard prototyping, 555 timers, op-amps, and transistor switching.",
    whatYouWillLearn: [
      "Understand Voltage, Current, Resistance, and Power calculations",
      "Design active transistor amplifiers & switches",
      "Master Op-Amp operational amplifier circuits",
      "Build power supply voltage regulators"
    ],
    modules: [
      {
        id: "mod-1",
        title: "Module 1: Electrical Principles & Resistors",
        lessons: [
          { id: "les-1", title: "1. Welcome & Fundamentals of Electricity", duration: "14:20", videoUrl: "https://www.youtube.com/watch?v=8q-p09yI6bM", isFreePreview: true },
          { id: "les-2", title: "2. Ohm's Law & Breadboard Prototyping", duration: "22:15", videoUrl: "https://www.youtube.com/watch?v=8q-p09yI6bM" }
        ]
      },
      {
        id: "mod-2",
        title: "Module 2: Capacitors, Diodes & Transistors",
        lessons: [
          { id: "les-3", title: "3. Capacitor Charging & RC Filters", duration: "18:40", videoUrl: "https://www.youtube.com/watch?v=8q-p09yI6bM" },
          { id: "les-4", title: "4. NPN vs PNP Transistor Switches", duration: "25:10", videoUrl: "https://www.youtube.com/watch?v=8q-p09yI6bM" }
        ]
      }
    ]
  },
  {
    id: "course-2",
    title: "Arduino C++ Programming & Hardware Interfacing",
    slug: "arduino-programming-hardware-interfacing",
    category: "Arduino",
    level: "Beginner",
    durationHours: 24,
    lessonsCount: 45,
    rating: 4.9,
    studentsEnrolled: 2890,
    instructor: "LetsGetEngagedin Team",
    price: 0,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
    description: "Learn Arduino microcontrollers from scratch! Interface 20+ sensors, LCD screens, motors, ultrasonic rangefinders, and build real-world automation projects.",
    whatYouWillLearn: [
      "Write clean modular C++ code for Arduino IDE 2.x",
      "Control DC Motors, Servos, and Stepper Motors",
      "Interface I2C and SPI sensors",
      "Build automated sensor dataloggers"
    ],
    modules: [
      {
        id: "mod-1",
        title: "Module 1: Arduino Environment & I/O",
        lessons: [
          { id: "les-1", title: "1. Hardware Overview & IDE Setup", duration: "15:00", videoUrl: "https://www.youtube.com/watch?v=nL34zDTPkcs", isFreePreview: true },
          { id: "les-2", title: "2. Digital Output: Blinking LEDs & Traffic Lights", duration: "19:30", videoUrl: "https://www.youtube.com/watch?v=nL34zDTPkcs" }
        ]
      }
    ]
  },
  {
    id: "course-3",
    title: "Embedded C & Bare-Metal Microcontroller Architecture",
    slug: "embedded-c-baremetal-microcontrollers",
    category: "Embedded",
    level: "Advanced",
    durationHours: 30,
    lessonsCount: 52,
    rating: 4.8,
    studentsEnrolled: 890,
    instructor: "Dr. K. Ramanathan",
    price: 0,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    description: "Program microcontrollers at the register level without libraries. Master memory maps, interrupts, PWM timers, UART communication, and USB logic analyzer debugging.",
    whatYouWillLearn: [
      "Direct register manipulation in C (PORT, DDR, PIN registers)",
      "Hardware Interrupt ISR routines",
      "Hardware Timers CTC & Fast PWM modes",
      "Bare-metal UART & SPI drivers"
    ],
    modules: [
      {
        id: "mod-1",
        title: "Module 1: Memory Architecture & Pointers",
        lessons: [
          { id: "les-1", title: "1. AVR Core Memory Architecture", duration: "25:00", videoUrl: "https://www.youtube.com/watch?v=J_7_s_v4_8k", isFreePreview: true }
        ]
      }
    ]
  },
  {
    id: "course-4",
    title: "ESP32 IoT Cloud Systems & Blynk 2.0 Integration",
    slug: "esp32-iot-cloud-systems",
    category: "ESP32",
    level: "Intermediate",
    durationHours: 20,
    lessonsCount: 38,
    rating: 4.9,
    studentsEnrolled: 1750,
    instructor: "LetsGetEngagedin Team",
    price: 0,
    originalPrice: 3299,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    description: "Build Wi-Fi & Bluetooth IoT devices with ESP32! Learn HTTP Web Servers, MQTT messaging protocol, Blynk mobile apps, and AWS IoT Core.",
    whatYouWillLearn: [
      "Host responsive web applications on dual-core ESP32",
      "Publish telemetry data over MQTT protocol",
      "Build mobile dashboards on Blynk 2.0 app",
      "Implement OTA (Over-The-Air) Wi-Fi firmware updates"
    ],
    modules: [
      {
        id: "mod-1",
        title: "Module 1: ESP32 Wi-Fi & Web Servers",
        lessons: [
          { id: "les-1", title: "1. ESP32 Wi-Fi Modes & Connection", duration: "18:00", videoUrl: "https://www.youtube.com/watch?v=3q-v_q3rXqY", isFreePreview: true }
        ]
      }
    ]
  },
  {
    id: "course-5",
    title: "STM32 ARM Cortex-M3/M4 Embedded Programming",
    slug: "stm32-arm-cortex-programming",
    category: "STM32",
    level: "Advanced",
    durationHours: 35,
    lessonsCount: 60,
    rating: 4.9,
    studentsEnrolled: 640,
    instructor: "Eng. Sedhu",
    price: 0,
    originalPrice: 4499,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    description: "Master 32-bit ARM Cortex architecture using STM32CubeIDE, HAL drivers, DMA memory transfers, and FreeRTOS real-time operating system kernel.",
    whatYouWillLearn: [
      "Configure STM32 pinouts in STM32CubeMX",
      "Debug ARM code step-by-step with ST-Link V2 SWD",
      "Direct Memory Access (DMA) for ultra-fast sampling",
      "FreeRTOS tasks, semaphores, and message queues"
    ],
    modules: [
      {
        id: "mod-1",
        title: "Module 1: STM32 Architecture & ST-Link",
        lessons: [
          { id: "les-1", title: "1. ARM Cortex-M Core Overview", duration: "28:10", videoUrl: "https://www.youtube.com/watch?v=u1j_7v8k_0w", isFreePreview: true }
        ]
      }
    ]
  },
  {
    id: "course-6",
    title: "KiCad 8 PCB Design & High-Speed Layout",
    slug: "kicad-pcb-design-high-speed-layout",
    category: "PCB Design",
    level: "Intermediate",
    durationHours: 16,
    lessonsCount: 28,
    rating: 4.9,
    studentsEnrolled: 1120,
    instructor: "LetsGetEngagedin Team",
    price: 0,
    originalPrice: 2799,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    description: "Design custom circuit boards like a pro! Learn schematic capture, symbol creation, footprint matching, 2-layer routing, thermal reliefs, and Gerber manufacturing.",
    whatYouWillLearn: [
      "Master KiCad 8 EDA interface and shortcut keys",
      "Create custom schematic symbols and 3D step models",
      "Route differential pairs and high-current power traces",
      "Order custom PCBs from overseas & local fabs"
    ],
    modules: [
      {
        id: "mod-1",
        title: "Module 1: KiCad Schematic Capture",
        lessons: [
          { id: "les-1", title: "1. Drawing Schematics in KiCad 8", duration: "22:00", videoUrl: "https://www.youtube.com/watch?v=vaCVh2PtWE4", isFreePreview: true }
        ]
      }
    ]
  },
  {
    id: "course-7",
    title: "Robotics Kinematics, PID & Autonomous Navigation",
    slug: "robotics-kinematics-pid-navigation",
    category: "Robotics",
    level: "Intermediate",
    durationHours: 28,
    lessonsCount: 48,
    rating: 4.9,
    studentsEnrolled: 1310,
    instructor: "Eng. Sedhu",
    price: 0,
    originalPrice: 3499,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
    description: "Build intelligent mobile robots! Learn differential drive kinematics, PID feedback tuning, optical motor encoders, ultrasonic obstacle radar, and maze solving.",
    whatYouWillLearn: [
      "Calculate wheel speed RPM and robot velocity vector",
      "Tune PID position & velocity feedback control loops",
      "Read quadrature encoder interrupt signals",
      "Implement Floodfill maze navigation algorithm"
    ],
    modules: [
      {
        id: "mod-1",
        title: "Module 1: Robot Chassis Dynamics & Motor Drivers",
        lessons: [
          { id: "les-1", title: "1. Motor Driver H-Bridge Physics", duration: "20:00", videoUrl: "https://www.youtube.com/watch?v=v_k4_v5v9yM", isFreePreview: true }
        ]
      }
    ]
  },
  {
    id: "course-8",
    title: "Python for Hardware Engineers & OpenCV Computer Vision",
    slug: "python-hardware-engineers-opencv",
    category: "Python",
    level: "Beginner",
    durationHours: 22,
    lessonsCount: 40,
    rating: 4.8,
    studentsEnrolled: 2100,
    instructor: "LetsGetEngagedin Team",
    price: 0,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    description: "Learn Python 3 for serial communication (PySerial), automated hardware testing, data plot visualization (Matplotlib), and real-time computer vision (OpenCV).",
    whatYouWillLearn: [
      "Master Python object-oriented syntax for hardware automation",
      "Read USB serial data streams with PySerial",
      "Process camera frames with OpenCV for face detection",
      "Build GUI dashboards with PyQt / CustomTkinter"
    ],
    modules: [
      {
        id: "mod-1",
        title: "Module 1: Python Hardware Fundamentals",
        lessons: [
          { id: "les-1", title: "1. Setting up Python 3.11 & PySerial", duration: "16:40", videoUrl: "https://www.youtube.com/watch?v=JmC-q39k8r8", isFreePreview: true }
        ]
      }
    ]
  }
];
