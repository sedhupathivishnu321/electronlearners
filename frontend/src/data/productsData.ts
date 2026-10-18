export interface ProductComponent {
  name: string;
  quantity: number;
}

export interface KitProject {
  tier: 'Basic' | 'Intermediate' | 'Advanced';
  name: string;
  desc: string;
}

export interface STEMProduct {
  id: string;
  name: string;
  slug: string;
  category: 'Arduino' | 'Electronics' | 'Robotics' | 'IoT' | 'Raspberry Pi' | 'AI' | 'PCB' | 'Embedded';
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  badge?: string;
  image: string;
  shortDesc: string;
  description: string;
  learningObjectives: string[];
  components: ProductComponent[];
  specifications: Record<string, string>;
  assemblySteps: string[];
  manualUrl: string;
  datasheetUrl: string;
  codeSnippetUrl?: string;
  videoUrl: string;
  faqs: { question: string; answer: string }[];
  projects?: KitProject[];
}

// The JR Learners Arduino Kit Series: 8 levels, 50 projects each (10 Basic, 20 Intermediate, 20 Advanced = 400 projects).
// Selling price = component cost of the kit (BOM, incl. the common core) + 40 %, rounded to the nearest rupee.
export const KIT_MARKUP = 0.4;
export const kitPrice = (componentCost: number) => Math.round(componentCost * (1 + KIT_MARKUP));

export const PRODUCTS_DATA: STEMProduct[] = [
  {
    "id": "prod-1",
    "name": "Level 1: Foundations Kit",
    "slug": "arduino-kit-1-foundations",
    "category": "Arduino",
    "price": 848,
    "originalPrice": 848,
    "rating": 4.8,
    "reviewsCount": 0,
    "stock": 100,
    "image": "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
    "shortDesc": "JR Learners Arduino Kit 1 of 8 - Foundations. Absolute beginner: digital I/O, PWM, analog read, serial. Includes an Arduino UNO R3 and 50 guided projects (10 Basic, 20 Intermediate, 20 Advanced).",
    "description": "Kit 1 of the 8-level JR Learners Arduino series: Foundations. Focus: Absolute beginner: digital I/O, PWM, analog read, serial. The kit contains 19 pieces on 19 BOM lines - the common core (Arduino UNO R3, USB cable, breadboard, jumper wires, resistors, push button, LEDs) plus the level-specific parts. Every one of the 50 projects uses only the parts in this kit and can be built and tested first in the free ArduinoForge simulator at /arduinoforge/.",
    "learningObjectives": [
      "Project examples: Blink / SOS",
      "Project examples: button-controlled LED",
      "Project examples: traffic light",
      "Focus: Absolute beginner: digital I/O, PWM, analog read, serial",
      "Build every circuit in the ArduinoForge simulator first, then on the real breadboard",
      "50 projects: 10 Basic, 20 Intermediate and 20 Advanced"
    ],
    "components": [
      {
        "name": "Arduino UNO R3 (clone, SMD)",
        "quantity": 1
      },
      {
        "name": "USB Type-A to B cable (Arduino)",
        "quantity": 1
      },
      {
        "name": "Breadboard 400 points",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-M (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires F-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Resistor Kit 1/4W assorted",
        "quantity": 1
      },
      {
        "name": "Push Button tactile 6x6",
        "quantity": 1
      },
      {
        "name": "LED 5mm Red",
        "quantity": 1
      },
      {
        "name": "LED 5mm Green",
        "quantity": 1
      },
      {
        "name": "LED 5mm Yellow",
        "quantity": 1
      },
      {
        "name": "LED 5mm Blue",
        "quantity": 1
      },
      {
        "name": "RGB LED common cathode 5mm",
        "quantity": 1
      },
      {
        "name": "Resistor 220 ohm 1/4W",
        "quantity": 1
      },
      {
        "name": "Potentiometer 10k (rotary)",
        "quantity": 1
      },
      {
        "name": "Buzzer Active 5V",
        "quantity": 1
      },
      {
        "name": "Piezo Passive Buzzer",
        "quantity": 1
      },
      {
        "name": "LDR Light Sensor Module",
        "quantity": 1
      },
      {
        "name": "Slide Switch SPDT",
        "quantity": 1
      }
    ],
    "specifications": {
      "Level": "1 of 8 - Foundations",
      "Microcontroller": "ATmega328P (Arduino UNO R3)",
      "Operating Voltage": "5V",
      "Projects": "50 (10 Basic, 20 Intermediate, 20 Advanced)",
      "Total Pieces": "19",
      "Level-specific Parts": "7",
      "Simulator": "ArduinoForge (web and desktop)"
    },
    "assemblySteps": [
      "Connect the Arduino UNO to your PC with the USB cable and install Arduino IDE 2.x (plus the CH340 driver for clone boards)",
      "Open the matching project in the ArduinoForge simulator (/arduinoforge/, menu Examples > Kit 1) and study the wiring and sketch",
      "Build the same circuit on the breadboard with the jumper wires and resistors from the kit",
      "Copy the sketch into the Arduino IDE, upload it and compare the result with the simulator"
    ],
    "manualUrl": "/arduinoforge/",
    "datasheetUrl": "/downloads",
    "videoUrl": "https://www.youtube.com/@LetsGetEngagedin",
    "faqs": [
      {
        "question": "Which parts are in this kit?",
        "answer": "12 common-core lines (UNO R3, cable, breadboard, jumpers, resistors, button, LEDs) and 7 level-specific lines. The full list is under Components."
      },
      {
        "question": "Do I need the earlier kits?",
        "answer": "No. Every kit includes the Arduino UNO R3 and the common core, so each level can be bought and used on its own."
      },
      {
        "question": "How many projects are included?",
        "answer": "50 per kit: 10 Basic, 20 Intermediate and 20 Advanced, each with circuit, sketch and expected result in the simulator."
      },
      {
        "question": "Is prior coding experience required?",
        "answer": "Kit 1 starts from scratch. Later kits assume the basics from the previous levels."
      }
    ],
    "projects": [
      {
        "tier": "Basic",
        "name": "Blink the LED",
        "desc": "Blink the red LED once per second using digital output and delay-free timing."
      },
      {
        "tier": "Basic",
        "name": "Two-LED Alternate Flasher",
        "desc": "Red and green LEDs flash alternately like a railway crossing."
      },
      {
        "tier": "Basic",
        "name": "Button-Controlled LED",
        "desc": "Hold the push button to light the LED; release to turn off (digital input with pull-up)."
      },
      {
        "tier": "Basic",
        "name": "Toggle Latch Switch",
        "desc": "Each button press toggles the green LED on/off with software debounce."
      },
      {
        "tier": "Basic",
        "name": "Slide-Switch Mode Select",
        "desc": "The slide switch chooses between a slow blink and a fast blink on the red LED."
      },
      {
        "tier": "Basic",
        "name": "Potentiometer Brightness Dimmer",
        "desc": "The pot sets the PWM brightness of the green LED via analogRead/analogWrite."
      },
      {
        "tier": "Basic",
        "name": "RGB Colour Cycle",
        "desc": "Step an RGB LED through red, green, blue and mixed colours."
      },
      {
        "tier": "Basic",
        "name": "Active Buzzer Beeper",
        "desc": "Sound short and long beeps from the active buzzer when the button is pressed."
      },
      {
        "tier": "Basic",
        "name": "Piezo Tone Scale",
        "desc": "Play the notes C-D-E-F-G-A-B-C with tone() on the passive buzzer."
      },
      {
        "tier": "Basic",
        "name": "Serial Monitor Hello and Echo",
        "desc": "Print text and echo typed characters over the serial monitor; blink the LED on each byte."
      },
      {
        "tier": "Intermediate",
        "name": "Traffic Light Controller",
        "desc": "Red, yellow and green LEDs in a timed cycle with correct sequencing."
      },
      {
        "tier": "Intermediate",
        "name": "Pedestrian Crossing",
        "desc": "Button request triggers a safe sequence: cars stop, pedestrian green blinks, buzzer ticks."
      },
      {
        "tier": "Intermediate",
        "name": "Pot-Controlled RGB Mixer",
        "desc": "Use one pot and the button to select a channel and set its PWM intensity."
      },
      {
        "tier": "Intermediate",
        "name": "LED Fade Breathing Effect",
        "desc": "Smooth sine-shaped fade in/out of the RGB LED to mimic breathing."
      },
      {
        "tier": "Intermediate",
        "name": "Knight Rider Scanner",
        "desc": "Sweep light between red and green LEDs with speed set by the pot."
      },
      {
        "tier": "Intermediate",
        "name": "LDR Night Lamp",
        "desc": "The LDR module turns the green LED on automatically when the room gets dark."
      },
      {
        "tier": "Intermediate",
        "name": "Adjustable Dark Threshold",
        "desc": "Pot sets the darkness threshold at which the lamp switches on; hysteresis avoids flicker."
      },
      {
        "tier": "Intermediate",
        "name": "Light-Controlled Dimmer",
        "desc": "Lamp brightness rises smoothly as ambient light falls using LDR analog input."
      },
      {
        "tier": "Intermediate",
        "name": "Light Theremin",
        "desc": "Hand shadow over the LDR changes the pitch played on the passive buzzer."
      },
      {
        "tier": "Intermediate",
        "name": "Pot Theremin",
        "desc": "Rotate the pot to play a continuous pitch; button silences it."
      },
      {
        "tier": "Intermediate",
        "name": "Simple Melody Player",
        "desc": "Play 'Happy Birthday' with note and duration tables on the passive buzzer."
      },
      {
        "tier": "Intermediate",
        "name": "Morse Code Sender",
        "desc": "Type text in the serial monitor and blink/beep it as Morse code."
      },
      {
        "tier": "Intermediate",
        "name": "Button Counter with LED Binary Display",
        "desc": "Count presses and show the 0-3 count on red/green LEDs in binary."
      },
      {
        "tier": "Intermediate",
        "name": "Reaction Timer",
        "desc": "LED lights after a random delay; button press time is printed in milliseconds."
      },
      {
        "tier": "Intermediate",
        "name": "Door-Open Reminder",
        "desc": "Slide switch acts as a door contact; buzzer reminds after 5 s open."
      },
      {
        "tier": "Intermediate",
        "name": "Colour Mood Lamp",
        "desc": "RGB lamp slowly drifts through colours; button freezes the current colour."
      },
      {
        "tier": "Intermediate",
        "name": "Rotary Volume Bar Simulator",
        "desc": "Pot value shown as a 2-LED level indicator plus serial percentage."
      },
      {
        "tier": "Intermediate",
        "name": "Strobe with Adjustable Rate",
        "desc": "Strobe frequency from the pot; slide switch selects red or green LED."
      },
      {
        "tier": "Intermediate",
        "name": "Auto Alarm Siren",
        "desc": "Siren sweeps up/down on the passive buzzer while the button is held."
      },
      {
        "tier": "Intermediate",
        "name": "Serial LED Command Console",
        "desc": "Control LEDs with typed commands: 'r1', 'g0', 'rgb 255 0 40'."
      },
      {
        "tier": "Advanced",
        "name": "Four-Way Intersection Simulator",
        "desc": "Two-phase traffic controller with pedestrian request, night-mode flashing (LDR) and mode switch."
      },
      {
        "tier": "Advanced",
        "name": "Reaction Game with High Score",
        "desc": "Best reaction time stored in EEPROM; RGB colour shows rank; buzzer feedback."
      },
      {
        "tier": "Advanced",
        "name": "Simon Says Memory Game",
        "desc": "Random LED sequence grows each round; repeat it with buttons, win/lose tones."
      },
      {
        "tier": "Advanced",
        "name": "Digital Lock with Button Code",
        "desc": "Enter a 4-press timing code; correct code lights green, wrong code alarms."
      },
      {
        "tier": "Advanced",
        "name": "Automatic Day/Night Controller with Hysteresis",
        "desc": "LDR with adaptive threshold calibrated at startup, RGB status colours and logging."
      },
      {
        "tier": "Advanced",
        "name": "Musical Instrument: Pot Keyboard",
        "desc": "Pot selects a note from a 2-octave scale, button plays, RGB shows the note family."
      },
      {
        "tier": "Advanced",
        "name": "Light-Following Tone Alarm (Security Beam)",
        "desc": "Laser/torch beam on LDR; broken beam triggers latch alarm that needs a reset sequence."
      },
      {
        "tier": "Advanced",
        "name": "Software PWM Chaser",
        "desc": "Bit-banged soft-PWM brightness profiles on LEDs while the hardware PWM drives RGB."
      },
      {
        "tier": "Advanced",
        "name": "Finite-State-Machine Vending Demo",
        "desc": "Coin (button) counting, select with pot, dispense indication with LEDs and tones."
      },
      {
        "tier": "Advanced",
        "name": "Metronome with Tempo Memory",
        "desc": "Tempo set by pot (BPM printed), accent beat flashes RGB, tempo saved in EEPROM."
      },
      {
        "tier": "Advanced",
        "name": "Binary and Gray-Code Counter Trainer",
        "desc": "Count 0-15 using two LEDs + RGB as bits with mode switch; serial quiz."
      },
      {
        "tier": "Advanced",
        "name": "Debounce and Long-Press Library",
        "desc": "Reusable button class: short/long/double click, mapped to RGB actions."
      },
      {
        "tier": "Advanced",
        "name": "Dark Room Intruder Logger",
        "desc": "LDR detects light flash; time-since-start events logged over serial with severity tones."
      },
      {
        "tier": "Advanced",
        "name": "Pot-to-Tone Encoder",
        "desc": "Encode pot values as tone-pulse sequences and monitor them on the serial plotter with LDR light-flash timing."
      },
      {
        "tier": "Advanced",
        "name": "Interactive Story Lamp",
        "desc": "RGB scenes progress through a storyline controlled by button, pot and slide switch."
      },
      {
        "tier": "Advanced",
        "name": "Two-Player Quick-Draw Game",
        "desc": "Two buttons race to react after a go-signal; false starts penalised."
      },
      {
        "tier": "Advanced",
        "name": "Sunrise Alarm Clock Simulator",
        "desc": "RGB slowly brightens over a set time, then the buzzer sounds; button snoozes."
      },
      {
        "tier": "Advanced",
        "name": "Self-Calibrating Light Meter",
        "desc": "Measures min/max LDR over 5 s calibration, then shows relative light on LEDs and serial."
      },
      {
        "tier": "Advanced",
        "name": "Three-Mode Menu System",
        "desc": "Slide switch + button navigate a three-mode menu running different LED programs."
      },
      {
        "tier": "Advanced",
        "name": "Security Panel Simulator",
        "desc": "Arm/disarm with button pattern, entry delay, siren and status RGB."
      }
    ],
    "badge": "Start Here"
  },
  {
    "id": "prod-2",
    "name": "Level 2: Sensing the World Kit",
    "slug": "arduino-kit-2-sensing-the-world",
    "category": "Arduino",
    "price": 1092,
    "originalPrice": 1092,
    "rating": 4.8,
    "reviewsCount": 0,
    "stock": 100,
    "image": "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
    "shortDesc": "JR Learners Arduino Kit 2 of 8 - Sensing the World. Analog and digital sensors, thresholds, calibration. Includes an Arduino UNO R3 and 50 guided projects (10 Basic, 20 Intermediate, 20 Advanced).",
    "description": "Kit 2 of the 8-level JR Learners Arduino series: Sensing the World. Focus: Analog and digital sensors, thresholds, calibration. The kit contains 22 pieces on 22 BOM lines - the common core (Arduino UNO R3, USB cable, breadboard, jumper wires, resistors, push button, LEDs) plus the level-specific parts. Every one of the 50 projects uses only the parts in this kit and can be built and tested first in the free ArduinoForge simulator at /arduinoforge/.",
    "learningObjectives": [
      "Project examples: Temperature display",
      "Project examples: humidity logger",
      "Project examples: thermistor vs LM35",
      "Focus: Analog and digital sensors, thresholds, calibration",
      "Build every circuit in the ArduinoForge simulator first, then on the real breadboard",
      "50 projects: 10 Basic, 20 Intermediate and 20 Advanced"
    ],
    "components": [
      {
        "name": "Arduino UNO R3 (clone, SMD)",
        "quantity": 1
      },
      {
        "name": "USB Type-A to B cable (Arduino)",
        "quantity": 1
      },
      {
        "name": "Breadboard 400 points",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-M (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires F-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Resistor Kit 1/4W assorted",
        "quantity": 1
      },
      {
        "name": "Push Button tactile 6x6",
        "quantity": 1
      },
      {
        "name": "LED 5mm Red",
        "quantity": 1
      },
      {
        "name": "LED 5mm Green",
        "quantity": 1
      },
      {
        "name": "LED 5mm Yellow",
        "quantity": 1
      },
      {
        "name": "LED 5mm Blue",
        "quantity": 1
      },
      {
        "name": "DHT11 Temp & Humidity",
        "quantity": 1
      },
      {
        "name": "LM35 Temperature Sensor",
        "quantity": 1
      },
      {
        "name": "Thermistor NTC 10k",
        "quantity": 1
      },
      {
        "name": "Resistor 10k ohm 1/4W",
        "quantity": 1
      },
      {
        "name": "Soil Moisture Sensor",
        "quantity": 1
      },
      {
        "name": "Rain Sensor Module",
        "quantity": 1
      },
      {
        "name": "Sound Sensor Module",
        "quantity": 1
      },
      {
        "name": "LDR Light Sensor Module",
        "quantity": 1
      },
      {
        "name": "Potentiometer 10k (rotary)",
        "quantity": 1
      },
      {
        "name": "Buzzer Active 5V",
        "quantity": 1
      }
    ],
    "specifications": {
      "Level": "2 of 8 - Sensing the World",
      "Microcontroller": "ATmega328P (Arduino UNO R3)",
      "Operating Voltage": "5V",
      "Projects": "50 (10 Basic, 20 Intermediate, 20 Advanced)",
      "Total Pieces": "22",
      "Level-specific Parts": "10",
      "Simulator": "ArduinoForge (web and desktop)"
    },
    "assemblySteps": [
      "Connect the Arduino UNO to your PC with the USB cable and install Arduino IDE 2.x (plus the CH340 driver for clone boards)",
      "Open the matching project in the ArduinoForge simulator (/arduinoforge/, menu Examples > Kit 2) and study the wiring and sketch",
      "Build the same circuit on the breadboard with the jumper wires and resistors from the kit",
      "Copy the sketch into the Arduino IDE, upload it and compare the result with the simulator"
    ],
    "manualUrl": "/arduinoforge/",
    "datasheetUrl": "/downloads",
    "videoUrl": "https://www.youtube.com/@LetsGetEngagedin",
    "faqs": [
      {
        "question": "Which parts are in this kit?",
        "answer": "12 common-core lines (UNO R3, cable, breadboard, jumpers, resistors, button, LEDs) and 10 level-specific lines. The full list is under Components."
      },
      {
        "question": "Do I need the earlier kits?",
        "answer": "No. Every kit includes the Arduino UNO R3 and the common core, so each level can be bought and used on its own. Concepts from earlier levels help, though."
      },
      {
        "question": "How many projects are included?",
        "answer": "50 per kit: 10 Basic, 20 Intermediate and 20 Advanced, each with circuit, sketch and expected result in the simulator."
      },
      {
        "question": "Is prior coding experience required?",
        "answer": "Kit 1 starts from scratch. Later kits assume the basics from the previous levels."
      }
    ],
    "projects": [
      {
        "tier": "Basic",
        "name": "Room Temperature Reader (LM35)",
        "desc": "Convert LM35 analog voltage to degrees Celsius and print it."
      },
      {
        "tier": "Basic",
        "name": "DHT11 Temperature and Humidity Display",
        "desc": "Read temperature and humidity and print them every 2 s."
      },
      {
        "tier": "Basic",
        "name": "Thermistor Raw Reading",
        "desc": "Read the NTC thermistor in a divider and print raw ADC values."
      },
      {
        "tier": "Basic",
        "name": "Light Level Reader",
        "desc": "Print LDR analog values and a bright/dark label."
      },
      {
        "tier": "Basic",
        "name": "Soil Moisture Reader",
        "desc": "Print dry/moist/wet classes for the soil probe."
      },
      {
        "tier": "Basic",
        "name": "Rain Detector",
        "desc": "Light the red LED and print RAIN when the sensor board gets wet."
      },
      {
        "tier": "Basic",
        "name": "Clap Switch",
        "desc": "Toggle the green LED with a clap detected by the sound module."
      },
      {
        "tier": "Basic",
        "name": "Pot Threshold Setter",
        "desc": "Print pot value as a 0-100% setting for later threshold projects."
      },
      {
        "tier": "Basic",
        "name": "Over-Temperature Buzzer",
        "desc": "Buzzer sounds when LM35 temperature exceeds 35 C."
      },
      {
        "tier": "Basic",
        "name": "Button-Triggered Sensor Reading",
        "desc": "Press the button to take a one-shot reading from the DHT11."
      },
      {
        "tier": "Intermediate",
        "name": "Thermistor Temperature (Steinhart-Hart)",
        "desc": "Compute real temperature from the NTC with the Steinhart-Hart equation."
      },
      {
        "tier": "Intermediate",
        "name": "LM35 vs Thermistor Comparison",
        "desc": "Print both temperatures side by side and show their error."
      },
      {
        "tier": "Intermediate",
        "name": "Heat Index Calculator",
        "desc": "Combine DHT11 temperature and humidity to compute the heat index."
      },
      {
        "tier": "Intermediate",
        "name": "Comfort Indicator",
        "desc": "Green/red LEDs show comfortable or uncomfortable climate from temperature and humidity."
      },
      {
        "tier": "Intermediate",
        "name": "Plant Watering Alert",
        "desc": "Buzzer and red LED warn when soil moisture falls below the pot-set threshold."
      },
      {
        "tier": "Intermediate",
        "name": "Rain Warning with Intensity",
        "desc": "Analog rain value mapped to light/moderate/heavy with different beeps."
      },
      {
        "tier": "Intermediate",
        "name": "Auto Street Light",
        "desc": "LDR switches an LED street light with hysteresis and pot-adjusted level."
      },
      {
        "tier": "Intermediate",
        "name": "Clap Counter",
        "desc": "Count claps within a time window to select single, double or triple clap actions."
      },
      {
        "tier": "Intermediate",
        "name": "Sound Level Meter",
        "desc": "Peak-to-peak sound level shown as a 0-100 value with LED bar warning."
      },
      {
        "tier": "Intermediate",
        "name": "Fever Alarm",
        "desc": "LM35 average over 10 samples triggers an alarm over the pot-set limit."
      },
      {
        "tier": "Intermediate",
        "name": "Dew Point Estimator",
        "desc": "Calculate dew point from DHT11 readings and warn if condensation is likely."
      },
      {
        "tier": "Intermediate",
        "name": "Soil + Light Plant Monitor",
        "desc": "Report whether a plant gets enough water and light, with LED status."
      },
      {
        "tier": "Intermediate",
        "name": "Moving-Average Filter Demo",
        "desc": "Compare raw and filtered LM35 data to show noise reduction."
      },
      {
        "tier": "Intermediate",
        "name": "Min/Max Recorder",
        "desc": "Track and print minimum and maximum temperature since power-up; button resets."
      },
      {
        "tier": "Intermediate",
        "name": "Humidity Alarm",
        "desc": "Alarm if humidity goes above the pot-set limit."
      },
      {
        "tier": "Intermediate",
        "name": "Dark and Quiet Detector",
        "desc": "Report when it is both dark and quiet using LDR and sound sensor."
      },
      {
        "tier": "Intermediate",
        "name": "Rain-Triggered Cover Indicator",
        "desc": "Show 'cover closed' LED once rain persists for 3 s; reopen after dry for 10 s."
      },
      {
        "tier": "Intermediate",
        "name": "Sensor Calibration Helper",
        "desc": "Button-driven two-point calibration of the soil probe (dry/wet) stored in EEPROM."
      },
      {
        "tier": "Intermediate",
        "name": "Thermistor Fan-Trigger Indicator",
        "desc": "Green/red LEDs emulate a fan on/off decision around a set temperature."
      },
      {
        "tier": "Intermediate",
        "name": "Multi-Sensor Serial Dashboard",
        "desc": "Print DHT11, LM35, LDR and sound values in one tidy line for logging."
      },
      {
        "tier": "Advanced",
        "name": "Smart Plant Care Station",
        "desc": "Combines soil, light and temperature; classifies plant health, buzzes and lights status."
      },
      {
        "tier": "Advanced",
        "name": "Mini Weather Station",
        "desc": "Temperature, humidity, rain and light summarised into a weather forecast string."
      },
      {
        "tier": "Advanced",
        "name": "Environmental Data Logger",
        "desc": "Logs time-stamped readings (millis) for all sensors in CSV over serial; button marks events."
      },
      {
        "tier": "Advanced",
        "name": "Frost and Overheat Guard",
        "desc": "Dual-threshold alarm with latched fault memory and acknowledge button."
      },
      {
        "tier": "Advanced",
        "name": "Auto Greenhouse Logic",
        "desc": "Rule engine decides heating/watering/shading LEDs from soil, temp, humidity and light."
      },
      {
        "tier": "Advanced",
        "name": "Clap-Pattern Door Knock Code",
        "desc": "Recognise a secret clap rhythm using timing windows; correct code lights green."
      },
      {
        "tier": "Advanced",
        "name": "Rain and Humidity Storm Predictor",
        "desc": "Rising humidity plus rain onset triggers a storm warning with trend analysis."
      },
      {
        "tier": "Advanced",
        "name": "Thermistor Linearisation and Self-Test",
        "desc": "Two-point calibration with LM35 as reference, error table printed."
      },
      {
        "tier": "Advanced",
        "name": "Night Garden Watering Scheduler",
        "desc": "Waters (LED) only when dark, soil dry and not raining."
      },
      {
        "tier": "Advanced",
        "name": "Sound-Reactive Light Show",
        "desc": "Sound level drives LED patterns and buzzer beats with adjustable sensitivity."
      },
      {
        "tier": "Advanced",
        "name": "Comfort Index Display with Trend Arrows",
        "desc": "Rising/falling trend of temp and humidity indicated using LED patterns and serial arrows."
      },
      {
        "tier": "Advanced",
        "name": "Sensor Health Monitor",
        "desc": "Detects disconnected or stuck sensors and reports fault codes by LED blinks."
      },
      {
        "tier": "Advanced",
        "name": "Statistical Sensor Analyzer",
        "desc": "Calculate mean, variance and drift for LM35 over 100 samples and report."
      },
      {
        "tier": "Advanced",
        "name": "Wet-Dry Calibration Wizard",
        "desc": "Guided serial wizard calibrates soil and rain sensors, saving to EEPROM."
      },
      {
        "tier": "Advanced",
        "name": "Occupancy Estimator (Sound + Light)",
        "desc": "Estimate whether a room is occupied from noise and light patterns over time."
      },
      {
        "tier": "Advanced",
        "name": "Dual-Sensor Fusion Thermometer",
        "desc": "Fuse DHT11 and LM35 using weighting for a steadier temperature value."
      },
      {
        "tier": "Advanced",
        "name": "Alert Escalation System",
        "desc": "Warning -> alarm -> critical escalation using temperature, sound, light with LED/buzzer levels."
      },
      {
        "tier": "Advanced",
        "name": "Daily Climate Report Generator",
        "desc": "Accumulates 24 simulated hourly samples and prints a formatted summary report."
      },
      {
        "tier": "Advanced",
        "name": "Smart Humidity-Rain Dehumidifier Logic",
        "desc": "State machine with timers decides dehumidifier LED from humidity and rain."
      },
      {
        "tier": "Advanced",
        "name": "Dry-Spell Early Warning",
        "desc": "Tracks the soil-moisture drying slope and warns hours before the plant gets critical."
      }
    ]
  },
  {
    "id": "prod-3",
    "name": "Level 3: Displays & Interfaces Kit",
    "slug": "arduino-kit-3-displays-interfaces",
    "category": "Arduino",
    "price": 1632,
    "originalPrice": 1632,
    "rating": 4.8,
    "reviewsCount": 0,
    "stock": 100,
    "image": "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
    "shortDesc": "JR Learners Arduino Kit 3 of 8 - Displays & Interfaces. Output devices, shift registers, human input. Includes an Arduino UNO R3 and 50 guided projects (10 Basic, 20 Intermediate, 20 Advanced).",
    "description": "Kit 3 of the 8-level JR Learners Arduino series: Displays & Interfaces. Focus: Output devices, shift registers, human input. The kit contains 20 pieces on 20 BOM lines - the common core (Arduino UNO R3, USB cable, breadboard, jumper wires, resistors, push button, LEDs) plus the level-specific parts. Every one of the 50 projects uses only the parts in this kit and can be built and tested first in the free ArduinoForge simulator at /arduinoforge/.",
    "learningObjectives": [
      "Project examples: 16x2 LCD sensor readout",
      "Project examples: OLED graphics",
      "Project examples: 4-digit stopwatch",
      "Focus: Output devices, shift registers, human input",
      "Build every circuit in the ArduinoForge simulator first, then on the real breadboard",
      "50 projects: 10 Basic, 20 Intermediate and 20 Advanced"
    ],
    "components": [
      {
        "name": "Arduino UNO R3 (clone, SMD)",
        "quantity": 1
      },
      {
        "name": "USB Type-A to B cable (Arduino)",
        "quantity": 1
      },
      {
        "name": "Breadboard 400 points",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-M (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires F-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Resistor Kit 1/4W assorted",
        "quantity": 1
      },
      {
        "name": "Push Button tactile 6x6",
        "quantity": 1
      },
      {
        "name": "LED 5mm Red",
        "quantity": 1
      },
      {
        "name": "LED 5mm Green",
        "quantity": 1
      },
      {
        "name": "LED 5mm Yellow",
        "quantity": 1
      },
      {
        "name": "LED 5mm Blue",
        "quantity": 1
      },
      {
        "name": "16x2 LCD I2C",
        "quantity": 1
      },
      {
        "name": "0.96in OLED I2C SSD1306",
        "quantity": 1
      },
      {
        "name": "TM1637 4-digit 7-segment",
        "quantity": 1
      },
      {
        "name": "8x8 LED Matrix MAX7219",
        "quantity": 1
      },
      {
        "name": "Shift Register 74HC595",
        "quantity": 1
      },
      {
        "name": "Rotary Encoder KY-040",
        "quantity": 1
      },
      {
        "name": "Joystick Module",
        "quantity": 1
      },
      {
        "name": "Resistor 220 ohm 1/4W",
        "quantity": 1
      }
    ],
    "specifications": {
      "Level": "3 of 8 - Displays & Interfaces",
      "Microcontroller": "ATmega328P (Arduino UNO R3)",
      "Operating Voltage": "5V",
      "Projects": "50 (10 Basic, 20 Intermediate, 20 Advanced)",
      "Total Pieces": "20",
      "Level-specific Parts": "8",
      "Simulator": "ArduinoForge (web and desktop)"
    },
    "assemblySteps": [
      "Connect the Arduino UNO to your PC with the USB cable and install Arduino IDE 2.x (plus the CH340 driver for clone boards)",
      "Open the matching project in the ArduinoForge simulator (/arduinoforge/, menu Examples > Kit 3) and study the wiring and sketch",
      "Build the same circuit on the breadboard with the jumper wires and resistors from the kit",
      "Copy the sketch into the Arduino IDE, upload it and compare the result with the simulator"
    ],
    "manualUrl": "/arduinoforge/",
    "datasheetUrl": "/downloads",
    "videoUrl": "https://www.youtube.com/@LetsGetEngagedin",
    "faqs": [
      {
        "question": "Which parts are in this kit?",
        "answer": "12 common-core lines (UNO R3, cable, breadboard, jumpers, resistors, button, LEDs) and 8 level-specific lines. The full list is under Components."
      },
      {
        "question": "Do I need the earlier kits?",
        "answer": "No. Every kit includes the Arduino UNO R3 and the common core, so each level can be bought and used on its own. Concepts from earlier levels help, though."
      },
      {
        "question": "How many projects are included?",
        "answer": "50 per kit: 10 Basic, 20 Intermediate and 20 Advanced, each with circuit, sketch and expected result in the simulator."
      },
      {
        "question": "Is prior coding experience required?",
        "answer": "Kit 1 starts from scratch. Later kits assume the basics from the previous levels."
      }
    ],
    "projects": [
      {
        "tier": "Basic",
        "name": "Hello World on LCD",
        "desc": "Show 'Hello, JR Learners' on the 16x2 I2C LCD."
      },
      {
        "tier": "Basic",
        "name": "LCD Counter",
        "desc": "Increment a counter every second on the LCD."
      },
      {
        "tier": "Basic",
        "name": "OLED Text Display",
        "desc": "Print text lines on the OLED using the SSD1306 library."
      },
      {
        "tier": "Basic",
        "name": "TM1637 Number Display",
        "desc": "Display numbers 0000-9999 on the 4-digit module."
      },
      {
        "tier": "Basic",
        "name": "LED Matrix Smiley",
        "desc": "Draw a smiley face on the 8x8 MAX7219 matrix."
      },
      {
        "tier": "Basic",
        "name": "74HC595 LED Counter",
        "desc": "Output binary count 0-255 through the shift register to 8 LEDs."
      },
      {
        "tier": "Basic",
        "name": "Rotary Encoder Counter",
        "desc": "Count clockwise/counter-clockwise steps on the encoder and show on serial."
      },
      {
        "tier": "Basic",
        "name": "Joystick Axis Reader",
        "desc": "Print X, Y and button state of the joystick."
      },
      {
        "tier": "Basic",
        "name": "Button Count on TM1637",
        "desc": "Each press increments the 7-segment counter."
      },
      {
        "tier": "Basic",
        "name": "LCD Backlight Control",
        "desc": "Toggle the LCD backlight with the push button."
      },
      {
        "tier": "Intermediate",
        "name": "Scrolling Text on LCD",
        "desc": "Marquee a long message across the 16x2 display."
      },
      {
        "tier": "Intermediate",
        "name": "Digital Stopwatch (TM1637)",
        "desc": "Start/stop/reset stopwatch with seconds:hundredths on the 7-segment."
      },
      {
        "tier": "Intermediate",
        "name": "Countdown Timer",
        "desc": "Set time with the encoder, start with its button, flash at zero."
      },
      {
        "tier": "Intermediate",
        "name": "Joystick-Controlled Dot on Matrix",
        "desc": "Move a single LED around the 8x8 matrix with the joystick."
      },
      {
        "tier": "Intermediate",
        "name": "Scrolling Marquee on Matrix",
        "desc": "Scroll letters across the matrix using a font table."
      },
      {
        "tier": "Intermediate",
        "name": "74HC595 Knight Rider",
        "desc": "Running-light patterns on 8 LEDs through the shift register."
      },
      {
        "tier": "Intermediate",
        "name": "Binary Clock Display",
        "desc": "Show seconds counter in binary on the 74HC595 LEDs and in decimal on LCD."
      },
      {
        "tier": "Intermediate",
        "name": "Encoder Menu on LCD",
        "desc": "Scroll a 4-item menu with the encoder and select with its push switch."
      },
      {
        "tier": "Intermediate",
        "name": "OLED Bar Graph",
        "desc": "Draw a live bar graph of the joystick X axis on the OLED."
      },
      {
        "tier": "Intermediate",
        "name": "OLED Analog Clock Face (software clock)",
        "desc": "Draw an analog clock with moving hands driven by millis()."
      },
      {
        "tier": "Intermediate",
        "name": "Digital Dice",
        "desc": "Press the button to roll a die; show dots on the matrix and total on TM1637."
      },
      {
        "tier": "Intermediate",
        "name": "Scoreboard",
        "desc": "Two buttons add points for two teams on the 4-digit display (2+2 digits)."
      },
      {
        "tier": "Intermediate",
        "name": "Etch-A-Sketch on OLED",
        "desc": "Draw lines with the joystick; button clears the screen."
      },
      {
        "tier": "Intermediate",
        "name": "LCD Custom Characters",
        "desc": "Define and animate custom 5x8 characters (heart, battery, arrow)."
      },
      {
        "tier": "Intermediate",
        "name": "LED Bar Level Indicator",
        "desc": "Joystick Y value shown as a lit bar on 8 LEDs via 74HC595."
      },
      {
        "tier": "Intermediate",
        "name": "Number Guessing Game",
        "desc": "Select digits using the encoder and display high/low hints on the LCD."
      },
      {
        "tier": "Intermediate",
        "name": "Matrix Animation Player",
        "desc": "Frame-by-frame animation (heartbeat, rain) stored in a table."
      },
      {
        "tier": "Intermediate",
        "name": "TM1637 Brightness and Colon Demo",
        "desc": "Adjust display brightness with the encoder and blink the colon like a clock."
      },
      {
        "tier": "Intermediate",
        "name": "Serial-to-OLED Text Terminal",
        "desc": "Text typed in the serial monitor appears on the OLED."
      },
      {
        "tier": "Intermediate",
        "name": "Reaction Time Game on LCD",
        "desc": "Reaction time in ms displayed after the button is hit following a random delay."
      },
      {
        "tier": "Advanced",
        "name": "Pixel Pong Game",
        "desc": "Classic pong on the 8x8 matrix with encoder paddle and TM1637 score."
      },
      {
        "tier": "Advanced",
        "name": "Snake Game",
        "desc": "Snake on the 8x8 matrix controlled by the joystick, score on TM1637."
      },
      {
        "tier": "Advanced",
        "name": "OLED Video Game: Breakout",
        "desc": "Breakout clone on the OLED with encoder paddle and lives on the LCD."
      },
      {
        "tier": "Advanced",
        "name": "Multi-Page Info Dashboard",
        "desc": "Pages of uptime, joystick data and counters, navigated by encoder, on OLED + LCD."
      },
      {
        "tier": "Advanced",
        "name": "Digital Clock with Alarm Set",
        "desc": "Software clock on the TM1637; set time and alarm via encoder; alarm flashes LEDs."
      },
      {
        "tier": "Advanced",
        "name": "Matrix Equaliser Visualizer",
        "desc": "Pseudo-spectrum bars animated from pot-like joystick and random data."
      },
      {
        "tier": "Advanced",
        "name": "Shift-Register Cascade Engine",
        "desc": "Multiple LED animation patterns, speed from the encoder, pattern selection via joystick."
      },
      {
        "tier": "Advanced",
        "name": "Tic-Tac-Toe on OLED",
        "desc": "Two-player game with joystick cursor, win detection and LCD score."
      },
      {
        "tier": "Advanced",
        "name": "Menu-Driven Settings System",
        "desc": "Hierarchical menu with persistent EEPROM settings across LCD and OLED."
      },
      {
        "tier": "Advanced",
        "name": "Game of Life on 8x8 Matrix",
        "desc": "Conway's Game of Life with joystick seeding and generation counter on TM1637."
      },
      {
        "tier": "Advanced",
        "name": "Calculator with Joystick Keypad",
        "desc": "Four-function calculator with the joystick selecting symbols; result on LCD."
      },
      {
        "tier": "Advanced",
        "name": "Binary-Hex-Decimal Converter Trainer",
        "desc": "Values set with encoder; shown in binary on LEDs (595), hex on TM1637, decimal on LCD."
      },
      {
        "tier": "Advanced",
        "name": "Scrolling News Ticker with Speed Control",
        "desc": "Long text across matrix and OLED with speed from the encoder."
      },
      {
        "tier": "Advanced",
        "name": "OLED Oscilloscope Simulator",
        "desc": "Draw waveforms (sine/saw/square) with frequency by encoder."
      },
      {
        "tier": "Advanced",
        "name": "Memory Card Game",
        "desc": "Hidden 4x4 symbols on the matrix; joystick selects, LCD shows moves."
      },
      {
        "tier": "Advanced",
        "name": "Lap Timer with Best-Lap Record",
        "desc": "Multi-lap timing on TM1637 with best lap shown on LCD."
      },
      {
        "tier": "Advanced",
        "name": "Pixel Art Editor",
        "desc": "Draw on the 8x8 matrix with the joystick, save frames, play animation."
      },
      {
        "tier": "Advanced",
        "name": "Bargraph VU on 74HC595 + OLED Trace",
        "desc": "Simulated audio level on LEDs with OLED history plot."
      },
      {
        "tier": "Advanced",
        "name": "Mini Operating Console",
        "desc": "Boot animation, selectable apps (clock, dice, counter) across all displays."
      },
      {
        "tier": "Advanced",
        "name": "Joystick Typing Trainer",
        "desc": "Pick letters with the joystick to type words on the OLED, with accuracy and speed on the LCD."
      }
    ]
  },
  {
    "id": "prod-4",
    "name": "Level 4: Motion & Distance Kit",
    "slug": "arduino-kit-4-motion-distance",
    "category": "Arduino",
    "price": 1259,
    "originalPrice": 1259,
    "rating": 4.8,
    "reviewsCount": 0,
    "stock": 100,
    "image": "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
    "shortDesc": "JR Learners Arduino Kit 4 of 8 - Motion & Distance. Ranging, presence and position sensing, first servo. Includes an Arduino UNO R3 and 50 guided projects (10 Basic, 20 Intermediate, 20 Advanced).",
    "description": "Kit 4 of the 8-level JR Learners Arduino series: Motion & Distance. Focus: Ranging, presence and position sensing, first servo. The kit contains 21 pieces on 21 BOM lines - the common core (Arduino UNO R3, USB cable, breadboard, jumper wires, resistors, push button, LEDs) plus the level-specific parts. Every one of the 50 projects uses only the parts in this kit and can be built and tested first in the free ArduinoForge simulator at /arduinoforge/.",
    "learningObjectives": [
      "Project examples: Ultrasonic distance meter",
      "Project examples: parking sensor",
      "Project examples: PIR intruder alarm",
      "Focus: Ranging, presence and position sensing, first servo",
      "Build every circuit in the ArduinoForge simulator first, then on the real breadboard",
      "50 projects: 10 Basic, 20 Intermediate and 20 Advanced"
    ],
    "components": [
      {
        "name": "Arduino UNO R3 (clone, SMD)",
        "quantity": 1
      },
      {
        "name": "USB Type-A to B cable (Arduino)",
        "quantity": 1
      },
      {
        "name": "Breadboard 400 points",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-M (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires F-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Resistor Kit 1/4W assorted",
        "quantity": 1
      },
      {
        "name": "Push Button tactile 6x6",
        "quantity": 1
      },
      {
        "name": "LED 5mm Red",
        "quantity": 1
      },
      {
        "name": "LED 5mm Green",
        "quantity": 1
      },
      {
        "name": "LED 5mm Yellow",
        "quantity": 1
      },
      {
        "name": "LED 5mm Blue",
        "quantity": 1
      },
      {
        "name": "HC-SR04 Ultrasonic",
        "quantity": 1
      },
      {
        "name": "PIR Motion HC-SR501",
        "quantity": 1
      },
      {
        "name": "IR Obstacle Sensor",
        "quantity": 1
      },
      {
        "name": "TCRT5000 Line Sensor",
        "quantity": 1
      },
      {
        "name": "VL53L0X ToF Distance",
        "quantity": 1
      },
      {
        "name": "Touch Sensor TTP223",
        "quantity": 1
      },
      {
        "name": "Hall Effect Sensor A3144",
        "quantity": 1
      },
      {
        "name": "SG90 Micro Servo",
        "quantity": 1
      },
      {
        "name": "Piezo Passive Buzzer",
        "quantity": 1
      }
    ],
    "specifications": {
      "Level": "4 of 8 - Motion & Distance",
      "Microcontroller": "ATmega328P (Arduino UNO R3)",
      "Operating Voltage": "5V",
      "Projects": "50 (10 Basic, 20 Intermediate, 20 Advanced)",
      "Total Pieces": "21",
      "Level-specific Parts": "9",
      "Simulator": "ArduinoForge (web and desktop)"
    },
    "assemblySteps": [
      "Connect the Arduino UNO to your PC with the USB cable and install Arduino IDE 2.x (plus the CH340 driver for clone boards)",
      "Open the matching project in the ArduinoForge simulator (/arduinoforge/, menu Examples > Kit 4) and study the wiring and sketch",
      "Build the same circuit on the breadboard with the jumper wires and resistors from the kit",
      "Copy the sketch into the Arduino IDE, upload it and compare the result with the simulator"
    ],
    "manualUrl": "/arduinoforge/",
    "datasheetUrl": "/downloads",
    "videoUrl": "https://www.youtube.com/@LetsGetEngagedin",
    "faqs": [
      {
        "question": "Which parts are in this kit?",
        "answer": "12 common-core lines (UNO R3, cable, breadboard, jumpers, resistors, button, LEDs) and 9 level-specific lines. The full list is under Components."
      },
      {
        "question": "Do I need the earlier kits?",
        "answer": "No. Every kit includes the Arduino UNO R3 and the common core, so each level can be bought and used on its own. Concepts from earlier levels help, though."
      },
      {
        "question": "How many projects are included?",
        "answer": "50 per kit: 10 Basic, 20 Intermediate and 20 Advanced, each with circuit, sketch and expected result in the simulator."
      },
      {
        "question": "Is prior coding experience required?",
        "answer": "Kit 1 starts from scratch. Later kits assume the basics from the previous levels."
      }
    ],
    "projects": [
      {
        "tier": "Basic",
        "name": "Ultrasonic Distance Meter",
        "desc": "Measure distance in cm with the HC-SR04 and print it."
      },
      {
        "tier": "Basic",
        "name": "PIR Motion LED",
        "desc": "Light the red LED whenever motion is detected."
      },
      {
        "tier": "Basic",
        "name": "Obstacle Detector",
        "desc": "IR obstacle sensor lights an LED when an object is in front."
      },
      {
        "tier": "Basic",
        "name": "Touch Switch",
        "desc": "TTP223 touch toggles the green LED."
      },
      {
        "tier": "Basic",
        "name": "Magnet Door Sensor",
        "desc": "Hall sensor lights an LED when a magnet is near."
      },
      {
        "tier": "Basic",
        "name": "Servo Sweep",
        "desc": "Sweep the SG90 servo 0-180 and back."
      },
      {
        "tier": "Basic",
        "name": "Line Detector",
        "desc": "TCRT5000 reports black vs white surface."
      },
      {
        "tier": "Basic",
        "name": "ToF Distance Reader",
        "desc": "Print millimetre distance from the VL53L0X."
      },
      {
        "tier": "Basic",
        "name": "Distance Beeper",
        "desc": "Buzzer beeps faster as the object gets closer (HC-SR04)."
      },
      {
        "tier": "Basic",
        "name": "Button-Controlled Servo",
        "desc": "Press the button to step the servo by 30 degrees."
      },
      {
        "tier": "Intermediate",
        "name": "Parking Sensor",
        "desc": "Distance mapped to LED colours and beep rate like a car parking aid."
      },
      {
        "tier": "Intermediate",
        "name": "Motion Alarm",
        "desc": "PIR trigger starts siren; button disarms; arm delay included."
      },
      {
        "tier": "Intermediate",
        "name": "Servo Radar Scanner",
        "desc": "Servo rotates with HC-SR04 and prints angle/distance pairs."
      },
      {
        "tier": "Intermediate",
        "name": "Automatic Door Opener",
        "desc": "Servo opens a 'door' when PIR or ultrasonic sees someone, closes after delay."
      },
      {
        "tier": "Intermediate",
        "name": "Touch-Activated Servo Lock",
        "desc": "Touch toggles servo between locked and unlocked angles."
      },
      {
        "tier": "Intermediate",
        "name": "Line-Follower Sensor Test Bench",
        "desc": "Display line/no-line status and calibrate threshold with the button."
      },
      {
        "tier": "Intermediate",
        "name": "Obstacle-Avoid Servo Steering Demo",
        "desc": "Servo steers 'wheels' left/right based on IR obstacle and ultrasonic data."
      },
      {
        "tier": "Intermediate",
        "name": "People Counter",
        "desc": "Count objects passing the IR sensor; button resets; show count on serial."
      },
      {
        "tier": "Intermediate",
        "name": "Door Open/Close Logger",
        "desc": "Hall sensor + magnet logs door events with timestamps and buzzer on long open."
      },
      {
        "tier": "Intermediate",
        "name": "Ultrasonic Level Meter",
        "desc": "Measure the level of liquid/object height from the sensor distance."
      },
      {
        "tier": "Intermediate",
        "name": "Gesture Switch",
        "desc": "Hand wave at a given distance toggles LED via ultrasonic thresholds."
      },
      {
        "tier": "Intermediate",
        "name": "Millimetre Ruler",
        "desc": "Show VL53L0X distance averaged for precision, with button to zero."
      },
      {
        "tier": "Intermediate",
        "name": "Speed Estimator",
        "desc": "Compute object speed from the time between two sensor triggers."
      },
      {
        "tier": "Intermediate",
        "name": "Motion-Triggered Servo Camera Pan",
        "desc": "PIR starts a slow servo pan until motion stops."
      },
      {
        "tier": "Intermediate",
        "name": "Touch Piano",
        "desc": "TTP223 plays a note per tap; ToF distance selects octave."
      },
      {
        "tier": "Intermediate",
        "name": "Proximity Light Switch",
        "desc": "IR obstacle sensor lights an LED; distance with ToF dims it."
      },
      {
        "tier": "Intermediate",
        "name": "Edge/Cliff Detector",
        "desc": "TCRT5000 detects table edge and sounds an alarm with LED."
      },
      {
        "tier": "Intermediate",
        "name": "Bike Wheel Revolution Counter",
        "desc": "Hall sensor counts magnet passes to estimate rpm."
      },
      {
        "tier": "Intermediate",
        "name": "Servo Position Memory",
        "desc": "Button saves up to 5 servo poses and replays them."
      },
      {
        "tier": "Intermediate",
        "name": "PIR Occupancy Timer",
        "desc": "Light stays on for N minutes after motion with retriggering."
      },
      {
        "tier": "Advanced",
        "name": "Servo Radar with Object Map",
        "desc": "360-style scan builds a polar distance map streamed to the serial plotter."
      },
      {
        "tier": "Advanced",
        "name": "Smart Parking Assistant",
        "desc": "Fuses ultrasonic and ToF, fixed-point filtering, LED + beep with stop warning."
      },
      {
        "tier": "Advanced",
        "name": "Intruder Detection System",
        "desc": "PIR + door-hall + ultrasonic zones, entry/exit delay, arm/disarm touch code."
      },
      {
        "tier": "Advanced",
        "name": "Automatic Gate Controller",
        "desc": "Hall limit sensing, servo gate, obstacle safety re-open, state machine."
      },
      {
        "tier": "Advanced",
        "name": "Line Follower Decision Logic",
        "desc": "Line sensor readings drive PID-style correction output on the servo steering."
      },
      {
        "tier": "Advanced",
        "name": "Sonar Mapping Robot Brain (Bench)",
        "desc": "Servo-mounted ultrasonic picks clearest direction and displays decision via LEDs."
      },
      {
        "tier": "Advanced",
        "name": "Touch + Distance Gesture Panel",
        "desc": "Touch selects mode; ToF distance sets value; piezo confirms."
      },
      {
        "tier": "Advanced",
        "name": "Hand-Proximity Theremin",
        "desc": "ToF controls pitch and ultrasonic controls the volume-like duty pattern."
      },
      {
        "tier": "Advanced",
        "name": "RPM Meter with Hall Sensor",
        "desc": "Compute rpm with moving average and overspeed alarm."
      },
      {
        "tier": "Advanced",
        "name": "Elevator Floor Simulator",
        "desc": "Servo as car position, IR sensors floor limits, button call queue."
      },
      {
        "tier": "Advanced",
        "name": "Vehicle Speed Trap",
        "desc": "IR beam and line sensor measure speed and flag speeding via buzzer."
      },
      {
        "tier": "Advanced",
        "name": "Water-Tank Level Controller Model",
        "desc": "Ultrasonic level, hysteresis pump LED logic, dry-run alarm."
      },
      {
        "tier": "Advanced",
        "name": "Smart Dustbin",
        "desc": "Opens lid (servo) when hand detected by PIR/IR, full-bin alert via ultrasonic."
      },
      {
        "tier": "Advanced",
        "name": "Distance-Based Security Zones",
        "desc": "Three configurable ultrasonic zones with escalating alarms and logging."
      },
      {
        "tier": "Advanced",
        "name": "Servo Plotter Calibration Tool",
        "desc": "Maps servo angle to measured ToF distance to build a calibration curve."
      },
      {
        "tier": "Advanced",
        "name": "Motion-Aware Night Lamp",
        "desc": "PIR + touch override + timed fade using PWM LEDs."
      },
      {
        "tier": "Advanced",
        "name": "Gesture Counter Game",
        "desc": "Hand swipes over IR/ultrasonic scored in a timed challenge."
      },
      {
        "tier": "Advanced",
        "name": "Door Ajar and Tamper Detector",
        "desc": "Hall + PIR detect forced opening patterns and latch an alarm."
      },
      {
        "tier": "Advanced",
        "name": "Multi-Sensor Fusion Distance Estimator",
        "desc": "Combine ultrasonic, ToF and IR for robust ranging, report the confidence level."
      },
      {
        "tier": "Advanced",
        "name": "Assistive Cane Prototype",
        "desc": "Beep/LED feedback on obstacle distance and edge drop detection."
      }
    ]
  },
  {
    "id": "prod-5",
    "name": "Level 5: Motors & Power Control Kit",
    "slug": "arduino-kit-5-motors-power-control",
    "category": "Arduino",
    "price": 1447,
    "originalPrice": 1447,
    "rating": 4.8,
    "reviewsCount": 0,
    "stock": 100,
    "image": "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
    "shortDesc": "JR Learners Arduino Kit 5 of 8 - Motors & Power Control. Driving loads: transistors, H-bridges, relays, steppers. Includes an Arduino UNO R3 and 50 guided projects (10 Basic, 20 Intermediate, 20 Advanced).",
    "description": "Kit 5 of the 8-level JR Learners Arduino series: Motors & Power Control. Focus: Driving loads: transistors, H-bridges, relays, steppers. The kit contains 25 pieces on 25 BOM lines - the common core (Arduino UNO R3, USB cable, breadboard, jumper wires, resistors, push button, LEDs) plus the level-specific parts. Every one of the 50 projects uses only the parts in this kit and can be built and tested first in the free ArduinoForge simulator at /arduinoforge/.",
    "learningObjectives": [
      "Project examples: Transistor motor switch",
      "Project examples: flyback diode demo",
      "Project examples: L293D speed + direction",
      "Focus: Driving loads: transistors, H-bridges, relays, steppers",
      "Build every circuit in the ArduinoForge simulator first, then on the real breadboard",
      "50 projects: 10 Basic, 20 Intermediate and 20 Advanced"
    ],
    "components": [
      {
        "name": "Arduino UNO R3 (clone, SMD)",
        "quantity": 1
      },
      {
        "name": "USB Type-A to B cable (Arduino)",
        "quantity": 1
      },
      {
        "name": "Breadboard 400 points",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-M (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires F-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Resistor Kit 1/4W assorted",
        "quantity": 1
      },
      {
        "name": "Push Button tactile 6x6",
        "quantity": 1
      },
      {
        "name": "LED 5mm Red",
        "quantity": 1
      },
      {
        "name": "LED 5mm Green",
        "quantity": 1
      },
      {
        "name": "LED 5mm Yellow",
        "quantity": 1
      },
      {
        "name": "LED 5mm Blue",
        "quantity": 1
      },
      {
        "name": "SG90 Micro Servo",
        "quantity": 1
      },
      {
        "name": "DC Motor 6V",
        "quantity": 1
      },
      {
        "name": "BO Motor + wheel",
        "quantity": 1
      },
      {
        "name": "Motor Driver L293D",
        "quantity": 1
      },
      {
        "name": "Motor Driver Module L298N",
        "quantity": 1
      },
      {
        "name": "28BYJ-48 Stepper + ULN2003",
        "quantity": 1
      },
      {
        "name": "Relay Module 1 Channel 5V",
        "quantity": 1
      },
      {
        "name": "TIP122 Darlington",
        "quantity": 1
      },
      {
        "name": "MOSFET IRFZ44N",
        "quantity": 1
      },
      {
        "name": "Diode 1N4007",
        "quantity": 1
      },
      {
        "name": "Electrolytic Capacitor 100uF 25V",
        "quantity": 1
      },
      {
        "name": "AA 4-cell Battery Holder",
        "quantity": 1
      },
      {
        "name": "LM35 Temperature Sensor",
        "quantity": 1
      }
    ],
    "specifications": {
      "Level": "5 of 8 - Motors & Power Control",
      "Microcontroller": "ATmega328P (Arduino UNO R3)",
      "Operating Voltage": "5V",
      "Projects": "50 (10 Basic, 20 Intermediate, 20 Advanced)",
      "Total Pieces": "25",
      "Level-specific Parts": "13",
      "Simulator": "ArduinoForge (web and desktop)"
    },
    "assemblySteps": [
      "Connect the Arduino UNO to your PC with the USB cable and install Arduino IDE 2.x (plus the CH340 driver for clone boards)",
      "Open the matching project in the ArduinoForge simulator (/arduinoforge/, menu Examples > Kit 5) and study the wiring and sketch",
      "Build the same circuit on the breadboard with the jumper wires and resistors from the kit",
      "Copy the sketch into the Arduino IDE, upload it and compare the result with the simulator"
    ],
    "manualUrl": "/arduinoforge/",
    "datasheetUrl": "/downloads",
    "videoUrl": "https://www.youtube.com/@LetsGetEngagedin",
    "faqs": [
      {
        "question": "Which parts are in this kit?",
        "answer": "12 common-core lines (UNO R3, cable, breadboard, jumpers, resistors, button, LEDs) and 13 level-specific lines. The full list is under Components."
      },
      {
        "question": "Do I need the earlier kits?",
        "answer": "No. Every kit includes the Arduino UNO R3 and the common core, so each level can be bought and used on its own. Concepts from earlier levels help, though."
      },
      {
        "question": "How many projects are included?",
        "answer": "50 per kit: 10 Basic, 20 Intermediate and 20 Advanced, each with circuit, sketch and expected result in the simulator."
      },
      {
        "question": "Is prior coding experience required?",
        "answer": "Kit 1 starts from scratch. Later kits assume the basics from the previous levels."
      }
    ],
    "projects": [
      {
        "tier": "Basic",
        "name": "Servo Sweep",
        "desc": "Sweep the SG90 servo through its range."
      },
      {
        "tier": "Basic",
        "name": "DC Motor On/Off with Transistor",
        "desc": "TIP122 switches the DC motor; flyback diode protects it."
      },
      {
        "tier": "Basic",
        "name": "L293D Forward/Stop",
        "desc": "Run the DC motor forward and stop with L293D."
      },
      {
        "tier": "Basic",
        "name": "Relay Click Test",
        "desc": "Toggle the relay with the push button and observe the LED indicator."
      },
      {
        "tier": "Basic",
        "name": "Stepper One Revolution",
        "desc": "Rotate the 28BYJ-48 by one full revolution."
      },
      {
        "tier": "Basic",
        "name": "BO Motor Spin",
        "desc": "Drive the BO motor through the L298N channel A."
      },
      {
        "tier": "Basic",
        "name": "MOSFET LED Switch",
        "desc": "IRFZ44N switches an LED load from a digital pin."
      },
      {
        "tier": "Basic",
        "name": "Motor Speed with PWM",
        "desc": "Vary DC motor speed through the TIP122 using PWM."
      },
      {
        "tier": "Basic",
        "name": "Button-Controlled Servo",
        "desc": "Button steps servo angle by 30 degrees."
      },
      {
        "tier": "Basic",
        "name": "Flyback Diode Demonstration",
        "desc": "Compare motor switching with and without the 1N4007 using a relay."
      },
      {
        "tier": "Intermediate",
        "name": "L293D Direction Control",
        "desc": "Forward, reverse, brake with button commands."
      },
      {
        "tier": "Intermediate",
        "name": "L298N Dual Motor Drive",
        "desc": "Independent speed and direction for DC and BO motors."
      },
      {
        "tier": "Intermediate",
        "name": "Warm-Hand Fan Speed Demo",
        "desc": "Fan speed follows how warm your hand makes the LM35, in five PWM steps."
      },
      {
        "tier": "Intermediate",
        "name": "Temperature Fan Controller",
        "desc": "LM35 reading sets motor speed in steps."
      },
      {
        "tier": "Intermediate",
        "name": "Servo Gate",
        "desc": "Servo opens on button press and closes after a delay."
      },
      {
        "tier": "Intermediate",
        "name": "Stepper Angle Positioning",
        "desc": "Move the stepper to commanded angles via serial."
      },
      {
        "tier": "Intermediate",
        "name": "Stepper Speed Ramp",
        "desc": "Accelerate/decelerate the stepper smoothly with timed steps."
      },
      {
        "tier": "Intermediate",
        "name": "Relay Lamp Timer",
        "desc": "Relay (with LED indicator load) on for a set time after press."
      },
      {
        "tier": "Intermediate",
        "name": "Soft-Start Motor with MOSFET",
        "desc": "PWM ramp-up using IRFZ44N and flyback diode with decoupling capacitor."
      },
      {
        "tier": "Intermediate",
        "name": "Servo + DC Motor Combo Door",
        "desc": "Servo latch then motor drive opens a model door."
      },
      {
        "tier": "Intermediate",
        "name": "Differential Drive Demo",
        "desc": "Two motors driven with L298N for turn left/right/straight."
      },
      {
        "tier": "Intermediate",
        "name": "Stepper Dial Pointer",
        "desc": "Pointer on stepper moves to values from the LM35 temperature."
      },
      {
        "tier": "Intermediate",
        "name": "PWM Brake and Coast Comparison",
        "desc": "Demonstrate brake vs coast stop on L293D."
      },
      {
        "tier": "Intermediate",
        "name": "Relay Toggle with Debounce",
        "desc": "Single-button latch relay with LED state indicator."
      },
      {
        "tier": "Intermediate",
        "name": "Motor Direction Safety Interlock",
        "desc": "Prevents direction change until stop delay is satisfied."
      },
      {
        "tier": "Intermediate",
        "name": "Capacitor Smoothing Experiment",
        "desc": "Observe motor supply dips with and without 100uF decoupling."
      },
      {
        "tier": "Intermediate",
        "name": "MOSFET vs TIP122 Comparison",
        "desc": "Switching performance comparison for the same motor load."
      },
      {
        "tier": "Intermediate",
        "name": "Stepper Half-Step vs Full-Step",
        "desc": "Compare torque/smoothness of stepping modes."
      },
      {
        "tier": "Intermediate",
        "name": "BO Motor Wheel Test Rig",
        "desc": "Run forward/reverse sequences and note speed vs PWM."
      },
      {
        "tier": "Intermediate",
        "name": "Automatic Fan with Hysteresis",
        "desc": "LM35 on/off thresholds avoid chatter using relay and LED status."
      },
      {
        "tier": "Advanced",
        "name": "Automatic Door Controller",
        "desc": "Servo door, stepper bolt, button and safety timeout state machine."
      },
      {
        "tier": "Advanced",
        "name": "Closed-Loop Temperature Fan",
        "desc": "LM35 PI control with PWM fan, MOSFET driver, flyback and decoupling."
      },
      {
        "tier": "Advanced",
        "name": "Two-Motor Robot Drive Brain",
        "desc": "Command parser for forward, back, turn, spin with ramped PWM."
      },
      {
        "tier": "Advanced",
        "name": "Stepper Pick-and-Place Model",
        "desc": "Stepper rotates arm, servo grips, relay powers a magnet load LED."
      },
      {
        "tier": "Advanced",
        "name": "Elevator Simulation",
        "desc": "Stepper car position with floor buttons, door servo and interlocks."
      },
      {
        "tier": "Advanced",
        "name": "Heat-Seeking Servo Pointer",
        "desc": "Servo scans and parks at the angle where the LM35 reads warmest (heat source finder)."
      },
      {
        "tier": "Advanced",
        "name": "Motor Soft-Start with Current-Safe Sequencing",
        "desc": "Staggered start of two motors via L298N/L293D to avoid supply sag."
      },
      {
        "tier": "Advanced",
        "name": "Servo Trajectory Planner",
        "desc": "Smooth S-curve motion between stored waypoints."
      },
      {
        "tier": "Advanced",
        "name": "Relay-Based Alternating Pump Logic Demo",
        "desc": "Two loads alternate (relay and transistor) to equalise run time."
      },
      {
        "tier": "Advanced",
        "name": "Stepper Position Memory",
        "desc": "Home sequence then remembers position in EEPROM across resets."
      },
      {
        "tier": "Advanced",
        "name": "Motor Stall Detection by Timing",
        "desc": "Detect no-motion with a start-up timeout and cut power via relay."
      },
      {
        "tier": "Advanced",
        "name": "PWM Frequency Explorer",
        "desc": "Show motor behaviour at different PWM frequencies with MOSFET driver."
      },
      {
        "tier": "Advanced",
        "name": "Conveyor Belt Controller",
        "desc": "BO motor belt with start/stop/jog, servo diverter and counters."
      },
      {
        "tier": "Advanced",
        "name": "Thermostat Heater/Fan Simulator",
        "desc": "Relay = heater, motor = fan, LM35 control with deadband and mode switch."
      },
      {
        "tier": "Advanced",
        "name": "Window Blind Controller",
        "desc": "Stepper raises/lowers a blind to preset positions, manual override button."
      },
      {
        "tier": "Advanced",
        "name": "Gearbox Speed Profile Tester",
        "desc": "Run BO and DC motors through standard acceleration profiles and compare."
      },
      {
        "tier": "Advanced",
        "name": "Motor Control Command Language",
        "desc": "Serial interpreter controlling all actuators: 'S90', 'M1 128', 'R1 on'."
      },
      {
        "tier": "Advanced",
        "name": "Safety-Interlocked Machine Cycle",
        "desc": "Two-hand button start, relay output, servo guard, e-stop with latch."
      },
      {
        "tier": "Advanced",
        "name": "Efficient Motor Driver Benchmark",
        "desc": "Compare L293D, L298N, TIP122, MOSFET drive for the same motor by measured speed/time."
      },
      {
        "tier": "Advanced",
        "name": "Pan-Tilt Style Sequencer",
        "desc": "Stepper base and servo arm run recorded move sequences with button record/replay."
      }
    ]
  },
  {
    "id": "prod-6",
    "name": "Level 6: Smart Safety & Environment Kit",
    "slug": "arduino-kit-6-smart-safety-environment",
    "category": "Arduino",
    "price": 1929,
    "originalPrice": 1929,
    "rating": 4.8,
    "reviewsCount": 0,
    "stock": 100,
    "image": "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
    "shortDesc": "JR Learners Arduino Kit 6 of 8 - Smart Safety & Environment. Hazard detection, data sensing, alarms and actuation. Includes an Arduino UNO R3 and 50 guided projects (10 Basic, 20 Intermediate, 20 Advanced).",
    "description": "Kit 6 of the 8-level JR Learners Arduino series: Smart Safety & Environment. Focus: Hazard detection, data sensing, alarms and actuation. The kit contains 27 pieces on 27 BOM lines - the common core (Arduino UNO R3, USB cable, breadboard, jumper wires, resistors, push button, LEDs) plus the level-specific parts. Every one of the 50 projects uses only the parts in this kit and can be built and tested first in the free ArduinoForge simulator at /arduinoforge/.",
    "learningObjectives": [
      "Project examples: LPG/smoke alarm",
      "Project examples: air-quality monitor",
      "Project examples: flame alarm",
      "Focus: Hazard detection, data sensing, alarms and actuation",
      "Build every circuit in the ArduinoForge simulator first, then on the real breadboard",
      "50 projects: 10 Basic, 20 Intermediate and 20 Advanced"
    ],
    "components": [
      {
        "name": "Arduino UNO R3 (clone, SMD)",
        "quantity": 1
      },
      {
        "name": "USB Type-A to B cable (Arduino)",
        "quantity": 1
      },
      {
        "name": "Breadboard 400 points",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-M (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires F-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Resistor Kit 1/4W assorted",
        "quantity": 1
      },
      {
        "name": "Push Button tactile 6x6",
        "quantity": 1
      },
      {
        "name": "LED 5mm Red",
        "quantity": 1
      },
      {
        "name": "LED 5mm Green",
        "quantity": 1
      },
      {
        "name": "LED 5mm Yellow",
        "quantity": 1
      },
      {
        "name": "LED 5mm Blue",
        "quantity": 1
      },
      {
        "name": "MQ-2 Gas Sensor",
        "quantity": 1
      },
      {
        "name": "MQ-135 Air Quality",
        "quantity": 1
      },
      {
        "name": "Flame Sensor Module",
        "quantity": 1
      },
      {
        "name": "DHT22 Temp & Humidity",
        "quantity": 1
      },
      {
        "name": "DS18B20 Waterproof Probe",
        "quantity": 1
      },
      {
        "name": "Resistor 10k ohm 1/4W",
        "quantity": 1
      },
      {
        "name": "BMP280 Pressure Sensor",
        "quantity": 1
      },
      {
        "name": "Rain Sensor Module",
        "quantity": 1
      },
      {
        "name": "Soil Moisture Sensor",
        "quantity": 1
      },
      {
        "name": "Mini Water Pump 5V",
        "quantity": 1
      },
      {
        "name": "Relay Module 1 Channel 5V",
        "quantity": 1
      },
      {
        "name": "TIP122 Darlington",
        "quantity": 1
      },
      {
        "name": "Diode 1N4007",
        "quantity": 1
      },
      {
        "name": "Buzzer Active 5V",
        "quantity": 1
      },
      {
        "name": "16x2 LCD I2C",
        "quantity": 1
      }
    ],
    "specifications": {
      "Level": "6 of 8 - Smart Safety & Environment",
      "Microcontroller": "ATmega328P (Arduino UNO R3)",
      "Operating Voltage": "5V",
      "Projects": "50 (10 Basic, 20 Intermediate, 20 Advanced)",
      "Total Pieces": "27",
      "Level-specific Parts": "15",
      "Simulator": "ArduinoForge (web and desktop)"
    },
    "assemblySteps": [
      "Connect the Arduino UNO to your PC with the USB cable and install Arduino IDE 2.x (plus the CH340 driver for clone boards)",
      "Open the matching project in the ArduinoForge simulator (/arduinoforge/, menu Examples > Kit 6) and study the wiring and sketch",
      "Build the same circuit on the breadboard with the jumper wires and resistors from the kit",
      "Copy the sketch into the Arduino IDE, upload it and compare the result with the simulator"
    ],
    "manualUrl": "/arduinoforge/",
    "datasheetUrl": "/downloads",
    "videoUrl": "https://www.youtube.com/@LetsGetEngagedin",
    "faqs": [
      {
        "question": "Which parts are in this kit?",
        "answer": "12 common-core lines (UNO R3, cable, breadboard, jumpers, resistors, button, LEDs) and 15 level-specific lines. The full list is under Components."
      },
      {
        "question": "Do I need the earlier kits?",
        "answer": "No. Every kit includes the Arduino UNO R3 and the common core, so each level can be bought and used on its own. Concepts from earlier levels help, though."
      },
      {
        "question": "How many projects are included?",
        "answer": "50 per kit: 10 Basic, 20 Intermediate and 20 Advanced, each with circuit, sketch and expected result in the simulator."
      },
      {
        "question": "Is prior coding experience required?",
        "answer": "Kit 1 starts from scratch. Later kits assume the basics from the previous levels."
      }
    ],
    "projects": [
      {
        "tier": "Basic",
        "name": "Gas Leak Detector",
        "desc": "MQ-2 analog level above a limit sounds the buzzer."
      },
      {
        "tier": "Basic",
        "name": "Flame Detector",
        "desc": "Flame sensor lights red LED and sounds buzzer."
      },
      {
        "tier": "Basic",
        "name": "Air Quality Reader",
        "desc": "Print MQ-135 values with clean/poor classification."
      },
      {
        "tier": "Basic",
        "name": "DHT22 Temperature and Humidity",
        "desc": "High-accuracy readings printed each 2 s."
      },
      {
        "tier": "Basic",
        "name": "DS18B20 Probe Temperature",
        "desc": "Read liquid temperature from the waterproof probe."
      },
      {
        "tier": "Basic",
        "name": "Barometric Pressure Reader",
        "desc": "Print pressure and altitude from the BMP280."
      },
      {
        "tier": "Basic",
        "name": "Rain Alarm",
        "desc": "Rain sensor sounds the buzzer when wet."
      },
      {
        "tier": "Basic",
        "name": "Soil Moisture Reader",
        "desc": "Print soil moisture classes."
      },
      {
        "tier": "Basic",
        "name": "Relay Switch",
        "desc": "Toggle a relay with the push button."
      },
      {
        "tier": "Basic",
        "name": "LCD Status Message",
        "desc": "Show 'SAFE' or 'DANGER' on the LCD from a button toggle."
      },
      {
        "tier": "Intermediate",
        "name": "LPG Alarm with LCD",
        "desc": "MQ-2 reading on LCD, alarm and relay cut-off above limit."
      },
      {
        "tier": "Intermediate",
        "name": "Smoke and Flame Fire Alarm",
        "desc": "Both sensors combined; flame alone is a warning, both is a fire alarm."
      },
      {
        "tier": "Intermediate",
        "name": "Air Quality Index Display",
        "desc": "MQ-135 mapped to a 0-500 AQI-like value on LCD with LED level."
      },
      {
        "tier": "Intermediate",
        "name": "Weather Station Basic",
        "desc": "Temperature, humidity and pressure on LCD pages."
      },
      {
        "tier": "Intermediate",
        "name": "Waterproof Thermometer with Alarm",
        "desc": "DS18B20 over/under temperature alarm."
      },
      {
        "tier": "Intermediate",
        "name": "Water Pump on Dry Soil",
        "desc": "Soil sensor controls the pump through TIP122 with flyback diode."
      },
      {
        "tier": "Intermediate",
        "name": "Rain-Triggered Relay",
        "desc": "Relay closes (cover) when rain is detected for 3 s."
      },
      {
        "tier": "Intermediate",
        "name": "Pressure Trend Weather Predictor",
        "desc": "Falling pressure predicts rain; display on LCD."
      },
      {
        "tier": "Intermediate",
        "name": "Gas Level Bar Graph",
        "desc": "MQ-2 level shown with graph characters on the LCD."
      },
      {
        "tier": "Intermediate",
        "name": "Fire Alarm with Relay Shutoff",
        "desc": "Flame detection triggers relay and siren with latch reset."
      },
      {
        "tier": "Intermediate",
        "name": "Indoor Climate Monitor",
        "desc": "DHT22 data with comfort rating and pump-less alarms."
      },
      {
        "tier": "Intermediate",
        "name": "Pump Dry-Run Protection",
        "desc": "Pump stops if soil does not respond after timed run."
      },
      {
        "tier": "Intermediate",
        "name": "MQ Sensor Warm-Up and Baseline",
        "desc": "Calibrate clean-air baseline for MQ-2 and MQ-135 and store it."
      },
      {
        "tier": "Intermediate",
        "name": "Temperature Compare DS18B20 vs DHT22",
        "desc": "Both sensors logged to find offset."
      },
      {
        "tier": "Intermediate",
        "name": "Rain Intensity Meter",
        "desc": "Quantify rain levels and show on LCD."
      },
      {
        "tier": "Intermediate",
        "name": "Alarm Escalation with Buzzer Patterns",
        "desc": "Gas levels low/medium/high map to different beeps."
      },
      {
        "tier": "Intermediate",
        "name": "Soil Moisture Display",
        "desc": "Moisture percent shown on LCD with water LED."
      },
      {
        "tier": "Intermediate",
        "name": "Altitude Meter",
        "desc": "Relative altitude from BMP280 with zero button."
      },
      {
        "tier": "Intermediate",
        "name": "Relay Exhaust Fan Trigger (Indicator)",
        "desc": "Relay switches on when air quality is poor."
      },
      {
        "tier": "Intermediate",
        "name": "Humidity Threshold Alarm",
        "desc": "Alarm when humidity out of the pot-less fixed range; LCD status."
      },
      {
        "tier": "Advanced",
        "name": "Complete Home Safety Panel",
        "desc": "Gas, flame, rain and temperature in zones, LCD status, relay cut-off, latched alarms."
      },
      {
        "tier": "Advanced",
        "name": "Environmental Monitoring Station",
        "desc": "Logs air quality, temperature, humidity, pressure; trend and alarm thresholds."
      },
      {
        "tier": "Advanced",
        "name": "Automated Irrigation Controller",
        "desc": "Pump scheduling using soil, rain, temperature with dry-run and flood protection."
      },
      {
        "tier": "Advanced",
        "name": "Smart Greenhouse Rules Engine",
        "desc": "Rule table decides pump, relay fan and alerts from multi-sensor data."
      },
      {
        "tier": "Advanced",
        "name": "Fire Detection with Sensor Fusion",
        "desc": "Weights smoke, flame and temperature rise rate; false alarm suppression."
      },
      {
        "tier": "Advanced",
        "name": "Gas Safety with Auto Valve Relay and Self-Test",
        "desc": "Relay valve closes at gas threshold, nightly self-test via button, event log."
      },
      {
        "tier": "Advanced",
        "name": "Weather Forecaster",
        "desc": "Pressure trend, humidity and rain combine into a 12-hour forecast text."
      },
      {
        "tier": "Advanced",
        "name": "Indoor Air Ventilation Controller",
        "desc": "Fan relay by AQI and humidity with hysteresis and manual override."
      },
      {
        "tier": "Advanced",
        "name": "Aquarium Monitor",
        "desc": "Temperature probe, water-level (rain sensor strip) and pump control with alarms."
      },
      {
        "tier": "Advanced",
        "name": "Sensor Calibration Suite",
        "desc": "Guided calibration of all gas sensors and soil/rain probes with EEPROM storage."
      },
      {
        "tier": "Advanced",
        "name": "Pollution Event Logger",
        "desc": "Event detection and statistics for MQ-135 and MQ-2 spikes over time."
      },
      {
        "tier": "Advanced",
        "name": "Storm Alert System",
        "desc": "Pressure drop + rain + humidity pattern triggers a storm warning."
      },
      {
        "tier": "Advanced",
        "name": "Safe Room Monitor",
        "desc": "Occupancy-agnostic air check: gas, temperature and ventilation relay."
      },
      {
        "tier": "Advanced",
        "name": "Fault-Tolerant Sensor Hub",
        "desc": "Detects sensor failure by plausibility checks and degrades gracefully."
      },
      {
        "tier": "Advanced",
        "name": "Rain Water Harvest Controller",
        "desc": "Pump transfers water when rain level and tank sensor (soil probe) allow."
      },
      {
        "tier": "Advanced",
        "name": "Emergency Warning Beacon",
        "desc": "Priority-based alarm patterns across buzzer, LEDs and relay with acknowledge."
      },
      {
        "tier": "Advanced",
        "name": "Dew and Frost Risk Estimator",
        "desc": "Dew point and frost warnings from DHT22 and DS18B20."
      },
      {
        "tier": "Advanced",
        "name": "Predictive Maintenance Demo",
        "desc": "Tracks pump run-time and moisture response to predict clogging."
      },
      {
        "tier": "Advanced",
        "name": "Multi-Page Safety Dashboard",
        "desc": "LCD pages cycle all sensors with an alert banner and button paging."
      },
      {
        "tier": "Advanced",
        "name": "Safety Compliance Self-Check",
        "desc": "Boot-time self-test of every sensor, relay and buzzer with pass/fail report."
      }
    ]
  },
  {
    "id": "prod-7",
    "name": "Level 7: Wireless & Remote Control Kit",
    "slug": "arduino-kit-7-wireless-remote-control",
    "category": "Arduino",
    "price": 2066,
    "originalPrice": 2066,
    "rating": 4.8,
    "reviewsCount": 0,
    "stock": 100,
    "image": "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
    "shortDesc": "JR Learners Arduino Kit 7 of 8 - Wireless & Remote Control. Bluetooth, 2.4 GHz radio, IR, Wi-Fi, 3.3 V interfacing. Includes an Arduino UNO R3 and 50 guided projects (10 Basic, 20 Intermediate, 20 Advanced).",
    "description": "Kit 7 of the 8-level JR Learners Arduino series: Wireless & Remote Control. Focus: Bluetooth, 2.4 GHz radio, IR, Wi-Fi, 3.3 V interfacing. The kit contains 25 pieces on 24 BOM lines - the common core (Arduino UNO R3, USB cable, breadboard, jumper wires, resistors, push button, LEDs) plus the level-specific parts. Every one of the 50 projects uses only the parts in this kit and can be built and tested first in the free ArduinoForge simulator at /arduinoforge/.",
    "learningObjectives": [
      "Project examples: Phone Bluetooth LED control",
      "Project examples: Bluetooth remote protocol",
      "Project examples: NRF24 two-node chat",
      "Focus: Bluetooth, 2.4 GHz radio, IR, Wi-Fi, 3.3 V interfacing",
      "Build every circuit in the ArduinoForge simulator first, then on the real breadboard",
      "50 projects: 10 Basic, 20 Intermediate and 20 Advanced"
    ],
    "components": [
      {
        "name": "Arduino UNO R3 (clone, SMD)",
        "quantity": 1
      },
      {
        "name": "USB Type-A to B cable (Arduino)",
        "quantity": 1
      },
      {
        "name": "Breadboard 400 points",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-M (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires F-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Resistor Kit 1/4W assorted",
        "quantity": 1
      },
      {
        "name": "Push Button tactile 6x6",
        "quantity": 1
      },
      {
        "name": "LED 5mm Red",
        "quantity": 1
      },
      {
        "name": "LED 5mm Green",
        "quantity": 1
      },
      {
        "name": "LED 5mm Yellow",
        "quantity": 1
      },
      {
        "name": "LED 5mm Blue",
        "quantity": 1
      },
      {
        "name": "HC-05 Bluetooth",
        "quantity": 1
      },
      {
        "name": "NRF24L01 Radio",
        "quantity": 2
      },
      {
        "name": "AMS1117-3.3V Regulator",
        "quantity": 1
      },
      {
        "name": "Electrolytic Capacitor 100uF 25V",
        "quantity": 1
      },
      {
        "name": "IR Remote + Receiver",
        "quantity": 1
      },
      {
        "name": "ESP8266 NodeMCU V3",
        "quantity": 1
      },
      {
        "name": "Logic Level Converter 4ch",
        "quantity": 1
      },
      {
        "name": "DHT11 Temp & Humidity",
        "quantity": 1
      },
      {
        "name": "SG90 Micro Servo",
        "quantity": 1
      },
      {
        "name": "Relay Module 1 Channel 5V",
        "quantity": 1
      },
      {
        "name": "Resistor 10k ohm 1/4W",
        "quantity": 1
      },
      {
        "name": "16x2 LCD I2C",
        "quantity": 1
      }
    ],
    "specifications": {
      "Level": "7 of 8 - Wireless & Remote Control",
      "Microcontroller": "ATmega328P (Arduino UNO R3)",
      "Operating Voltage": "5V",
      "Projects": "50 (10 Basic, 20 Intermediate, 20 Advanced)",
      "Total Pieces": "25",
      "Level-specific Parts": "12",
      "Simulator": "ArduinoForge (web and desktop)"
    },
    "assemblySteps": [
      "Connect the Arduino UNO to your PC with the USB cable and install Arduino IDE 2.x (plus the CH340 driver for clone boards)",
      "Open the matching project in the ArduinoForge simulator (/arduinoforge/, menu Examples > Kit 7) and study the wiring and sketch",
      "Build the same circuit on the breadboard with the jumper wires and resistors from the kit",
      "Copy the sketch into the Arduino IDE, upload it and compare the result with the simulator"
    ],
    "manualUrl": "/arduinoforge/",
    "datasheetUrl": "/downloads",
    "videoUrl": "https://www.youtube.com/@LetsGetEngagedin",
    "faqs": [
      {
        "question": "Which parts are in this kit?",
        "answer": "12 common-core lines (UNO R3, cable, breadboard, jumpers, resistors, button, LEDs) and 12 level-specific lines. The full list is under Components."
      },
      {
        "question": "Do I need the earlier kits?",
        "answer": "No. Every kit includes the Arduino UNO R3 and the common core, so each level can be bought and used on its own. Concepts from earlier levels help, though."
      },
      {
        "question": "How many projects are included?",
        "answer": "50 per kit: 10 Basic, 20 Intermediate and 20 Advanced, each with circuit, sketch and expected result in the simulator."
      },
      {
        "question": "Is prior coding experience required?",
        "answer": "Kit 1 starts from scratch. Later kits assume the basics from the previous levels."
      }
    ],
    "projects": [
      {
        "tier": "Basic",
        "name": "Bluetooth LED Control",
        "desc": "Control an LED from a phone terminal via HC-05."
      },
      {
        "tier": "Basic",
        "name": "Bluetooth Echo",
        "desc": "Echo phone-typed text to the serial monitor and back."
      },
      {
        "tier": "Basic",
        "name": "IR Remote Key Reader",
        "desc": "Print codes of remote buttons received."
      },
      {
        "tier": "Basic",
        "name": "IR LED Toggle",
        "desc": "Remote button toggles the green LED."
      },
      {
        "tier": "Basic",
        "name": "NodeMCU Blink",
        "desc": "Blink the onboard LED of the ESP8266."
      },
      {
        "tier": "Basic",
        "name": "NodeMCU Wi-Fi Scan",
        "desc": "Scan and print nearby Wi-Fi networks."
      },
      {
        "tier": "Basic",
        "name": "Level Converter Test",
        "desc": "Pass a 5 V signal safely to a 3.3 V input."
      },
      {
        "tier": "Basic",
        "name": "NRF24 Module Check",
        "desc": "Initialise the NRF24L01 with 3.3 V rail and read its status register."
      },
      {
        "tier": "Basic",
        "name": "Relay via Bluetooth",
        "desc": "Switch the relay with phone commands."
      },
      {
        "tier": "Basic",
        "name": "Servo via Bluetooth",
        "desc": "Set servo angle with a number sent from the phone."
      },
      {
        "tier": "Intermediate",
        "name": "Bluetooth LED Dimmer",
        "desc": "Phone slider values set LED PWM brightness."
      },
      {
        "tier": "Intermediate",
        "name": "Bluetooth Sensor Data to Phone",
        "desc": "Send DHT11 temperature and humidity to the phone every few seconds."
      },
      {
        "tier": "Intermediate",
        "name": "IR Remote Controlled Servo",
        "desc": "Keys rotate servo left/right/centre."
      },
      {
        "tier": "Intermediate",
        "name": "IR Remote Relay Switch",
        "desc": "Power button toggles relay with LED status."
      },
      {
        "tier": "Intermediate",
        "name": "NRF24 Transmitter",
        "desc": "Send DHT11 data from the UNO NRF24 node."
      },
      {
        "tier": "Intermediate",
        "name": "NRF24 Receiver on NodeMCU",
        "desc": "Receive and print packets sent by the UNO node."
      },
      {
        "tier": "Intermediate",
        "name": "Wi-Fi Web LED Control",
        "desc": "NodeMCU hosts a web page with ON/OFF links for an LED."
      },
      {
        "tier": "Intermediate",
        "name": "Wi-Fi Temperature Web Page",
        "desc": "NodeMCU serves DHT11 data on a local web page."
      },
      {
        "tier": "Intermediate",
        "name": "Bluetooth Command Parser",
        "desc": "Commands 'LED1', 'SERVO 90', 'RELAY ON' parsed and executed."
      },
      {
        "tier": "Intermediate",
        "name": "Remote Door Lock",
        "desc": "Bluetooth command moves a servo lock and indicates state on the LCD."
      },
      {
        "tier": "Intermediate",
        "name": "LCD Message Receiver",
        "desc": "Text typed on the phone appears on the LCD."
      },
      {
        "tier": "Intermediate",
        "name": "Level-Shifted UNO to NodeMCU Serial",
        "desc": "Exchange serial data safely using the converter."
      },
      {
        "tier": "Intermediate",
        "name": "NRF24 Two-Way Chat",
        "desc": "UNO and NodeMCU nodes send text messages to each other."
      },
      {
        "tier": "Intermediate",
        "name": "IR Remote Number Entry",
        "desc": "Enter digits with the remote and show them on the LCD."
      },
      {
        "tier": "Intermediate",
        "name": "Wireless Button Doorbell",
        "desc": "Button on node A rings buzzer-less red LED alert on node B over NRF24."
      },
      {
        "tier": "Intermediate",
        "name": "Phone Alarm Notification",
        "desc": "Gas-like threshold from DHT11 sends alert text to phone via Bluetooth."
      },
      {
        "tier": "Intermediate",
        "name": "Wi-Fi Relay Control",
        "desc": "NodeMCU web page controls an external relay via level converter."
      },
      {
        "tier": "Intermediate",
        "name": "Bluetooth Servo Joystick",
        "desc": "Phone sends x/y values to move servo smoothly."
      },
      {
        "tier": "Intermediate",
        "name": "NodeMCU Wi-Fi Status LCD",
        "desc": "Show IP address and signal strength on the LCD."
      },
      {
        "tier": "Intermediate",
        "name": "Remote Temperature Display",
        "desc": "NRF24 sensor node sends temperature shown on the LCD on the receiver."
      },
      {
        "tier": "Advanced",
        "name": "Bluetooth Home Automation Panel",
        "desc": "Control relay, servo, LEDs from a phone app with status feedback and LCD."
      },
      {
        "tier": "Advanced",
        "name": "IoT Weather Node over Wi-Fi",
        "desc": "NodeMCU hosts a dashboard and a JSON endpoint with DHT11 data."
      },
      {
        "tier": "Advanced",
        "name": "NRF24 Sensor Network Gateway",
        "desc": "UNO node sends to NodeMCU gateway that serves the data via Wi-Fi."
      },
      {
        "tier": "Advanced",
        "name": "Secure Remote Door Lock",
        "desc": "PIN via Bluetooth, rolling code on NRF24 and servo lock."
      },
      {
        "tier": "Advanced",
        "name": "IR + Bluetooth Dual Remote Appliance Control",
        "desc": "Priority rules between IR remote and phone commands for the relay."
      },
      {
        "tier": "Advanced",
        "name": "Wi-Fi Controlled Servo Radar Display Page",
        "desc": "Web UI to set servo angle and show readings."
      },
      {
        "tier": "Advanced",
        "name": "Wireless Alarm System",
        "desc": "NRF24 contact sensor triggers remote siren node and phone alert."
      },
      {
        "tier": "Advanced",
        "name": "OTA-Style Settings Manager",
        "desc": "Store settings in EEPROM, edit over Bluetooth with checksum verification."
      },
      {
        "tier": "Advanced",
        "name": "Master-Slave Command Bus",
        "desc": "UNO as master sends framed commands to NodeMCU slave with ACK/retry."
      },
      {
        "tier": "Advanced",
        "name": "Wi-Fi Time Display Clock",
        "desc": "NodeMCU fetches time over NTP and forwards it to the LCD via serial through the level converter."
      },
      {
        "tier": "Advanced",
        "name": "Phone Data Logger",
        "desc": "Logs DHT11 data with timestamps to phone over Bluetooth using a custom protocol."
      },
      {
        "tier": "Advanced",
        "name": "Wireless Light Show Controller",
        "desc": "Phone and IR commands select LED and servo animations."
      },
      {
        "tier": "Advanced",
        "name": "NRF24 Range and Packet-Loss Tester",
        "desc": "Measures packet loss across distance with counter and LCD."
      },
      {
        "tier": "Advanced",
        "name": "Multi-Protocol Gateway",
        "desc": "Bridges IR, Bluetooth and NRF24 commands into one unified action queue."
      },
      {
        "tier": "Advanced",
        "name": "Remote Greenhouse Controller (Demo Loads)",
        "desc": "Wi-Fi dashboard toggles relay load and shows DHT11 climate data."
      },
      {
        "tier": "Advanced",
        "name": "Encrypted Message Link",
        "desc": "Simple XOR/cipher between two nodes over NRF24 with LCD display."
      },
      {
        "tier": "Advanced",
        "name": "Smart Remote Hub with Learning",
        "desc": "IR code learning plus Bluetooth macro recording."
      },
      {
        "tier": "Advanced",
        "name": "Wireless Fault Reporter",
        "desc": "Nodes send heartbeat; missing heartbeats raise alarm LEDs and phone notice."
      },
      {
        "tier": "Advanced",
        "name": "Wi-Fi Access Point Configuration Portal",
        "desc": "NodeMCU AP serves a form to set parameters stored for the UNO."
      },
      {
        "tier": "Advanced",
        "name": "Wireless System Self-Test Suite",
        "desc": "Automated tests for HC-05, NRF24, IR, NodeMCU link and relay with report."
      }
    ]
  },
  {
    "id": "prod-8",
    "name": "Level 8: Smart Systems Capstone Kit",
    "slug": "arduino-kit-8-smart-systems-capstone",
    "category": "Arduino",
    "price": 2560,
    "originalPrice": 2560,
    "rating": 4.8,
    "reviewsCount": 0,
    "stock": 100,
    "image": "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
    "shortDesc": "JR Learners Arduino Kit 8 of 8 - Smart Systems Capstone. Integration: access control, data logging, power monitoring, IMU. Includes an Arduino UNO R3 and 50 guided projects (10 Basic, 20 Intermediate, 20 Advanced).",
    "description": "Kit 8 of the 8-level JR Learners Arduino series: Smart Systems Capstone. Focus: Integration: access control, data logging, power monitoring, IMU. The kit contains 24 pieces on 24 BOM lines - the common core (Arduino UNO R3, USB cable, breadboard, jumper wires, resistors, push button, LEDs) plus the level-specific parts. Every one of the 50 projects uses only the parts in this kit and can be built and tested first in the free ArduinoForge simulator at /arduinoforge/.",
    "learningObjectives": [
      "Project examples: RFID door lock",
      "Project examples: RFID attendance with time-stamp (RTC)",
      "Project examples: access log on LCD",
      "Focus: Integration: access control, data logging, power monitoring, IMU",
      "Build every circuit in the ArduinoForge simulator first, then on the real breadboard",
      "50 projects: 10 Basic, 20 Intermediate and 20 Advanced"
    ],
    "components": [
      {
        "name": "Arduino UNO R3 (clone, SMD)",
        "quantity": 1
      },
      {
        "name": "USB Type-A to B cable (Arduino)",
        "quantity": 1
      },
      {
        "name": "Breadboard 400 points",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-M (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires F-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Resistor Kit 1/4W assorted",
        "quantity": 1
      },
      {
        "name": "Push Button tactile 6x6",
        "quantity": 1
      },
      {
        "name": "LED 5mm Red",
        "quantity": 1
      },
      {
        "name": "LED 5mm Green",
        "quantity": 1
      },
      {
        "name": "LED 5mm Yellow",
        "quantity": 1
      },
      {
        "name": "LED 5mm Blue",
        "quantity": 1
      },
      {
        "name": "MFRC522 RFID Kit",
        "quantity": 1
      },
      {
        "name": "RTC DS3231",
        "quantity": 1
      },
      {
        "name": "16x2 LCD I2C",
        "quantity": 1
      },
      {
        "name": "SG90 Micro Servo",
        "quantity": 1
      },
      {
        "name": "Relay Module 1 Channel 5V",
        "quantity": 1
      },
      {
        "name": "Buzzer Active 5V",
        "quantity": 1
      },
      {
        "name": "Load Cell + HX711",
        "quantity": 1
      },
      {
        "name": "INA219 Current Sensor",
        "quantity": 1
      },
      {
        "name": "MPU6050 IMU",
        "quantity": 1
      },
      {
        "name": "MAX30102 Pulse Oximeter",
        "quantity": 1
      },
      {
        "name": "0.96in OLED I2C SSD1306",
        "quantity": 1
      },
      {
        "name": "Resistor 10k ohm 1/4W",
        "quantity": 1
      }
    ],
    "specifications": {
      "Level": "8 of 8 - Smart Systems Capstone",
      "Microcontroller": "ATmega328P (Arduino UNO R3)",
      "Operating Voltage": "5V",
      "Projects": "50 (10 Basic, 20 Intermediate, 20 Advanced)",
      "Total Pieces": "24",
      "Level-specific Parts": "12",
      "Simulator": "ArduinoForge (web and desktop)"
    },
    "assemblySteps": [
      "Connect the Arduino UNO to your PC with the USB cable and install Arduino IDE 2.x (plus the CH340 driver for clone boards)",
      "Open the matching project in the ArduinoForge simulator (/arduinoforge/, menu Examples > Kit 8) and study the wiring and sketch",
      "Build the same circuit on the breadboard with the jumper wires and resistors from the kit",
      "Copy the sketch into the Arduino IDE, upload it and compare the result with the simulator"
    ],
    "manualUrl": "/arduinoforge/",
    "datasheetUrl": "/downloads",
    "videoUrl": "https://www.youtube.com/@LetsGetEngagedin",
    "faqs": [
      {
        "question": "Which parts are in this kit?",
        "answer": "12 common-core lines (UNO R3, cable, breadboard, jumpers, resistors, button, LEDs) and 12 level-specific lines. The full list is under Components."
      },
      {
        "question": "Do I need the earlier kits?",
        "answer": "No. Every kit includes the Arduino UNO R3 and the common core, so each level can be bought and used on its own. Concepts from earlier levels help, though."
      },
      {
        "question": "How many projects are included?",
        "answer": "50 per kit: 10 Basic, 20 Intermediate and 20 Advanced, each with circuit, sketch and expected result in the simulator."
      },
      {
        "question": "Is prior coding experience required?",
        "answer": "Kit 1 starts from scratch. Later kits assume the basics from the previous levels."
      }
    ],
    "projects": [
      {
        "tier": "Basic",
        "name": "RFID Card UID Reader",
        "desc": "Read and print the UID of a card/tag."
      },
      {
        "tier": "Basic",
        "name": "RFID Access LED",
        "desc": "Green LED for authorised UID, red for unknown."
      },
      {
        "tier": "Basic",
        "name": "RTC Time Display",
        "desc": "Print date and time from the DS3231."
      },
      {
        "tier": "Basic",
        "name": "LCD Clock",
        "desc": "Show the real time on the LCD."
      },
      {
        "tier": "Basic",
        "name": "Servo Lock Test",
        "desc": "Move servo between lock and unlock angles by button."
      },
      {
        "tier": "Basic",
        "name": "Weight Reader",
        "desc": "Read the load cell with HX711 and print grams after tare."
      },
      {
        "tier": "Basic",
        "name": "Voltage and Current Reader",
        "desc": "Read bus voltage, current and power from INA219."
      },
      {
        "tier": "Basic",
        "name": "MPU6050 Tilt Reader",
        "desc": "Print accelerometer and gyro values."
      },
      {
        "tier": "Basic",
        "name": "Heart-Rate Raw Signal",
        "desc": "Print raw IR/red readings from MAX30102."
      },
      {
        "tier": "Basic",
        "name": "OLED Hello",
        "desc": "Show text on OLED."
      },
      {
        "tier": "Intermediate",
        "name": "RFID Door Lock",
        "desc": "Authorised card unlocks the servo and relay, buzzer feedback."
      },
      {
        "tier": "Intermediate",
        "name": "RFID Attendance with Time-Stamp",
        "desc": "Log UID with RTC date/time in serial."
      },
      {
        "tier": "Intermediate",
        "name": "Access Log on LCD",
        "desc": "Last card, status and time shown on LCD."
      },
      {
        "tier": "Intermediate",
        "name": "Digital Weighing Scale",
        "desc": "Weight in grams on the LCD with tare button."
      },
      {
        "tier": "Intermediate",
        "name": "Overload Alarm Scale",
        "desc": "Buzzer when weight exceeds a set limit."
      },
      {
        "tier": "Intermediate",
        "name": "Power Meter",
        "desc": "Show INA219 voltage, current, power and energy on the OLED."
      },
      {
        "tier": "Intermediate",
        "name": "Tilt Alarm",
        "desc": "MPU6050 detects tilt beyond a limit and sounds the buzzer."
      },
      {
        "tier": "Intermediate",
        "name": "Step/Motion Counter",
        "desc": "Count movements using accelerometer peaks."
      },
      {
        "tier": "Intermediate",
        "name": "Pulse Rate Display",
        "desc": "Compute BPM from MAX30102 and display it on OLED."
      },
      {
        "tier": "Intermediate",
        "name": "Alarm Clock",
        "desc": "RTC alarm with buzzer and snooze button."
      },
      {
        "tier": "Intermediate",
        "name": "Timed Relay Schedule",
        "desc": "Relay on at set times from the RTC."
      },
      {
        "tier": "Intermediate",
        "name": "RFID Add/Remove Master Card",
        "desc": "Master card registers and removes cards stored in EEPROM."
      },
      {
        "tier": "Intermediate",
        "name": "Smart Locker with Weight Check",
        "desc": "Locker (servo) opens by RFID and reports contents weight."
      },
      {
        "tier": "Intermediate",
        "name": "Battery Voltage Monitor",
        "desc": "INA219 shows battery state and low-voltage warning."
      },
      {
        "tier": "Intermediate",
        "name": "IMU Level Bubble on OLED",
        "desc": "Digital spirit level drawn on the OLED from tilt."
      },
      {
        "tier": "Intermediate",
        "name": "Access Denied Lockout",
        "desc": "Three wrong cards trigger a 30 s lockout with buzzer."
      },
      {
        "tier": "Intermediate",
        "name": "Fall Detector Demo",
        "desc": "Free-fall followed by impact detected with the MPU6050."
      },
      {
        "tier": "Intermediate",
        "name": "SpO2 Estimate Display",
        "desc": "Approximate SpO2 and BPM shown on OLED."
      },
      {
        "tier": "Intermediate",
        "name": "Data Logger with Timestamp",
        "desc": "Log INA219 current with RTC stamp over serial."
      },
      {
        "tier": "Intermediate",
        "name": "Kitchen Scale with Unit Switching",
        "desc": "Grams/ounces switching by button on the LCD."
      },
      {
        "tier": "Advanced",
        "name": "Complete Smart Locker",
        "desc": "RFID auth, servo lock, relay strike, weight check, RTC log, OLED UI."
      },
      {
        "tier": "Advanced",
        "name": "Attendance System with Reports",
        "desc": "Per-user daily in/out records in EEPROM, summary on serial."
      },
      {
        "tier": "Advanced",
        "name": "Time-Based Access Control",
        "desc": "Cards allowed only within time windows from the RTC."
      },
      {
        "tier": "Advanced",
        "name": "Energy Monitor and Logger",
        "desc": "Energy (Wh) accumulated by the INA219 with hourly log by RTC."
      },
      {
        "tier": "Advanced",
        "name": "Motion-Aware Power Saver",
        "desc": "MPU6050 motion keeps OLED on; sleep after idle; INA219 verifies savings."
      },
      {
        "tier": "Advanced",
        "name": "Posture and Tilt Coach",
        "desc": "Tracks slouch events and logs duration with RTC stamps."
      },
      {
        "tier": "Advanced",
        "name": "Health Monitor",
        "desc": "BPM, SpO2 and motion artefact rejection with MPU6050; OLED trends."
      },
      {
        "tier": "Advanced",
        "name": "Smart Medication Box",
        "desc": "RTC schedules, locker servo, weight verification, alert tones."
      },
      {
        "tier": "Advanced",
        "name": "Industrial Weighing Station",
        "desc": "Load cell calibration, batch counting, overload relay trip, report."
      },
      {
        "tier": "Advanced",
        "name": "Vibration Monitor",
        "desc": "MPU6050 vibration RMS logged with alarms and RTC timestamps."
      },
      {
        "tier": "Advanced",
        "name": "Secure Vault Alarm",
        "desc": "Tamper (MPU), weight change (HX711), invalid RFID combine into a latched alarm."
      },
      {
        "tier": "Advanced",
        "name": "Calibration Manager",
        "desc": "Stores calibration for load cell, current offset and IMU zero in EEPROM."
      },
      {
        "tier": "Advanced",
        "name": "Appliance Usage Tracker",
        "desc": "INA219 power with RTC schedule of use; relay cuts power after time limit."
      },
      {
        "tier": "Advanced",
        "name": "Wearable Prototype Dashboard",
        "desc": "Time, BPM, steps, battery state on the OLED with button paging."
      },
      {
        "tier": "Advanced",
        "name": "Fall Detection and Alert",
        "desc": "Threshold plus orientation after impact, escalate alarm unless cancelled."
      },
      {
        "tier": "Advanced",
        "name": "Smart Door with Two-Factor Auth",
        "desc": "RFID card then button-sequence PIN; relay + servo; time-stamped log."
      },
      {
        "tier": "Advanced",
        "name": "Sample-Weight Dispensing Controller",
        "desc": "Relay/servo dispenses until target weight reached with calibration."
      },
      {
        "tier": "Advanced",
        "name": "Multi-Sensor Black Box Recorder",
        "desc": "Rolling buffer of IMU, current and heart-rate data frozen on event trigger."
      },
      {
        "tier": "Advanced",
        "name": "Capstone: Integrated Smart-Locker System",
        "desc": "Final project integrating RFID, RTC, load cell, servo, relay, IMU, INA219, OLED and LCD."
      },
      {
        "tier": "Advanced",
        "name": "Weigh-and-Log Station",
        "desc": "Weighs items, time-stamps each entry with the RTC and keeps a running total on the LCD."
      }
    ],
    "badge": "Capstone"
  },
  {
    "id": "prod-9",
    "name": "All-in-One Kit: all 8 levels",
    "slug": "all-in-one-kit",
    "category": "Arduino",
    "price": 7665,
    "originalPrice": 12833,
    "rating": 4.8,
    "reviewsCount": 0,
    "stock": 100,
    "badge": "Best value",
    "image": "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
    "shortDesc": "Everything for all 8 levels in one box: one Arduino UNO R3 with the common core plus every level-specific part. All 400 projects. Save ₹5168 compared with buying the 8 kits separately.",
    "description": "The complete JR Learners Arduino series in a single kit. It contains the common core once (Arduino UNO R3, USB cable, breadboard, jumper wires, resistor kit, push button and four LEDs) plus the level-specific parts of all 8 kits, 99 pieces on 71 BOM lines. That is enough to build every one of the 400 projects (50 per level: 10 Basic, 20 Intermediate, 20 Advanced). Price = BOM cost of the common core once plus all level-specific parts, plus 40 %. Parts that several levels use (such as relays, LCDs and servos) are included as many times as the levels need them.",
    "learningObjectives": [
      "Work through all 8 levels: Foundations, Sensing, Displays, Motion, Motors, Safety, Wireless and the Smart Systems Capstone",
      "400 guided projects, each testable first in the ArduinoForge simulator",
      "Move from first LED blink to RFID access control, data logging and power monitoring",
      "One Arduino UNO R3 and one breadboard are shared by every project"
    ],
    "components": [
      {
        "name": "Arduino UNO R3 (clone, SMD)",
        "quantity": 1
      },
      {
        "name": "USB Type-A to B cable (Arduino)",
        "quantity": 1
      },
      {
        "name": "Breadboard 400 points",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-M (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires M-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Jumper Wires F-F (40pcs)",
        "quantity": 1
      },
      {
        "name": "Resistor Kit 1/4W assorted",
        "quantity": 1
      },
      {
        "name": "Push Button tactile 6x6",
        "quantity": 1
      },
      {
        "name": "LED 5mm Red",
        "quantity": 1
      },
      {
        "name": "LED 5mm Green",
        "quantity": 1
      },
      {
        "name": "LED 5mm Yellow",
        "quantity": 1
      },
      {
        "name": "LED 5mm Blue",
        "quantity": 1
      },
      {
        "name": "RGB LED common cathode 5mm",
        "quantity": 1
      },
      {
        "name": "Resistor 220 ohm 1/4W",
        "quantity": 2
      },
      {
        "name": "Potentiometer 10k (rotary)",
        "quantity": 2
      },
      {
        "name": "Buzzer Active 5V",
        "quantity": 4
      },
      {
        "name": "Piezo Passive Buzzer",
        "quantity": 2
      },
      {
        "name": "LDR Light Sensor Module",
        "quantity": 2
      },
      {
        "name": "Slide Switch SPDT",
        "quantity": 1
      },
      {
        "name": "DHT11 Temp & Humidity",
        "quantity": 2
      },
      {
        "name": "LM35 Temperature Sensor",
        "quantity": 2
      },
      {
        "name": "Thermistor NTC 10k",
        "quantity": 1
      },
      {
        "name": "Resistor 10k ohm 1/4W",
        "quantity": 4
      },
      {
        "name": "Soil Moisture Sensor",
        "quantity": 2
      },
      {
        "name": "Rain Sensor Module",
        "quantity": 2
      },
      {
        "name": "Sound Sensor Module",
        "quantity": 1
      },
      {
        "name": "16x2 LCD I2C",
        "quantity": 4
      },
      {
        "name": "0.96in OLED I2C SSD1306",
        "quantity": 2
      },
      {
        "name": "TM1637 4-digit 7-segment",
        "quantity": 1
      },
      {
        "name": "8x8 LED Matrix MAX7219",
        "quantity": 1
      },
      {
        "name": "Shift Register 74HC595",
        "quantity": 1
      },
      {
        "name": "Rotary Encoder KY-040",
        "quantity": 1
      },
      {
        "name": "Joystick Module",
        "quantity": 1
      },
      {
        "name": "HC-SR04 Ultrasonic",
        "quantity": 1
      },
      {
        "name": "PIR Motion HC-SR501",
        "quantity": 1
      },
      {
        "name": "IR Obstacle Sensor",
        "quantity": 1
      },
      {
        "name": "TCRT5000 Line Sensor",
        "quantity": 1
      },
      {
        "name": "VL53L0X ToF Distance",
        "quantity": 1
      },
      {
        "name": "Touch Sensor TTP223",
        "quantity": 1
      },
      {
        "name": "Hall Effect Sensor A3144",
        "quantity": 1
      },
      {
        "name": "SG90 Micro Servo",
        "quantity": 4
      },
      {
        "name": "DC Motor 6V",
        "quantity": 1
      },
      {
        "name": "BO Motor + wheel",
        "quantity": 1
      },
      {
        "name": "Motor Driver L293D",
        "quantity": 1
      },
      {
        "name": "Motor Driver Module L298N",
        "quantity": 1
      },
      {
        "name": "28BYJ-48 Stepper + ULN2003",
        "quantity": 1
      },
      {
        "name": "Relay Module 1 Channel 5V",
        "quantity": 4
      },
      {
        "name": "TIP122 Darlington",
        "quantity": 2
      },
      {
        "name": "MOSFET IRFZ44N",
        "quantity": 1
      },
      {
        "name": "Diode 1N4007",
        "quantity": 2
      },
      {
        "name": "Electrolytic Capacitor 100uF 25V",
        "quantity": 2
      },
      {
        "name": "AA 4-cell Battery Holder",
        "quantity": 1
      },
      {
        "name": "MQ-2 Gas Sensor",
        "quantity": 1
      },
      {
        "name": "MQ-135 Air Quality",
        "quantity": 1
      },
      {
        "name": "Flame Sensor Module",
        "quantity": 1
      },
      {
        "name": "DHT22 Temp & Humidity",
        "quantity": 1
      },
      {
        "name": "DS18B20 Waterproof Probe",
        "quantity": 1
      },
      {
        "name": "BMP280 Pressure Sensor",
        "quantity": 1
      },
      {
        "name": "Mini Water Pump 5V",
        "quantity": 1
      },
      {
        "name": "HC-05 Bluetooth",
        "quantity": 1
      },
      {
        "name": "NRF24L01 Radio",
        "quantity": 2
      },
      {
        "name": "AMS1117-3.3V Regulator",
        "quantity": 1
      },
      {
        "name": "IR Remote + Receiver",
        "quantity": 1
      },
      {
        "name": "ESP8266 NodeMCU V3",
        "quantity": 1
      },
      {
        "name": "Logic Level Converter 4ch",
        "quantity": 1
      },
      {
        "name": "MFRC522 RFID Kit",
        "quantity": 1
      },
      {
        "name": "RTC DS3231",
        "quantity": 1
      },
      {
        "name": "Load Cell + HX711",
        "quantity": 1
      },
      {
        "name": "INA219 Current Sensor",
        "quantity": 1
      },
      {
        "name": "MPU6050 IMU",
        "quantity": 1
      },
      {
        "name": "MAX30102 Pulse Oximeter",
        "quantity": 1
      }
    ],
    "specifications": {
      "Levels": "All 8",
      "Microcontroller": "ATmega328P (Arduino UNO R3)",
      "Operating Voltage": "5V",
      "Projects": "400 (8 x 50)",
      "Total Pieces": "99",
      "BOM Lines": "71",
      "Simulator": "ArduinoForge (web and desktop)"
    },
    "assemblySteps": [
      "Connect the Arduino UNO to your PC with the USB cable and install Arduino IDE 2.x (plus the CH340 driver for clone boards)",
      "Open a project in the ArduinoForge simulator (/simulator) or from the Projects page and study the wiring and sketch",
      "Build the same circuit on the breadboard using only the parts that project lists",
      "Upload the sketch and compare the result with the simulator"
    ],
    "manualUrl": "/projects",
    "datasheetUrl": "/downloads",
    "videoUrl": "https://www.youtube.com/@LetsGetEngagedin",
    "faqs": [
      {
        "question": "What is in the All-in-One kit?",
        "answer": "The common core once plus the level-specific parts of all 8 kits. The complete list is under Components."
      },
      {
        "question": "How is it priced?",
        "answer": "Common core once + all level-specific parts, plus 40 %. That is ₹7665, which is ₹5168 less than the eight separate kits (₹12833)."
      },
      {
        "question": "Can I build every project with it?",
        "answer": "Yes. All 400 projects use only parts from their own kit, and the All-in-One contains every kit's parts."
      },
      {
        "question": "Do I get the sketches?",
        "answer": "Yes. Every project page has its Arduino sketch, and the Downloads page has a ZIP per level."
      }
    ]
  }
];
