import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Heart, Search, Star, Filter, Cpu, Check, Layers, Tag, HelpCircle } from 'lucide-react';

export default function ProductsCatalog() {
  const { products, addToCart, toggleWishlist, wishlist } = useApp();
  const router = useRouter();

  // Sidebar Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');
  const [showComparison, setShowComparison] = useState<boolean>(true);
  const [selectedKitsModal, setSelectedKitsModal] = useState<any | null>(null);

  // Sync state with URL Query Params
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.category) {
      setSelectedCategory(router.query.category as string);
    }
    if (router.query.type === 'kits') {
      setSelectedCategory('Learning Kits');
    }
    if (router.query.search) {
      setSearchQuery(router.query.search as string);
    }
  }, [router.isReady, router.query]);

  // Categories list based on products data
  const categories = ['All', 'Arduino', 'Electronics', 'Robotics', 'IoT', 'Raspberry Pi', 'AI', 'PCB', 'Embedded', 'Learning Kits'];
  const platforms = ['All', 'Arduino', 'ESP32', 'Raspberry Pi', 'STM32', 'None'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Apply filters
  const filteredProducts = products.filter((product) => {
    // Category match
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Learning Kits') {
        matchesCategory = product.category === 'Arduino' || product.category === 'Robotics' || product.category === 'IoT' || product.badge === 'Bestseller';
      } else {
        matchesCategory = product.category.toLowerCase() === selectedCategory.toLowerCase();
      }
    }

    // Search match
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());

    // Price range match
    let matchesPrice = true;
    if (priceRange === 'under-1500') matchesPrice = product.price < 1500;
    else if (priceRange === '1500-3000') matchesPrice = product.price >= 1500 && product.price <= 3000;
    else if (priceRange === 'over-3000') matchesPrice = product.price > 3000;

    // Platform match
    let matchesPlatform = true;
    if (selectedPlatform !== 'All') {
      if (selectedPlatform === 'Arduino') matchesPlatform = product.name.toLowerCase().includes('arduino') || product.specifications?.['Microcontroller']?.includes('ATmega');
      else if (selectedPlatform === 'ESP32') matchesPlatform = product.name.toLowerCase().includes('esp32');
      else if (selectedPlatform === 'Raspberry Pi') matchesPlatform = product.name.toLowerCase().includes('raspberry');
      else if (selectedPlatform === 'None') matchesPlatform = !product.name.toLowerCase().match(/arduino|esp32|raspberry/);
    }

    // Difficulty match
    let matchesDifficulty = true;
    if (selectedDifficulty !== 'All') {
      matchesDifficulty = product.learningObjectives?.some(o => o.toLowerCase().includes(selectedDifficulty.toLowerCase())) || 
                          product.shortDesc.toLowerCase().includes(selectedDifficulty.toLowerCase()) ||
                          (selectedDifficulty === 'Beginner' && product.price < 1500);
    }

    // Availability match
    let matchesAvailability = true;
    if (selectedAvailability === 'in-stock') matchesAvailability = product.stock > 0;
    else if (selectedAvailability === 'out-of-stock') matchesAvailability = product.stock === 0;

    return matchesCategory && matchesSearch && matchesPrice && matchesPlatform && matchesDifficulty && matchesAvailability;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return b.rating - a.rating;
  });

  // Comparison Matrix Data (Arduino UNO vs Nano vs Mega)
  const unoItem = products.find(p => p.id === 'prod-1') || products[0];
  const comparisonProducts = [
    {
      name: "Arduino UNO R3 Starter Kit",
      digitalIO: "14 pins",
      analogInputs: "6 pins",
      flash: "32 KB",
      usb: "Type-B",
      beginner: "Yes (Excellent)",
      projectsCount: "30+ Lab Projects",
      addOnComponents: "I2C 16x2 LCD display, SG90 servo motor, DHT11 humidity unit, HC-SR04 ultrasonic sound sensor, 5V digital relay, Active buzzer, Light LDR sensors",
      experiments: [
        "Experiment 1: LED Blink (GPIO State Control)",
        "Experiment 2: Traffic Light Sequence Controller",
        "Experiment 3: LDR Intelligent Automatic Street Light",
        "Experiment 4: Analog Sensor Calibration & Plotting",
        "Experiment 5: RGB Color Mixing Mood Lamp",
        "Experiment 6: SG90 Servo Sweep & Sweep Speed Controls",
        "Experiment 7: 16x2 LCD Character Welcome Terminal",
        "Experiment 8: DHT11 Digital Thermometer Log Display",
        "Experiment 9: HC-SR04 Sound Distance Alert system",
        "Experiment 10: 5V Home Appliance Relay Switching"
      ],
      price: unoItem?.price || 1499,
      product: unoItem
    },
    {
      name: "Arduino Nano V3 Starter Kit",
      digitalIO: "22 pins",
      analogInputs: "8 pins",
      flash: "32 KB",
      usb: "Mini-USB",
      beginner: "Yes (Breadboard)",
      projectsCount: "15+ Prototyping Projects",
      addOnComponents: "Breadboard breakout interface, MPU6050 Accelerometer Gyro, HC-05 Bluetooth transceivers, NRF24L01 RF communications module, Infrared IR receiver card",
      experiments: [
        "Experiment 1: Breadboard Blink & Multi-LED Arrays",
        "Experiment 2: MPU6050 Motion Angles Angle Plotting",
        "Experiment 3: Bluetooth Serial Remote Controls",
        "Experiment 4: RF Transmitter-Receiver Telemetry Loop",
        "Experiment 5: Infrared Remote Controller Command Decoder",
        "Experiment 6: Ambient Light Sensor Sleep Mode Alarm",
        "Experiment 7: SPI Digital Resistor Calibration",
        "Experiment 8: Analog Comparator Interrupt Control"
      ],
      price: Math.round((unoItem?.price || 1499) * 0.6),
      product: unoItem // fallback for add to cart
    },
    {
      name: "Arduino Mega 2560 Starter Kit",
      digitalIO: "54 pins",
      analogInputs: "16 pins",
      flash: "256 KB",
      usb: "Type-B",
      beginner: "Medium (Complex)",
      projectsCount: "50+ Enterprise Projects",
      addOnComponents: "3.2 inch TFT touch-screen shield, RC522 RFID Card Scanner, DS1307 Real Time Clock, Stepper motor + ULN2003 driver, Soil moisture probe, Gas sensor",
      experiments: [
        "Experiment 1: Bare-metal Multi-pin Register Masking",
        "Experiment 2: 3.2\" TFT Screen UI Layout Layouts",
        "Experiment 3: RFID Gate Security Card Verification",
        "Experiment 4: DS1307 RTC Clock Time Alarm Alert",
        "Experiment 5: Stepper Motor Step Driver Calibrations",
        "Experiment 6: Soil Moisture Irrigation Water Relay System",
        "Experiment 7: Gas Concentration Alarms with Buzzer",
        "Experiment 8: FreeRTOS Task Scheduling & Multitasking",
        "Experiment 9: Multi-bus UART Telemetry Console Logs",
        "Experiment 10: Matrix Keypad Lock Password Verification"
      ],
      price: Math.round((unoItem?.price || 1499) * 1.8),
      product: products.find(p => p.name.includes('Mega')) || unoItem
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* 1. Header Title & Search Controls */}
      <div className="border-b border-slate-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Business Catalog</span>
          <h1 className="text-3xl font-heading font-extrabold text-white mt-1 uppercase">Shop Products & Kits</h1>
          <p className="text-slate-400 text-xs mt-1">High-quality development boards, sensors, electronics components, and all-in-one project kits.</p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search store catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
          >
            <option value="rating">Sort by Rating</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all w-full sm:w-auto ${
              showComparison ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-450 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" /> Compare Boards
          </button>
        </div>
      </div>

      {/* 2. Product Comparison Matrix (Arduino boards) */}
      {showComparison && (
        <div className="p-6 rounded-2xl glass-card border border-blue-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
                <Cpu className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Developer Boards Comparison Matrix</h3>
                <p className="text-[10px] text-slate-400">Compare specifications of popular Arduino boards to pick the correct one for your project.</p>
              </div>
            </div>
            <button onClick={() => setShowComparison(false)} className="text-xs text-slate-500 hover:text-white">Hide</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Feature</th>
                  {comparisonProducts.map((p, idx) => (
                    <th key={idx} className="p-3 text-center text-white font-bold">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-3 font-semibold text-slate-450">Digital I/O</td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center font-mono">{p.digitalIO}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-450">Analog Inputs</td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center font-mono">{p.analogInputs}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-450">Flash Memory</td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center font-mono">{p.flash}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-450">USB Connection</td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center">{p.usb}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-450">Beginner Friendly</td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.beginner.includes('Yes') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>{p.beginner}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-450">Projects Supported</td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center font-semibold text-blue-300">{p.projectsCount}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-450">Add-on Modules</td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center text-[10px] text-slate-450 max-w-[200px] leading-relaxed mx-auto">{p.addOnComponents}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-450">Syllabus / Lab Guides</td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center">
                      <button
                        onClick={() => setSelectedKitsModal(p)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-[10px] font-bold text-cyan-400 border border-slate-700 transition-all cursor-pointer shadow-md"
                      >
                        View Experiments List
                      </button>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Estimated Price</td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center font-extrabold text-blue-450 text-sm">₹{p.price}</td>
                  ))}
                </tr>
                <tr className="bg-slate-900/10">
                  <td className="p-3"></td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center">
                      <button
                        onClick={() => {
                          if (p.product) {
                            addToCart(p.product);
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-all shadow-md shadow-blue-600/10"
                      >
                        Add to Cart
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Sidebar Filters & Products Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6 bg-slate-900/40 p-5 border border-slate-800 rounded-2xl h-fit">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-white font-bold">
            <Filter className="w-4 h-4 text-blue-500" />
            <span>Filters</span>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Category</label>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-blue-600/15 border-l-2 border-blue-500 text-blue-400 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Price Range</label>
            <div className="flex flex-col gap-1.5 text-xs">
              {[
                { key: 'All', label: 'All Prices' },
                { key: 'under-1500', label: 'Under ₹1,500' },
                { key: '1500-3000', label: '₹1,500 - ₹3,000' },
                { key: 'over-3000', label: 'Over ₹3,000' }
              ].map((range) => (
                <button
                  key={range.key}
                  onClick={() => setPriceRange(range.key)}
                  className={`text-left px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-between ${
                    priceRange === range.key
                      ? 'bg-blue-600/15 border-l-2 border-blue-500 text-blue-400 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{range.label}</span>
                  {priceRange === range.key && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Platform Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Platform Board</label>
            <div className="flex flex-col gap-1.5 text-xs">
              {platforms.map((plat) => (
                <button
                  key={plat}
                  onClick={() => setSelectedPlatform(plat)}
                  className={`text-left px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-between ${
                    selectedPlatform === plat
                      ? 'bg-blue-600/15 border-l-2 border-blue-500 text-blue-400 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{plat}</span>
                  {selectedPlatform === plat && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Difficulty</label>
            <div className="flex flex-col gap-1.5 text-xs">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`text-left px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-between ${
                    selectedDifficulty === diff
                      ? 'bg-blue-600/15 border-l-2 border-blue-500 text-blue-400 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{diff}</span>
                  {selectedDifficulty === diff && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Availability</label>
            <div className="flex flex-col gap-1.5 text-xs">
              {[
                { key: 'All', label: 'All Stock Status' },
                { key: 'in-stock', label: 'In Stock' },
                { key: 'out-of-stock', label: 'Out of Stock' }
              ].map((status) => (
                <button
                  key={status.key}
                  onClick={() => setSelectedAvailability(status.key)}
                  className={`text-left px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-between ${
                    selectedAvailability === status.key
                      ? 'bg-blue-600/15 border-l-2 border-blue-500 text-blue-400 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{status.label}</span>
                  {selectedAvailability === status.key && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSelectedCategory('All');
              setPriceRange('All');
              setSelectedPlatform('All');
              setSelectedDifficulty('All');
              setSelectedAvailability('All');
              setSearchQuery('');
            }}
            className="w-full py-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-all mt-4"
          >
            Clear Filters
          </button>
        </aside>

        {/* Products Grid Section */}
        <section className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-450">
            <span>Showing {filteredProducts.length} hardware products</span>
            {selectedCategory !== 'All' && (
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 font-semibold">
                Category: {selectedCategory}
              </span>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlist.some((p) => p.id === product.id);
                return (
                  <div key={product.id} className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between shadow-lg">
                    <div>
                      <div className="relative aspect-video bg-slate-900 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        {product.badge && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                            {product.badge}
                          </span>
                        )}
                        <button
                          onClick={() => toggleWishlist(product)}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                            isWishlisted ? 'bg-red-600 text-white' : 'bg-slate-900/80 text-slate-300 hover:text-red-400'
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-450">
                          <span className="text-cyan-400 font-medium">{product.category}</span>
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{product.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <Link href={`/products/${product.id}`} className="block">
                          <h3 className="text-sm font-semibold text-white line-clamp-1 hover:text-blue-400 transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                          {product.shortDesc}
                        </p>

                        <div className="text-[10px] font-bold text-slate-500">
                          SKU: {product.specifications?.['Microcontroller'] ? `ARD-UNO-${product.id.split('-')[1] || '01'}` : `COMP-${product.id.split('-')[1] || '02'}`}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex flex-col gap-3 border-t border-slate-800/80 mt-4">
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="text-base font-extrabold text-white font-heading">₹{product.price}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-slate-500 line-through ml-2">₹{product.originalPrice}</span>
                          )}
                        </div>
                        
                        <span className={`text-[10px] font-bold ${
                          product.stock > 10 ? 'text-emerald-500' : product.stock > 0 ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="flex-grow text-center py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center border border-slate-800 rounded-2xl glass-card text-slate-400 space-y-3">
              <HelpCircle className="w-10 h-10 mx-auto text-slate-650" />
              <h3 className="text-sm font-semibold text-white">No products found</h3>
              <p className="text-xs">Try adjusting your filters or search terms to find what you are looking for.</p>
            </div>
          )}
        </section>
      </div>

      {/* Experiments List Modal */}
      {selectedKitsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">{selectedKitsModal.name}</h3>
                <span className="text-[10px] text-cyan-400 font-semibold">{selectedKitsModal.projectsCount}</span>
              </div>
              <button
                onClick={() => setSelectedKitsModal(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 transition-all text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Included Add-On Components</h4>
                <p className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 leading-relaxed text-slate-200">
                  {selectedKitsModal.addOnComponents}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">List of Practical Experiments</h4>
                <div className="space-y-1.5">
                  {selectedKitsModal.experiments?.map((exp: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/40 border border-slate-850">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                      <span>{exp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-center">
              <button
                onClick={() => setSelectedKitsModal(null)}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow"
              >
                Understood, Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
