# PowerShell script to generate SVG circuit diagrams for all 15 Experiments
$PublicDir = "frontend/public/circuits"
$DesktopDir = [System.IO.Path]::Combine($env:USERPROFILE, "Desktop", "circuits")

if (!(Test-Path $PublicDir)) { New-Item -ItemType Directory -Path $PublicDir -Force }
if (!(Test-Path $DesktopDir)) { New-Item -ItemType Directory -Path $DesktopDir -Force }

function Create-CircuitSVG($expNum, $title, $details) {
    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 350" width="100%" height="100%" style="background-color: #0b1329; font-family: Arial, sans-serif;">
  <rect width="650" height="350" fill="#0b1329" rx="16" stroke="#1e293b" stroke-width="2"/>
  
  <!-- Title Badge -->
  <rect x="20" y="15" width="610" height="35" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="30" y="38" fill="#60a5fa" font-size="14" font-weight="bold">CIRCUIT SCHEMATIC DIAGRAM: EXP #$expNum - $title</text>
  
  <!-- Arduino Uno Board Graphic -->
  <rect x="30" y="75" width="180" height="240" rx="12" fill="#006699" stroke="#0099cc" stroke-width="2"/>
  <rect x="40" y="85" width="40" height="30" fill="#cccccc" rx="3"/>
  <text x="45" y="105" fill="#333333" font-size="10" font-weight="bold">USB</text>
  <rect x="150" y="150" width="50" height="100" fill="#111111" rx="4"/>
  <text x="155" y="200" fill="#ffffff" font-size="9" font-weight="bold">ATmega328P</text>
  <text x="80" y="140" fill="#ffffff" font-size="16" font-weight="bold">ARDUINO</text>
  <text x="95" y="160" fill="#00ccff" font-size="14" font-weight="bold">UNO R3</text>
  
  <!-- Pin Headers -->
  <rect x="195" y="85" width="10" height="220" fill="#222222"/>
  <text x="175" y="100" fill="#00ffcc" font-size="10" font-weight="bold">PINS</text>

  <!-- Component Breadboard Area -->
  <rect x="270" y="75" width="350" height="240" rx="12" fill="#1e293b" stroke="#334155" stroke-width="2"/>
  <text x="285" y="100" fill="#94a3b8" font-size="12" font-weight="bold">BREADBOARD HARDWARE WIRING</text>
  
  <!-- Schematic Wires & Connections -->
  <path d="M 205 100 L 270 100" stroke="#ef4444" stroke-width="3" fill="none" stroke-dasharray="4"/>
  <text x="215" y="95" fill="#ef4444" font-size="10" font-weight="bold">5V Power</text>

  <path d="M 205 290 L 270 290" stroke="#3b82f6" stroke-width="3" fill="none"/>
  <text x="215" y="285" fill="#60a5fa" font-size="10" font-weight="bold">GND Ground</text>

  <!-- Experiment Specific Hardware Details -->
  <g transform="translate(290, 120)">
    <rect x="0" y="0" width="310" height="170" rx="8" fill="#090d16" stroke="#2563eb" stroke-width="1"/>
    <text x="15" y="30" fill="#34d399" font-size="12" font-weight="bold">Components & Connections:</text>
    $details
  </g>
  
  <!-- Footer Status -->
  <text x="30" y="335" fill="#64748b" font-size="10">ElectronLearners STEM Kit • Experiment #$expNum Schematic</text>
</svg>
"@
    $pubPath = Join-Path $PublicDir "exp$expNum.svg"
    $deskPath = Join-Path $DesktopDir "exp$expNum.svg"
    Set-Content -Path $pubPath -Value $svg -Encoding UTF8
    Set-Content -Path $deskPath -Value $svg -Encoding UTF8
}

# Generate SVGs for all 15 experiments
Create-CircuitSVG 1 "LED BLINK" '<text x="15" y="60" fill="#f8fafc" font-size="11">• Pin 13  ---> [ 220Ω Resistor ]</text><text x="15" y="90" fill="#f8fafc" font-size="11">• Resistor ---> [ Red LED Anode (+)]</text><text x="15" y="120" fill="#f8fafc" font-size="11">• LED Cathode (-) ---> [ GND ]</text>'
Create-CircuitSVG 2 "TRAFFIC LIGHT" '<text x="15" y="50" fill="#ef4444" font-size="11">• Pin 12 ---> [ 220Ω ] ---> [ Red LED ] ---> GND</text><text x="15" y="80" fill="#eab308" font-size="11">• Pin 11 ---> [ 220Ω ] ---> [ Yellow LED ] ---> GND</text><text x="15" y="110" fill="#22c55e" font-size="11">• Pin 10 ---> [ 220Ω ] ---> [ Green LED ] ---> GND</text>'
Create-CircuitSVG 3 "PUSH BUTTON LED" '<text x="15" y="50" fill="#f8fafc" font-size="11">• 5V ---> Push Button Terminal A</text><text x="15" y="80" fill="#f8fafc" font-size="11">• Button B ---> Pin 2 &amp; [ 10kΩ to GND ]</text><text x="15" y="110" fill="#f8fafc" font-size="11">• Pin 13 ---> [ 220Ω ] ---> [ LED ] ---> GND</text>'
Create-CircuitSVG 4 "TOGGLE SWITCH" '<text x="15" y="50" fill="#f8fafc" font-size="11">• Button Pin 2 with 10kΩ Pull-down to GND</text><text x="15" y="80" fill="#f8fafc" font-size="11">• Output Pin 13 to LED Anode via 220Ω</text><text x="15" y="110" fill="#34d399" font-size="11">• State flips on button rising edge</text>'
Create-CircuitSVG 5 "ELECTRONIC DICE" '<text x="15" y="45" fill="#f8fafc" font-size="11">• Pins 2,3,4,5,6,7 ---> [ 6x 220Ω ] ---> 6x LEDs</text><text x="15" y="75" fill="#f8fafc" font-size="11">• Pin 8 ---> Push Button (Roll Trigger)</text><text x="15" y="105" fill="#67e8f9" font-size="11">• Pin A0 ---> Floating Analog Noise Seed</text>'
Create-CircuitSVG 6 "LED BRIGHTNESS PWM" '<text x="15" y="50" fill="#f8fafc" font-size="11">• Potentiometer Wiper ---> Analog Pin A0</text><text x="15" y="80" fill="#f8fafc" font-size="11">• PWM Output Pin 9 ---> [ 220Ω ] ---> LED</text><text x="15" y="110" fill="#34d399" font-size="11">• Duty cycle adjusts 0% to 100% brightness</text>'
Create-CircuitSVG 7 "RGB MOOD LAMP" '<text x="15" y="45" fill="#ef4444" font-size="11">• Pot 1 (A0) ---> PWM Pin 9 (Red Diode)</text><text x="15" y="75" fill="#22c55e" font-size="11">• Pot 2 (A1) ---> PWM Pin 10 (Green Diode)</text><text x="15" y="105" fill="#3b82f6" font-size="11">• Pot 3 (A2) ---> PWM Pin 11 (Blue Diode)</text>'
Create-CircuitSVG 8 "LIGHT LAMP (LDR)" '<text x="15" y="50" fill="#f8fafc" font-size="11">• 5V ---> LDR Photocell ---> Pin A0</text><text x="15" y="80" fill="#f8fafc" font-size="11">• Pin A0 ---> [ 10kΩ Resistor ] ---> GND</text><text x="15" y="110" fill="#f8fafc" font-size="11">• Output Pin 13 ---> [ 220Ω ] ---> Lamp LED</text>'
Create-CircuitSVG 9 "DIGITAL LIGHT METER" '<text x="15" y="50" fill="#f8fafc" font-size="11">• LDR Voltage Divider ---> Analog Pin A0</text><text x="15" y="80" fill="#34d399" font-size="11">• USB Tx/Rx ---> Computer Serial Monitor</text><text x="15" y="110" fill="#67e8f9" font-size="11">• Real-time Lux &amp; Voltage telemetry</text>'
Create-CircuitSVG 10 "INTRUDER ALARM" '<text x="15" y="45" fill="#f8fafc" font-size="11">• LDR Tripwire Sensor ---> Pin A0</text><text x="15" y="75" fill="#ef4444" font-size="11">• Pin 8 ---> Piezo Buzzer (1kHz Siren)</text><text x="15" y="105" fill="#ef4444" font-size="11">• Pin 13 ---> Red Warning Status LED</text>'
Create-CircuitSVG 11 "DOORBELL SYSTEM" '<text x="15" y="50" fill="#f8fafc" font-size="11">• Push Button ---> Pin 2 (10kΩ Pull-down)</text><text x="15" y="80" fill="#67e8f9" font-size="11">• Pin 8 ---> Piezo Speaker (+)</text><text x="15" y="110" fill="#34d399" font-size="11">• Tone 659Hz (Ding) &amp; 523Hz (Dong)</text>'
Create-CircuitSVG 12 "MUSICAL PIANO" '<text x="15" y="45" fill="#f8fafc" font-size="11">• 5x Buttons (Pins 2..6) ---> Piano Keys</text><text x="15" y="75" fill="#67e8f9" font-size="11">• Pin 8 ---> Audio Output Speaker</text><text x="15" y="105" fill="#34d399" font-size="11">• Notes: C4 (262Hz), D4, E4, F4, G4 (392Hz)</text>'
Create-CircuitSVG 13 "REACTION TIME GAME" '<text x="15" y="45" fill="#f8fafc" font-size="11">• Pin 13 ---> Signal Start LED</text><text x="15" y="75" fill="#f8fafc" font-size="11">• Pin 2 ---> Player Reaction Push Button</text><text x="15" y="105" fill="#34d399" font-size="11">• Pin 8 ---> Buzzer | millis() Timer</text>'
Create-CircuitSVG 14 "PASSWORD LOCK" '<text x="15" y="45" fill="#f8fafc" font-size="11">• Pins 2,3,4,5 ---> 4 Keypad Buttons</text><text x="15" y="75" fill="#22c55e" font-size="11">• Pin 10 ---> Green LED (Access Granted)</text><text x="15" y="105" fill="#ef4444" font-size="11">• Pin 11 ---> Red LED &amp; Pin 8 Buzzer</text>'
Create-CircuitSVG 15 "MINI QUIZ GAME" '<text x="15" y="45" fill="#f8fafc" font-size="11">• Pins 2,3,4,5 ---> Answer Keys A, B, C, D</text><text x="15" y="75" fill="#22c55e" font-size="11">• Pin 10 (Green) &amp; Pin 11 (Red) Feedback</text><text x="15" y="105" fill="#67e8f9" font-size="11">• USB Serial Prompt UI &amp; Score Counter</text>'

Write-Host "✅ Created 15 SVG Circuit Diagrams in public/circuits and Desktop/circuits!"
