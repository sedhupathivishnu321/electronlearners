import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { FileText, Download, Code, Wrench, Calculator, HelpCircle, ArrowRight, ShoppingCart, ExternalLink, Play } from 'lucide-react';

export default function ResourcesHub() {
  const { products, addToCart } = useApp();
  const [activeTab, setActiveTab] = useState<'articles' | 'manuals' | 'code' | 'calculator' | 'trouble'>('articles');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Resistor Color Code Calculator State
  const [band1, setBand1] = useState<string>('brown');
  const [band2, setBand2] = useState<string>('black');
  const [band3, setBand3] = useState<string>('red');
  const [band4, setBand4] = useState<string>('gold');

  const colorValues: Record<string, { value: number; multiplier: number; tolerance: number; hex: string }> = {
    black: { value: 0, multiplier: 1, tolerance: 0, hex: '#000000' },
    brown: { value: 1, multiplier: 10, tolerance: 1, hex: '#8B4513' },
    red: { value: 2, multiplier: 100, tolerance: 2, hex: '#FF0000' },
    orange: { value: 3, multiplier: 1000, tolerance: 0, hex: '#FFA500' },
    yellow: { value: 4, multiplier: 10000, tolerance: 0, hex: '#FFFF00' },
    green: { value: 5, multiplier: 100000, tolerance: 0.5, hex: '#008000' },
    blue: { value: 6, multiplier: 1000000, tolerance: 0.25, hex: '#0000FF' },
    violet: { value: 7, multiplier: 10000000, tolerance: 0.1, hex: '#EE82EE' },
    grey: { value: 8, multiplier: 100000000, tolerance: 0.05, hex: '#808080' },
    white: { value: 9, multiplier: 1000000000, tolerance: 0, hex: '#FFFFFF' },
    gold: { value: 0, multiplier: 0.1, tolerance: 5, hex: '#D4AF37' },
    silver: { value: 0, multiplier: 0.01, tolerance: 10, hex: '#C0C0C0' }
  };

  const calculateResistance = () => {
    const val1 = colorValues[band1]?.value ?? 0;
    const val2 = colorValues[band2]?.value ?? 0;
    const mult = colorValues[band3]?.multiplier ?? 1;
    const tol = colorValues[band4]?.tolerance ?? 5;

    const baseValue = (val1 * 10 + val2) * mult;
    let formatted = '';
    if (baseValue >= 1000000) {
      formatted = `${(baseValue / 1000000).toFixed(1)} MΩ`;
    } else if (baseValue >= 1000) {
      formatted = `${(baseValue / 1000).toFixed(1)} kΩ`;
    } else {
      formatted = `${baseValue} Ω`;
    }

    return { value: formatted, tolerance: `±${tol}%` };
  };

  const resistanceResult = calculateResistance();

  // Articles & Search Traffic Funnel Mocks
  const ARTICLES = [
    {
      id: "art-1",
      title: "How to build an LDR-based automatic night light",
      slug: "how-to-build-ldr-night-light",
      summary: "Understand how Light Dependent Resistors (LDRs) work with transistors to trigger relays automatically.",
      content: `Light Dependent Resistors (LDRs), or photoresistors, decrease their electrical resistance as light intensity increases. By creating a simple voltage divider circuit with a 10kΩ resistor and feeding the junction into the base of a BC547 NPN transistor, you can create an automatic switch. When it gets dark, the LDR resistance rises, pulling the transistor base voltage high enough to turn it on, which subsequently triggers an LED or activates a 5V relay pin.`,
      components: [
        { name: "LDR Sensor Module", price: 15, id: "prod-5" },
        { name: "Arduino UNO Board", price: 599, id: "prod-1" },
        { name: "Electronics Fundamentals Kit", price: 999, id: "prod-2" }
      ],
      kitId: "prod-2",
      videoUrl: "https://www.youtube.com/watch?v=8q-p09yI6bM"
    },
    {
      id: "art-2",
      title: "What is PWM (Pulse Width Modulation) and how does it work?",
      slug: "what-is-pwm-microcontrollers",
      summary: "Master motor speed steering and LED brightness control utilizing digital pin pulse cycles.",
      content: `Pulse Width Modulation (PWM) is a technique for getting analog-like results with digital outputs. Microcontrollers can only switch digital pins between 0V and 5V. By switching the pin ON and OFF extremely fast, you create an average voltage. The percentage of time the signal is high is called the 'Duty Cycle'. A 50% duty cycle outputs an average of 2.5V. This is used extensively to run DC motors via H-Bridges or dim RGB LEDs.`,
      components: [
        { name: "Arduino UNO Board", price: 599, id: "prod-1" },
        { name: "Robotics Beginner Kit", price: 1999, id: "prod-8" }
      ],
      kitId: "prod-8",
      videoUrl: "https://www.youtube.com/watch?v=v_k4_v5v9yM"
    },
    {
      id: "art-3",
      title: "ESP32 vs Arduino: Choosing the right board for your IoT project",
      slug: "esp32-vs-arduino-iot",
      summary: "A detailed comparison of hardware speed, core counts, Wi-Fi connections, and power savings.",
      content: `Arduino UNO is an 8-bit board running at 16MHz, perfect for basic sensor projects and absolute beginners. However, it lacks built-in connectivity. The ESP32 is a dual-core 32-bit chip running at 240MHz with onboard Wi-Fi, Bluetooth LE, and 4MB flash. If your project requires cloud database uploads, Blynk connectivity, or hosting local web control pages, the ESP32 is the correct choice.`,
      components: [
        { name: "IoT ESP32 Starter Kit", price: 1899, id: "prod-6" },
        { name: "Arduino Starter Kit", price: 1499, id: "prod-1" }
      ],
      kitId: "prod-6",
      videoUrl: "https://www.youtube.com/watch?v=3q-v_q3rXqY"
    }
  ];

  const handleBuyComponent = (cName: string, pId: string, price: number) => {
    const matched = products.find(p => p.id === pId);
    if (matched) {
      addToCart(matched, 1);
    } else {
      const mockComponentProduct = {
        id: pId,
        name: cName,
        slug: cName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: 'Components' as any,
        price,
        originalPrice: price + 100,
        rating: 4.8,
        reviewsCount: 15,
        stock: 50,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=80",
        shortDesc: `Component for LDR circuit.`,
        description: `Tested components.`,
        learningObjectives: [],
        components: [],
        specifications: {},
        assemblySteps: [],
        manualUrl: '',
        datasheetUrl: '',
        videoUrl: ''
      };
      addToCart(mockComponentProduct, 1);
    }
  };

  const handleBuyKit = (kitId: string) => {
    const kit = products.find(p => p.id === kitId) || products[0];
    addToCart(kit, 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#0F172A] text-slate-100">
      
      {/* Page Title */}
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Ecosystem Support</span>
        <h1 className="text-3xl font-heading font-extrabold text-white mt-1 uppercase">Resources & Guides</h1>
        <p className="text-slate-400 text-xs mt-1">Access resistor calculators, schematic manuals, coding snippets, and hardware articles.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-xs font-semibold overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'articles', label: 'Tutorial Articles', icon: FileText },
          { key: 'manuals', label: 'Manuals & Datasheets', icon: Download },
          { key: 'code', label: 'Verified Code Templates', icon: Code },
          { key: 'calculator', label: 'Resistor Calculator', icon: Calculator },
          { key: 'trouble', label: 'Troubleshooting Guides', icon: Wrench }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as any);
              setSelectedArticleId(null);
            }}
            className={`py-3 border-b-2 whitespace-nowrap flex items-center gap-2 transition-all ${
              activeTab === tab.key ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panel Contents */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl">
        
        {/* TAB 1: ARTICLES */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            {!selectedArticleId ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ARTICLES.map((art) => (
                  <div key={art.id} className="p-5 rounded-xl bg-slate-950 border border-slate-850 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-white uppercase line-clamp-1">{art.title}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">{art.summary}</p>
                    </div>
                    <button
                      onClick={() => setSelectedArticleId(art.id)}
                      className="text-xs font-semibold text-blue-450 hover:text-blue-350 flex items-center gap-1 self-start"
                    >
                      Read Article & Buy Parts <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              (() => {
                const article = ARTICLES.find(a => a.id === selectedArticleId)!;
                return (
                  <div className="space-y-8">
                    <button onClick={() => setSelectedArticleId(null)} className="text-xs font-semibold text-slate-450 hover:text-white flex items-center gap-1">
                      ← Back to Articles list
                    </button>

                    <div className="space-y-4 max-w-4xl">
                      <h2 className="text-lg font-bold text-white uppercase tracking-wide">{article.title}</h2>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">{article.content}</p>
                    </div>

                    {article.videoUrl && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-between text-xs max-w-2xl">
                        <span className="font-semibold text-slate-200">YouTube Walkthrough by @LetsGetEngagedin</span>
                        <a href={article.videoUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-red-650 hover:bg-red-550 text-white font-semibold">
                          Watch Video
                        </a>
                      </div>
                    )}

                    {/* Funnel Widgets */}
                    <div className="border-t border-slate-850 pt-6 space-y-6 max-w-3xl">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Required Hardware Components</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Individual Parts */}
                        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase">Buy Parts Individually</h4>
                          <div className="space-y-2">
                            {article.components.map((comp, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 text-xs">
                                <span className="text-slate-200 font-semibold">{comp.name}</span>
                                <button
                                  onClick={() => handleBuyComponent(comp.name, comp.id, comp.price)}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-blue-600 hover:text-white text-[10px] font-bold border border-slate-700 transition-all"
                                >
                                  Add (₹{comp.price})
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Whole Kit */}
                        <div className="p-5 rounded-xl bg-gradient-to-b from-blue-950/20 to-slate-950 border border-blue-500/25 flex flex-col justify-between space-y-4 shadow">
                          <div className="space-y-1">
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[8px] font-bold uppercase tracking-wide">All-In-One Box</span>
                            <h4 className="text-xs font-bold text-white uppercase">Complete Project Kit Package</h4>
                            <p className="text-[10px] text-slate-450 leading-relaxed">Save time & shipping. Buy the entire pre-packaged kit containing these parts and printed guides.</p>
                          </div>
                          <button
                            onClick={() => handleBuyKit(article.kitId)}
                            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow"
                          >
                            <ShoppingCart className="w-4 h-4" /> Add Complete Kit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* TAB 2: MANUALS */}
        {activeTab === 'manuals' && (
          <div className="space-y-6 text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Official Setup Manuals & IC Datasheets</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Arduino 15-Circuits Learning Manual PDF", desc: "Detailed breadboard layouts & C++ code snippets.", url: "/downloads/manuals/Arduino_Starter_Kit_Guide.pdf" },
                { title: "ESP32 IoT Home-Automation Assembly Guide", desc: "Wooden model framing, relay specs, wifi settings.", url: "/downloads/manuals/Smart_Home_3D_Guide.pdf" },
                { title: "ATmega328P 8-bit Microcontroller Datasheet", desc: "Register configurations, ADC timings, pinouts.", url: "/downloads/datasheets/ATmega328P_Datasheet.pdf" },
                { title: "NE555 Timer IC Integrated Circuit Datasheet", desc: "Duty cycle ratios, internal block schematics.", url: "/downloads/datasheets/NE555_Datasheet.pdf" }
              ].map((doc, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="text-white font-semibold">{doc.title}</div>
                      <div className="text-slate-500 text-[10px]">{doc.desc}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Downloading: ${doc.title}`)}
                    className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CODE */}
        {activeTab === 'code' && (
          <div className="space-y-6 text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Verified Starter Code Snippets</h3>
            
            <div className="space-y-4">
              {[
                {
                  title: "1. Arduino LED Blink & Duty Cycle",
                  lang: "cpp",
                  code: `void setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}`
                },
                {
                  title: "2. Light Dependent Resistor (LDR) Analog Read Threshold",
                  lang: "cpp",
                  code: `const int LDR_PIN = A0;\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int lightVal = analogRead(LDR_PIN);\n  Serial.print("Intensity: ");\n  Serial.println(lightVal);\n  delay(100);\n}`
                }
              ].map((snippet, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="font-bold text-slate-200">{snippet.title}</div>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-emerald-450 font-mono overflow-x-auto whitespace-pre">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Resistor Band Color Code Calculator</h3>
            <p className="text-xs text-slate-400">Select the band colors of a carbon composition resistor to calculate its resistance and tolerance values.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-950 p-6 rounded-2xl border border-slate-850">
              {/* Controls */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Band 1 (1st Digit)</label>
                  <select value={band1} onChange={(e) => setBand1(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200">
                    {Object.keys(colorValues).filter(c => c !== 'gold' && c !== 'silver').map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Band 2 (2nd Digit)</label>
                  <select value={band2} onChange={(e) => setBand2(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200">
                    {Object.keys(colorValues).filter(c => c !== 'gold' && c !== 'silver').map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Band 3 (Multiplier)</label>
                  <select value={band3} onChange={(e) => setBand3(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200">
                    {Object.keys(colorValues).map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Band 4 (Tolerance)</label>
                  <select value={band4} onChange={(e) => setBand4(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200">
                    {['brown', 'red', 'green', 'blue', 'violet', 'grey', 'gold', 'silver'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              {/* Graphic Resistor Visualizer */}
              <div className="space-y-6 text-center">
                {/* Visual Resistor Body */}
                <div className="relative w-64 h-16 bg-slate-850 rounded-2xl border border-slate-700 mx-auto flex items-center justify-around px-8 shadow-inner">
                  {/* Lead Lines */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-8 w-8 h-1.5 bg-slate-500"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-8 w-8 h-1.5 bg-slate-500"></div>
                  
                  {/* Bands */}
                  <div className="w-3 h-full border-x border-black/10" style={{ backgroundColor: colorValues[band1]?.hex }}></div>
                  <div className="w-3 h-full border-x border-black/10" style={{ backgroundColor: colorValues[band2]?.hex }}></div>
                  <div className="w-3 h-full border-x border-black/10" style={{ backgroundColor: colorValues[band3]?.hex }}></div>
                  <div className="w-3 h-full border-x border-black/10" style={{ backgroundColor: colorValues[band4]?.hex }}></div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Calculated Resistance</div>
                  <div className="text-2xl font-extrabold text-blue-400 font-heading">{resistanceResult.value}</div>
                  <div className="text-[11px] text-slate-400">Tolerance: {resistanceResult.tolerance}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TROUBLESHOOTING */}
        {activeTab === 'trouble' && (
          <div className="space-y-6 text-xs text-slate-300">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Common Hardware Troubleshooting Tips</h3>
            
            <div className="space-y-4">
              {[
                { q: "avrdude: stk500_getsync(): attempt 1 of 10: not in sync: resp=0x00", a: "This means the Arduino IDE cannot talk to the bootloader. 1. Double check the USB cable is fully plugged in. 2. Verify the correct COM Port is selected under Tools > Port. 3. If using a clone board, make sure the CH340 Driver is installed." },
                { q: "ESP32 board fails to connect to Wi-Fi", a: "1. ESP32 ONLY supports 2.4GHz Wi-Fi bands. Make sure your router dual-band is outputting 2.4GHz. 2. Verify ssid and password credentials in your code are exact. 3. Provide sufficient power; USB ports might struggle with peak wifi transceiver currents, use an external 5V adapter." }
              ].map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white">Q: {faq.q}</div>
                  <p className="text-slate-400 leading-relaxed">A: {faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
