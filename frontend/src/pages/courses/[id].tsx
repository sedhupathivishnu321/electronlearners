import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { COURSES_DATA, STEMCourse } from '../../data/coursesData';
import { useApp } from '../../context/AppContext';
import { Play, CheckCircle, Award, BookOpen, Clock, Users, ArrowLeft, Lock, ShoppingCart, Star, ShieldAlert } from 'lucide-react';

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { products, user, addToCart, enrollCourse } = useApp();

  const course = COURSES_DATA.find((c) => c.id === id || c.slug === id) || COURSES_DATA[0];

  const [activeLesson, setActiveLesson] = useState(course?.modules[0]?.lessons[0]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['les-1']);

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-350">
        <p>Course not found.</p>
        <Link href="/courses" className="text-blue-500 hover:underline mt-4 inline-block">Back to Courses</Link>
      </div>
    );
  }

  // Check if course or corresponding recommended hardware kit is purchased by the logged-in user
  const isPurchased = user
    ? user.enrolledCourseIds.includes(course.id) ||
      user.purchasedProductIds.includes(course.recommendedHardwareId) ||
      user.role === 'admin' || user.role === 'store_manager'
    : false;

  const kitProduct = products.find(p => p.id === course.recommendedHardwareId) || products[0];
  const bundlePrice = Math.round(course.price * 0.5) + (kitProduct?.price || 0);
  const originalBundlePrice = course.originalPrice + (kitProduct?.originalPrice || 0);

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) =>
      prev.includes(lessonId) ? prev.filter((i) => i !== lessonId) : [...prev, lessonId]
    );
  };

  const handleBuyCourse = () => {
    const virtualCourseProduct = {
      id: `course-virtual-${course.id}`,
      name: `Course: ${course.title}`,
      slug: `enroll-${course.slug}`,
      category: 'Learning Kits' as any,
      price: course.price,
      originalPrice: course.originalPrice,
      rating: 5.0,
      reviewsCount: 1,
      stock: 99999,
      image: course.image,
      shortDesc: `Online course enrollment for ${course.title}.`,
      description: `Lifetime access to online curriculum.`,
      learningObjectives: [],
      components: [],
      specifications: {},
      assemblySteps: [],
      manualUrl: '',
      datasheetUrl: '',
      videoUrl: ''
    };
    addToCart(virtualCourseProduct, 1);
    router.push('/cart');
  };

  const handleBuyBundle = () => {
    if (kitProduct) {
      addToCart(kitProduct, 1);
    }
    const virtualCourseProduct = {
      id: `course-virtual-${course.id}`,
      name: `Course: ${course.title}`,
      slug: `enroll-${course.slug}`,
      category: 'Learning Kits' as any,
      price: Math.round(course.price * 0.5),
      originalPrice: course.price,
      rating: 5.0,
      reviewsCount: 1,
      stock: 99999,
      image: course.image,
      shortDesc: `Online course enrollment for ${course.title} (Bundle Offer).`,
      description: `Lifetime access to online curriculum.`,
      learningObjectives: [],
      components: [],
      specifications: {},
      assemblySteps: [],
      manualUrl: '',
      datasheetUrl: '',
      videoUrl: ''
    };
    addToCart(virtualCourseProduct, 1);
    router.push('/cart');
  };

  const handleLessonClick = (les: any) => {
    if (isPurchased || les.isFreePreview) {
      setActiveLesson(les);
    } else {
      alert("This lesson is locked. Purchase the course or bundle it with the physical kit to unlock!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#0F172A] text-slate-100">
      
      {/* Back Link */}
      <Link href="/courses" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Courses</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Video Player Main View */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
            {activeLesson && (isPurchased || activeLesson.isFreePreview) ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeLesson.videoUrl.split('v=')[1] || 'nL34zDTPkcs'}?autoplay=1`}
                title={activeLesson.title}
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 space-y-4">
                <Lock className="w-12 h-12 text-slate-650" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Lesson Locked</h3>
                  <p className="text-xs text-slate-400 max-w-sm">This lesson is locked. Enroll in the course for free or buy the recommended physical hardware kit to follow along.</p>
                </div>
                <div className="flex gap-3">
                  {user ? (
                    <button
                      onClick={() => enrollCourse(course.id)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all"
                    >
                      Enroll Free
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all"
                    >
                      Sign In to Enroll
                    </Link>
                  )}
                  {kitProduct && (
                    <button
                      onClick={() => {
                        addToCart(kitProduct, 1);
                        router.push('/cart');
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Buy Kit (₹{kitProduct.price})
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Lesson Metadata */}
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-blue-600/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                {activeLesson?.isFreePreview ? "Free Preview Lecture" : "Standard Lecture"}
              </span>
              {isPurchased ? (
                <button
                  onClick={() => activeLesson && toggleLessonComplete(activeLesson.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeLesson && completedLessonIds.includes(activeLesson.id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {activeLesson && completedLessonIds.includes(activeLesson.id) ? "Completed" : "Mark Complete"}
                </button>
              ) : (
                <span className="text-[10px] text-amber-500 font-bold uppercase flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4" /> Preview Mode
                </span>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-white font-heading">{activeLesson?.title || course.title}</h2>
            <p className="text-slate-350 text-xs leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* Right Column: Playlist & Funnel Ads */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Bundle Funnel Ad Box if not purchased */}
          {!isPurchased && kitProduct && (
            <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-950/20 to-slate-950 border border-blue-500/20 space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-xl rounded-full"></div>
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[9px] font-bold uppercase">Learning Bundle</span>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Get the Physical Kit</h4>
                <p className="text-[10px] text-slate-400">Follow along with actual hardware by purchasing the recommended kit bundle.</p>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-[11px]">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-200 line-clamp-1">{kitProduct.name}</div>
                  <div className="text-xs font-extrabold text-blue-450">₹{kitProduct.price}</div>
                </div>
              </div>

              <div className="flex gap-2">
                {user ? (
                  <button
                    onClick={() => enrollCourse(course.id)}
                    className="flex-grow py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all shadow"
                  >
                    Enroll Now (Free)
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex-grow py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-all shadow flex items-center justify-center"
                  >
                    Sign In to Enroll
                  </Link>
                )}
                <button
                  onClick={() => {
                    addToCart(kitProduct, 1);
                    router.push('/cart');
                  }}
                  className="flex-grow py-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-350 text-[10px] font-bold border border-slate-800 transition-all flex items-center justify-center gap-1"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Buy Kit
                </button>
              </div>
            </div>
          )}

          {/* Curriculum Sidebar */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Curriculum</h3>
                <span className="text-[10px] text-slate-450">{course.durationHours} Hours • {course.lessonsCount} Lectures</span>
              </div>
              {isPurchased && (
                <div className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Enrolled
                </div>
              )}
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {course.modules.map((mod) => (
                <div key={mod.id} className="space-y-2">
                  <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{mod.title}</div>
                  <div className="space-y-1">
                    {mod.lessons.map((les) => {
                      const isCompleted = completedLessonIds.includes(les.id);
                      const isActive = activeLesson?.id === les.id;
                      const isLocked = !isPurchased && !les.isFreePreview;
                      
                      return (
                        <div
                          key={les.id}
                          onClick={() => handleLessonClick(les)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                            isActive
                              ? 'bg-cyan-600/10 border-cyan-500/50 text-cyan-300'
                              : 'bg-slate-900 border-slate-850 text-slate-350 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate pr-2">
                            {isLocked ? (
                              <Lock className="w-3.5 h-3.5 text-slate-650 shrink-0" />
                            ) : isCompleted ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-450 shrink-0" />
                            ) : (
                              <Play className="w-3 h-3 text-slate-500 shrink-0" />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>
                          
                          {les.isFreePreview && !isPurchased && (
                            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 font-bold px-1.5 py-0.5 rounded uppercase">Preview</span>
                          )}
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
