import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EXPERIMENTS_15, ExperimentData } from './manual';
import { ArrowLeft, Save, Plus, Trash2, Printer, Download, Upload, Edit3, Check, Cpu, Lightbulb, Wrench, BookOpen, Sparkles, Copy } from 'lucide-react';

export default function LocalEditableManual() {
  const [experiments, setExperiments] = useState<ExperimentData[]>(EXPERIMENTS_15);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  // Load from LocalStorage on mount if custom edits exist
  useEffect(() => {
    try {
      const saved = localStorage.getItem('el_custom_manual');
      if (saved) {
        setExperiments(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const currentExp = experiments[selectedIndex] || experiments[0];

  const handleUpdateField = (field: keyof ExperimentData, value: any) => {
    const updated = [...experiments];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      [field]: value
    };
    setExperiments(updated);
  };

  const handleUpdateComponent = (compIdx: number, val: string) => {
    const updated = [...experiments];
    const comps = [...updated[selectedIndex].components];
    comps[compIdx] = val;
    updated[selectedIndex].components = comps;
    setExperiments(updated);
  };

  const handleAddComponent = () => {
    const updated = [...experiments];
    updated[selectedIndex].components.push("New Component");
    setExperiments(updated);
  };

  const handleRemoveComponent = (compIdx: number) => {
    const updated = [...experiments];
    updated[selectedIndex].components.splice(compIdx, 1);
    setExperiments(updated);
  };

  const handleUpdateLearning = (learnIdx: number, val: string) => {
    const updated = [...experiments];
    const outcomes = [...updated[selectedIndex].learning];
    outcomes[learnIdx] = val;
    updated[selectedIndex].learning = outcomes;
    setExperiments(updated);
  };

  const handleAddLearning = () => {
    const updated = [...experiments];
    updated[selectedIndex].learning.push("New Learning Outcome");
    setExperiments(updated);
  };

  const handleRemoveLearning = (learnIdx: number) => {
    const updated = [...experiments];
    updated[selectedIndex].learning.splice(learnIdx, 1);
    setExperiments(updated);
  };

  const handleAddNewExperiment = () => {
    const newNum = experiments.length + 1;
    const newExp: ExperimentData = {
      num: newNum,
      title: `EXPERIMENT ${newNum}: CUSTOM CIRCUIT`,
      concept: "Enter Concept Here",
      components: ["Arduino Uno Board", "1x LED", "1x Resistor"],
      learning: ["pinMode()", "digitalWrite()"],
      code: `// Custom Experiment #${newNum}\nvoid setup() {\n  pinMode(13, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(13, HIGH);\n}`,
      explanation: "Enter circuit explanation here.",
      working: "Describe how current flows in the circuit.",
      result: "Describe expected hardware output.",
      tip: "Engineer's tip for safety and best practices.",
      circuitDiagram: `[ Arduino Pin 13 ] ---> [ Resistor ] ---> [ LED ] ---> [ GND ]`
    };
    setExperiments([...experiments, newExp]);
    setSelectedIndex(experiments.length);
  };

  const handleSaveToLocalStorage = () => {
    try {
      localStorage.setItem('el_custom_manual', JSON.stringify(experiments));
      setSavedStatus("Saved to LocalStorage!");
      setTimeout(() => setSavedStatus(null), 3000);
    } catch (e) {
      alert("Failed to save to local storage.");
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(experiments, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "ElectronLearners_STEM_Manual.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setExperiments(parsed);
            setSelectedIndex(0);
            alert("Successfully imported custom manual experiments!");
          }
        } catch (err) {
          alert("Invalid JSON file format.");
        }
      };
    }
  };

  const handleDeleteExperiment = (idx: number) => {
    if (experiments.length <= 1) {
      alert("Cannot delete the last remaining experiment!");
      return;
    }
    if (confirm(`Delete Experiment #${experiments[idx].num}?`)) {
      const updated = experiments.filter((_, i) => i !== idx);
      setExperiments(updated);
      setSelectedIndex(0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:p-0 print:m-0">
      
      {/* Action Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6 print:hidden">
        <div>
          <Link href="/manual" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>View Published Manual</span>
          </Link>
          <h1 className="text-3xl font-heading font-extrabold text-white">Local Editable Manual Studio</h1>
          <p className="text-slate-400 text-xs">Create, edit, import/export, and print custom STEM Lab Manuals matching your exact visual background frame.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isEditing ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? "Edit Mode (Active)" : "Preview Mode"}
          </button>

          <button
            onClick={handleSaveToLocalStorage}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
          >
            <Save className="w-4 h-4" /> Save Local Edits
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-semibold text-xs flex items-center gap-1"
          >
            <Download className="w-4 h-4" /> Export JSON
          </button>

          <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-semibold text-xs flex items-center gap-1 cursor-pointer">
            <Upload className="w-4 h-4" /> Import JSON
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {savedStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 print:hidden">
          <Check className="w-4 h-4" /> {savedStatus}
        </div>
      )}

      {/* Experiment Selector Carousel Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none print:hidden">
        {experiments.map((item, idx) => (
          <div key={idx} className="flex items-center shrink-0 space-x-1">
            <button
              onClick={() => setSelectedIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedIndex === idx
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Exp #{item.num}: {item.title}
            </button>
            {isEditing && (
              <button
                onClick={() => handleDeleteExperiment(idx)}
                className="p-1 text-slate-600 hover:text-red-400"
                title="Delete Experiment"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
        {isEditing && (
          <button
            onClick={handleAddNewExperiment}
            className="px-3.5 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white text-xs font-bold flex items-center gap-1 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add New Experiment
          </button>
        )}
      </div>

      {/* EDITABLE EXPERIMENT TEMPLATE FRAME (MATCHING USER'S EXACT BACKGROUND TEMPLATE) */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 border-4 border-blue-600/50 shadow-2xl relative space-y-6 print:border-black print:text-black print:bg-white">
        
        {/* HEADER BAR: EXPERIMENT # + TITLE + ARDUINO BRAND LOGO */}
        <div className="grid grid-cols-12 gap-4 items-center border-b-2 border-blue-600/40 pb-6">
          <div className="col-span-3 sm:col-span-2">
            <div className="px-4 py-3 rounded-2xl bg-blue-600 text-white font-heading font-black text-center shadow-lg shadow-blue-600/30">
              <span className="block text-[10px] uppercase font-bold tracking-widest text-blue-200">EXPERIMENT</span>
              {isEditing ? (
                <input
                  type="number"
                  value={currentExp.num}
                  onChange={(e) => handleUpdateField('num', Number(e.target.value))}
                  className="w-16 bg-blue-700 text-white text-center font-bold text-xl rounded px-1"
                />
              ) : (
                <span className="text-2xl font-extrabold">#{currentExp.num}</span>
              )}
            </div>
          </div>

          <div className="col-span-6 sm:col-span-8 text-center">
            <div className="p-4 rounded-2xl bg-slate-900 border-2 border-blue-500/40 shadow-inner">
              {isEditing ? (
                <input
                  type="text"
                  value={currentExp.title}
                  onChange={(e) => handleUpdateField('title', e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 text-red-500 text-center font-heading font-black text-xl sm:text-2xl uppercase rounded px-2 py-1 border border-slate-800"
                />
              ) : (
                <h2 className="text-xl sm:text-2xl font-heading font-black tracking-wide text-red-500 uppercase">{currentExp.title}</h2>
              )}
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
            
            {/* CONCEPT BOX */}
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow">
                <Lightbulb className="w-4 h-4" />
                <span>CONCEPT</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-semibold leading-relaxed">
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={currentExp.concept}
                    onChange={(e) => handleUpdateField('concept', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-normal"
                  />
                ) : (
                  currentExp.concept
                )}
              </div>
            </div>

            {/* COMPONENTS BOX */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                  <Wrench className="w-4 h-4" />
                  <span>COMPONENTS</span>
                </div>
                {isEditing && (
                  <button onClick={handleAddComponent} className="text-emerald-400 text-[11px] font-bold hover:underline">+ Add Part</button>
                )}
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
                {currentExp.components.map((comp, idx) => (
                  <div key={idx} className="flex items-center justify-between space-x-2">
                    {isEditing ? (
                      <div className="flex items-center space-x-2 w-full">
                        <input
                          type="text"
                          value={comp}
                          onChange={(e) => handleUpdateComponent(idx, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                        />
                        <button onClick={() => handleRemoveComponent(idx)} className="text-red-400 text-xs px-1">✕</button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                        <span>{comp}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* LEARNING OUTCOMES BOX */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                  <BookOpen className="w-4 h-4" />
                  <span>LEARNING</span>
                </div>
                {isEditing && (
                  <button onClick={handleAddLearning} className="text-purple-400 text-[11px] font-bold hover:underline">+ Add Outcome</button>
                )}
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
                {currentExp.learning.map((obj, idx) => (
                  <div key={idx} className="flex items-center justify-between space-x-2">
                    {isEditing ? (
                      <div className="flex items-center space-x-2 w-full">
                        <input
                          type="text"
                          value={obj}
                          onChange={(e) => handleUpdateLearning(idx, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                        />
                        <button onClick={() => handleRemoveLearning(idx)} className="text-red-400 text-xs px-1">✕</button>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-2">
                        <span className="text-purple-400 font-bold">•</span>
                        <span>{obj}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT MAIN PANEL (Circuit Diagram, Code, Explanation) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* CIRCUIT DIAGRAM & SCHEMATIC WIRING BOX */}
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-cyan-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                <Cpu className="w-4 h-4" />
                <span>CIRCUIT DIAGRAM & SCHEMATIC WIRING</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={currentExp.circuitDiagram}
                    onChange={(e) => handleUpdateField('circuitDiagram', e.target.value)}
                    className="w-full bg-slate-950 text-cyan-300 font-mono text-xs p-2 rounded border border-slate-800"
                  />
                ) : (
                  <pre>{currentExp.circuitDiagram}</pre>
                )}
              </div>
            </div>

            {/* ARDUINO C++ CODE BOX */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                  <Sparkles className="w-4 h-4" />
                  <span>ARDUINO C++ CODE</span>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-[#090D16] border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
                {isEditing ? (
                  <textarea
                    rows={8}
                    value={currentExp.code}
                    onChange={(e) => handleUpdateField('code', e.target.value)}
                    className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-3 rounded border border-slate-800"
                  />
                ) : (
                  <pre><code>{currentExp.code}</code></pre>
                )}
              </div>
            </div>

            {/* EXPLANATION BOX */}
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                <span>EXPLANATION</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={currentExp.explanation}
                    onChange={(e) => handleUpdateField('explanation', e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs p-2 rounded border border-slate-800"
                  />
                ) : (
                  currentExp.explanation
                )}
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
              {isEditing ? (
                <textarea
                  rows={2}
                  value={currentExp.working}
                  onChange={(e) => handleUpdateField('working', e.target.value)}
                  className="w-full bg-slate-950 text-slate-300 text-xs p-2 rounded border border-slate-800 mt-1"
                />
              ) : (
                <p className="text-xs text-slate-300 pt-1 leading-relaxed">{currentExp.working}</p>
              )}
            </div>

            {/* RESULT */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-400 text-[10px] font-extrabold uppercase">EXPECTED RESULT</span>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={currentExp.result}
                  onChange={(e) => handleUpdateField('result', e.target.value)}
                  className="w-full bg-slate-950 text-slate-300 text-xs p-2 rounded border border-slate-800 mt-1"
                />
              ) : (
                <p className="text-xs text-slate-300 pt-1 leading-relaxed">{currentExp.result}</p>
              )}
            </div>
          </div>

          {/* ENGINEER'S TIP (YELLOW HIGHLIGHT BOX MATCHING TEMPLATE) */}
          <div className="lg:col-span-4 p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-200 space-y-1 flex flex-col justify-center">
            <div className="flex items-center space-x-2 font-bold text-xs text-amber-400 uppercase">
              <Lightbulb className="w-4 h-4 fill-current text-amber-400" />
              <span>ENGINEER'S TIP</span>
            </div>
            {isEditing ? (
              <textarea
                rows={2}
                value={currentExp.tip}
                onChange={(e) => handleUpdateField('tip', e.target.value)}
                className="w-full bg-slate-950 text-amber-200 text-xs p-2 rounded border border-slate-800"
              />
            ) : (
              <p className="text-xs leading-relaxed text-amber-100">{currentExp.tip}</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
