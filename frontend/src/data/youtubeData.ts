export interface YouTubeTutorial {
  id: string;
  title: string;
  slug: string;
  youtubeId: string;
  youtubeUrl: string;
  channelName: string;
  category: 'Arduino' | 'Electronics' | 'ESP32' | 'Robotics' | 'AI & ML' | 'PCB Design' | 'Raspberry Pi';
  duration: string;
  views: string;
  publishedDate: string;
  thumbnail: string;
  description: string;
  transcriptSummary: string[];
  componentsNeeded: string[];
  codeDownloadName: string;
  codeSnippet: string;
  relatedProductId?: string;
}

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@LetsGetEngagedin";

export const YOUTUBE_TUTORIALS: YouTubeTutorial[] = [
  {
    id: "yt-1",
    title: "Arduino Complete Beginner Tutorial 2026 - From Zero to Hero",
    slug: "arduino-complete-beginner-tutorial",
    youtubeId: "nL34zDTPkcs",
    youtubeUrl: "https://www.youtube.com/watch?v=nL34zDTPkcs",
    channelName: "LetsGetEngagedin",
    category: "Arduino",
    duration: "42:15",
    views: "24.5K",
    publishedDate: "2026-03-15",
    thumbnail: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
    description: "Welcome to the ultimate Arduino course by LetsGetEngagedin! In this step-by-step tutorial, we cover breadboard wiring, C++ functions, digital reading, analog PWM fading, and serial communication.",
    transcriptSummary: [
      "00:00 - Introduction to Arduino UNO hardware anatomy",
      "05:20 - Installing Arduino IDE 2.3 and USB FTDI drivers",
      "12:45 - Understanding pinMode(), digitalWrite(), and delay()",
      "22:10 - Reading potentiometers with analogRead() and Serial Monitor",
      "34:50 - Building a automatic light dimmer with LDR sensor"
    ],
    componentsNeeded: [
      "Arduino UNO R3 Board",
      "Solderless Breadboard",
      "10k Potentiometer",
      "5mm Red LED",
      "220 Ohm Resistor",
      "USB Cable"
    ],
    codeDownloadName: "Arduino_Beginner_Master_Code.ino",
    codeSnippet: `// ElectronLearners YouTube Tutorial Sketch - @LetsGetEngagedin
const int LED_PIN = 9; // PWM pin
const int POT_PIN = A0;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("LetsGetEngagedin - Arduino Started!");
}

void loop() {
  int potValue = analogRead(POT_PIN);
  int brightness = map(potValue, 0, 1023, 0, 255);
  analogWrite(LED_PIN, brightness);
  
  Serial.print("Pot: ");
  Serial.print(potValue);
  Serial.print(" -> Brightness PWM: ");
  Serial.println(brightness);
  
  delay(50);
}`,
    relatedProductId: "prod-1"
  },
  {
    id: "yt-2",
    title: "ESP32 Web Server & Home Automation with Relay Control",
    slug: "esp32-web-server-home-automation",
    youtubeId: "3q-v_q3rXqY",
    youtubeUrl: "https://www.youtube.com/watch?v=3q-v_q3rXqY",
    channelName: "LetsGetEngagedin",
    category: "ESP32",
    duration: "28:40",
    views: "18.2K",
    publishedDate: "2026-04-02",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    description: "Learn how to turn your smartphone into a wireless remote control for home appliances using ESP32 Wi-Fi server and 4-Channel Relays.",
    transcriptSummary: [
      "00:00 - Project overview and safety guidelines for AC relays",
      "04:15 - Connecting ESP32 to home Wi-Fi network",
      "10:30 - Creating HTML/CSS glassmorphic UI directly in C++ string",
      "19:00 - Handling HTTP GET requests to toggle GPIO pins",
      "25:10 - Testing mobile browser responsiveness"
    ],
    componentsNeeded: [
      "ESP32 NodeMCU Board",
      "4-Channel 5V Relay Module",
      "Jumper Wires",
      "5V DC Power Adapter"
    ],
    codeDownloadName: "ESP32_WiFi_Relay_WebServer.ino",
    codeSnippet: `#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

WebServer server(80);
const int RELAY_PIN = 26;

void handleRoot() {
  String html = "<!DOCTYPE html><html><head><title>ESP32 Control</title></head>";
  html += "<body style='background:#0F172A;color:#fff;font-family:sans-serif;text-align:center;padding:50px;'>";
  html += "<h1>ElectronLearners Smart Home</h1>";
  html += "<a href='/on'><button style='padding:15px 30px;font-size:20px;background:#10B981;color:#fff;border:none;border-radius:8px;'>TURN ON</button></a> ";
  html += "<a href='/off'><button style='padding:15px 30px;font-size:20px;background:#EF4444;color:#fff;border:none;border-radius:8px;'>TURN OFF</button></a>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected. IP: " + WiFi.localIP().toString());
  
  server.on("/", handleRoot);
  server.on("/on", []() { digitalWrite(RELAY_PIN, LOW); handleRoot(); });
  server.on("/off", []() { digitalWrite(RELAY_PIN, HIGH); handleRoot(); });
  server.begin();
}

void loop() {
  server.handleClient();
}`,
    relatedProductId: "prod-6"
  },
  {
    id: "yt-3",
    title: "How to Build a Line Follower Robot with PID Tuning",
    slug: "build-line-follower-robot-pid-tuning",
    youtubeId: "XWpA6zX8x-8",
    youtubeUrl: "https://www.youtube.com/watch?v=XWpA6zX8x-8",
    channelName: "LetsGetEngagedin",
    category: "Robotics",
    duration: "35:10",
    views: "31.9K",
    publishedDate: "2026-02-20",
    thumbnail: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80",
    description: "Master PID math in robotics! We assemble a high-speed line tracker with 5 IR sensors and tune Kp, Ki, and Kd constants live on track.",
    transcriptSummary: [
      "00:00 - Theory of Line Tracking and PID Control loops",
      "08:30 - Assembling chassis, motors, and TCRT5000 array",
      "16:20 - Writing line error mapping function",
      "24:45 - Tuning Proportional gain Kp vs Derivative gain Kd",
      "32:10 - Racetrack lap time benchmark runs"
    ],
    componentsNeeded: [
      "2WD Robot Chassis",
      "5-Channel TCRT5000 Array",
      "L298N Motor Driver",
      "Arduino UNO Board",
      "18650 Li-Ion Batteries"
    ],
    codeDownloadName: "PID_LineFollower_LetsGetEngagedin.ino",
    codeSnippet: `// PID Line Follower Code - ElectronLearners / @LetsGetEngagedin
float Kp = 25.0, Ki = 0.0, Kd = 15.0;
float error = 0, previousError = 0, integral = 0, derivative = 0;
int baseSpeed = 150;

void loop() {
  int position = readLinePosition(); // returns -2 to +2
  error = position;
  integral += error;
  derivative = error - previousError;
  
  float correction = (Kp * error) + (Ki * integral) + (Kd * derivative);
  previousError = error;
  
  int leftSpeed = baseSpeed + correction;
  int rightSpeed = baseSpeed - correction;
  
  setMotorSpeeds(leftSpeed, rightSpeed);
}`,
    relatedProductId: "prod-9"
  },
  {
    id: "yt-4",
    title: "PCB Design for Beginners using KiCad 8 - Full Workflow",
    slug: "pcb-design-beginners-kicad-workflow",
    youtubeId: "vaCVh2PtWE4",
    youtubeUrl: "https://www.youtube.com/watch?v=vaCVh2PtWE4",
    channelName: "LetsGetEngagedin",
    category: "PCB Design",
    duration: "50:00",
    views: "15.7K",
    publishedDate: "2026-05-10",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    description: "Learn KiCad 8 EDA from scratch! We design a custom 555 timer flasher PCB, route 2-layer copper traces, add silkscreen logos, and export Gerbers.",
    transcriptSummary: [
      "00:00 - Schematic Capture & Component Symbol Library",
      "15:30 - Assigning Footprints (DIP-8, Resistors 0805, 5mm LEDs)",
      "28:00 - Board Layout & Copper Ground Plane Pour",
      "39:20 - Design Rule Check (DRC) & Manufacturing Checks",
      "46:10 - Exporting Gerber & Drill Files"
    ],
    componentsNeeded: [
      "KiCad 8 Software (Free Open Source)",
      "ElectronLearners PCB Design Kit"
    ],
    codeDownloadName: "555_Flasher_KiCad_Project.zip",
    codeSnippet: `# KiCad 8 Gerber Export Checklist:
1. F.Cu & B.Cu Copper Layers
2. F.SilkS Silkscreen Layer
3. F.Mask & B.Mask Solder Mask
4. Edge.Cuts Board Outline
5. Excellon Drill File (.drl)`,
    relatedProductId: "prod-14"
  },
  {
    id: "yt-5",
    title: "AI Vision with ESP32-CAM & OpenCV Object Detection",
    slug: "ai-vision-esp32-cam-opencv",
    youtubeId: "JmC-q39k8r8",
    youtubeUrl: "https://www.youtube.com/watch?v=JmC-q39k8r8",
    channelName: "LetsGetEngagedin",
    category: "AI & ML",
    duration: "31:25",
    views: "29.4K",
    publishedDate: "2026-06-01",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    description: "Combine cheap ESP32-CAM hardware with Python OpenCV to build real-time face detection, color tracking, and security alerts.",
    transcriptSummary: [
      "00:00 - Flashing ESP32-CAM CameraWebServer sketch",
      "08:15 - Connecting Python script to MJPEG video stream URL",
      "14:40 - Implementing Haar Cascade Classifier for Face Recognition",
      "23:00 - Drawing bounding boxes and sending Telegram notifications"
    ],
    componentsNeeded: [
      "ESP32-CAM Module with OV2640 Camera",
      "FTDI USB Serial Programmer",
      "Python 3.11 with OpenCV & Requests"
    ],
    codeDownloadName: "esp32_opencv_vision.py",
    codeSnippet: `# Python OpenCV ESP32-CAM Stream Reader - @LetsGetEngagedin
import cv2
import urllib.request
import numpy as np

url = 'http://192.168.1.100/jpg'
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

while True:
    img_resp = urllib.request.urlopen(url)
    img_np = np.array(bytearray(img_resp.read()), dtype=np.uint8)
    frame = cv2.imdecode(img_np, -1)
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
        cv2.putText(frame, "Face Detected", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        
    cv2.imshow("ElectronLearners AI Vision", frame)
    if cv2.waitKey(1) == 27:
        break

cv2.destroyAllWindows()`,
    relatedProductId: "prod-12"
  }
];
