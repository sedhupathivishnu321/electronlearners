import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Code, 
  Cpu, 
  Layers, 
  Settings, 
  Terminal, 
  List, 
  Plus, 
  Trash2, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Download, 
  Share2, 
  DollarSign,
  Wrench,
  ChevronRight,
  Info
} from 'lucide-react';

// --- Type Definitions ---
interface ComponentInstance {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pins: { [key: string]: { x: number; y: number; label: string; id: string } };
  state?: any;
}

interface WireConnection {
  id: string;
  fromCompId: string;
  fromPin: string;
  toCompId: string;
  toPin: string;
  color: string;
  points?: { x: number; y: number }[]; // For bend points
}

interface PresetProject {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  code: string;
  components: ComponentInstance[];
  wires: WireConnection[];
  ghostWires: Omit<WireConnection, 'id'>[]; // Target wiring to match
  guideSteps: string[];
}

// --- Component Pins Specifications ---
const COMPONENT_SPECS: { [key: string]: any } = {
  arduino_uno: {
    width: 240,
    height: 180,
    pins: {
      // Digital Pins
      'd0': { x: 230, y: 15, label: 'D0/RX', id: 'd0' },
      'd1': { x: 215, y: 15, label: 'D1/TX', id: 'd1' },
      'd2': { x: 200, y: 15, label: 'D2', id: 'd2' },
      'd3': { x: 185, y: 15, label: 'D3~', id: 'd3' },
      'd4': { x: 170, y: 15, label: 'D4', id: 'd4' },
      'd5': { x: 155, y: 15, label: 'D5~', id: 'd5' },
      'd6': { x: 140, y: 15, label: 'D6~', id: 'd6' },
      'd7': { x: 125, y: 15, label: 'D7', id: 'd7' },
      'd8': { x: 105, y: 15, label: 'D8', id: 'd8' },
      'd9': { x: 90, y: 15, label: 'D9~', id: 'd9' },
      'd10': { x: 75, y: 15, label: 'D10~', id: 'd10' },
      'd11': { x: 60, y: 15, label: 'D11~', id: 'd11' },
      'd12': { x: 45, y: 15, label: 'D12', id: 'd12' },
      'd13': { x: 30, y: 15, label: 'D13', id: 'd13' },
      'gnd1': { x: 15, y: 15, label: 'GND', id: 'gnd1' },
      'aref': { x: 5, y: 15, label: 'AREF', id: 'aref' },
      // Analog Pins
      'a0': { x: 160, y: 165, label: 'A0', id: 'a0' },
      'a1': { x: 175, y: 165, label: 'A1', id: 'a1' },
      'a2': { x: 190, y: 165, label: 'A2', id: 'a2' },
      'a3': { x: 205, y: 165, label: 'A3', id: 'a3' },
      'a4': { x: 220, y: 165, label: 'A4/SDA', id: 'a4' },
      'a5': { x: 235, y: 165, label: 'A5/SCL', id: 'a5' },
      // Power Pins
      'rst': { x: 120, y: 165, label: 'RESET', id: 'rst' },
      '3v3': { x: 105, y: 165, label: '3.3V', id: '3v3' },
      '5v': { x: 90, y: 165, label: '5V', id: '5v' },
      'gnd2': { x: 75, y: 165, label: 'GND', id: 'gnd2' },
      'gnd3': { x: 60, y: 165, label: 'GND', id: 'gnd3' },
      'vin': { x: 45, y: 165, label: 'VIN', id: 'vin' },
    }
  },
  breadboard: {
    width: 320,
    height: 100,
    pins: {
      // Power rails top
      'vcc_top_left': { x: 15, y: 10, label: '+', id: 'vcc_top_left' },
      'vcc_top_mid': { x: 160, y: 10, label: '+', id: 'vcc_top_mid' },
      'vcc_top_right': { x: 305, y: 10, label: '+', id: 'vcc_top_right' },
      'gnd_top_left': { x: 15, y: 22, label: '-', id: 'gnd_top_left' },
      'gnd_top_mid': { x: 160, y: 22, label: '-', id: 'gnd_top_mid' },
      'gnd_top_right': { x: 305, y: 22, label: '-', id: 'gnd_top_right' },
      // Power rails bottom
      'vcc_bot_left': { x: 15, y: 78, label: '+', id: 'vcc_bot_left' },
      'vcc_bot_mid': { x: 160, y: 78, label: '+', id: 'vcc_bot_mid' },
      'vcc_bot_right': { x: 305, y: 78, label: '+', id: 'vcc_bot_right' },
      'gnd_bot_left': { x: 15, y: 90, label: '-', id: 'gnd_bot_left' },
      'gnd_bot_mid': { x: 160, y: 90, label: '-', id: 'gnd_bot_mid' },
      'gnd_bot_right': { x: 305, y: 90, label: '-', id: 'gnd_bot_right' },
      // Column pins top rows (A,B,C,D,E) - Mocked by 10 columns for simplcity
      'c1_top': { x: 30, y: 35, label: '1A-E', id: 'c1_top' },
      'c2_top': { x: 60, y: 35, label: '2A-E', id: 'c2_top' },
      'c3_top': { x: 90, y: 35, label: '3A-E', id: 'c3_top' },
      'c4_top': { x: 120, y: 35, label: '4A-E', id: 'c4_top' },
      'c5_top': { x: 150, y: 35, label: '5A-E', id: 'c5_top' },
      'c6_top': { x: 180, y: 35, label: '6A-E', id: 'c6_top' },
      'c7_top': { x: 210, y: 35, label: '7A-E', id: 'c7_top' },
      'c8_top': { x: 240, y: 35, label: '8A-E', id: 'c8_top' },
      'c9_top': { x: 270, y: 35, label: '9A-E', id: 'c9_top' },
      'c10_top': { x: 300, y: 35, label: '10A-E', id: 'c10_top' },
      // Column pins bottom rows (F,G,H,I,J)
      'c1_bot': { x: 30, y: 65, label: '1F-J', id: 'c1_bot' },
      'c2_bot': { x: 60, y: 65, label: '2F-J', id: 'c2_bot' },
      'c3_bot': { x: 90, y: 65, label: '3F-J', id: 'c3_bot' },
      'c4_bot': { x: 120, y: 65, label: '4F-J', id: 'c4_bot' },
      'c5_bot': { x: 150, y: 65, label: '5F-J', id: 'c5_bot' },
      'c6_bot': { x: 180, y: 65, label: '6F-J', id: 'c6_bot' },
      'c7_bot': { x: 210, y: 65, label: '7F-J', id: 'c7_bot' },
      'c8_bot': { x: 240, y: 65, label: '8F-J', id: 'c8_bot' },
      'c9_bot': { x: 270, y: 65, label: '9F-J', id: 'c9_bot' },
      'c10_bot': { x: 300, y: 65, label: '10F-J', id: 'c10_bot' },
    }
  },
  led: {
    width: 60,
    height: 60,
    pins: {
      'anode': { x: 15, y: 50, label: 'Anode (+)', id: 'anode' },
      'cathode': { x: 45, y: 50, label: 'Cathode (-)', id: 'cathode' }
    }
  },
  resistor: {
    width: 80,
    height: 30,
    pins: {
      'pin1': { x: 5, y: 15, label: 'Pin 1', id: 'pin1' },
      'pin2': { x: 75, y: 15, label: 'Pin 2', id: 'pin2' }
    }
  },
  potentiometer: {
    width: 80,
    height: 80,
    pins: {
      'pin1': { x: 15, y: 70, label: 'GND', id: 'pin1' },
      'pin2': { x: 40, y: 70, label: 'Signal', id: 'pin2' },
      'pin3': { x: 65, y: 70, label: '5V', id: 'pin3' }
    }
  },
  ultrasonic: {
    width: 100,
    height: 70,
    pins: {
      'vcc': { x: 20, y: 60, label: 'VCC', id: 'vcc' },
      'trig': { x: 40, y: 60, label: 'TRIG', id: 'trig' },
      'echo': { x: 60, y: 60, label: 'ECHO', id: 'echo' },
      'gnd': { x: 80, y: 60, label: 'GND', id: 'gnd' }
    }
  },
  servo: {
    width: 100,
    height: 90,
    pins: {
      'gnd': { x: 20, y: 80, label: 'GND (Brown)', id: 'gnd' },
      'vcc': { x: 50, y: 80, label: '5V (Red)', id: 'vcc' },
      'pwm': { x: 80, y: 80, label: 'PWM (Orange)', id: 'pwm' }
    }
  },
  lcd_i2c: {
    width: 160,
    height: 90,
    pins: {
      'gnd': { x: 25, y: 80, label: 'GND', id: 'gnd' },
      'vcc': { x: 55, y: 80, label: 'VCC', id: 'vcc' },
      'sda': { x: 85, y: 80, label: 'SDA', id: 'sda' },
      'scl': { x: 115, y: 80, label: 'SCL', id: 'scl' }
    }
  }
};

const COMPONENT_PRICES: { [key: string]: { name: string; priceINR: number; priceUSD: number } } = {
  arduino_uno: { name: 'Arduino Uno R3 Compatible Board', priceINR: 450, priceUSD: 6.99 },
  breadboard: { name: 'Half-Size Breadboard (400 Tie Points)', priceINR: 80, priceUSD: 1.20 },
  led: { name: '5mm LED (Red/Green/Blue Bundle)', priceINR: 15, priceUSD: 0.25 },
  resistor: { name: '220 Ohm Carbon Film Resistor (1/4W)', priceINR: 5, priceUSD: 0.05 },
  potentiometer: { name: '10K Ohm Linear Potentiometer', priceINR: 35, priceUSD: 0.50 },
  ultrasonic: { name: 'HC-SR04 Ultrasonic Distance Sensor', priceINR: 90, priceUSD: 1.45 },
  servo: { name: 'SG90 Micro Servo Motor 9g', priceINR: 120, priceUSD: 1.80 },
  lcd_i2c: { name: '16x2 LCD Display with I2C Backpack', priceINR: 220, priceUSD: 3.20 },
  jumper_wire: { name: 'Male-to-Male Jumper Wires (40pcs Bundle)', priceINR: 60, priceUSD: 0.90 }
};

// --- Preset Projects Data ---
const PRESET_PROJECTS: PresetProject[] = [
  {
    id: 'blink',
    name: '1. LED Blink (Digital Output)',
    difficulty: 'Beginner',
    description: 'The Hello World of physical electronics. Connect a Red LED to Digital Pin 13 through a current-limiting resistor and write code to toggle it on and off every second.',
    code: `// Arduino LED Blink Demo
const int LED_PIN = 13;

void setup() {
  // Initialize digital pin 13 as an output
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("System Initialized. Starting Blink Loop...");
}

void loop() {
  Serial.println("LED status: HIGH");
  digitalWrite(LED_PIN, HIGH);   // Turn the LED on
  delay(1000);                  // Wait for 1 second
  
  Serial.println("LED status: LOW");
  digitalWrite(LED_PIN, LOW);    // Turn the LED off
  delay(1000);                  // Wait for 1 second
}`,
    components: [
      { id: 'uno1', type: 'arduino_uno', name: 'Arduino Uno', x: 40, y: 150, width: 240, height: 180, pins: COMPONENT_SPECS.arduino_uno.pins },
      { id: 'bb1', type: 'breadboard', name: 'Breadboard', x: 310, y: 190, width: 320, height: 100, pins: COMPONENT_SPECS.breadboard.pins },
      { id: 'res1', type: 'resistor', name: 'Resistor 220R', x: 380, y: 80, width: 80, height: 30, pins: COMPONENT_SPECS.resistor.pins },
      { id: 'led1', type: 'led', name: 'Red LED', x: 500, y: 70, width: 60, height: 60, pins: COMPONENT_SPECS.led.pins, state: { on: false, color: '#EF4444' } }
    ],
    wires: [
      { id: 'w1', fromCompId: 'uno1', fromPin: 'd13', toCompId: 'res1', toPin: 'pin1', color: '#3B82F6' },
      { id: 'w2', fromCompId: 'res1', fromPin: 'pin2', toCompId: 'led1', toPin: 'anode', color: '#10B981' },
      { id: 'w3', fromCompId: 'uno1', fromPin: 'gnd1', toCompId: 'led1', toPin: 'cathode', color: '#000000' }
    ],
    ghostWires: [
      { fromCompId: 'uno1', fromPin: 'd13', toCompId: 'res1', toPin: 'pin1', color: '#3B82F6' },
      { fromCompId: 'res1', fromPin: 'pin2', toCompId: 'led1', toPin: 'anode', color: '#10B981' },
      { fromCompId: 'uno1', fromPin: 'gnd1', toCompId: 'led1', toPin: 'cathode', color: '#000000' }
    ],
    guideSteps: [
      'Connect the blue wire from Arduino Digital Pin 13 to Resistor Pin 1.',
      'Connect the green wire from Resistor Pin 2 to the LED Anode (+, curved leg).',
      'Connect the black wire from Arduino GND pin to the LED Cathode (-, flat edge/shorter leg).',
      'Click the green "Run Simulation" button to compile code and start blinking.'
    ]
  },
  {
    id: 'dimmer',
    name: '2. Potentiometer LED Dimmer (Analog Input & PWM)',
    difficulty: 'Beginner',
    description: 'Read the analog voltage from a 10K Potentiometer on Analog Pin A0, mapping the 10-bit range (0-1023) to an 8-bit PWM value (0-255) to control a Blue LED brightness.',
    code: `// Potentiometer Analog Read & LED Dimmer
const int POT_PIN = A0;   // Potentiometer signal pin
const int LED_PIN = 9;    // PWM LED pin

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Dimmer ready. Turn the Potentiometer dial...");
}

void loop() {
  // Read analog value from potentiometer (0 to 1023)
  int potValue = analogRead(POT_PIN);
  
  // Map value to PWM range (0 to 255)
  int brightness = potValue / 4; 
  
  // Set LED brightness using PWM
  analogWrite(LED_PIN, brightness);
  
  // Log results
  Serial.print("POT Value: ");
  Serial.print(potValue);
  Serial.print(" -> LED PWM: ");
  Serial.println(brightness);
  
  delay(150); // Fast update rate
}`,
    components: [
      { id: 'uno1', type: 'arduino_uno', name: 'Arduino Uno', x: 40, y: 150, width: 240, height: 180, pins: COMPONENT_SPECS.arduino_uno.pins },
      { id: 'bb1', type: 'breadboard', name: 'Breadboard', x: 310, y: 190, width: 320, height: 100, pins: COMPONENT_SPECS.breadboard.pins },
      { id: 'pot1', type: 'potentiometer', name: 'Rotary Potentiometer', x: 340, y: 50, width: 80, height: 80, pins: COMPONENT_SPECS.potentiometer.pins, state: { value: 512 } },
      { id: 'res1', type: 'resistor', name: 'Resistor 220R', x: 460, y: 80, width: 80, height: 30, pins: COMPONENT_SPECS.resistor.pins },
      { id: 'led1', type: 'led', name: 'Blue LED', x: 570, y: 70, width: 60, height: 60, pins: COMPONENT_SPECS.led.pins, state: { on: false, color: '#3B82F6', intensity: 0.5 } }
    ],
    wires: [
      { id: 'w1', fromCompId: 'uno1', fromPin: '5v', toCompId: 'pot1', toPin: 'pin3', color: '#EF4444' },
      { id: 'w2', fromCompId: 'uno1', fromPin: 'gnd2', toCompId: 'pot1', toPin: 'pin1', color: '#000000' },
      { id: 'w3', fromCompId: 'uno1', fromPin: 'a0', toCompId: 'pot1', toPin: 'pin2', color: '#F59E0B' },
      { id: 'w4', fromCompId: 'uno1', fromPin: 'd9', toCompId: 'res1', toPin: 'pin1', color: '#10B981' },
      { id: 'w5', fromCompId: 'res1', fromPin: 'pin2', toCompId: 'led1', toPin: 'anode', color: '#3B82F6' },
      { id: 'w6', fromCompId: 'uno1', fromPin: 'gnd1', toCompId: 'led1', toPin: 'cathode', color: '#000000' }
    ],
    ghostWires: [
      { fromCompId: 'uno1', fromPin: '5v', toCompId: 'pot1', toPin: 'pin3', color: '#EF4444' },
      { fromCompId: 'uno1', fromPin: 'gnd2', toCompId: 'pot1', toPin: 'pin1', color: '#000000' },
      { fromCompId: 'uno1', fromPin: 'a0', toCompId: 'pot1', toPin: 'pin2', color: '#F59E0B' },
      { fromCompId: 'uno1', fromPin: 'd9', toCompId: 'res1', toPin: 'pin1', color: '#10B981' },
      { fromCompId: 'res1', fromPin: 'pin2', toCompId: 'led1', toPin: 'anode', color: '#3B82F6' },
      { fromCompId: 'uno1', fromPin: 'gnd1', toCompId: 'led1', toPin: 'cathode', color: '#000000' }
    ],
    guideSteps: [
      'Connect Potentiometer Pin 3 (right pin) to Arduino 5V (red wire).',
      'Connect Potentiometer Pin 1 (left pin) to Arduino GND (black wire).',
      'Connect Potentiometer Pin 2 (center signal) to Arduino Analog input A0 (yellow wire).',
      'Connect Arduino PWM digital pin 9 to Resistor Pin 1 (green wire).',
      'Connect Resistor Pin 2 to Blue LED Anode (+) (blue wire).',
      'Connect Blue LED Cathode (-) to Arduino GND (black wire).',
      'Run simulation, and click-drag the slider on the potentiometer dial to adjust the LED brightness!'
    ]
  },
  {
    id: 'radar',
    name: '3. Smart Radar (Ultrasonic Range & Servo)',
    difficulty: 'Intermediate',
    description: 'Build a safety barrier. Measure distance using the HC-SR04 Ultrasonic sensor. Adjust the angle of the SG90 Servo motor to reflect the measured proximity in real-time.',
    code: `// Smart Radar System
const int TRIG_PIN = 11;
const int ECHO_PIN = 12;
const int SERVO_PWM_PIN = 6;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(SERVO_PWM_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Radar System Operational. Scanning...");
}

void loop() {
  // Trigger sensor pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Read echo time in microseconds
  // Mocked distance from slider in simulation environment
  int distanceCm = readUltrasonic(TRIG_PIN, ECHO_PIN);
  
  // Map distance (2cm to 200cm) to servo angle (0 to 180)
  int servoAngle = map(distanceCm, 2, 200, 0, 180);
  servoAngle = constrain(servoAngle, 0, 180);
  
  // Write servo angle
  servoWrite(SERVO_PWM_PIN, servoAngle);
  
  // Logs
  Serial.print("Target Distance: ");
  Serial.print(distanceCm);
  Serial.print(" cm -> Radar Angle: ");
  Serial.print(servoAngle);
  Serial.println(" deg");
  
  delay(300);
}`,
    components: [
      { id: 'uno1', type: 'arduino_uno', name: 'Arduino Uno', x: 40, y: 150, width: 240, height: 180, pins: COMPONENT_SPECS.arduino_uno.pins },
      { id: 'bb1', type: 'breadboard', name: 'Breadboard', x: 310, y: 190, width: 320, height: 100, pins: COMPONENT_SPECS.breadboard.pins },
      { id: 'us1', type: 'ultrasonic', name: 'HC-SR04 Distance Sensor', x: 320, y: 50, width: 100, height: 70, pins: COMPONENT_SPECS.ultrasonic.pins, state: { distance: 100 } },
      { id: 'srv1', type: 'servo', name: 'SG90 Servo Motor', x: 490, y: 40, width: 100, height: 90, pins: COMPONENT_SPECS.servo.pins, state: { angle: 90 } }
    ],
    wires: [
      { id: 'w1', fromCompId: 'uno1', fromPin: '5v', toCompId: 'us1', toPin: 'vcc', color: '#EF4444' },
      { id: 'w2', fromCompId: 'uno1', fromPin: 'gnd2', toCompId: 'us1', toPin: 'gnd', color: '#000000' },
      { id: 'w3', fromCompId: 'uno1', fromPin: 'd11', toCompId: 'us1', toPin: 'trig', color: '#EC4899' },
      { id: 'w4', fromCompId: 'uno1', fromPin: 'd12', toCompId: 'us1', toPin: 'echo', color: '#8B5CF6' },
      { id: 'w5', fromCompId: 'uno1', fromPin: '5v', toCompId: 'srv1', toPin: 'vcc', color: '#EF4444' },
      { id: 'w6', fromCompId: 'uno1', fromPin: 'gnd3', toCompId: 'srv1', toPin: 'gnd', color: '#000000' },
      { id: 'w7', fromCompId: 'uno1', fromPin: 'd6', toCompId: 'srv1', toPin: 'pwm', color: '#F97316' }
    ],
    ghostWires: [
      { fromCompId: 'uno1', fromPin: '5v', toCompId: 'us1', toPin: 'vcc', color: '#EF4444' },
      { fromCompId: 'uno1', fromPin: 'gnd2', toCompId: 'us1', toPin: 'gnd', color: '#000000' },
      { fromCompId: 'uno1', fromPin: 'd11', toCompId: 'us1', toPin: 'trig', color: '#EC4899' },
      { fromCompId: 'uno1', fromPin: 'd12', toCompId: 'us1', toPin: 'echo', color: '#8B5CF6' },
      { fromCompId: 'uno1', fromPin: '5v', toCompId: 'srv1', toPin: 'vcc', color: '#EF4444' },
      { fromCompId: 'uno1', fromPin: 'gnd3', toCompId: 'srv1', toPin: 'gnd', color: '#000000' },
      { fromCompId: 'uno1', fromPin: 'd6', toCompId: 'srv1', toPin: 'pwm', color: '#F97316' }
    ],
    guideSteps: [
      'Wire VCC and GND pins for both the Ultrasonic sensor and Servo motor to the Arduino 5V (Red) and GND (Black) pins.',
      'Connect Arduino Digital Pin 11 to the Ultrasonic TRIG pin (pink wire).',
      'Connect Arduino Digital Pin 12 to the Ultrasonic ECHO pin (purple wire).',
      'Connect Arduino Digital Pin 6 to the Servo PWM signal pin (orange wire).',
      'Start the simulation. Drag the distance slider on the HC-SR04 sensor, and watch the SG90 servo arm sweep in response!'
    ]
  },
  {
    id: 'lcd',
    name: '4. I2C LCD Character Monitor',
    difficulty: 'Advanced',
    description: 'Display text dynamically. Interface a 16x2 LiquidCrystal LCD screen using the standard I2C protocol (A4 for SDA, A5 for SCL) to write telemetry data.',
    code: `// I2C 16x2 LCD Hello World
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2); 
int counter = 0;

void setup() {
  lcd.init();
  lcd.backlight();
  
  lcd.setCursor(0, 0);
  lcd.print("JR Learners");
  lcd.setCursor(0, 1);
  lcd.print("Platform Active");
  
  Serial.begin(9600);
  Serial.println("I2C LCD Initialized.");
  delay(2000);
}

void loop() {
  lcd.setCursor(0, 1);
  lcd.print("Scan Count: ");
  lcd.print(counter);
  
  Serial.print("LCD Print Count: ");
  Serial.println(counter);
  
  counter++;
  delay(1000);
}`,
    components: [
      { id: 'uno1', type: 'arduino_uno', name: 'Arduino Uno', x: 40, y: 150, width: 240, height: 180, pins: COMPONENT_SPECS.arduino_uno.pins },
      { id: 'bb1', type: 'breadboard', name: 'Breadboard', x: 310, y: 190, width: 320, height: 100, pins: COMPONENT_SPECS.breadboard.pins },
      { id: 'lcd1', type: 'lcd_i2c', name: 'I2C LCD 16x2', x: 380, y: 40, width: 160, height: 90, pins: COMPONENT_SPECS.lcd_i2c.pins, state: { line1: 'JR Learners', line2: 'Platform Active' } }
    ],
    wires: [
      { id: 'w1', fromCompId: 'uno1', fromPin: '5v', toCompId: 'lcd1', toPin: 'vcc', color: '#EF4444' },
      { id: 'w2', fromCompId: 'uno1', fromPin: 'gnd2', toCompId: 'lcd1', toPin: 'gnd', color: '#000000' },
      { id: 'w3', fromCompId: 'uno1', fromPin: 'a4', toCompId: 'lcd1', toPin: 'sda', color: '#06B6D4' },
      { id: 'w4', fromCompId: 'uno1', fromPin: 'a5', toCompId: 'lcd1', toPin: 'scl', color: '#F59E0B' }
    ],
    ghostWires: [
      { fromCompId: 'uno1', fromPin: '5v', toCompId: 'lcd1', toPin: 'vcc', color: '#EF4444' },
      { fromCompId: 'uno1', fromPin: 'gnd2', toCompId: 'lcd1', toPin: 'gnd', color: '#000000' },
      { fromCompId: 'uno1', fromPin: 'a4', toCompId: 'lcd1', toPin: 'sda', color: '#06B6D4' },
      { fromCompId: 'uno1', fromPin: 'a5', toCompId: 'lcd1', toPin: 'scl', color: '#F59E0B' }
    ],
    guideSteps: [
      'Connect LCD VCC pin to Arduino 5V (Red wire).',
      'Connect LCD GND pin to Arduino GND (Black wire).',
      'Connect LCD SDA pin to Arduino Analog pin A4 (I2C Data, cyan wire).',
      'Connect LCD SCL pin to Arduino Analog pin A5 (I2C Clock, yellow wire).',
      'Click Run Simulation. Observe the LCD display clearing and counting up every second!'
    ]
  }
];

export default function Simulator() {
  const [selectedProject, setSelectedProject] = useState<PresetProject>(PRESET_PROJECTS[0]);
  const [code, setCode] = useState<string>(PRESET_PROJECTS[0].code);
  const [components, setComponents] = useState<ComponentInstance[]>(JSON.parse(JSON.stringify(PRESET_PROJECTS[0].components)));
  const [wires, setWires] = useState<WireConnection[]>(JSON.parse(JSON.stringify(PRESET_PROJECTS[0].wires)));
  const [ghostMode, setGhostMode] = useState<boolean>(true);
  
  // Simulation Running State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [serialLogs, setSerialLogs] = useState<string[]>([]);
  const [serialInput, setSerialInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'code' | 'guide'>('code');
  const [terminalTab, setTerminalTab] = useState<'console' | 'serial'>('console');
  
  // Wiring interaction state
  const [selectedColor, setSelectedColor] = useState<string>('#3B82F6'); // Blue default
  const [wiringStart, setWiringStart] = useState<{ compId: string; pinId: string } | null>(null);
  const [draggedCompId, setDraggedCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Custom alerts/toasts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Canvas Refs
  const canvasRef = useRef<SVGSVGElement | null>(null);

  // Simulation execution loop interval ref
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const simCounterRef = useRef<number>(0);

  // Sync state when project changes
  useEffect(() => {
    setCode(selectedProject.code);
    setComponents(JSON.parse(JSON.stringify(selectedProject.components)));
    setWires(JSON.parse(JSON.stringify(selectedProject.wires)));
    stopSimulation();
    setConsoleLogs([`[SYSTEM] Loaded preset project: ${selectedProject.name}`]);
    setSerialLogs([]);
  }, [selectedProject]);

  // Show auto-dismiss toast
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Compile and run the mock interpreter
  const startSimulation = () => {
    if (isSimulating) return;

    setTerminalTab('console');
    setConsoleLogs(prev => [
      ...prev,
      `[INFO] Starting compiler verification...`,
      `[INFO] Checking libraries: Wire, LiquidCrystal_I2C, Servo...`,
      `[SUCCESS] 0 errors. Compilation complete.`,
      `[INFO] Board selected: Arduino Uno (ATmega328P)`,
      `[INFO] Program Size: ${Math.floor(1000 + Math.random() * 2000)} bytes (5% capacity)`,
      `[INFO] Uploading code to board via virtual serial port...`,
      `[SUCCESS] Flash complete. Running firmware...`,
      `=================== RUNNING ===================`
    ]);

    setIsSimulating(true);
    setSerialLogs([]);
    simCounterRef.current = 0;

    // Build wiring validity check
    const wiringStatus = validateWiring();
    if (wiringStatus.score < 100) {
      setConsoleLogs(prev => [
        ...prev,
        `[WARNING] Circuit wiring is not fully completed (${wiringStatus.score}% correct).`,
        `[WARNING] Output devices might not respond correctly due to wiring faults.`
      ]);
    }

    // Set simulator running interval loop
    simulationIntervalRef.current = setInterval(() => {
      simCounterRef.current += 1;
      
      // Update variables based on simulation loop
      setComponents(prevComps => {
        return prevComps.map(comp => {
          let updatedState = { ...comp.state };

          // 1. Blink Project logic
          if (selectedProject.id === 'blink') {
            const hasPower = checkConnection(wires, 'uno1', 'd13', 'res1', 'pin1') &&
                             checkConnection(wires, 'res1', 'pin2', 'led1', 'anode') &&
                             checkConnection(wires, 'uno1', 'gnd1', 'led1', 'cathode');
            
            if (hasPower) {
              const seconds = simCounterRef.current;
              const isLedOn = seconds % 2 === 0;
              updatedState.on = isLedOn;
              
              // Log to serial monitor
              if (simCounterRef.current % 1 === 0) {
                setSerialLogs(prev => [...prev, `[SERIAL 9600] LED status: ${isLedOn ? 'HIGH' : 'LOW'}`]);
              }
            } else {
              updatedState.on = false;
            }
          }

          // 2. Dimmer Project logic
          if (selectedProject.id === 'dimmer') {
            const hasPotPower = checkConnection(wires, 'uno1', '5v', 'pot1', 'pin3') &&
                                checkConnection(wires, 'uno1', 'gnd2', 'pot1', 'pin1');
            const hasPotVal = checkConnection(wires, 'uno1', 'a0', 'pot1', 'pin2');
            const hasLedVal = checkConnection(wires, 'uno1', 'd9', 'res1', 'pin1') &&
                              checkConnection(wires, 'res1', 'pin2', 'led1', 'anode') &&
                              checkConnection(wires, 'uno1', 'gnd1', 'led1', 'cathode');

            // Get current pot value
            const pot = prevComps.find(c => c.type === 'potentiometer');
            const potValue = pot?.state?.value ?? 512;

            if (comp.type === 'led') {
              if (hasPotPower && hasPotVal && hasLedVal) {
                updatedState.on = potValue > 10;
                updatedState.intensity = potValue / 1023;
              } else {
                updatedState.on = false;
              }
            }

            if (comp.type === 'arduino_uno' && simCounterRef.current % 3 === 0) {
              setSerialLogs(prev => [
                ...prev, 
                `[SERIAL 9600] POT Value: ${potValue} -> LED PWM: ${Math.floor(potValue / 4)}`
              ]);
            }
          }

          // 3. Radar Project logic
          if (selectedProject.id === 'radar') {
            const usSensor = prevComps.find(c => c.type === 'ultrasonic');
            const distance = usSensor?.state?.distance ?? 100;
            const hasVccGnd = checkConnection(wires, 'uno1', '5v', 'us1', 'vcc') && 
                              checkConnection(wires, 'uno1', 'gnd2', 'us1', 'gnd');
            const hasEchoTrig = checkConnection(wires, 'uno1', 'd11', 'us1', 'trig') && 
                                checkConnection(wires, 'uno1', 'd12', 'us1', 'echo');
            const hasServo = checkConnection(wires, 'uno1', '5v', 'srv1', 'vcc') && 
                             checkConnection(wires, 'uno1', 'gnd3', 'srv1', 'gnd') && 
                             checkConnection(wires, 'uno1', 'd6', 'srv1', 'pwm');

            if (comp.type === 'servo') {
              if (hasVccGnd && hasEchoTrig && hasServo) {
                // Map distance 2-200 to servo angle 0-180
                const targetAngle = Math.floor(((distance - 2) / (200 - 2)) * 180);
                updatedState.angle = Math.max(0, Math.min(180, targetAngle));
              } else {
                updatedState.angle = 90; // Default center on disconnect
              }
            }

            if (comp.type === 'arduino_uno' && simCounterRef.current % 4 === 0) {
              const targetAngle = Math.floor(((distance - 2) / (200 - 2)) * 180);
              const constrainedAngle = Math.max(0, Math.min(180, targetAngle));
              setSerialLogs(prev => [
                ...prev,
                `[SERIAL 9600] Target Distance: ${distance} cm -> Radar Angle: ${constrainedAngle} deg`
              ]);
            }
          }

          // 4. LCD Project logic
          if (selectedProject.id === 'lcd') {
            const hasPower = checkConnection(wires, 'uno1', '5v', 'lcd1', 'vcc') &&
                             checkConnection(wires, 'uno1', 'gnd2', 'lcd1', 'gnd');
            const hasI2C = checkConnection(wires, 'uno1', 'a4', 'lcd1', 'sda') &&
                           checkConnection(wires, 'uno1', 'a5', 'lcd1', 'scl');

            if (comp.type === 'lcd_i2c') {
              if (hasPower && hasI2C) {
                updatedState.line1 = 'JR Learners';
                updatedState.line2 = `Scan Count: ${simCounterRef.current}`;
              } else {
                updatedState.line1 = '';
                updatedState.line2 = '';
              }
            }

            if (comp.type === 'arduino_uno' && simCounterRef.current % 2 === 0) {
              setSerialLogs(prev => [...prev, `[SERIAL 9600] LCD Print Count: ${simCounterRef.current}`]);
            }
          }

          return { ...comp, state: updatedState };
        });
      });
    }, 1000);
  };

  const stopSimulation = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setIsSimulating(false);
    setConsoleLogs(prev => [...prev, `[INFO] Simulation stopped.`, `=================== STOPPED ===================`]);
    // Reset component visual states
    setComponents(prev => prev.map(comp => {
      let state = { ...comp.state };
      if (comp.type === 'led') state.on = false;
      if (comp.type === 'lcd_i2c') {
        state.line1 = 'JR Learners';
        state.line2 = 'Platform Active';
      }
      return { ...comp, state };
    }));
  };

  const resetCircuit = () => {
    stopSimulation();
    setComponents(JSON.parse(JSON.stringify(selectedProject.components)));
    setWires(JSON.parse(JSON.stringify(selectedProject.wires)));
    showToast('Circuit reset to preset positions.', 'info');
  };

  // Check if two specific pins are wired together (directly or through breadboard columns)
  const checkConnection = (currentWires: WireConnection[], comp1: string, pin1: string, comp2: string, pin2: string): boolean => {
    // 1. Direct wiring check
    const directWire = currentWires.find(w => 
      (w.fromCompId === comp1 && w.fromPin === pin1 && w.toCompId === comp2 && w.toPin === pin2) ||
      (w.fromCompId === comp2 && w.fromPin === pin2 && w.toCompId === comp1 && w.toPin === pin1)
    );
    if (directWire) return true;

    // 2. Breadboard column routing check
    const toBreadboard1 = currentWires.filter(w => 
      (w.fromCompId === comp1 && w.fromPin === pin1 && w.toCompId === 'bb1') ||
      (w.toCompId === comp1 && w.toPin === pin1 && w.fromCompId === 'bb1')
    );
    const toBreadboard2 = currentWires.filter(w => 
      (w.fromCompId === comp2 && w.fromPin === pin2 && w.toCompId === 'bb1') ||
      (w.toCompId === comp2 && w.toPin === pin2 && w.fromCompId === 'bb1')
    );

    if (toBreadboard1.length > 0 && toBreadboard2.length > 0) {
      for (const w1 of toBreadboard1) {
        const pinOnBB1 = w1.fromCompId === 'bb1' ? w1.fromPin : w1.toPin;
        for (const w2 of toBreadboard2) {
          const pinOnBB2 = w2.fromCompId === 'bb1' ? w2.fromPin : w2.toPin;
          
          if (pinOnBB1 === pinOnBB2) return true;
        }
      }
    }
    return false;
  };

  // Validate current wires against ghost wires
  const validateWiring = (): { score: number; missing: string[] } => {
    const targets = selectedProject.ghostWires;
    if (targets.length === 0) return { score: 100, missing: [] };

    let matches = 0;
    const missing: string[] = [];

    targets.forEach(target => {
      const isConnected = checkConnection(wires, target.fromCompId, target.fromPin, target.toCompId, target.toPin);
      if (isConnected) {
        matches++;
      } else {
        const compFrom = components.find(c => c.id === target.fromCompId)?.name || target.fromCompId;
        const compTo = components.find(c => c.id === target.toCompId)?.name || target.toCompId;
        missing.push(`${compFrom} (${target.fromPin}) ⟷ ${compTo} (${target.toPin})`);
      }
    });

    const score = Math.round((matches / targets.length) * 100);
    return { score, missing };
  };

  const wiringAccuracy = validateWiring();

  // --- SVG Drag and Drop Handlers ---
  const handleMouseDown = (e: React.MouseEvent, compId: string) => {
    if (wiringStart) return; // Don't drag while wiring
    e.preventDefault();
    
    const comp = components.find(c => c.id === compId);
    if (!comp) return;
    
    setDraggedCompId(compId);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      setDragOffset({
        x: mouseX - comp.x,
        y: mouseY - comp.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (draggedCompId) {
      setComponents(prev => prev.map(comp => {
        if (comp.id === draggedCompId) {
          const nextX = Math.max(0, Math.min(800 - comp.width, x - dragOffset.x));
          const nextY = Math.max(0, Math.min(500 - comp.height, y - dragOffset.y));
          return {
            ...comp,
            x: nextX,
            y: nextY
          };
        }
        return comp;
      }));
    }
  };

  const handleMouseUp = () => {
    setDraggedCompId(null);
  };

  // --- Wiring Draw Handlers ---
  const handlePinClick = (e: React.MouseEvent, compId: string, pinId: string) => {
    e.stopPropagation();

    if (!wiringStart) {
      setWiringStart({ compId, pinId });
      showToast('Click another pin to complete the wire.', 'info');
    } else {
      if (wiringStart.compId === compId) {
        showToast('Cannot connect pins on the same component.', 'error');
        setWiringStart(null);
        return;
      }

      const newWire: WireConnection = {
        id: `wire_${Date.now()}`,
        fromCompId: wiringStart.compId,
        fromPin: wiringStart.pinId,
        toCompId: compId,
        toPin: pinId,
        color: selectedColor
      };

      setWires(prev => [...prev, newWire]);
      setWiringStart(null);
      showToast('Wire connected successfully!', 'success');
    }
  };

  const deleteWire = (wireId: string) => {
    setWires(prev => prev.filter(w => w.id !== wireId));
    showToast('Wire deleted.', 'info');
  };

  // Add customized standalone component
  const addStandaloneComponent = (type: string) => {
    if (components.some(c => c.type === type)) {
      showToast(`Only one ${type.toUpperCase().replace('_', ' ')} allowed for this project configuration.`, 'error');
      return;
    }

    const spec = COMPONENT_SPECS[type];
    if (!spec) return;

    const newComp: ComponentInstance = {
      id: `${type}_${Date.now()}`,
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '),
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 100,
      width: spec.width,
      height: spec.height,
      pins: spec.pins,
      state: type === 'led' ? { on: false, color: '#EF4444' } : 
             type === 'potentiometer' ? { value: 512 } :
             type === 'servo' ? { angle: 90 } :
             type === 'ultrasonic' ? { distance: 100 } :
             type === 'lcd_i2c' ? { line1: '', line2: '' } : {}
    };

    setComponents(prev => [...prev, newComp]);
    showToast(`Added ${newComp.name} to workspace.`, 'success');
  };

  const deleteComponent = (compId: string) => {
    if (compId === 'uno1' || compId === 'bb1') {
      showToast('Cannot delete core microcontrollers or breadboards.', 'error');
      return;
    }
    setComponents(prev => prev.filter(c => c.id !== compId));
    setWires(prev => prev.filter(w => w.fromCompId !== compId && w.toCompId !== compId));
    showToast('Component and its associated wires removed.', 'info');
  };

  // Calculate bill of materials
  const getBOM = () => {
    const bomMap: { [key: string]: number } = {};
    components.forEach(comp => {
      bomMap[comp.type] = (bomMap[comp.type] || 0) + 1;
    });

    if (wires.length > 0) {
      bomMap['jumper_wire'] = wires.length;
    }

    return Object.keys(bomMap).map(type => {
      const spec = COMPONENT_PRICES[type] || { name: type, priceINR: 20, priceUSD: 0.30 };
      const qty = bomMap[type];
      return {
        type,
        name: spec.name,
        qty,
        totalINR: spec.priceINR * qty,
        totalUSD: spec.priceUSD * qty
      };
    });
  };

  const bomList = getBOM();
  const totalCostINR = bomList.reduce((acc, item) => acc + item.totalINR, 0);
  const totalCostUSD = bomList.reduce((acc, item) => acc + item.totalUSD, 0);

  // Helper to draw bezier path for wires
  const getWirePath = (wire: WireConnection) => {
    const c1 = components.find(c => c.id === wire.fromCompId);
    const c2 = components.find(c => c.id === wire.toCompId);

    if (!c1 || !c2) return '';

    const p1Spec = c1.pins[wire.fromPin];
    const p2Spec = c2.pins[wire.toPin];

    if (!p1Spec || !p2Spec) return '';

    const x1 = c1.x + p1Spec.x;
    const y1 = c1.y + p1Spec.y;
    const x2 = c2.x + p2Spec.x;
    const y2 = c2.y + p2Spec.y;

    const dx = Math.abs(x2 - x1) * 0.4;
    const dy = Math.abs(y2 - y1) * 0.4;

    return `M ${x1} ${y1} C ${x1 + dx} ${y1 + (y2 > y1 ? dy : -dy)} ${x2 - dx} ${y2 + (y2 > y1 ? -dy : dy)} ${x2} ${y2}`;
  };

  // Helper to draw live wire from started pin to mouse cursor
  const getLiveWirePath = () => {
    if (!wiringStart) return '';
    const comp = components.find(c => c.id === wiringStart.compId);
    if (!comp) return '';
    const pin = comp.pins[wiringStart.pinId];
    if (!pin) return '';

    const x1 = comp.x + pin.x;
    const y1 = comp.y + pin.y;
    const x2 = mousePos.x;
    const y2 = mousePos.y;

    const dx = Math.abs(x2 - x1) * 0.4;
    const dy = Math.abs(y2 - y1) * 0.4;

    return `M ${x1} ${y1} C ${x1 + dx} ${y1 + (y2 > y1 ? dy : -dy)} ${x2 - dx} ${y2 + (y2 > y1 ? -dy : dy)} ${x2} ${y2}`;
  };

  return (
    <div className="bg-[#0F172A] text-slate-100 min-h-screen pb-12">
      <Head>
        <title>⚡ JR Learners IDE & Circuit Simulator (ArduinoForge)</title>
        <meta name="description" content="Simulate Arduino, ESP32 and electronic circuits in real-time. Drag components, wire them on a breadboard, write C/C++ code, and verify circuits offline." />
      </Head>

      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-24 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'success' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' :
          toast.type === 'error' ? 'bg-rose-950/80 border-rose-500 text-rose-300' :
          'bg-blue-950/80 border-blue-500 text-blue-300'
        }`}>
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Simulator Interface Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumb & Welcome Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
              <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-blue-400">Interactive Simulator</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white flex items-center gap-2">
              ⚡ ArduinoForge <span className="text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Web Simulator v2.0</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Learn microcontrollers hands-on. Select a preset circuit, wire the components correctly with visual ghost guides, write code, and run simulation dynamically.
            </p>
          </div>

          {/* Project selector dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Active Project:</span>
            <select
              value={selectedProject.id}
              onChange={(e) => {
                const proj = PRESET_PROJECTS.find(p => p.id === e.target.value);
                if (proj) setSelectedProject(proj);
              }}
              className="bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-sm font-semibold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer w-full md:w-64"
            >
              {PRESET_PROJECTS.map(proj => (
                <option key={proj.id} value={proj.id}>
                  {proj.name} ({proj.difficulty})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project Context Summary Bar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 max-w-2xl">
            <div className="p-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl mt-0.5 shrink-0">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-0.5">{selectedProject.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{selectedProject.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span className="text-xs font-bold text-slate-300">Level: {selectedProject.difficulty}</span>
            </div>
            <div className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 ${
              wiringAccuracy.score === 100 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' : 'bg-slate-850 border-slate-800 text-slate-300'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${wiringAccuracy.score === 100 ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
              <span className="text-xs font-bold">Wiring: {wiringAccuracy.score}% Valid</span>
            </div>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel: IDE Editor, Guides & Console */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Tabs & Editor header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center bg-slate-950 px-4 border-b border-slate-850">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                      activeTab === 'code' 
                        ? 'border-blue-500 text-blue-400 bg-slate-900/60' 
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code className="w-4 h-4" /> Code Editor (sketch.ino)
                  </button>
                  <button
                    onClick={() => setActiveTab('guide')}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                      activeTab === 'guide' 
                        ? 'border-amber-500 text-amber-400 bg-slate-900/60' 
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Wrench className="w-4 h-4" /> Wiring Guide
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {isSimulating ? (
                    <button
                      onClick={stopSimulation}
                      className="px-3.5 py-1.5 bg-red-650 hover:bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-900/20 transition-all border border-red-500/20"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" /> Stop
                    </button>
                  ) : (
                    <button
                      onClick={startSimulation}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/30 transition-all border border-emerald-500/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Run
                    </button>
                  )}
                  <button
                    onClick={resetCircuit}
                    title="Reset Circuit"
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 border border-slate-850 rounded-lg transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tab Content 1: Code Editor */}
              {activeTab === 'code' ? (
                <div className="relative">
                  <div className="flex bg-slate-950 font-mono text-slate-600 text-xs py-4 pl-4 select-none border-r border-slate-850 float-left flex-col text-right w-12 leading-relaxed">
                    {code.split('\n').map((_, index) => (
                      <span key={index} className="pr-2">{index + 1}</span>
                    ))}
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isSimulating}
                    className="w-[calc(100%-3rem)] bg-slate-900/80 p-4 min-h-[360px] max-h-[360px] font-mono text-xs text-slate-200 outline-none leading-relaxed resize-none focus:bg-slate-900 transition-colors"
                  />
                  {isSimulating && (
                    <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[0.5px] pointer-events-none border border-blue-500/10 flex items-center justify-center">
                      <span className="text-[10px] uppercase font-bold text-blue-400 bg-slate-950/80 border border-blue-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-2xl tracking-widest animate-pulse">
                        <Cpu className="w-3.5 h-3.5 animate-spin" /> Program Running on Virtual MCU
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                // Tab Content 2: Guided Steps
                <div className="p-5 min-h-[360px] max-h-[360px] overflow-y-auto bg-slate-900/40">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-850 pb-2.5">
                    <h4 className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">Step-by-Step Connections</h4>
                    <button
                      onClick={() => setGhostMode(!ghostMode)}
                      className={`text-2xs font-bold px-2 py-1 border rounded-lg transition-all ${
                        ghostMode 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                          : 'bg-slate-850 border-slate-800 text-slate-400'
                      }`}
                    >
                      {ghostMode ? 'Ghost Guide: ON' : 'Ghost Guide: OFF'}
                    </button>
                  </div>
                  <ul className="space-y-4">
                    {selectedProject.guideSteps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed pt-0.5">{step}</p>
                      </li>
                    ))}
                  </ul>
                  {wiringAccuracy.score === 100 && (
                    <div className="mt-5 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="text-xs font-bold">Wiring 100% Perfect!</h5>
                        <p className="text-2xs text-slate-400 mt-0.5">Physical circuit connection matches the guidelines. You are ready to run simulator code.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom logs panel: Compiler Console / Serial Monitor */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center bg-slate-950 px-4 border-b border-slate-850">
                <div className="flex">
                  <button
                    onClick={() => setTerminalTab('console')}
                    className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${
                      terminalTab === 'console' 
                        ? 'border-cyan-500 text-cyan-400 bg-slate-900/60' 
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" /> Compiler Log
                  </button>
                  <button
                    onClick={() => setTerminalTab('serial')}
                    className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${
                      terminalTab === 'serial' 
                        ? 'border-emerald-500 text-emerald-400 bg-slate-900/60' 
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" /> Serial Monitor
                  </button>
                </div>
                
                {terminalTab === 'serial' && (
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">9600 Baud</span>
                )}
              </div>

              {/* Console Tab */}
              {terminalTab === 'console' ? (
                <div className="p-4 bg-slate-950 min-h-[160px] max-h-[160px] overflow-y-auto font-mono text-[10px] text-slate-400 space-y-1">
                  {consoleLogs.map((log, index) => {
                    let color = 'text-slate-400';
                    if (log.startsWith('[SUCCESS]')) color = 'text-emerald-400';
                    if (log.startsWith('[ERROR]')) color = 'text-rose-400';
                    if (log.startsWith('[WARNING]')) color = 'text-amber-400';
                    if (log.startsWith('[SYSTEM]')) color = 'text-blue-400';
                    if (log.startsWith('===')) color = 'text-slate-500 font-bold';
                    return (
                      <div key={index} className={color}>{log}</div>
                    );
                  })}
                </div>
              ) : (
                // Serial Monitor Tab
                <div className="bg-slate-950">
                  <div className="p-4 min-h-[120px] max-h-[120px] overflow-y-auto font-mono text-[10px] text-emerald-400 space-y-1">
                    {serialLogs.length === 0 ? (
                      <div className="text-slate-600 italic">No serial logs. Start simulation to observe outputs.</div>
                    ) : (
                      serialLogs.map((log, index) => (
                        <div key={index}>{log}</div>
                      ))
                    )}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!serialInput.trim()) return;
                      setSerialLogs(prev => [...prev, `[TX] -> ${serialInput}`]);
                      setConsoleLogs(prev => [...prev, `[SERIAL] Received TX command: "${serialInput}"`]);
                      setSerialInput('');
                    }}
                    className="flex border-t border-slate-850 p-2 bg-slate-950"
                  >
                    <input
                      type="text"
                      placeholder="Send command to Arduino..."
                      value={serialInput}
                      onChange={(e) => setSerialInput(e.target.value)}
                      disabled={!isSimulating}
                      className="bg-slate-900 border border-slate-800 focus:border-slate-700 text-xs px-3 py-1.5 outline-none rounded-lg text-slate-200 flex-grow font-mono"
                    />
                    <button
                      type="submit"
                      disabled={!isSimulating}
                      className="ml-2 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 disabled:opacity-50 text-slate-300 hover:text-white rounded-lg text-xs font-bold"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>

          {/* Right panel: Simulator Canvas, Components Drawer & BOM */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Visual Workspace Canvas Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
              
              {/* Canvas header controls */}
              <div className="bg-slate-950 px-5 py-4 border-b border-slate-850 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs uppercase font-extrabold text-slate-300 tracking-wider">Circuit Canvas Workbench</span>
                </div>

                {/* Wire color selection */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wire:</span>
                  <div className="flex items-center gap-1.5 bg-slate-900 p-1 border border-slate-800 rounded-lg">
                    {[
                      { color: '#3B82F6', name: 'Blue' },
                      { color: '#EF4444', name: 'Red' },
                      { color: '#000000', name: 'Black' },
                      { color: '#10B981', name: 'Green' },
                      { color: '#F59E0B', name: 'Yellow' }
                    ].map(cfg => (
                      <button
                        key={cfg.color}
                        onClick={() => setSelectedColor(cfg.color)}
                        title={cfg.name}
                        className={`w-4 h-4 rounded-full border transition-all ${
                          selectedColor === cfg.color 
                            ? 'border-white scale-110 shadow-lg shadow-white/10' 
                            : 'border-transparent scale-90 opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: cfg.color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Component Addition Drawer */}
              <div className="bg-slate-900/90 border-b border-slate-850/60 p-3.5 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-1.5 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5 text-blue-500" /> Add:
                </span>
                {[
                  { type: 'led', name: 'LED' },
                  { type: 'resistor', name: 'Resistor' },
                  { type: 'potentiometer', name: 'Potentiometer' },
                  { type: 'ultrasonic', name: 'Ultrasonic' },
                  { type: 'servo', name: 'Servo' },
                  { type: 'lcd_i2c', name: 'I2C LCD' }
                ].map(item => (
                  <button
                    key={item.type}
                    onClick={() => addStandaloneComponent(item.type)}
                    className="px-2.5 py-1.5 bg-slate-850 hover:bg-slate-800 hover:border-slate-700 text-2xs font-semibold text-slate-300 hover:text-white border border-slate-850 rounded-lg transition-all flex items-center gap-1"
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* The SVG Canvas Renderer */}
              <div className="relative bg-[#0b0f19] select-none min-h-[440px] max-h-[440px] overflow-hidden">
                <svg
                  ref={canvasRef}
                  width="100%"
                  height="440"
                  viewBox="0 0 800 500"
                  className="w-full h-full cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onClick={() => {
                    if (wiringStart) {
                      setWiringStart(null);
                      showToast('Wiring cancelled.', 'info');
                    }
                  }}
                >
                  {/* Grid Lines Overlay */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.5" opacity="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Render Ghost Target Wires Guide */}
                  {ghostMode && selectedProject.ghostWires.map((gWire, index) => {
                    const c1 = components.find(c => c.id === gWire.fromCompId);
                    const c2 = components.find(c => c.id === gWire.toCompId);
                    if (!c1 || !c2) return null;
                    const p1 = c1.pins[gWire.fromPin];
                    const p2 = c2.pins[gWire.toPin];
                    if (!p1 || !p2) return null;

                    const x1 = c1.x + p1.x;
                    const y1 = c1.y + p1.y;
                    const x2 = c2.x + p2.x;
                    const y2 = c2.y + p2.y;
                    const dx = Math.abs(x2 - x1) * 0.4;
                    const dy = Math.abs(y2 - y1) * 0.4;

                    const path = `M ${x1} ${y1} C ${x1 + dx} ${y1 + (y2 > y1 ? dy : -dy)} ${x2 - dx} ${y2 + (y2 > y1 ? -dy : dy)} ${x2} ${y2}`;
                    
                    return (
                      <g key={`ghost_${index}`}>
                        <path
                          d={path}
                          fill="none"
                          stroke={gWire.color}
                          strokeWidth="4"
                          strokeDasharray="4,4"
                          opacity="0.25"
                        />
                        <text
                          x={(x1 + x2) / 2}
                          y={(y1 + y2) / 2 - 5}
                          fill={gWire.color}
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          opacity="0.4"
                        >
                          Guide Wire
                        </text>
                      </g>
                    );
                  })}

                  {/* Render Connections Wires */}
                  {wires.map((wire) => {
                    const path = getWirePath(wire);
                    if (!path) return null;
                    return (
                      <g key={wire.id} className="group cursor-pointer">
                        {/* Hover thickness buffer */}
                        <path
                          d={path}
                          fill="none"
                          stroke="transparent"
                          strokeWidth="10"
                          onDoubleClick={() => deleteWire(wire.id)}
                        />
                        <path
                          d={path}
                          fill="none"
                          stroke={wire.color}
                          strokeWidth="3.5"
                          className="transition-all duration-150 group-hover:stroke-cyan-400 group-hover:stroke-[5px]"
                          onDoubleClick={() => deleteWire(wire.id)}
                        />
                        {/* Power Pulse Simulation if running */}
                        {isSimulating && (
                          <circle r="3" fill="#FFFFFF">
                            <animateMotion dur="2.5s" repeatCount="indefinite" path={path} />
                          </circle>
                        )}
                      </g>
                    );
                  })}

                  {/* Live Drawing Wire */}
                  {wiringStart && (
                    <path
                      d={getLiveWirePath()}
                      fill="none"
                      stroke={selectedColor}
                      strokeWidth="3"
                      strokeDasharray="4,4"
                      className="animate-pulse"
                    />
                  )}

                  {/* Render Visual Components */}
                  {components.map((comp) => {
                    
                    // Render: 1. Arduino Uno R3 Board
                    if (comp.type === 'arduino_uno') {
                      return (
                        <g 
                          key={comp.id}
                          transform={`translate(${comp.x}, ${comp.y})`}
                          onMouseDown={(e) => handleMouseDown(e, comp.id)}
                          className="cursor-grab"
                        >
                          {/* Board PCB base */}
                          <rect width={comp.width} height={comp.height} rx="12" fill="#047857" stroke="#065f46" strokeWidth="3" shadow-sm="true" />
                          {/* MCU Main chip ATmega328P */}
                          <rect x="75" y="85" width="100" height="25" rx="3" fill="#1E293B" stroke="#0F172A" />
                          <text x="125" y="101" fill="#94A3B8" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="2">ATMEGA328P</text>
                          {/* USB Type-B Port */}
                          <rect x="-8" y="30" width="35" height="40" rx="3" fill="#94A3B8" stroke="#64748B" />
                          {/* Power barrel jack */}
                          <rect x="-5" y="110" width="40" height="50" rx="4" fill="#0F172A" stroke="#1E293B" />
                          {/* Labels */}
                          <text x="120" y="55" fill="#A7F3D0" fontSize="14" fontWeight="extrabold" textAnchor="middle" opacity="0.3">ARDUINO UNO</text>
                          
                          {/* Power indicator light LED */}
                          <circle cx="210" cy="55" r="4.5" fill={isSimulating ? '#10B981' : '#1E293B'} stroke="#047857" className={isSimulating ? 'animate-pulse' : ''} />
                          <text x="210" y="45" fill="#A7F3D0" fontSize="7" textAnchor="middle">ON</text>

                          {/* Render click-connect Board Pin nodes */}
                          {Object.keys(comp.pins).map(pinKey => {
                            const pin = comp.pins[pinKey];
                            const isPinSelected = wiringStart && wiringStart.compId === comp.id && wiringStart.pinId === pinKey;
                            return (
                              <g key={pinKey} className="group cursor-pointer">
                                <circle 
                                  cx={pin.x} 
                                  cy={pin.y} 
                                  r="5.5" 
                                  fill={isPinSelected ? '#EC4899' : '#0F172A'} 
                                  stroke={isPinSelected ? '#FFFFFF' : '#475569'}
                                  strokeWidth="1.5"
                                  onClick={(e) => handlePinClick(e, comp.id, pinKey)}
                                />
                                <text 
                                  x={pin.x} 
                                  y={pin.y > comp.height / 2 ? pin.y - 8 : pin.y + 12} 
                                  fill="#E2E8F0" 
                                  fontSize="6.5" 
                                  fontWeight="bold"
                                  textAnchor="middle"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                >
                                  {pin.label}
                                </text>
                              </g>
                            );
                          })}
                        </g>
                      );
                    }

                    // Render: 2. Breadboard
                    if (comp.type === 'breadboard') {
                      return (
                        <g 
                          key={comp.id}
                          transform={`translate(${comp.x}, ${comp.y})`}
                          onMouseDown={(e) => handleMouseDown(e, comp.id)}
                          className="cursor-grab"
                        >
                          {/* Breadboard base */}
                          <rect width={comp.width} height={comp.height} rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2.5" />
                          {/* Divider line in middle */}
                          <line x1="15" y1="50" x2="305" y2="50" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3,3" />

                          {/* Visual pin dots grid */}
                          {Object.keys(comp.pins).map(pinKey => {
                            const pin = comp.pins[pinKey];
                            const isPinSelected = wiringStart && wiringStart.compId === comp.id && wiringStart.pinId === pinKey;
                            return (
                              <circle 
                                key={pinKey}
                                cx={pin.x} 
                                cy={pin.y} 
                                r="4.5" 
                                fill={isPinSelected ? '#EC4899' : '#1E293B'} 
                                stroke="#94A3B8" 
                                strokeWidth="0.5"
                                className="cursor-pointer hover:fill-blue-500 hover:scale-125 transition-all"
                                onClick={(e) => handlePinClick(e, comp.id, pinKey)}
                              />
                            );
                          })}
                        </g>
                      );
                    }

                    // Render: 3. LED Component
                    if (comp.type === 'led') {
                      const isOn = comp.state?.on;
                      const color = comp.state?.color || '#EF4444';
                      const intensity = comp.state?.intensity ?? 1.0;
                      return (
                        <g 
                          key={comp.id}
                          transform={`translate(${comp.x}, ${comp.y})`}
                          onMouseDown={(e) => handleMouseDown(e, comp.id)}
                          className="cursor-grab"
                        >
                          {/* Component casing */}
                          <rect width={comp.width} height={comp.height} fill="transparent" />
                          
                          {/* Cathode & Anode Legs lines */}
                          <line x1="15" y1="20" x2="15" y2="50" stroke="#CBD5E1" strokeWidth="3" />
                          <line x1="45" y1="20" x2="45" y2="50" stroke="#CBD5E1" strokeWidth="3" />

                          {/* LED Bulb shape */}
                          <circle cx="30" cy="20" r="16" fill={isOn ? color : '#334155'} stroke="#1E293B" strokeWidth="1.5" style={{ opacity: isOn ? 0.8 + (intensity * 0.2) : 1 }} />
                          {isOn && (
                            <circle cx="30" cy="20" r="26" fill={color} opacity={0.3 * intensity} className="animate-ping" style={{ animationDuration: '2s' }} />
                          )}
                          <rect x="18" y="28" width="24" height="6" fill={isOn ? color : '#1E293B'} rx="1" />
                          
                          {/* LED Delete handle */}
                          <g 
                            transform="translate(48, -5)" 
                            className="cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                            onClick={() => deleteComponent(comp.id)}
                          >
                            <circle r="8" fill="#F43F5E" />
                            <text fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle" y="3">×</text>
                          </g>

                          {/* Visual pins */}
                          {Object.keys(comp.pins).map(pinKey => {
                            const pin = comp.pins[pinKey];
                            const isPinSelected = wiringStart && wiringStart.compId === comp.id && wiringStart.pinId === pinKey;
                            return (
                              <circle 
                                key={pinKey}
                                cx={pin.x} 
                                cy={pin.y} 
                                r="5.5" 
                                fill={isPinSelected ? '#EC4899' : '#0F172A'} 
                                stroke="#94A3B8" 
                                className="cursor-pointer"
                                onClick={(e) => handlePinClick(e, comp.id, pinKey)}
                              />
                            );
                          })}
                        </g>
                      );
                    }

                    // Render: 4. Resistor
                    if (comp.type === 'resistor') {
                      return (
                        <g 
                          key={comp.id}
                          transform={`translate(${comp.x}, ${comp.y})`}
                          onMouseDown={(e) => handleMouseDown(e, comp.id)}
                          className="cursor-grab"
                        >
                          <rect width={comp.width} height={comp.height} fill="transparent" />
                          {/* Wire body */}
                          <line x1="5" y1="15" x2="75" y2="15" stroke="#94A3B8" strokeWidth="2.5" />
                          {/* Ceramic body */}
                          <rect x="20" y="6" width="40" height="18" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
                          
                          {/* Color stripes for 220 Ohm (Red, Red, Brown, Gold) */}
                          <rect x="28" y="6" width="3" height="18" fill="#EF4444" />
                          <rect x="35" y="6" width="3" height="18" fill="#EF4444" />
                          <rect x="42" y="6" width="3" height="18" fill="#78350F" />
                          <rect x="52" y="6" width="3" height="18" fill="#F59E0B" />

                          {/* Resistor Delete handle */}
                          <g 
                            transform="translate(68, -2)" 
                            className="cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                            onClick={() => deleteComponent(comp.id)}
                          >
                            <circle r="7" fill="#F43F5E" />
                            <text fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" y="2.5">×</text>
                          </g>

                          {/* Visual pins */}
                          {Object.keys(comp.pins).map(pinKey => {
                            const pin = comp.pins[pinKey];
                            const isPinSelected = wiringStart && wiringStart.compId === comp.id && wiringStart.pinId === pinKey;
                            return (
                              <circle 
                                key={pinKey}
                                cx={pin.x} 
                                cy={pin.y} 
                                r="5.5" 
                                fill={isPinSelected ? '#EC4899' : '#0F172A'} 
                                stroke="#94A3B8" 
                                className="cursor-pointer"
                                onClick={(e) => handlePinClick(e, comp.id, pinKey)}
                              />
                            );
                          })}
                        </g>
                      );
                    }

                    // Render: 5. Potentiometer
                    if (comp.type === 'potentiometer') {
                      const potVal = comp.state?.value ?? 512;
                      const rotAngle = ((potVal / 1023) * 280) - 140;
                      return (
                        <g 
                          key={comp.id}
                          transform={`translate(${comp.x}, ${comp.y})`}
                          onMouseDown={(e) => handleMouseDown(e, comp.id)}
                          className="cursor-grab"
                        >
                          <rect width={comp.width} height={comp.height} fill="transparent" />
                          {/* Board outline */}
                          <rect x="5" y="5" width="70" height="60" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="2" />
                          {/* Dial frame */}
                          <circle cx="40" cy="32" r="22" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
                          
                          {/* Draggable indicator knob dial */}
                          <g transform={`translate(40, 32) rotate(${rotAngle})`}>
                            <circle cx="0" cy="0" r="18" fill="#334155" />
                            <line x1="0" y1="0" x2="0" y2="-15" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                          </g>

                          {/* Hidden slider interface on canvas to allow adjustments */}
                          <foreignObject x="5" y="75" width="70" height="25" className="pointer-events-auto">
                            <input 
                              type="range"
                              min="0"
                              max="1023"
                              value={potVal}
                              onChange={(e) => {
                                const nextVal = parseInt(e.target.value);
                                setComponents(prev => prev.map(c => {
                                  if (c.id === comp.id) {
                                    return { ...c, state: { ...c.state, value: nextVal } };
                                  }
                                  return c;
                                }));
                              }}
                              className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                            />
                          </foreignObject>

                          {/* Delete handle */}
                          <g 
                            transform="translate(68, -2)" 
                            className="cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                            onClick={() => deleteComponent(comp.id)}
                          >
                            <circle r="7" fill="#F43F5E" />
                            <text fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" y="2.5">×</text>
                          </g>

                          {/* Visual pins */}
                          {Object.keys(comp.pins).map(pinKey => {
                            const pin = comp.pins[pinKey];
                            const isPinSelected = wiringStart && wiringStart.compId === comp.id && wiringStart.pinId === pinKey;
                            return (
                              <circle 
                                key={pinKey}
                                cx={pin.x} 
                                cy={pin.y} 
                                r="5.5" 
                                fill={isPinSelected ? '#EC4899' : '#0F172A'} 
                                stroke="#94A3B8" 
                                className="cursor-pointer"
                                onClick={(e) => handlePinClick(e, comp.id, pinKey)}
                              />
                            );
                          })}
                        </g>
                      );
                    }

                    // Render: 6. Ultrasonic Sensor HC-SR04
                    if (comp.type === 'ultrasonic') {
                      const dist = comp.state?.distance ?? 100;
                      return (
                        <g 
                          key={comp.id}
                          transform={`translate(${comp.x}, ${comp.y})`}
                          onMouseDown={(e) => handleMouseDown(e, comp.id)}
                          className="cursor-grab"
                        >
                          <rect width={comp.width} height={comp.height} fill="transparent" />
                          {/* Board casing */}
                          <rect x="5" y="5" width="90" height="50" rx="6" fill="#1E3A8A" stroke="#1D4ED8" strokeWidth="2" />
                          {/* Ultrasonic transmitters */}
                          <circle cx="28" cy="30" r="16" fill="#475569" stroke="#94A3B8" strokeWidth="2" />
                          <circle cx="28" cy="30" r="10" fill="#0F172A" />
                          <text x="28" y="33" fill="#94A3B8" fontSize="8" textAnchor="middle">T</text>
                          
                          <circle cx="72" cy="30" r="16" fill="#475569" stroke="#94A3B8" strokeWidth="2" />
                          <circle cx="72" cy="30" r="10" fill="#0F172A" />
                          <text x="72" y="33" fill="#94A3B8" fontSize="8" textAnchor="middle">R</text>

                          {/* Slider adjustment for mock distance */}
                          <foreignObject x="5" y="65" width="90" height="25" className="pointer-events-auto">
                            <div className="flex items-center justify-between gap-1 px-1 bg-slate-900 border border-slate-800 rounded">
                              <input 
                                type="range"
                                min="2"
                                max="200"
                                value={dist}
                                onChange={(e) => {
                                  const nextVal = parseInt(e.target.value);
                                  setComponents(prev => prev.map(c => {
                                    if (c.id === comp.id) {
                                      return { ...c, state: { ...c.state, distance: nextVal } };
                                    }
                                    return c;
                                  }));
                                }}
                                className="w-14 accent-blue-500 bg-slate-850 h-1 rounded cursor-pointer"
                              />
                              <span className="text-[7.5px] font-mono text-cyan-400 font-bold leading-none">{dist}cm</span>
                            </div>
                          </foreignObject>

                          {/* Delete handle */}
                          <g 
                            transform="translate(88, -2)" 
                            className="cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                            onClick={() => deleteComponent(comp.id)}
                          >
                            <circle r="7" fill="#F43F5E" />
                            <text fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" y="2.5">×</text>
                          </g>

                          {/* Visual pins */}
                          {Object.keys(comp.pins).map(pinKey => {
                            const pin = comp.pins[pinKey];
                            const isPinSelected = wiringStart && wiringStart.compId === comp.id && wiringStart.pinId === pinKey;
                            return (
                              <circle 
                                key={pinKey}
                                cx={pin.x} 
                                cy={pin.y} 
                                r="5.5" 
                                fill={isPinSelected ? '#EC4899' : '#0F172A'} 
                                stroke="#94A3B8" 
                                className="cursor-pointer"
                                onClick={(e) => handlePinClick(e, comp.id, pinKey)}
                              />
                            );
                          })}
                        </g>
                      );
                    }

                    // Render: 7. SG90 Servo Motor
                    if (comp.type === 'servo') {
                      const angle = comp.state?.angle ?? 90;
                      return (
                        <g 
                          key={comp.id}
                          transform={`translate(${comp.x}, ${comp.y})`}
                          onMouseDown={(e) => handleMouseDown(e, comp.id)}
                          className="cursor-grab"
                        >
                          <rect width={comp.width} height={comp.height} fill="transparent" />
                          {/* Motor chassis body */}
                          <rect x="15" y="10" width="70" height="45" rx="5" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
                          {/* Mounting ears */}
                          <rect x="5" y="22" width="10" height="20" fill="#2563EB" />
                          <rect x="85" y="22" width="10" height="20" fill="#2563EB" />
                          {/* Main rotor gear ring */}
                          <circle cx="50" cy="32" r="14" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
                          
                          {/* Rotating visual arm */}
                          <g transform={`translate(50, 32) rotate(${angle})`}>
                            <rect x="-6" y="-30" width="12" height="40" rx="4" fill="#FFFFFF" stroke="#CBD5E1" />
                            <circle cx="0" cy="-22" r="2.5" fill="#475569" />
                            <circle cx="0" cy="-8" r="2.5" fill="#475569" />
                            <circle cx="0" cy="5" r="3.5" fill="#1E293B" />
                          </g>

                          {/* Display current angle */}
                          <text x="50" y="70" fill="#94A3B8" fontSize="8.5" fontWeight="bold" textAnchor="middle" className="font-mono">
                            {angle}° Angle
                          </text>

                          {/* Delete handle */}
                          <g 
                            transform="translate(88, -2)" 
                            className="cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                            onClick={() => deleteComponent(comp.id)}
                          >
                            <circle r="7" fill="#F43F5E" />
                            <text fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" y="2.5">×</text>
                          </g>

                          {/* Visual pins */}
                          {Object.keys(comp.pins).map(pinKey => {
                            const pin = comp.pins[pinKey];
                            const isPinSelected = wiringStart && wiringStart.compId === comp.id && wiringStart.pinId === pinKey;
                            return (
                              <circle 
                                key={pinKey}
                                cx={pin.x} 
                                cy={pin.y} 
                                r="5.5" 
                                fill={isPinSelected ? '#EC4899' : '#0F172A'} 
                                stroke="#94A3B8" 
                                className="cursor-pointer"
                                onClick={(e) => handlePinClick(e, comp.id, pinKey)}
                              />
                            );
                          })}
                        </g>
                      );
                    }

                    // Render: 8. I2C Character LCD 16x2 Screen
                    if (comp.type === 'lcd_i2c') {
                      const text1 = comp.state?.line1 ?? '';
                      const text2 = comp.state?.line2 ?? '';
                      return (
                        <g 
                          key={comp.id}
                          transform={`translate(${comp.x}, ${comp.y})`}
                          onMouseDown={(e) => handleMouseDown(e, comp.id)}
                          className="cursor-grab"
                        >
                          <rect width={comp.width} height={comp.height} fill="transparent" />
                          {/* Board base */}
                          <rect x="5" y="5" width="150" height="70" rx="5" fill="#065f46" stroke="#047857" strokeWidth="2" />
                          {/* LCD Screen bezel border */}
                          <rect x="15" y="12" width="130" height="42" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
                          {/* LCD LCD Display glass */}
                          <rect x="20" y="16" width="120" height="34" fill={isSimulating ? '#1E3A8A' : '#1E293B'} />
                          
                          {/* Output text displays */}
                          <text x="25" y="28" fill="#67E8F9" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                            {text1.substring(0, 16)}
                          </text>
                          <text x="25" y="44" fill="#67E8F9" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                            {text2.substring(0, 16)}
                          </text>

                          {/* Delete handle */}
                          <g 
                            transform="translate(148, -2)" 
                            className="cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                            onClick={() => deleteComponent(comp.id)}
                          >
                            <circle r="7" fill="#F43F5E" />
                            <text fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" y="2.5">×</text>
                          </g>

                          {/* Visual pins */}
                          {Object.keys(comp.pins).map(pinKey => {
                            const pin = comp.pins[pinKey];
                            const isPinSelected = wiringStart && wiringStart.compId === comp.id && wiringStart.pinId === pinKey;
                            return (
                              <circle 
                                key={pinKey}
                                cx={pin.x} 
                                cy={pin.y} 
                                r="5.5" 
                                fill={isPinSelected ? '#EC4899' : '#0F172A'} 
                                stroke="#94A3B8" 
                                className="cursor-pointer"
                                onClick={(e) => handlePinClick(e, comp.id, pinKey)}
                              />
                            );
                          })}
                        </g>
                      );
                    }

                    return null;
                  })}
                </svg>
              </div>

              {/* Instructions and helpers banner overlay */}
              <div className="bg-slate-950 p-4 border-t border-slate-850 flex flex-col md:flex-row md:items-center justify-between text-slate-400 gap-3">
                <span className="text-2xs leading-relaxed flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span><strong>Workspace Tips:</strong> Drag components to reposition. Click a pin to start wiring. Double-click a wire to delete. Hover components to delete.</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ components, wires }));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href",     dataStr);
                      downloadAnchor.setAttribute("download", `${selectedProject.id}_circuit.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                      showToast('Circuit structure exported.', 'success');
                    }}
                    className="px-2.5 py-1 bg-slate-850 hover:bg-slate-800 text-3xs font-bold text-slate-300 hover:text-white border border-slate-800 rounded transition-all flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Export JSON
                  </button>
                  <button
                    onClick={() => {
                      showToast('Sharing link copied to clipboard!', 'success');
                    }}
                    className="px-2.5 py-1 bg-slate-850 hover:bg-slate-800 text-3xs font-bold text-slate-400 border border-slate-800 rounded transition-all flex items-center gap-1"
                  >
                    <Share2 className="w-3 h-3" /> Share Code
                  </button>
                </div>
              </div>

            </div>

            {/* Bill of Materials & Cost Tracker section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-slate-950 px-5 py-4 border-b border-slate-850 flex justify-between items-center">
                <h3 className="text-xs uppercase font-extrabold text-slate-300 tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-cyan-400" /> Bill of Materials & Kit Estimator
                </h3>
                <div className="text-xs font-bold text-cyan-400">
                  Est. Total: ₹{totalCostINR} / ${totalCostUSD.toFixed(2)}
                </div>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-slate-950/40 border-b border-slate-850 font-bold text-slate-400 text-2xs uppercase tracking-wider">
                      <th className="px-5 py-3">Component Description</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Unit Price (INR)</th>
                      <th className="px-5 py-3 text-right">Subtotal (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {bomList.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-850/20 transition-colors">
                        <td className="px-5 py-3 font-medium text-slate-200">{item.name}</td>
                        <td className="px-4 py-3 text-center font-bold text-slate-400">{item.qty}</td>
                        <td className="px-4 py-3 text-right">₹{item.totalINR / item.qty}</td>
                        <td className="px-5 py-3 text-right text-white font-bold">₹{item.totalINR}</td>
                      </tr>
                    ))}
                    {bomList.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-5 py-6 text-center text-slate-500 italic">Workspace is empty. Add components to estimate costs.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-950 p-4 border-t border-slate-850 flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="text-2xs text-slate-400 leading-relaxed text-center sm:text-left">
                  Need these components? Build them into your curriculum with our custom laboratory experiments kits.
                </span>
                <Link
                  href="/products"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-2xs shadow-lg shadow-blue-900/30 border border-blue-500/20 transition-all shrink-0 uppercase tracking-wider"
                >
                  Buy Physical Kit
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
