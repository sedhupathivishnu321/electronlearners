import React, { useState } from 'react';
import { YouTubeTutorial } from '../../data/youtubeData';
import { X, Play, Download, Code, CheckCircle, ExternalLink, Cpu } from 'lucide-react';
import Link from 'next/link';

interface YouTubeModalProps {
  tutorial: YouTubeTutorial | null;
  onClose: () => void;
}

export const YouTubeModal: React.FC<YouTubeModalProps> = ({ tutorial, onClose }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'code' | 'transcript' | 'components'>('video');
  const [copied, setCopied] = useState(false);

  if (!tutorial) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(tutorial.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 rounded-md bg-red-600/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
              YouTube Tutorial
            </span>
            <h3 className="text-white text-sm font-semibold truncate max-w-md">{tutorial.title}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 space-x-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('video')}
            className={`py-3 border-b-2 flex items-center gap-1.5 ${activeTab === 'video' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <Play className="w-4 h-4" /> Watch Video
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 border-b-2 flex items-center gap-1.5 ${activeTab === 'code' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <Code className="w-4 h-4" /> Source Code
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`py-3 border-b-2 flex items-center gap-1.5 ${activeTab === 'transcript' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Timestamps & Notes
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={`py-3 border-b-2 flex items-center gap-1.5 ${activeTab === 'components' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Hardware Parts
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          
          {/* Video Player Tab */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${tutorial.youtubeId}?autoplay=1`}
                  title={tutorial.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div>
                <h4 className="text-white text-base font-semibold">{tutorial.title}</h4>
                <p className="text-slate-400 text-xs mt-1">{tutorial.description}</p>
                <div className="flex items-center justify-between pt-4 text-xs text-slate-500 border-t border-slate-800/80 mt-4">
                  <span>Channel: @{tutorial.channelName}</span>
                  <a href={tutorial.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline flex items-center gap-1">
                    Open on YouTube <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Source Code Tab */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400">{tutorial.codeDownloadName}</span>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5" />}
                  {copied ? "Copied to Clipboard!" : "Copy Code"}
                </button>
              </div>
              <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs overflow-x-auto border border-slate-800 max-h-96 font-mono leading-relaxed">
                <code>{tutorial.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Transcript & Timestamps Tab */}
          {activeTab === 'transcript' && (
            <div className="space-y-3">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Video Timestamps & Key Moments</h4>
              <div className="space-y-2">
                {tutorial.transcriptSummary.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hardware Parts Tab */}
          {activeTab === 'components' && (
            <div className="space-y-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Components Required for this Tutorial</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tutorial.componentsNeeded.map((comp, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-orange-400" /> {comp}
                  </li>
                ))}
              </ul>
              {tutorial.relatedProductId && (
                <div className="mt-4 p-4 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-between">
                  <div>
                    <h5 className="text-white text-xs font-bold">Want the complete official hardware kit?</h5>
                    <p className="text-slate-400 text-[11px]">Includes all parts pre-tested for this YouTube lesson.</p>
                  </div>
                  <Link href={`/products/${tutorial.relatedProductId}`} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
                    View STEM Kit
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
