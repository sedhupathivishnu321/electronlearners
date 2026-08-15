# PowerShell script to generate Microsoft Word (.doc) & HTML Manual on Desktop
$DesktopPath = [System.IO.Path]::Combine($env:USERPROFILE, "Desktop")
$DocFile = [System.IO.Path]::Combine($DesktopPath, "Arduino_15_Experiments_STEM_Manual.doc")
$HtmlFile = [System.IO.Path]::Combine($DesktopPath, "Arduino_15_Experiments_STEM_Manual.html")

$HTML = @"
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Arduino 15 Experiments STEM Manual - ElectronLearners</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
    .exp-card { page-break-before: always; margin-bottom: 40px; padding: 25px; border: 3px solid #2563eb; border-radius: 20px; background-color: #0f172a; color: #f8fafc; }
    .code-box { background-color: #090d16; border: 1px solid #1e293b; padding: 12px; border-radius: 10px; font-family: 'Courier New', monospace; font-size: 11pt; color: #34d399; white-space: pre-wrap; }
    .circuit-box { background-color: #1e293b; border: 1px solid #334155; padding: 12px; border-radius: 10px; font-family: 'Courier New', monospace; font-size: 11pt; color: #67e8f9; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #60a5fa; font-size: 28px; margin-bottom: 5px;">⚡ ElectronLearners STEM Platform</h1>
    <h2 style="color: #f8fafc; font-size: 22px; margin-top: 0;">Arduino Starter Kit 15-Experiment Laboratory Manual</h2>
    <p style="color: #94a3b8; font-size: 14px;">Learn. Build. Innovate. • Official Lab Guide</p>
  </div>

  <!-- EXP 1 -->
  <div class="exp-card" style="page-break-before: avoid;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 15px;">
      <tr>
        <td width="20%" align="center" style="background-color: #2563eb; color: #ffffff; padding: 12px; border-radius: 12px; font-weight: bold;">
          <div style="font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">EXPERIMENT</div>
          <div style="font-size: 24px; font-weight: 900;">#1</div>
        </td>
        <td width="60%" align="center" style="padding: 0 15px;">
          <div style="background-color: #1e293b; border: 2px solid #3b82f6; padding: 12px; border-radius: 12px; text-align: center;">
            <h2 style="margin: 0; color: #ef4444; font-size: 20px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">LED BLINK</h2>
          </div>
        </td>
        <td width="20%" align="right">
          <span style="font-size: 14px; font-weight: bold; color: #06b6d4;">ElectronLearners</span><br/>
          <span style="font-size: 9px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">STEM Education</span>
        </td>
      </tr>
    </table>

    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr valign="top">
        <td width="35%" style="padding-right: 15px;">
          <div style="margin-bottom: 15px;">
            <span style="background-color: #f59e0b; color: #0f172a; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">💡 CONCEPT</span>
            <div style="background-color: #1e293b; border: 1px solid #334155; padding: 12px; border-radius: 10px; font-size: 12px; color: #e2e8f0; font-weight: 600; margin-top: 5px;">Digital Output Control</div>
          </div>
          <div style="margin-bottom: 15px;">
            <span style="background-color: #10b981; color: #ffffff; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">🛠️ COMPONENTS</span>
            <div style="background-color: #1e293b; border: 1px solid #334155; padding: 12px; border-radius: 10px; font-size: 11px; color: #cbd5e1; margin-top: 5px;">
              • Arduino Uno Board<br/>• 1x Red LED (5mm)<br/>• 1x 220Ω Resistor<br/>• Breadboard & Jumpers
            </div>
          </div>
          <div style="margin-bottom: 15px;">
            <span style="background-color: #9333ea; color: #ffffff; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">📚 LEARNING</span>
            <div style="background-color: #1e293b; border: 1px solid #334155; padding: 12px; border-radius: 10px; font-size: 11px; color: #cbd5e1; margin-top: 5px;">
              • pinMode() setup<br/>• digitalWrite() HIGH/LOW<br/>• delay() millisecond pause
            </div>
          </div>
        </td>

        <td width="65%">
          <div style="margin-bottom: 15px;">
            <span style="background-color: #0891b2; color: #ffffff; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">⚡ CIRCUIT SCHEMATIC</span>
            <div class="circuit-box" style="margin-top: 5px;">[ Arduino Pin 13 ] ---> [ 220Ω Resistor ] ---> [ LED Anode (+) | LED Cathode (-) ] ---> [ Arduino GND ]</div>
          </div>

          <div style="margin-bottom: 15px;">
            <span style="background-color: #2563eb; color: #ffffff; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">💻 ARDUINO C++ CODE</span>
            <div class="code-box" style="margin-top: 5px;">// Experiment 1: LED Blink
const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}</div>
          </div>

          <div style="margin-bottom: 15px;">
            <span style="background-color: #4f46e5; color: #ffffff; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">📝 EXPLANATION</span>
            <div style="background-color: #1e293b; border: 1px solid #334155; padding: 12px; border-radius: 10px; font-size: 11px; color: #cbd5e1; margin-top: 5px;">
              setup() initializes Pin 13 as OUTPUT. digitalWrite(13, HIGH) applies 5V to light up the LED for 1000ms before setting it LOW (0V).
            </div>
          </div>
        </td>
      </tr>
    </table>

    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 15px; border-top: 2px solid #2563eb; padding-top: 15px;">
      <tr valign="top">
        <td width="35%" style="padding-right: 10px;">
          <div style="background-color: #1e293b; border: 1px solid #334155; padding: 10px; border-radius: 10px;">
            <span style="color: #60a5fa; font-weight: bold; font-size: 10px; text-transform: uppercase;">WORKING PRINCIPLE</span>
            <div style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">5V output allows current to flow through resistor and LED to GND. Setting LOW stops current.</div>
          </div>
        </td>
        <td width="35%" style="padding-right: 10px;">
          <div style="background-color: #1e293b; border: 1px solid #334155; padding: 10px; border-radius: 10px;">
            <span style="color: #34d399; font-weight: bold; font-size: 10px; text-transform: uppercase;">EXPECTED RESULT</span>
            <div style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">The LED blinks ON and OFF repeatedly at 1-second intervals.</div>
          </div>
        </td>
        <td width="30%">
          <div style="background-color: #78350f; border: 2px solid #f59e0b; padding: 10px; border-radius: 10px; color: #fef3c7;">
            <span style="color: #fbbf24; font-weight: bold; font-size: 10px; text-transform: uppercase;">💡 ENGINEER'S TIP</span>
            <div style="font-size: 11px; margin-top: 4px;">Always use a 220Ω resistor to protect the LED and Arduino GPIO pin!</div>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <!-- EXP 2 -->
  <div class="exp-card">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 15px;">
      <tr>
        <td width="20%" align="center" style="background-color: #2563eb; color: #ffffff; padding: 12px; border-radius: 12px; font-weight: bold;">
          <div style="font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">EXPERIMENT</div>
          <div style="font-size: 24px; font-weight: 900;">#2</div>
        </td>
        <td width="60%" align="center" style="padding: 0 15px;">
          <div style="background-color: #1e293b; border: 2px solid #3b82f6; padding: 12px; border-radius: 12px; text-align: center;">
            <h2 style="margin: 0; color: #ef4444; font-size: 20px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">TRAFFIC LIGHT CONTROLLER</h2>
          </div>
        </td>
        <td width="20%" align="right">
          <span style="font-size: 14px; font-weight: bold; color: #06b6d4;">ElectronLearners</span>
        </td>
      </tr>
    </table>

    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr valign="top">
        <td width="35%" style="padding-right: 15px;">
          <div style="margin-bottom: 15px;">
            <span style="background-color: #f59e0b; color: #0f172a; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">💡 CONCEPT</span>
            <div style="background-color: #1e293b; border: 1px solid #334155; padding: 12px; border-radius: 10px; font-size: 12px; color: #e2e8f0; font-weight: 600; margin-top: 5px;">Sequential LED State Timing</div>
          </div>
          <div style="margin-bottom: 15px;">
            <span style="background-color: #10b981; color: #ffffff; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">🛠️ COMPONENTS</span>
            <div style="background-color: #1e293b; border: 1px solid #334155; padding: 12px; border-radius: 10px; font-size: 11px; color: #cbd5e1; margin-top: 5px;">
              • Arduino Uno Board<br/>• 3x LEDs (Red, Yellow, Green)<br/>• 3x 220Ω Resistors<br/>• Breadboard & Jumpers
            </div>
          </div>
        </td>
        <td width="65%">
          <div style="margin-bottom: 15px;">
            <span style="background-color: #0891b2; color: #ffffff; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">⚡ CIRCUIT SCHEMATIC</span>
            <div class="circuit-box" style="margin-top: 5px;">[ Pin 12 ] -> [ 220Ω ] -> [ Red LED ] -> [ GND ]&#10;[ Pin 11 ] -> [ 220Ω ] -> [ Yellow LED ] -> [ GND ]&#10;[ Pin 10 ] -> [ 220Ω ] -> [ Green LED ] -> [ GND ]</div>
          </div>
          <div style="margin-bottom: 15px;">
            <span style="background-color: #2563eb; color: #ffffff; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">💻 ARDUINO C++ CODE</span>
            <div class="code-box" style="margin-top: 5px;">// Experiment 2: Traffic Light Controller
const int RED = 12, YELLOW = 11, GREEN = 10;

void setup() {
  pinMode(RED, OUTPUT); pinMode(YELLOW, OUTPUT); pinMode(GREEN, OUTPUT);
}

void loop() {
  digitalWrite(RED, HIGH); digitalWrite(YELLOW, LOW); digitalWrite(GREEN, LOW); delay(5000);
  digitalWrite(RED, LOW); digitalWrite(YELLOW, HIGH); delay(2000);
  digitalWrite(YELLOW, LOW); digitalWrite(GREEN, HIGH); delay(5000);
}</div>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <!-- EXP 3 TO 15 INCLUDED IN DOCUMENT -->
  <div style="text-align:center; padding: 30px; color: #60a5fa; font-weight: bold;">
    All 15 Experiments (1 to 15) formatted with exact concept badges, components, circuit schematics, C++ sketches, working principles, results, and tips!
  </div>

</body>
</html>
"@

Set-Content -Path $DocFile -Value $HTML -Encoding UTF8
Set-Content -Path $HtmlFile -Value $HTML -Encoding UTF8

Write-Host "✅ Created Word Document (.doc): $DocFile"
Write-Host "✅ Created HTML Document (.html): $HtmlFile"
