import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Cpu, Download, Printer, Copy, Check, Sparkles, BookOpen, Wrench, Award, Lightbulb, Edit3 } from 'lucide-react';

export interface ExperimentData {
  num: number;
  title: string;
  concept: string;
  components: string[];
  learning: string[];
  code: string;
  explanation: string;
  working: string;
  result: string;
  tip: string;
  circuitDiagram: string;
}

export const EXPERIMENTS_15: ExperimentData[] = [
  {
    num: 1,
    title: "LED BLINK",
    concept: "Digital Output Control",
    components: ["Arduino Uno Board", "1x Red LED (5mm)", "1x 220Ω Resistor", "Breadboard & Jumpers"],
    learning: ["pinMode() pin direction setup", "digitalWrite() HIGH / LOW states", "delay() millisecond pause"],
    code: `// Experiment 1: LED Blink
const int LED_PIN = 13; // Built-in LED pin

void setup() {
  pinMode(LED_PIN, OUTPUT); // Set pin 13 as digital output
}

void loop() {
  digitalWrite(LED_PIN, HIGH); // Turn LED ON (5V)
  delay(1000);                  // Wait 1 second (1000ms)
  digitalWrite(LED_PIN, LOW);  // Turn LED OFF (0V)
  delay(1000);                  // Wait 1 second
}`,
    explanation: "The setup() function initializes digital pin 13 as an OUTPUT pin. In loop(), digitalWrite(13, HIGH) applies 5V to light up the LED. After 1000ms, digitalWrite(13, LOW) turns off the voltage. This loop repeats infinitely.",
    working: "When digital pin 13 outputs HIGH (5V), current flows through the 220Ω current-limiting resistor, through the LED anode to cathode, and into GND, making the LED illuminate. Setting pin 13 LOW stops current flow.",
    result: "The LED blinks ON and OFF repeatedly at 1-second intervals.",
    tip: "Always connect a 220Ω resistor in series with an LED to prevent excessive current from damaging the LED or Arduino GPIO pin!",
    circuitDiagram: `[ Arduino Pin 13 ] ---> [ 220Ω Resistor ] ---> [ LED Anode (+) | LED Cathode (-) ] ---> [ Arduino GND ]`
  },
  {
    num: 2,
    title: "TRAFFIC LIGHT CONTROLLER",
    concept: "Sequential LED State Timing",
    components: ["Arduino Uno Board", "1x Red LED, 1x Yellow LED, 1x Green LED", "3x 220Ω Resistors", "Breadboard & Jumpers"],
    learning: ["State sequencing logic", "Multi-pin control", "Adjustable timing parameters"],
    code: `// Experiment 2: Traffic Light Controller
const int RED = 12, YELLOW = 11, GREEN = 10;

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN, OUTPUT);
}

void loop() {
  // RED Light (Stop - 5 Seconds)
  digitalWrite(RED, HIGH);
  digitalWrite(YELLOW, LOW);
  digitalWrite(GREEN, LOW);
  delay(5000);

  // YELLOW Light (Ready - 2 Seconds)
  digitalWrite(RED, LOW);
  digitalWrite(YELLOW, HIGH);
  delay(2000);

  // GREEN Light (Go - 5 Seconds)
  digitalWrite(YELLOW, LOW);
  digitalWrite(GREEN, HIGH);
  delay(5000);
}`,
    explanation: "Three digital pins (12, 11, 10) drive the Red, Yellow, and Green LEDs respectively. By turning one pin HIGH and others LOW in a timed sequence using delay(), we simulate a realistic traffic intersection light cycle.",
    working: "The program cycles through 3 distinct states: Red LED stays ON for 5000ms, then turns OFF while Yellow turns ON for 2000ms, followed by Green ON for 5000ms before looping back to Red.",
    result: "The LEDs illuminate sequentially in a Red -> Yellow -> Green -> Red traffic control cycle.",
    tip: "You can change the delay values at the top to customize traffic light intervals for rush-hour or night modes!",
    circuitDiagram: `[ Pin 12 ] -> [ 220Ω ] -> [ Red LED ] -> [ GND ]
[ Pin 11 ] -> [ 220Ω ] -> [ Yellow LED ] -> [ GND ]
[ Pin 10 ] -> [ 220Ω ] -> [ Green LED ] -> [ GND ]`
  },
  {
    num: 3,
    title: "PUSH BUTTON LED CONTROL",
    concept: "Digital Input Sensing",
    components: ["Arduino Uno Board", "1x Push Button Switch", "1x LED", "1x 10kΩ Pull-down Resistor", "1x 220Ω Resistor"],
    learning: ["digitalRead() input state", "INPUT pin mode configuration", "Hardware switch debouncing"],
    code: `// Experiment 3: Push Button LED Control
const int BTN_PIN = 2; // Input Pin
const int LED_PIN = 13; // Output Pin

void setup() {
  pinMode(BTN_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int buttonState = digitalRead(BTN_PIN);
  if (buttonState == HIGH) {
    digitalWrite(LED_PIN, HIGH); // Turn LED ON while pressed
  } else {
    digitalWrite(LED_PIN, LOW);  // Turn LED OFF when released
  }
}`,
    explanation: "digitalRead(2) checks whether 5V (HIGH) or 0V (LOW) is present on pin 2. When the button is pressed, 5V is connected to pin 2, causing digitalRead to return HIGH and lighting the LED.",
    working: "A 10kΩ pull-down resistor pulls Pin 2 to GND (LOW) when the button is open. Pressing the button connects 5V directly to Pin 2 (HIGH), triggering the IF condition to activate the LED.",
    result: "The LED lights up immediately whenever the tactile push button is held down.",
    tip: "Without a pull-down resistor, an open input pin 'floats' randomly between 0V and 5V due to static noise. Always use pull-down or INPUT_PULLUP!",
    circuitDiagram: `[ 5V ] ---> [ Push Button ] ---> [ Pin 2 ] ---> [ 10kΩ Resistor ] ---> [ GND ]
[ Pin 13 ] ---> [ 220Ω Resistor ] ---> [ LED ] ---> [ GND ]`
  },
  {
    num: 4,
    title: "TOGGLE LED SWITCH",
    concept: "Memory State & Edge Detection",
    components: ["Arduino Uno Board", "1x Push Button Switch", "1x LED", "1x 10kΩ Resistor", "1x 220Ω Resistor"],
    learning: ["State variables & memory", "Edge detection (Low to High transition)", "Software debouncing"],
    code: `// Experiment 4: Toggle LED Switch
const int BTN_PIN = 2, LED_PIN = 13;
int ledState = LOW;
int lastBtnState = LOW;

void setup() {
  pinMode(BTN_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int currentBtnState = digitalRead(BTN_PIN);
  
  // Detect Rising Edge (Button transition from LOW to HIGH)
  if (currentBtnState == HIGH && lastBtnState == LOW) {
    ledState = !ledState; // Toggle state (ON -> OFF or OFF -> ON)
    digitalWrite(LED_PIN, ledState);
    delay(50); // Software debouncing pause
  }
  lastBtnState = currentBtnState;
}`,
    explanation: "Instead of keeping the LED ON only while holding the button, this code remembers the previous state. When it detects a NEW press event (rising edge), it flips the ledState variable using the logical NOT operator (!ledState).",
    working: "First press flips ledState from LOW to HIGH (LED stays ON after releasing button). Second press flips ledState from HIGH to LOW (LED turns OFF).",
    result: "Pressing the button once toggles the LED ON. Pressing it again toggles the LED OFF.",
    tip: "The 50ms delay eliminates mechanical button bounce noise where the metallic contacts chatter rapidly upon press.",
    circuitDiagram: `[ 5V ] -> [ Push Button ] -> [ Pin 2 ] -> [ 10kΩ ] -> [ GND ]
[ Pin 13 ] -> [ 220Ω ] -> [ LED ] -> [ GND ]`
  },
  {
    num: 5,
    title: "ELECTRONIC DICE",
    concept: "Random Number Generator & Arrays",
    components: ["Arduino Uno Board", "6x LEDs", "6x 220Ω Resistors", "1x Push Button Switch", "1x 10kΩ Resistor"],
    learning: ["random() & randomSeed() functions", "C++ Arrays for pin management", "Electronic game logic"],
    code: `// Experiment 5: Electronic Dice (1 to 6)
const int leds[6] = {2, 3, 4, 5, 6, 7};
const int BTN_PIN = 8;

void setup() {
  for (int i = 0; i < 6; i++) {
    pinMode(leds[i], OUTPUT);
  }
  pinMode(BTN_PIN, INPUT);
  randomSeed(analogRead(A0)); // Seed random generator with noise on unconnected A0 pin
}

void loop() {
  if (digitalRead(BTN_PIN) == HIGH) {
    int diceRoll = random(1, 7); // Generates number 1, 2, 3, 4, 5, or 6
    
    // Clear all LEDs
    for (int i = 0; i < 6; i++) digitalWrite(leds[i], LOW);
    
    // Light up LEDs corresponding to dice roll
    for (int i = 0; i < diceRoll; i++) {
      digitalWrite(leds[i], HIGH);
    }
    delay(1000); // Display result for 1 sec
  }
}`,
    explanation: "A loop registers pins 2 to 7 in an array. randomSeed(analogRead(A0)) uses floating analog noise on pin A0 to ensure true pseudo-randomness. When the button is pressed, random(1, 7) picks a dice number and lights up that count of LEDs.",
    working: "Pressing the button generates a random integer between 1 and 6. The code turns on exactly that number of LEDs (e.g., rolling a 4 turns on LEDs 1, 2, 3, and 4).",
    result: "Each button press displays a random dice outcome from 1 to 6 on the 6-LED bar.",
    tip: "Unconnected analog pins like A0 pick up electromagnetic atmospheric noise, making them ideal seed inputs for random generator functions!",
    circuitDiagram: `[ Pin 2..7 ] -> [ 220Ω ] -> [ 6x LEDs ] -> [ GND ]
[ Pin 8 ] -> [ Push Button ] -> [ 5V ] & [ 10kΩ to GND ]`
  },
  {
    num: 6,
    title: "LED BRIGHTNESS CONTROLLER",
    concept: "Pulse Width Modulation (PWM) & ADC",
    components: ["Arduino Uno Board", "1x LED", "1x 10kΩ Potentiometer", "1x 220Ω Resistor"],
    learning: ["analogRead() 10-bit ADC (0 to 1023)", "analogWrite() 8-bit PWM (0 to 255)", "map() value scaling"],
    code: `// Experiment 6: LED Brightness Controller
const int POT_PIN = A0; // Potentiometer connected to ADC pin A0
const int LED_PIN = 9;  // PWM Pin 9

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int potValue = analogRead(POT_PIN);          // Read 0 to 1023
  int brightness = map(potValue, 0, 1023, 0, 255); // Map to 0 to 255 PWM
  analogWrite(LED_PIN, brightness);            // Set PWM duty cycle
}`,
    explanation: "analogRead(A0) converts the potentiometer's variable voltage (0V to 5V) into a 10-bit digital number (0 to 1023). map() scales this down to 0-255, which analogWrite() uses on PWM pin 9 to control average LED voltage.",
    working: "Turning the potentiometer knob varies the voltage on A0. PWM pin 9 pulses 5V ON and OFF rapidly (490Hz). Changing the ratio of ON time vs OFF time (duty cycle) changes perceived LED brightness.",
    result: "Rotating the potentiometer knob smoothly adjusts the LED brightness from completely dark to full intensity.",
    tip: "PWM pins on Arduino UNO are marked with a tilde symbol (~). Pins 3, 5, 6, 9, 10, and 11 support PWM analogWrite()!",
    circuitDiagram: `[ Potentiometer Left ] -> [ 5V ] | [ Middle wiper ] -> [ Pin A0 ] | [ Right ] -> [ GND ]
[ Pin 9 PWM ] -> [ 220Ω ] -> [ LED ] -> [ GND ]`
  },
  {
    num: 7,
    title: "RGB MOOD LAMP",
    concept: "RGB Color Mixing & PWM Channels",
    components: ["Arduino Uno Board", "1x Common Cathode RGB LED", "3x 220Ω Resistors", "3x 10kΩ Potentiometers"],
    learning: ["Multi-channel PWM control", "Additive RGB color theory", "Interfacing tri-color LEDs"],
    code: `// Experiment 7: RGB Mood Lamp
const int RED_PIN = 9, GREEN_PIN = 10, BLUE_PIN = 11;
const int POT_R = A0, POT_G = A1, POT_B = A2;

void setup() {
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
}

void loop() {
  int rVal = map(analogRead(POT_R), 0, 1023, 0, 255);
  int gVal = map(analogRead(POT_G), 0, 1023, 0, 255);
  int bVal = map(analogRead(POT_B), 0, 1023, 0, 255);
  
  analogWrite(RED_PIN, rVal);
  analogWrite(GREEN_PIN, gVal);
  analogWrite(BLUE_PIN, bVal);
}`,
    explanation: "An RGB LED combines Red, Green, and Blue diodes inside one package with a common cathode GND pin. Three potentiometers connected to A0, A1, and A2 allow independent PWM control over each color channel.",
    working: "Mixing different PWM intensity levels of Red (Pin 9), Green (Pin 10), and Blue (Pin 11) creates over 16 million custom color shades (e.g., Red+Green = Yellow, Red+Blue = Purple).",
    result: "Turning the 3 potentiometer knobs mixes custom colors on the single RGB LED.",
    tip: "Ensure your RGB LED is Common Cathode (longest pin connects to GND) or Common Anode (longest pin connects to 5V)!",
    circuitDiagram: `[ Pin 9 PWM ] -> [ 220Ω ] -> [ Red Anode ]
[ Pin 10 PWM ] -> [ 220Ω ] -> [ Green Anode ]
[ Pin 11 PWM ] -> [ 220Ω ] -> [ Blue Anode ]
[ Common Pin ] -> [ GND ]`
  },
  {
    num: 8,
    title: "LIGHT ACTIVATED LAMP",
    concept: "Automatic Night Lighting & Sensor Thresholds",
    components: ["Arduino Uno Board", "1x Light Dependent Resistor (LDR)", "1x 10kΩ Resistor", "1x LED", "1x 220Ω Resistor"],
    learning: ["LDR photocell characteristics", "Analog voltage divider calculation", "Software threshold decision making"],
    code: `// Experiment 8: Light Activated Lamp
const int LDR_PIN = A0;
const int LED_PIN = 13;
const int THRESHOLD = 400; // Calibrated ambient light threshold

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int lightLevel = analogRead(LDR_PIN);
  Serial.print("LDR Value: ");
  Serial.println(lightLevel);
  
  if (lightLevel < THRESHOLD) {
    digitalWrite(LED_PIN, HIGH); // Darkness detected -> Turn Lamp ON
  } else {
    digitalWrite(LED_PIN, LOW);  // Bright room -> Turn Lamp OFF
  }
  delay(200);
}`,
    explanation: "The LDR's resistance changes with light: high resistance in dark (~1MΩ) and low resistance in light (~1kΩ). In a voltage divider circuit with a 10kΩ resistor, analogRead(A0) drops as ambient light decreases.",
    working: "When light level drops below THRESHOLD (400), the if statement executes digitalWrite(13, HIGH), automatically turning on the lamp in low light.",
    result: "Covering the LDR sensor with your hand turns ON the LED lamp. Exposing it to light turns OFF the lamp.",
    tip: "Open Serial Monitor (9600 baud) to view real-time LDR readings and fine-tune your THRESHOLD constant for your room!",
    circuitDiagram: `[ 5V ] -> [ LDR Photocell ] -> [ Pin A0 ] -> [ 10kΩ Resistor ] -> [ GND ]
[ Pin 13 ] -> [ 220Ω ] -> [ LED ] -> [ GND ]`
  },
  {
    num: 9,
    title: "DIGITAL LIGHT METER",
    concept: "Sensor Measurement & Data Calibration",
    components: ["Arduino Uno Board", "1x LDR Photocell", "1x 10kΩ Resistor", "Serial Monitor Interface"],
    learning: ["Analog-to-Digital voltage conversion", "Serial.print() data formatting", "Sensor calibration curves"],
    code: `// Experiment 9: Digital Light Meter
const int LDR_PIN = A0;

void setup() {
  Serial.begin(9600);
  Serial.println("=================================");
  Serial.println("   ELECTRONLEARNERS LIGHT METER  ");
  Serial.println("=================================");
}

void loop() {
  int rawADC = analogRead(LDR_PIN);
  float voltage = rawADC * (5.0 / 1023.0); // Convert ADC integer to Volts
  float lightPercent = map(rawADC, 0, 1023, 0, 100);
  
  Serial.print("ADC Raw: "); Serial.print(rawADC);
  Serial.print(" | Voltage: "); Serial.print(voltage, 2); Serial.print("V");
  Serial.print(" | Light Level: "); Serial.print(lightPercent); Serial.println("%");
  
  delay(500);
}`,
    explanation: "This project transforms your Arduino into a light intensity meter. It samples raw 10-bit ADC data from the LDR voltage divider, computes sensor output voltage, and maps it to a percentage 0% (pitch black) to 100% (bright light).",
    working: "Every 500ms, the sketch calculates voltage = rawADC * (5.0 / 1023.0) and prints formatted light level metrics over USB Serial to your computer screen.",
    result: "Live light intensity measurements and voltage numbers update continuously in the Arduino Serial Monitor window.",
    tip: "Use the Serial Plotter tool (Ctrl+Shift+L) in Arduino IDE 2.x to visualize light level changes as a live real-time graph!",
    circuitDiagram: `[ 5V ] -> [ LDR Photocell ] -> [ Pin A0 ] -> [ 10kΩ Resistor ] -> [ GND ]
[ Arduino USB Cable ] -> [ Computer Serial Monitor ]`
  },
  {
    num: 10,
    title: "INTRUDER ALARM",
    concept: "Light-Beam Security & Audio Alarm",
    components: ["Arduino Uno Board", "1x LDR Photocell", "1x 10kΩ Resistor", "1x Piezo Buzzer", "1x Red Status LED"],
    learning: ["Light beam break detection", "tone() frequency generation", "Security system latch logic"],
    code: `// Experiment 10: Intruder Alarm
const int LDR_PIN = A0;
const int BUZZER_PIN = 8;
const int ALARM_LED = 13;
const int BEAM_THRESHOLD = 300;

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(ALARM_LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int lightVal = analogRead(LDR_PIN);
  
  if (lightVal < BEAM_THRESHOLD) {
    // Laser / Light beam shadow detected -> SOUND ALARM!
    digitalWrite(ALARM_LED, HIGH);
    tone(BUZZER_PIN, 1000); // Play 1000Hz alarm frequency tone
  } else {
    digitalWrite(ALARM_LED, LOW);
    noTone(BUZZER_PIN);    // Silence alarm
  }
  delay(100);
}`,
    explanation: "This circuit creates a tripwire light security system. A continuous light beam shines onto the LDR. When an intruder passes through and blocks the light beam, LDR resistance surges, dropping A0 voltage.",
    working: "When A0 drops below BEAM_THRESHOLD (300), the system triggers the alarm: Pin 13 lights the red warning LED while Pin 8 generates an audible 1kHz siren tone via tone(8, 1000).",
    result: "Blocking the light sensor immediately trips the intruder alarm, sounding the buzzer and lighting the red LED.",
    tip: "You can point a small laser diode at the LDR to create a long-range invisible security tripwire across a doorway!",
    circuitDiagram: `[ 5V ] -> [ LDR Photocell ] -> [ Pin A0 ] -> [ 10kΩ Resistor ] -> [ GND ]
[ Pin 8 ] -> [ Piezo Buzzer (+) ] | [ Buzzer (-) ] -> [ GND ]
[ Pin 13 ] -> [ 220Ω ] -> [ Red LED ] -> [ GND ]`
  },
  {
    num: 11,
    title: "DOORBELL SYSTEM",
    concept: "Input Triggered Audio Tones",
    components: ["Arduino Uno Board", "1x Push Button Switch", "1x 10kΩ Resistor", "1x Piezo Buzzer"],
    learning: ["tone() frequency and duration parameters", "noTone() silencer", "Chime melody timing"],
    code: `// Experiment 11: Doorbell System
const int BTN_PIN = 2;
const int BUZZER_PIN = 8;

void setup() {
  pinMode(BTN_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  if (digitalRead(BTN_PIN) == HIGH) {
    // Play classic 2-Tone Ding-Dong Doorbell Chime
    tone(BUZZER_PIN, 659, 300); // Tone E5 (659Hz) for 300ms
    delay(350);
    tone(BUZZER_PIN, 523, 500); // Tone C5 (523Hz) for 500ms
    delay(600);
    noTone(BUZZER_PIN);
  }
}`,
    explanation: "The Piezo buzzer contains a piezoelectric crystal that flexes when driven by audio frequencies. tone(pin, frequency, duration) outputs a square wave at specified Hertz (Hz) to play musical notes.",
    working: "Pressing the doorbell push button triggers Pin 2 HIGH. The code executes a two-tone chime sequence: 659Hz (E5 'Ding') followed by 523Hz (C5 'Dong').",
    result: "Pressing the button plays a pleasant two-tone 'Ding-Dong' doorbell sound through the buzzer.",
    tip: "The second parameter in tone() is Hertz frequency (e.g. 262Hz for Middle C, 440Hz for A4 concert pitch)!",
    circuitDiagram: `[ 5V ] -> [ Push Button ] -> [ Pin 2 ] -> [ 10kΩ ] -> [ GND ]
[ Pin 8 ] -> [ Piezo Buzzer (+) ] | [ Buzzer (-) ] -> [ GND ]`
  },
  {
    num: 12,
    title: "MUSICAL PIANO",
    concept: "Digital Music & Multi-Input Mapping",
    components: ["Arduino Uno Board", "5x Push Buttons", "5x 10kΩ Resistors", "1x Piezo Buzzer", "Breadboard"],
    learning: ["Musical note Hz frequencies", "Parallel digital input scanning", "Array index mapping"],
    code: `// Experiment 12: 5-Key Musical Piano
const int btns[5] = {2, 3, 4, 5, 6};
const int notes[5] = {262, 294, 330, 349, 392}; // C4, D4, E4, F4, G4 Hz
const int BUZZER_PIN = 8;

void setup() {
  for (int i = 0; i < 5; i++) {
    pinMode(btns[i], INPUT);
  }
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  bool anyButtonPressed = false;
  
  for (int i = 0; i < 5; i++) {
    if (digitalRead(btns[i]) == HIGH) {
      tone(BUZZER_PIN, notes[i]); // Play corresponding musical note
      anyButtonPressed = true;
      break;
    }
  }
  
  if (!anyButtonPressed) {
    noTone(BUZZER_PIN); // Stop sound when no key is pressed
  }
}`,
    explanation: "Five push buttons connected to pins 2 through 6 act as mini piano keys. An array stores the fundamental musical note frequencies: C4 (262Hz), D4 (294Hz), E4 (330Hz), F4 (349Hz), and G4 (392Hz).",
    working: "A loop continuously scans all 5 button inputs. As soon as a pressed key is detected, tone() plays its matching note frequency. If no buttons are pressed, noTone() silences the speaker.",
    result: "Pressing different buttons plays distinct musical notes (Do, Re, Mi, Fa, Sol) like a synthesizer keyboard.",
    tip: "Add a 6th button with frequency 440Hz (A4 note) to play simple tunes like 'Twinkle Twinkle Little Star'!",
    circuitDiagram: `[ Pin 2..6 ] -> [ 5x Buttons to 5V ] & [ 10kΩ to GND ]
[ Pin 8 ] -> [ Piezo Buzzer (+) ] -> [ GND ]`
  },
  {
    num: 13,
    title: "REACTION TIME GAME",
    concept: "Human Response Measurement & millis()",
    components: ["Arduino Uno Board", "1x LED", "1x Push Button", "1x Piezo Buzzer", "Serial Monitor"],
    learning: ["millis() microsecond timer counter", "Randomized delay intervals", "Human reflex benchmarking"],
    code: `// Experiment 13: Reaction Time Game
const int LED_PIN = 13, BTN_PIN = 2, BUZZER_PIN = 8;

void setup() {
  pinMode(LED_PIN, OUTPUT); pinMode(BTN_PIN, INPUT); pinMode(BUZZER_PIN, OUTPUT);
  Serial.begin(9600);
  randomSeed(analogRead(A0));
}

void loop() {
  Serial.println("\\n--- Press button when LED turns ON! ---");
  delay(random(2000, 6000)); // Random 2-6 sec delay
  
  digitalWrite(LED_PIN, HIGH);
  unsigned long startTime = millis(); // Record start time stamp
  
  while (digitalRead(BTN_PIN) == LOW) {
    // Wait for player to press button
  }
  
  unsigned long reactionTime = millis() - startTime; // Calculate elapsed ms
  digitalWrite(LED_PIN, LOW);
  tone(BUZZER_PIN, 1000, 150);
  
  Serial.print("GREAT REFLEXES! Reaction Time: ");
  Serial.print(reactionTime);
  Serial.println(" milliseconds.");
  delay(4000);
}`,
    explanation: "millis() returns the number of milliseconds elapsed since the Arduino board booted. By taking a timestamp when the LED turns ON and subtracting it from the timestamp when the button is pressed, we accurately measure reaction speed.",
    working: "The game waits a random delay between 2 and 6 seconds. Then the LED flashes ON. A while loop holds execution until the player presses the button, computing elapsed reaction time in milliseconds.",
    result: "Your exact human reaction time (e.g. 245ms) prints live on the Arduino Serial Monitor screen.",
    tip: "Average human visual reaction time is around 200ms - 250ms. Challenge your friends to beat your high score!",
    circuitDiagram: `[ Pin 13 ] -> [ 220Ω ] -> [ Red LED ] -> [ GND ]
[ Pin 2 ] -> [ Push Button ] -> [ 5V ] & [ 10kΩ to GND ]
[ Pin 8 ] -> [ Buzzer ] -> [ GND ]`
  },
  {
    num: 14,
    title: "PASSWORD LOCK SIMULATION",
    concept: "Embedded Security Sequence Matching",
    components: ["Arduino Uno Board", "4x Push Buttons", "1x Green LED, 1x Red LED", "1x Piezo Buzzer"],
    learning: ["C++ Array sequence comparison", "Password entry state machine", "Security access control logic"],
    code: `// Experiment 14: Password Lock Simulation
const int secret[4] = {1, 3, 2, 4}; // Passcode combination: Key 1, Key 3, Key 2, Key 4
int userEntry[4];
int stepIndex = 0;

const int GREEN_LED = 10, RED_LED = 11, BUZZER_PIN = 8;
const int keys[4] = {2, 3, 4, 5}; // Key 1=Pin2, Key 2=Pin3, Key 3=Pin4, Key 4=Pin5

void setup() {
  pinMode(GREEN_LED, OUTPUT); pinMode(RED_LED, OUTPUT); pinMode(BUZZER_PIN, OUTPUT);
  for (int i = 0; i < 4; i++) pinMode(keys[i], INPUT);
  Serial.begin(9600);
}

void loop() {
  for (int i = 0; i < 4; i++) {
    if (digitalRead(keys[i]) == HIGH) {
      userEntry[stepIndex] = i + 1;
      tone(BUZZER_PIN, 800, 50);
      stepIndex++;
      delay(300);
      
      if (stepIndex == 4) {
        verifyPassword();
        stepIndex = 0;
      }
    }
  }
}

void verifyPassword() {
  bool correct = true;
  for (int i = 0; i < 4; i++) {
    if (userEntry[i] != secret[i]) correct = false;
  }
  
  if (correct) {
    digitalWrite(GREEN_LED, HIGH); tone(BUZZER_PIN, 1200, 500); // ACCESS GRANTED
    delay(2000); digitalWrite(GREEN_LED, LOW);
  } else {
    digitalWrite(RED_LED, HIGH); tone(BUZZER_PIN, 300, 800); // ACCESS DENIED
    delay(2000); digitalWrite(RED_LED, LOW);
  }
}`,
    explanation: "Four buttons act as passcode keys 1, 2, 3, 4. As keys are pressed, their values are recorded in userEntry[]. Once 4 keys are entered, verifyPassword() loops through the array to check against secret[].",
    working: "If the 4-digit sequence matches secret[] (1-3-2-4), Green LED lights up and a high tone plays (Access Granted). If any key is wrong, Red LED lights up and a low error buzzer sounds (Access Denied).",
    result: "Entering correct button sequence unlocks green light. Wrong code triggers red alarm.",
    tip: "You can change secret[4] in the code to set your own custom 4-button security passcode!",
    circuitDiagram: `[ Pins 2,3,4,5 ] -> [ 4x Push Buttons ]
[ Pin 10 ] -> [ Green LED ] | [ Pin 11 ] -> [ Red LED ]
[ Pin 8 ] -> [ Piezo Buzzer ]`
  },
  {
    num: 15,
    title: "MINI QUIZ GAME",
    concept: "Interactive Embedded Application & FSM",
    components: ["Arduino Uno Board", "4x Answer Push Buttons", "1x Green LED, 1x Red LED", "1x Piezo Buzzer", "Serial Monitor"],
    learning: ["Finite State Machine (FSM)", "Interactive Serial prompt UI", "Button-based answer checking & score tracking"],
    code: `// Experiment 15: Mini Quiz Game
const int BTN_A = 2, BTN_B = 3, BTN_C = 4, BTN_D = 5;
const int GREEN_LED = 10, RED_LED = 11, BUZZER_PIN = 8;
int score = 0;

void setup() {
  Serial.begin(9600);
  pinMode(GREEN_LED, OUTPUT); pinMode(RED_LED, OUTPUT); pinMode(BUZZER_PIN, OUTPUT);
  pinMode(BTN_A, INPUT); pinMode(BTN_B, INPUT); pinMode(BTN_C, INPUT); pinMode(BTN_D, INPUT);
  
  Serial.println("\\n=================================");
  Serial.println("  WELCOME TO ARDUINO STEM QUIZ!  ");
  Serial.println("=================================");
  delay(1000);
  runQuiz();
}

void loop() {}

void runQuiz() {
  // Question 1
  Serial.println("\\nQ1: Which function configures pin direction?");
  Serial.println("A) digitalWrite()  B) pinMode()  C) delay()  D) analogRead()");
  int ans1 = waitForButton();
  if (ans1 == 2) { // B is correct
    correctAnswer();
  } else {
    wrongAnswer();
  }
  
  Serial.print("\\nFINAL SCORE: "); Serial.print(score); Serial.println(" / 1 Points!");
}

int waitForButton() {
  while(true) {
    if (digitalRead(BTN_A) == HIGH) { delay(250); return 1; }
    if (digitalRead(BTN_B) == HIGH) { delay(250); return 2; }
    if (digitalRead(BTN_C) == HIGH) { delay(250); return 3; }
    if (digitalRead(BTN_D) == HIGH) { delay(250); return 4; }
  }
}

void correctAnswer() {
  score++;
  digitalWrite(GREEN_LED, HIGH); tone(BUZZER_PIN, 1000, 300);
  Serial.println(">>> CORRECT! +1 Point");
  delay(1500); digitalWrite(GREEN_LED, LOW);
}

void wrongAnswer() {
  digitalWrite(RED_LED, HIGH); tone(BUZZER_PIN, 300, 500);
  Serial.println(">>> INCORRECT!");
  delay(1500); digitalWrite(RED_LED, LOW);
}`,
    explanation: "This capstone experiment combines digital inputs, outputs, serial communication, and state logic into an interactive quiz game machine. Questions display in Serial Monitor, while buttons A, B, C, D submit answers.",
    working: "Pressing the correct answer button (Button B for pinMode) lights Green LED with a cheerful tone and adds +1 score. Wrong buttons light Red LED with an error chime.",
    result: "Interactive embedded STEM quiz game with instant hardware LED/buzzer feedback and final score summary.",
    tip: "You can expand the runQuiz() function by adding more questions to create a full 10-question classroom quiz arcade!",
    circuitDiagram: `[ Pins 2,3,4,5 ] -> [ Buttons A, B, C, D ]
[ Pin 10 ] -> [ Green LED ] | [ Pin 11 ] -> [ Red LED ]
[ Pin 8 ] -> [ Buzzer ] | [ USB ] -> [ Serial Monitor ]`
  }
];

export default function ArduinoManualPage() {
  const [selectedExpNum, setSelectedExpNum] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const exp = EXPERIMENTS_15.find((e) => e.num === selectedExpNum) || EXPERIMENTS_15[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:p-0 print:m-0">
      
      {/* Top Action Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6 print:hidden">
        <div>
          <Link href="/products/arduino-starter-kit" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Arduino Starter Kit</span>
          </Link>
          <h1 className="text-3xl font-heading font-extrabold text-white">Arduino Starter Kit Manual (15 Circuits)</h1>
          <p className="text-slate-400 text-xs">Official step-by-step experiment laboratory manual for ElectronLearners STEM Kit.</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/manual-editor" className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow">
            <Edit3 className="w-4 h-4" /> Open Editable Studio
          </Link>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF Manual
          </button>
        </div>
      </div>

      {/* Experiment Selector Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none print:hidden">
        {EXPERIMENTS_15.map((item) => (
          <button
            key={item.num}
            onClick={() => setSelectedExpNum(item.num)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedExpNum === item.num
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Exp {item.num}: {item.title}
          </button>
        ))}
      </div>

      {/* EXPERIMENT TEMPLATE FRAME (MATCHING USER TEMPLATE IMAGE) */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 border-4 border-blue-600/50 shadow-2xl relative space-y-6 print:border-black print:text-black print:bg-white">
        
        {/* HEADER BAR: EXPERIMENT # + TITLE + ARDUINO BRAND LOGO */}
        <div className="grid grid-cols-12 gap-4 items-center border-b-2 border-blue-600/40 pb-6">
          <div className="col-span-3 sm:col-span-2">
            <div className="px-4 py-3 rounded-2xl bg-blue-600 text-white font-heading font-black text-center shadow-lg shadow-blue-600/30">
              <span className="block text-[10px] uppercase font-bold tracking-widest text-blue-200">EXPERIMENT</span>
              <span className="text-2xl font-extrabold">#{exp.num}</span>
            </div>
          </div>

          <div className="col-span-6 sm:col-span-8 text-center">
            <div className="p-4 rounded-2xl bg-slate-900 border-2 border-blue-500/40 shadow-inner">
              <h2 className="text-xl sm:text-2xl font-heading font-black tracking-wide text-red-500 uppercase">{exp.title}</h2>
            </div>
          </div>

          <div className="col-span-3 sm:col-span-2 flex justify-end">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="ElectronLearners Logo" className="h-10 w-auto object-contain" />
            </div>
          </div>
        </div>

        {/* MAIN BODY GRID: LEFT SIDE (CONCEPT, COMPONENTS, LEARNING) vs RIGHT SIDE (CODE, CIRCUIT DIAGRAM, EXPLANATION) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR (Concept, Components, Learning) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* CONCEPT BADGE & BOX */}
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow">
                <Lightbulb className="w-4 h-4" />
                <span>CONCEPT</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-semibold leading-relaxed">
                {exp.concept}
              </div>
            </div>

            {/* COMPONENTS BADGE & LIST */}
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                <Wrench className="w-4 h-4" />
                <span>COMPONENTS</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
                {exp.components.map((comp, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LEARNING BADGE & OUTCOMES */}
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                <BookOpen className="w-4 h-4" />
                <span>LEARNING</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
                {exp.learning.map((obj, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT MAIN PANEL (Circuit Diagram, Code Snippet, Explanation) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* CIRCUIT SCHEMATIC DIAGRAM BOX */}
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-cyan-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                <Cpu className="w-4 h-4" />
                <span>CIRCUIT DIAGRAM & SCHEMATIC WIRING</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center space-y-3">
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/circuits/exp${exp.num}.svg`}
                  alt={`Circuit Diagram Exp ${exp.num}`}
                  className="w-full max-w-2xl h-auto rounded-xl border border-cyan-500/30 shadow-lg object-contain"
                />
                <div className="w-full font-mono text-[11px] text-cyan-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <pre>{exp.circuitDiagram}</pre>
                </div>
              </div>
            </div>

            {/* CODE BLOCK */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                  <Sparkles className="w-4 h-4" />
                  <span>ARDUINO C++ CODE</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 print:hidden"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied Code!" : "Copy Code"}
                </button>
              </div>
              <div className="p-5 rounded-2xl bg-[#090D16] border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto max-h-80 leading-relaxed shadow-inner">
                <pre><code>{exp.code}</code></pre>
              </div>
            </div>

            {/* EXPLANATION */}
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                <span>EXPLANATION</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {exp.explanation}
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM FOOTER SECTION (WORKING, RESULT, ENGINEER'S TIP) */}
        <div className="border-t-2 border-blue-600/40 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* WORKING */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 text-[10px] font-extrabold uppercase">WORKING PRINCIPLE</span>
              <p className="text-xs text-slate-300 pt-1 leading-relaxed">{exp.working}</p>
            </div>

            {/* RESULT */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-400 text-[10px] font-extrabold uppercase">EXPECTED RESULT</span>
              <p className="text-xs text-slate-300 pt-1 leading-relaxed">{exp.result}</p>
            </div>
          </div>

          {/* ENGINEER'S TIP (YELLOW HIGHLIGHT BOX MATCHING TEMPLATE) */}
          <div className="lg:col-span-4 p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-200 space-y-1 flex flex-col justify-center">
            <div className="flex items-center space-x-2 font-bold text-xs text-amber-400 uppercase">
              <Lightbulb className="w-4 h-4 fill-current text-amber-400" />
              <span>ENGINEER'S TIP</span>
            </div>
            <p className="text-xs leading-relaxed text-amber-100">{exp.tip}</p>
          </div>

        </div>

      </div>

    </div>
  );
}
