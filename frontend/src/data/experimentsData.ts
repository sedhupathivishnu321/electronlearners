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
  circuitDiagram?: string;
}

export const EXPERIMENTS_15: ExperimentData[] = [
  {
    num: 1,
    title: "LED BLINK",
    concept: "Digital Output Control",
    components: ["Arduino Uno Board", "1x Red LED (5mm)", "1x 220Ω Resistor", "Breadboard & Jumpers"],
    learning: ["pinMode() pin direction setup", "digitalWrite() HIGH / LOW states", "delay() millisecond pause"],
    code: `// Experiment 1: LED Blink
const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}`,
    explanation: "The setup() function initializes digital pin 13 as an OUTPUT pin. In loop(), digitalWrite(13, HIGH) applies 5V to light up the LED. After 1000ms, digitalWrite(13, LOW) turns off the voltage. This loop repeats infinitely.",
    working: "When digital pin 13 outputs HIGH (5V), current flows through the 220Ω resistor, through the LED anode to cathode, and into GND, making the LED illuminate. Setting pin 13 LOW stops current flow.",
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
  digitalWrite(RED, HIGH); digitalWrite(YELLOW, LOW); digitalWrite(GREEN, LOW);
  delay(5000);
  digitalWrite(RED, LOW); digitalWrite(YELLOW, HIGH);
  delay(2000);
  digitalWrite(YELLOW, LOW); digitalWrite(GREEN, HIGH);
  delay(5000);
}`,
    explanation: "Three digital pins (12, 11, 10) drive Red, Yellow, and Green LEDs. By turning one pin HIGH and others LOW in a timed sequence using delay(), we simulate a realistic traffic light cycle.",
    working: "The program cycles through 3 states: Red ON (5000ms), Yellow ON (2000ms), and Green ON (5000ms).",
    result: "The LEDs illuminate sequentially in a Red -> Yellow -> Green traffic control cycle.",
    tip: "You can change the delay values at the top to customize traffic light intervals!",
    circuitDiagram: `[ Pin 12 ] -> [ 220Ω ] -> [ Red LED ] -> [ GND ]\n[ Pin 11 ] -> [ 220Ω ] -> [ Yellow LED ] -> [ GND ]\n[ Pin 10 ] -> [ 220Ω ] -> [ Green LED ] -> [ GND ]`
  },
  {
    num: 3,
    title: "PUSH BUTTON LED CONTROL",
    concept: "Digital Input Sensing",
    components: ["Arduino Uno Board", "1x Push Button Switch", "1x LED", "1x 10kΩ Pull-down Resistor", "1x 220Ω Resistor"],
    learning: ["digitalRead() input state", "INPUT pin mode configuration", "Hardware switch debouncing"],
    code: `// Experiment 3: Push Button LED Control
const int BTN_PIN = 2, LED_PIN = 13;

void setup() {
  pinMode(BTN_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int buttonState = digitalRead(BTN_PIN);
  if (buttonState == HIGH) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}`,
    explanation: "digitalRead(2) checks whether 5V (HIGH) or 0V (LOW) is present on pin 2. Pressing the button connects 5V to pin 2, causing digitalRead to return HIGH and lighting the LED.",
    working: "A 10kΩ pull-down resistor pulls Pin 2 to GND (LOW) when the button is open. Pressing the button connects 5V directly to Pin 2 (HIGH), activating the LED.",
    result: "The LED lights up immediately whenever the tactile push button is held down.",
    tip: "Without a pull-down resistor, an open input pin floats randomly. Always use pull-down or INPUT_PULLUP!",
    circuitDiagram: `[ 5V ] ---> [ Push Button ] ---> [ Pin 2 ] ---> [ 10kΩ Resistor ] ---> [ GND ]\n[ Pin 13 ] ---> [ 220Ω Resistor ] ---> [ LED ] ---> [ GND ]`
  },
  {
    num: 4,
    title: "TOGGLE LED SWITCH",
    concept: "Memory State & Edge Detection",
    components: ["Arduino Uno Board", "1x Push Button Switch", "1x LED", "1x 10kΩ Resistor", "1x 220Ω Resistor"],
    learning: ["State variables & memory", "Edge detection (Low to High transition)", "Software debouncing"],
    code: `// Experiment 4: Toggle LED Switch
const int BTN_PIN = 2, LED_PIN = 13;
int ledState = LOW, lastBtnState = LOW;

void setup() {
  pinMode(BTN_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int currentBtnState = digitalRead(BTN_PIN);
  if (currentBtnState == HIGH && lastBtnState == LOW) {
    ledState = !ledState;
    digitalWrite(LED_PIN, ledState);
    delay(50);
  }
  lastBtnState = currentBtnState;
}`,
    explanation: "Detects a rising edge (button transition from LOW to HIGH). When a new press occurs, it flips ledState using logical NOT (!ledState).",
    working: "First press flips ledState to HIGH (LED stays ON). Second press flips ledState to LOW (LED turns OFF).",
    result: "Pressing the button once toggles the LED ON. Pressing it again toggles the LED OFF.",
    tip: "The 50ms delay eliminates mechanical button contact bounce noise.",
    circuitDiagram: `[ 5V ] -> [ Push Button ] -> [ Pin 2 ] -> [ 10kΩ ] -> [ GND ]\n[ Pin 13 ] -> [ 220Ω ] -> [ LED ] -> [ GND ]`
  },
  {
    num: 5,
    title: "ELECTRONIC DICE",
    concept: "Random Number Generator & Arrays",
    components: ["Arduino Uno Board", "6x LEDs", "6x 220Ω Resistors", "1x Push Button Switch", "1x 10kΩ Resistor"],
    learning: ["random() & randomSeed() functions", "C++ Arrays for pin management", "Electronic game logic"],
    code: `// Experiment 5: Electronic Dice
const int leds[6] = {2, 3, 4, 5, 6, 7};
const int BTN_PIN = 8;

void setup() {
  for (int i = 0; i < 6; i++) pinMode(leds[i], OUTPUT);
  pinMode(BTN_PIN, INPUT);
  randomSeed(analogRead(A0));
}

void loop() {
  if (digitalRead(BTN_PIN) == HIGH) {
    int diceRoll = random(1, 7);
    for (int i = 0; i < 6; i++) digitalWrite(leds[i], LOW);
    for (int i = 0; i < diceRoll; i++) digitalWrite(leds[i], HIGH);
    delay(1000);
  }
}`,
    explanation: "Uses floating analog noise on pin A0 to seed pseudo-randomness. When pressed, random(1, 7) picks a dice number and lights up that count of LEDs.",
    working: "Generates a random integer 1 to 6 and turns on that exact number of LEDs on the breadboard.",
    result: "Each button press displays a random dice outcome from 1 to 6.",
    tip: "Unconnected analog pins like A0 pick up atmospheric noise, ideal for random seeds!",
    circuitDiagram: `[ Pin 2..7 ] -> [ 220Ω ] -> [ 6x LEDs ] -> [ GND ]\n[ Pin 8 ] -> [ Push Button ] -> [ 5V ] & [ 10kΩ to GND ]`
  },
  {
    num: 6,
    title: "LED BRIGHTNESS CONTROLLER",
    concept: "Pulse Width Modulation (PWM) & ADC",
    components: ["Arduino Uno Board", "1x LED", "1x 10kΩ Potentiometer", "1x 220Ω Resistor"],
    learning: ["analogRead() 10-bit ADC (0 to 1023)", "analogWrite() 8-bit PWM (0 to 255)", "map() value scaling"],
    code: `// Experiment 6: LED Brightness Controller
const int POT_PIN = A0, LED_PIN = 9;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int potValue = analogRead(POT_PIN);
  int brightness = map(potValue, 0, 1023, 0, 255);
  analogWrite(LED_PIN, brightness);
}`,
    explanation: "analogRead(A0) reads potentiometer voltage (0 to 1023). map() scales it to 0-255 for analogWrite() on PWM pin 9.",
    working: "Varying potentiometer position changes PWM duty cycle on Pin 9, modulating average voltage delivered to the LED.",
    result: "Rotating the potentiometer knob smoothly adjusts LED brightness.",
    tip: "PWM pins on Arduino UNO are marked with a tilde (~): Pins 3, 5, 6, 9, 10, 11.",
    circuitDiagram: `[ Potentiometer Wiper ] -> [ Pin A0 ] | [ 5V / GND ]\n[ Pin 9 PWM ] -> [ 220Ω ] -> [ LED ] -> [ GND ]`
  },
  {
    num: 7,
    title: "RGB MOOD LAMP",
    concept: "RGB Color Mixing & PWM Channels",
    components: ["Arduino Uno Board", "1x Common Cathode RGB LED", "3x 220Ω Resistors", "3x Potentiometers"],
    learning: ["Multi-channel PWM control", "Additive RGB color theory", "Interfacing tri-color LEDs"],
    code: `// Experiment 7: RGB Mood Lamp
const int R = 9, G = 10, B = 11;
const int POT_R = A0, POT_G = A1, POT_B = A2;

void setup() {
  pinMode(R, OUTPUT); pinMode(G, OUTPUT); pinMode(B, OUTPUT);
}

void loop() {
  analogWrite(R, map(analogRead(POT_R), 0, 1023, 0, 255));
  analogWrite(G, map(analogRead(POT_G), 0, 1023, 0, 255));
  analogWrite(B, map(analogRead(POT_B), 0, 1023, 0, 255));
}`,
    explanation: "Independent PWM control of Red (Pin 9), Green (Pin 10), and Blue (Pin 11) pins produces millions of custom RGB color combinations.",
    working: "Potentiometers A0, A1, A2 continuously adjust Red, Green, and Blue intensity channels.",
    result: "Turning the 3 potentiometer knobs mixes custom colors on the RGB LED.",
    tip: "Ensure your RGB LED common pin is connected to GND for Common Cathode type!",
    circuitDiagram: `[ Pins 9, 10, 11 PWM ] -> [ 220Ω x3 ] -> [ RGB Red, Green, Blue ]\n[ Common Pin ] -> [ GND ]`
  },
  {
    num: 8,
    title: "LIGHT ACTIVATED LAMP",
    concept: "Automatic Night Lighting & Sensor Thresholds",
    components: ["Arduino Uno Board", "1x LDR Photocell", "1x 10kΩ Resistor", "1x LED", "1x 220Ω Resistor"],
    learning: ["LDR photocell characteristics", "Analog voltage divider calculation", "Software threshold decision making"],
    code: `// Experiment 8: Light Activated Lamp
const int LDR_PIN = A0, LED_PIN = 13, THRESHOLD = 400;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int lightLevel = analogRead(LDR_PIN);
  if (lightLevel < THRESHOLD) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
  delay(200);
}`,
    explanation: "In low light, LDR resistance surges, causing voltage at pin A0 to drop below THRESHOLD, turning the lamp ON automatically.",
    working: "A voltage divider circuit measures light levels. Falling light levels trigger the IF logic to activate the LED.",
    result: "Covering the LDR sensor turns ON the LED lamp. Exposing it to light turns OFF the lamp.",
    tip: "Open Serial Monitor (9600 baud) to view real-time LDR readings and adjust your THRESHOLD!",
    circuitDiagram: `[ 5V ] -> [ LDR Photocell ] -> [ Pin A0 ] -> [ 10kΩ ] -> [ GND ]\n[ Pin 13 ] -> [ 220Ω ] -> [ LED ] -> [ GND ]`
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
}

void loop() {
  int raw = analogRead(LDR_PIN);
  float volts = raw * (5.0 / 1023.0);
  float percent = map(raw, 0, 1023, 0, 100);
  
  Serial.print("Raw ADC: "); Serial.print(raw);
  Serial.print(" | Volts: "); Serial.print(volts);
  Serial.print("V | Light: "); Serial.print(percent); Serial.println("%");
  delay(500);
}`,
    explanation: "Converts raw 10-bit ADC integer (0-1023) into actual voltage and light intensity percentage.",
    working: "Calculates voltage = raw * (5.0 / 1023.0) every 500ms and logs data over USB Serial.",
    result: "Live light measurements update continuously on the Arduino Serial Monitor.",
    tip: "Use Serial Plotter (Ctrl+Shift+L) in Arduino IDE to graph ambient light in real time!",
    circuitDiagram: `[ 5V ] -> [ LDR Photocell ] -> [ Pin A0 ] -> [ 10kΩ ] -> [ GND ]\n[ USB ] -> [ Computer Serial Monitor ]`
  },
  {
    num: 10,
    title: "INTRUDER ALARM",
    concept: "Light-Beam Security & Audio Alarm",
    components: ["Arduino Uno Board", "1x LDR Photocell", "1x 10kΩ Resistor", "1x Piezo Buzzer", "1x Red LED"],
    learning: ["Light beam break detection", "tone() frequency generation", "Security system latch logic"],
    code: `// Experiment 10: Intruder Alarm
const int LDR_PIN = A0, BUZZER = 8, LED = 13, THRESHOLD = 300;

void setup() {
  pinMode(BUZZER, OUTPUT); pinMode(LED, OUTPUT);
}

void loop() {
  if (analogRead(LDR_PIN) < THRESHOLD) {
    digitalWrite(LED, HIGH);
    tone(BUZZER, 1000);
  } else {
    digitalWrite(LED, LOW);
    noTone(BUZZER);
  }
  delay(100);
}`,
    explanation: "A continuous light beam hits the LDR. When an intruder interrupts the beam, A0 voltage drops, sounding the buzzer and lighting the alarm LED.",
    working: "Dropping below THRESHOLD triggers tone(8, 1000) siren and Red LED warning pin.",
    result: "Blocking the light sensor immediately trips the alarm sound and red warning light.",
    tip: "Point a small laser diode at the LDR to create a long-range tripwire across a room!",
    circuitDiagram: `[ 5V ] -> [ LDR Photocell ] -> [ Pin A0 ] -> [ 10kΩ ] -> [ GND ]\n[ Pin 8 ] -> [ Buzzer ] -> [ GND ] | [ Pin 13 ] -> [ 220Ω ] -> [ LED ] -> [ GND ]`
  },
  {
    num: 11,
    title: "DOORBELL SYSTEM",
    concept: "Input Triggered Audio Tones",
    components: ["Arduino Uno Board", "1x Push Button Switch", "1x 10kΩ Resistor", "1x Piezo Buzzer"],
    learning: ["tone() frequency and duration parameters", "noTone() silencer", "Chime melody timing"],
    code: `// Experiment 11: Doorbell System
const int BTN = 2, BUZZER = 8;

void setup() {
  pinMode(BTN, INPUT); pinMode(BUZZER, OUTPUT);
}

void loop() {
  if (digitalRead(BTN) == HIGH) {
    tone(BUZZER, 659, 300); delay(350);
    tone(BUZZER, 523, 500); delay(600);
    noTone(BUZZER);
  }
}`,
    explanation: "Outputs audio frequencies via tone(pin, Hz, duration) to play a classic two-tone Ding-Dong doorbell chime.",
    working: "Pressing the button triggers Pin 2 HIGH, playing 659Hz (E5 'Ding') followed by 523Hz (C5 'Dong').",
    result: "Pressing the button plays a pleasant two-tone 'Ding-Dong' doorbell sound.",
    tip: "The second parameter in tone() is Hertz frequency (e.g. 262Hz for Middle C)!",
    circuitDiagram: `[ 5V ] -> [ Push Button ] -> [ Pin 2 ] -> [ 10kΩ ] -> [ GND ]\n[ Pin 8 ] -> [ Piezo Buzzer ] -> [ GND ]`
  },
  {
    num: 12,
    title: "MUSICAL PIANO",
    concept: "Digital Music & Multi-Input Mapping",
    components: ["Arduino Uno Board", "5x Push Buttons", "5x 10kΩ Resistors", "1x Piezo Buzzer"],
    learning: ["Musical note Hz frequencies", "Parallel digital input scanning", "Array index mapping"],
    code: `// Experiment 12: Musical Piano
const int btns[5] = {2, 3, 4, 5, 6};
const int notes[5] = {262, 294, 330, 349, 392}; // C4, D4, E4, F4, G4
const int BUZZER = 8;

void setup() {
  for (int i = 0; i < 5; i++) pinMode(btns[i], INPUT);
  pinMode(BUZZER, OUTPUT);
}

void loop() {
  bool pressed = false;
  for (int i = 0; i < 5; i++) {
    if (digitalRead(btns[i]) == HIGH) {
      tone(BUZZER, notes[i]); pressed = true; break;
    }
  }
  if (!pressed) noTone(BUZZER);
}`,
    explanation: "Five push buttons map to an array of musical pitch frequencies: C4 (262Hz), D4 (294Hz), E4 (330Hz), F4 (349Hz), G4 (392Hz).",
    working: "Loops through button inputs and plays matching note frequency when a key is pressed.",
    result: "Pressing different buttons plays distinct musical notes like a mini piano keyboard.",
    tip: "Add a 6th button with frequency 440Hz (A4 note) to play simple songs!",
    circuitDiagram: `[ Pins 2..6 ] -> [ 5x Push Buttons to 5V & 10kΩ to GND ]\n[ Pin 8 ] -> [ Piezo Buzzer ] -> [ GND ]`
  },
  {
    num: 13,
    title: "REACTION TIME GAME",
    concept: "Human Response Measurement & millis()",
    components: ["Arduino Uno Board", "1x LED", "1x Push Button", "1x Piezo Buzzer", "Serial Monitor"],
    learning: ["millis() microsecond timer counter", "Randomized delay intervals", "Human reflex benchmarking"],
    code: `// Experiment 13: Reaction Time Game
const int LED = 13, BTN = 2, BUZZER = 8;

void setup() {
  pinMode(LED, OUTPUT); pinMode(BTN, INPUT); pinMode(BUZZER, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.println("Get Ready...");
  delay(random(2000, 6000));
  digitalWrite(LED, HIGH);
  unsigned long start = millis();
  while (digitalRead(BTN) == LOW);
  unsigned long reaction = millis() - start;
  digitalWrite(LED, LOW); tone(BUZZER, 1000, 150);
  Serial.print("Reaction Time: "); Serial.print(reaction); Serial.println(" ms");
  delay(4000);
}`,
    explanation: "Uses millis() time stamps to calculate exact elapsed time between LED light-up and button press.",
    working: "Waits a random delay, flashes LED ON, and computes reaction time in milliseconds when pressed.",
    result: "Your exact human reaction speed (e.g. 235ms) displays on the Serial Monitor.",
    tip: "Average human visual reaction time is 200ms - 250ms!",
    circuitDiagram: `[ Pin 13 ] -> [ 220Ω ] -> [ LED ] -> [ GND ]\n[ Pin 2 ] -> [ Push Button ] -> [ 5V & 10kΩ to GND ]\n[ Pin 8 ] -> [ Buzzer ] -> [ GND ]`
  },
  {
    num: 14,
    title: "PASSWORD LOCK SIMULATION",
    concept: "Embedded Security Sequence Matching",
    components: ["Arduino Uno Board", "4x Push Buttons", "1x Green LED, 1x Red LED", "1x Piezo Buzzer"],
    learning: ["C++ Array sequence comparison", "Password entry state machine", "Security access control logic"],
    code: `// Experiment 14: Password Lock Simulation
const int secret[4] = {1, 3, 2, 4};
int userEntry[4], stepIndex = 0;
const int GREEN = 10, RED = 11, BUZZER = 8;
const int keys[4] = {2, 3, 4, 5};

void setup() {
  pinMode(GREEN, OUTPUT); pinMode(RED, OUTPUT); pinMode(BUZZER, OUTPUT);
  for (int i = 0; i < 4; i++) pinMode(keys[i], INPUT);
}

void loop() {
  for (int i = 0; i < 4; i++) {
    if (digitalRead(keys[i]) == HIGH) {
      userEntry[stepIndex++] = i + 1;
      tone(BUZZER, 800, 50); delay(300);
      if (stepIndex == 4) { verify(); stepIndex = 0; }
    }
  }
}

void verify() {
  bool match = true;
  for (int i = 0; i < 4; i++) if (userEntry[i] != secret[i]) match = false;
  if (match) {
    digitalWrite(GREEN, HIGH); tone(BUZZER, 1200, 500); delay(2000); digitalWrite(GREEN, LOW);
  } else {
    digitalWrite(RED, HIGH); tone(BUZZER, 300, 800); delay(2000); digitalWrite(RED, LOW);
  }
}`,
    explanation: "Records button press sequence and compares userEntry[] array with predefined secret[4] passcode.",
    working: "Entering 1-3-2-4 triggers Green LED & success tone. Incorrect keys trigger Red LED & alarm tone.",
    result: "Correct button sequence unlocks green access. Wrong sequence triggers red alarm.",
    tip: "You can change secret[4] in code to set any custom 4-button password!",
    circuitDiagram: `[ Pins 2,3,4,5 ] -> [ 4x Push Buttons ]\n[ Pin 10 ] -> [ Green LED ] | [ Pin 11 ] -> [ Red LED ] | [ Pin 8 ] -> [ Buzzer ]`
  },
  {
    num: 15,
    title: "MINI QUIZ GAME",
    concept: "Interactive Embedded Application & FSM",
    components: ["Arduino Uno Board", "4x Answer Push Buttons", "1x Green LED, 1x Red LED", "1x Piezo Buzzer", "Serial Monitor"],
    learning: ["Finite State Machine (FSM)", "Interactive Serial prompt UI", "Button-based answer checking & score tracking"],
    code: `// Experiment 15: Mini Quiz Game
const int BTN_A = 2, BTN_B = 3, BTN_C = 4, BTN_D = 5;
const int GREEN = 10, RED = 11, BUZZER = 8;
int score = 0;

void setup() {
  Serial.begin(9600);
  pinMode(GREEN, OUTPUT); pinMode(RED, OUTPUT); pinMode(BUZZER, OUTPUT);
  pinMode(BTN_A, INPUT); pinMode(BTN_B, INPUT); pinMode(BTN_C, INPUT); pinMode(BTN_D, INPUT);
  delay(1000);
  runQuiz();
}

void loop() {}

void runQuiz() {
  Serial.println("\\nQ1: Which function configures pin direction?");
  Serial.println("A) digitalWrite()  B) pinMode()  C) delay()  D) analogRead()");
  int ans = waitForButton();
  if (ans == 2) { score++; digitalWrite(GREEN, HIGH); tone(BUZZER, 1000, 300); }
  else { digitalWrite(RED, HIGH); tone(BUZZER, 300, 500); }
  delay(1500); digitalWrite(GREEN, LOW); digitalWrite(RED, LOW);
  Serial.print("Score: "); Serial.println(score);
}

int waitForButton() {
  while(true) {
    if (digitalRead(BTN_A) == HIGH) { delay(250); return 1; }
    if (digitalRead(BTN_B) == HIGH) { delay(250); return 2; }
    if (digitalRead(BTN_C) == HIGH) { delay(250); return 3; }
    if (digitalRead(BTN_D) == HIGH) { delay(250); return 4; }
  }
}`,
    explanation: "Combines Serial Monitor prompts with hardware button inputs A, B, C, D to check answers and update score.",
    working: "Pressing the correct answer button (Button B) lights Green LED with a cheerful tone. Wrong buttons light Red LED.",
    result: "Interactive STEM quiz arcade machine with hardware LED & audio feedback.",
    tip: "Add more questions inside runQuiz() to build a 10-question classroom arcade quiz!",
    circuitDiagram: `[ Pins 2,3,4,5 ] -> [ Buttons A, B, C, D ]\n[ Pin 10 ] -> [ Green LED ] | [ Pin 11 ] -> [ Red LED ] | [ Pin 8 ] -> [ Buzzer ]`
  }
];
