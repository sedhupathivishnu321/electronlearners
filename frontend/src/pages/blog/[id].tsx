import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BLOGS_DATA } from '../../data/blogsData';
import { ArrowLeft, Clock, User, Calendar, Tag } from 'lucide-react';

export default function BlogPostDetail() {
  const router = useRouter();
  const { id } = router.query;

  const blog = BLOGS_DATA.find((b) => b.id === id || b.slug === id) || BLOGS_DATA[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <Link href="/blog" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to 100 Blog Posts</span>
      </Link>

      <div className="space-y-4">
        <span className="px-3 py-1 rounded bg-orange-600/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
          {blog.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white leading-tight">{blog.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-b border-slate-800 pb-4">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-cyan-400" /> {blog.author}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-orange-400" /> {blog.date}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-400" /> {blog.readTime}</span>
        </div>
      </div>

      <img src={blog.image} alt={blog.title} className="w-full h-80 object-cover rounded-2xl border border-slate-800" />

      {/* Markdown Content Box */}
      <div className="p-8 rounded-2xl glass-card border border-slate-800 text-slate-200 text-sm leading-relaxed space-y-4">
        <p className="text-base text-slate-300 font-medium leading-relaxed italic border-l-4 border-orange-500 pl-4 py-1">
          {blog.summary}
        </p>
        <div className="prose prose-invert max-w-none text-xs sm:text-sm space-y-4">
          <p>
            Welcome to the official technical article on <strong>{blog.title}</strong> by the ElectronLearners engineering team.
          </p>
          <h3 className="text-lg font-bold text-white font-heading pt-2">System Design & Implementation</h3>
          <p>
            When designing embedded hardware or wiring breadboard circuits, signal integrity and stable power rails are essential. Always place decoupling capacitors near microcontrollers and keep high-current motor drivers isolated from sensitive ADC measurement pins.
          </p>
          <pre className="bg-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
            <code>{`// ElectronLearners Verified C++ Driver Snippet
void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(115200);
  Serial.println("System initialized successfully.");
}`}</code>
          </pre>
        </div>
      </div>

    </div>
  );
}
