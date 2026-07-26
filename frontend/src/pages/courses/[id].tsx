import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { COURSES_DATA } from '../../data/coursesData';
import { Play, CheckCircle, Award, BookOpen, Clock, Users, ArrowLeft, Lock, FileCheck } from 'lucide-react';

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;

  const course = COURSES_DATA.find((c) => c.id === id || c.slug === id) || COURSES_DATA[0];
  const [activeLesson, setActiveLesson] = useState(course.modules[0]?.lessons[0]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['les-1']);

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) =>
      prev.includes(lessonId) ? prev.filter((i) => i !== lessonId) : [...prev, lessonId]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <Link href="/courses" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to STEM Courses</span>
      </Link>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Video Player Main View */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
            {activeLesson ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeLesson.videoUrl.split('v=')[1] || 'nL34zDTPkcs'}?autoplay=1`}
                title={activeLesson.title}
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">Select a lesson to begin.</div>
            )}
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase">
                Currently Playing
              </span>
              <button
                onClick={() => activeLesson && toggleLessonComplete(activeLesson.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeLesson && completedLessonIds.includes(activeLesson.id)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {activeLesson && completedLessonIds.includes(activeLesson.id) ? "Lesson Completed" : "Mark Complete"}
              </button>
            </div>
            <h2 className="text-xl font-bold text-white font-heading">{activeLesson?.title || course.title}</h2>
            <p className="text-slate-300 text-xs leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* Modules Playlist Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Course Curriculum</h3>
                <span className="text-[11px] text-slate-400">{course.durationHours} Hours • {course.lessonsCount} Lessons</span>
              </div>
              <Link href={`/certificates?course=${encodeURIComponent(course.title)}`} className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow">
                <Award className="w-3.5 h-3.5" /> Certificate
              </Link>
            </div>

            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
              {course.modules.map((mod) => (
                <div key={mod.id} className="space-y-2">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{mod.title}</div>
                  <div className="space-y-1">
                    {mod.lessons.map((les) => {
                      const isCompleted = completedLessonIds.includes(les.id);
                      const isActive = activeLesson?.id === les.id;
                      return (
                        <div
                          key={les.id}
                          onClick={() => setActiveLesson(les)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                            isActive
                              ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate pr-2">
                            {isCompleted ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> : <Play className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                            <span className="truncate">{les.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 shrink-0 font-mono">{les.duration}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
