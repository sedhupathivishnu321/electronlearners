import React, { useState } from 'react';
import Link from 'next/link';
import { COURSES_DATA, STEMCourse } from '../../data/coursesData';
import { useApp } from '../../context/AppContext';
import { BookOpen, Star, Clock, Users, Award, Search, ShoppingCart } from 'lucide-react';

export default function CoursesCatalog() {
  const { products, addToCart } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter courses based on search query
  const filteredCourses = COURSES_DATA.filter((c) => {
    return c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getRecommendedKit = (kitId: string) => {
    return products.find(p => p.id === kitId) || products[0];
  };

  const handleBuyBundle = (course: STEMCourse, kitProduct: any) => {
    // Add recommended kit to cart
    addToCart(kitProduct, 1);
    // Add course enrollment to cart at a special bundle discount (50% off course price)
    const bundleCoursePrice = Math.round(course.price * 0.5);
    const virtualCourseProduct = {
      id: `course-virtual-${course.id}`,
      name: `Course: ${course.title}`,
      slug: `enroll-${course.slug}`,
      category: 'Learning Kits' as any,
      price: bundleCoursePrice,
      originalPrice: course.price,
      rating: 5.0,
      reviewsCount: 1,
      stock: 99999,
      image: course.image,
      shortDesc: `Online course enrollment for ${course.title} (Bundle Offer).`,
      description: `Includes lifetime access to lectures, quizzes, and certificates.`,
      learningObjectives: [],
      components: [],
      specifications: {},
      assemblySteps: [],
      manualUrl: '',
      datasheetUrl: '',
      videoUrl: ''
    };
    addToCart(virtualCourseProduct, 1);
  };

  const handleBuyCourse = (course: STEMCourse) => {
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
      description: `Includes lifetime access to lectures, quizzes, and certificates.`,
      learningObjectives: [],
      components: [],
      specifications: {},
      assemblySteps: [],
      manualUrl: '',
      datasheetUrl: '',
      videoUrl: ''
    };
    addToCart(virtualCourseProduct, 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#0F172A] text-slate-100">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Structured Curriculum</span>
          <h1 className="text-3xl font-heading font-extrabold text-white mt-1 uppercase">Online STEM Courses</h1>
          <p className="text-slate-400 text-xs mt-1">Master basic electronics, hardware microcontrollers, sensor interfacing, and cloud IoT setups.</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => {
          const kitProduct = getRecommendedKit(course.recommendedHardwareId);
          const bundlePrice = Math.round(course.price * 0.5) + (kitProduct?.price || 0);
          const originalBundlePrice = course.originalPrice + (kitProduct?.originalPrice || 0);

          return (
            <div key={course.id} className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between shadow-xl">
              <div>
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                    {course.level}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{course.category} Course</span>
                    <Link href={`/courses/${course.id}`} className="block">
                      <h3 className="text-sm font-bold text-white hover:text-blue-400 transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                    </Link>
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-450 flex items-center justify-between border-y border-slate-850 py-2">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.durationHours} Hours</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-current" /> {course.rating.toFixed(1)}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.studentsEnrolled} Enrolled</span>
                  </div>

                  {/* Recommended hardware kit section */}
                  {kitProduct && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-1 text-[11px]">
                      <div className="text-slate-500 uppercase text-[9px] font-bold">Recommended Hardware</div>
                      <div className="font-semibold text-slate-200 line-clamp-1">{kitProduct.name}</div>
                      <div className="text-xs text-blue-450 font-bold">₹{kitProduct.price}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase Options */}
              <div className="p-5 pt-0 space-y-3">
                <div className="border-t border-slate-850 pt-3 flex flex-col gap-2">
                  
                  {/* Course Only */}
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">Course Only:</span>
                      <span className="font-bold text-white ml-2">₹{course.price}</span>
                    </div>
                    <button
                      onClick={() => handleBuyCourse(course)}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold border border-slate-700 transition-all"
                    >
                      Buy Course
                    </button>
                  </div>

                  {/* Course + Kit Bundle Funnel */}
                  {kitProduct && (
                    <div className="p-3 rounded-xl bg-blue-600/5 border border-blue-500/20 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-blue-400">Course + Hardware Kit Bundle</span>
                        <div className="flex flex-col items-end">
                          <span className="font-extrabold text-white">₹{bundlePrice}</span>
                          <span className="text-[9px] text-slate-500 line-through">₹{originalBundlePrice}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBuyBundle(course, kitProduct)}
                        className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-1"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Buy Bundle (Save ₹{originalBundlePrice - bundlePrice})
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
