import React, { useState } from 'react';
import Link from 'next/link';
import { COURSES_DATA } from '../../data/coursesData';
import { BookOpen, Star, Clock, Users, Award, Search } from 'lucide-react';

export default function CoursesCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Electronics', 'Arduino', 'Embedded', 'ESP32', 'STM32', 'PCB Design', 'Robotics', 'Python'];

  const filteredCourses = COURSES_DATA.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Structured Curriculum</span>
          <h1 className="text-3xl font-heading font-extrabold text-white mt-1">STEM Online Certification Courses</h1>
          <p className="text-slate-400 text-xs mt-1">Master embedded systems engineering, robotics, and hardware programming with certified video courses.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search STEM courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-cyan-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                  {course.level}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="text-cyan-400 font-medium">{course.category}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <Link href={`/courses/${course.id}`} className="block">
                  <h3 className="text-sm font-semibold text-white line-clamp-2 hover:text-cyan-400 transition-colors">
                    {course.title}
                  </h3>
                </Link>

                <div className="text-xs text-slate-400 flex items-center justify-between pt-2">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.durationHours} Hours</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.studentsEnrolled}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-4">
              <div>
                <span className="text-lg font-bold text-white font-heading">₹{course.price}</span>
                <span className="text-xs text-slate-500 line-through ml-2">₹{course.originalPrice}</span>
              </div>
              <Link href={`/courses/${course.id}`} className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30">
                Enroll Course
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
