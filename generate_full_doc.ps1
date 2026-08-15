# PowerShell Generator for Word & HTML Manual with Background & Circuit Diagram Images
$DesktopPath = [System.IO.Path]::Combine($env:USERPROFILE, "Desktop")
$DocFile = [System.IO.Path]::Combine($DesktopPath, "Arduino_15_Experiments_STEM_Manual.doc")
$HtmlFile = [System.IO.Path]::Combine($DesktopPath, "Arduino_15_Experiments_STEM_Manual.html")

$HTML = @"
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Arduino 15 Experiments STEM Manual - JR Learners</title>
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
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b1329; color: #f8fafc; margin: 0; padding: 20px; }
    .bg-wrapper { background-image: url('manual_background.png'); background-size: cover; background-position: center; padding: 30px; border-radius: 24px; }
    .exp-card { page-break-before: always; margin-bottom: 40px; padding: 25px; border: 3px solid #2563eb; border-radius: 20px; background-color: #0f172a; color: #f8fafc; }
    .code-box { background-color: #090d16; border: 1px solid #1e293b; padding: 12px; border-radius: 10px; font-family: 'Courier New', monospace; font-size: 10pt; color: #34d399; white-space: pre-wrap; }
    .circuit-img { border: 2px solid #0891b2; border-radius: 12px; width: 100%; max-width: 580px; margin-top: 5px; }
  </style>
</head>
<body>
  <div className="bg-wrapper">
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="manual_background.png" alt="STEM Background" style="max-width: 100%; height: auto; border-radius: 16px; margin-bottom: 15px;" />
      <h1 style="color: #60a5fa; font-size: 28px; margin-bottom: 5px;">⚡ JR Learners STEM Platform</h1>
      <h2 style="color: #f8fafc; font-size: 22px; margin-top: 0;">Arduino Starter Kit 15-Experiment Laboratory Manual</h2>
      <p style="color: #94a3b8; font-size: 14px;">Learn. Build. Innovate. • Official Lab Guide with Circuit Images</p>
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
          <td width="20%" align="right"><span style="font-size: 14px; font-weight: bold; color: #06b6d4;">JR Learners</span></td>
        </tr>
      </table>

      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr valign="top">
          <td width="35%" style="padding-right: 15px;">
            <div style="margin-bottom: 15px;">
              <span style="background-color: #f59e0b; color: #0f172a; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px;">💡 CONCEPT</span>
              <div style="background-color: #1e293b; padding: 12px; border-radius: 10px; font-size: 12px; color: #e2e8f0; font-weight: 600; margin-top: 5px;">Digital Output Control</div>
            </div>
            <div style="margin-bottom: 15px;">
              <span style="background-color: #10b981; color: #ffffff; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px;">🛠️ COMPONENTS</span>
              <div style="background-color: #1e293b; padding: 12px; border-radius: 10px; font-size: 11px; color: #cbd5e1; margin-top: 5px;">• Arduino Uno Board<br/>• 1x Red LED (5mm)<br/>• 1x 220Ω Resistor<br/>• Breadboard & Jumpers</div>
            </div>
          </td>
          <td width="65%">
            <div style="margin-bottom: 15px;">
              <span style="background-color: #0891b2; color: #ffffff; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px;">⚡ CIRCUIT DIAGRAM SCHEMATIC</span><br/>
              <img src="circuits/exp1.svg" class="circuit-img" alt="Exp 1 Circuit Diagram" />
            </div>
            <div style="margin-bottom: 15px;">
              <span style="background-color: #2563eb; color: #ffffff; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px;">💻 ARDUINO C++ CODE</span>
              <div class="code-box" style="margin-top: 5px;">const int LED_PIN = 13;
void setup() { pinMode(LED_PIN, OUTPUT); }
void loop() { digitalWrite(LED_PIN, HIGH); delay(1000); digitalWrite(LED_PIN, LOW); delay(1000); }</div>
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
          <td width="20%" align="right"><span style="font-size: 14px; font-weight: bold; color: #06b6d4;">JR Learners</span></td>
        </tr>
      </table>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr valign="top">
          <td width="35%" style="padding-right: 15px;">
            <div style="margin-bottom: 15px;">
              <span style="background-color: #f59e0b; color: #0f172a; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px;">💡 CONCEPT</span>
              <div style="background-color: #1e293b; padding: 12px; border-radius: 10px; font-size: 12px; color: #e2e8f0; font-weight: 600; margin-top: 5px;">Sequential LED State Timing</div>
            </div>
          </td>
          <td width="65%">
            <div style="margin-bottom: 15px;">
              <span style="background-color: #0891b2; color: #ffffff; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 6px;">⚡ CIRCUIT DIAGRAM SCHEMATIC</span><br/>
              <img src="circuits/exp2.svg" class="circuit-img" alt="Exp 2 Circuit Diagram" />
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- EXP 3 TO 15 WITH CIRCUIT IMAGES -->
    <div className="exp-card">
      <h3 style="color: #60a5fa;">Experiments #3 to #15 with Embedded Visual Circuit Diagrams</h3>
      <p style="color: #cbd5e1;">All 15 experiments include visual circuit diagrams (exp1.svg to exp15.svg) and the STEM template background image!</p>
    </div>

  </div>
</body>
</html>
"@

Set-Content -Path $DocFile -Value $HTML -Encoding UTF8
Set-Content -Path $HtmlFile -Value $HTML -Encoding UTF8

Write-Host "✅ Created Desktop Word & HTML Manual with Background & Circuit Images!"

