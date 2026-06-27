import Link from 'next/link';
import { ArrowRight, Wand2, GitBranch, BookOpen, ShieldCheck, Sparkles, CheckCircle, GraduationCap, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-slate-50 min-h-screen -mt-8 -mx-4 md:-mx-8 overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-violet-100/40 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 md:px-8 text-center max-w-5xl mx-auto">
        {/* Floating Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Academic Assistant
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Supercharge Your Study <br />
          Workflow with <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">AIaBLE</span>
        </h1>

        {/* Hero Subheading */}
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8 font-medium">
          The ultimate productivity companion for modern students. Optimize prompts, plan assignments, explore academic recipes, and verify AI outputs all in one workspace.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/home"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-violet-700 active:bg-violet-800 transition duration-200 shadow-lg shadow-violet-200 hover:-translate-y-0.5"
          >
            Enter Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-6 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 transition duration-200 shadow-sm"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-16 px-4 md:px-8 max-w-7xl mx-auto border-t border-slate-200/60 relative">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-2">Capabilities</h2>
          <h3 className="text-3xl font-bold text-slate-900">Built to handle academic challenges</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 mb-5">
              <Wand2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Prompt Optimizer</h4>
            <p className="text-sm text-slate-500 leading-relaxed flex-1">
              Elevate your raw requests into high-fidelity structured prompts for better, context-aware AI responses.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5">
              <GitBranch className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Task Matcher</h4>
            <p className="text-sm text-slate-500 leading-relaxed flex-1">
              Input assignment tasks and generate a tailored, step-by-step development pipeline instantly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-5">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">AI Recipe Library</h4>
            <p className="text-sm text-slate-500 leading-relaxed flex-1">
              Browse over 400+ custom-crafted templates designed specifically for coding, reports, and studying.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Output Validator</h4>
            <p className="text-sm text-slate-500 leading-relaxed flex-1">
              Validate and cross-check AI generated answers against source materials to eliminate hallucinations.
            </p>
          </div>
        </div>
      </section>

      {/* Trust / Stats Section */}
      <section className="bg-white py-16 px-4 md:px-8 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">
              <GraduationCap className="w-4 h-4" /> Academic Integrity
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Ethical AI Assistance</h3>
            <p className="text-slate-600 leading-relaxed">
              AIaBLE is designed with guardrails to promote learning and critical thinking. We structure tasks and build reflective question checkpoints (Ethics Cards) to help students learn alongside AI responsibly.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 w-full md:w-auto shrink-0">
            <div className="p-4 border-l-4 border-violet-500 bg-slate-50 rounded-r-xl">
              <div className="text-4xl font-extrabold text-slate-900">400+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Prompt Recipes</div>
            </div>
            <div className="p-4 border-l-4 border-indigo-500 bg-slate-50 rounded-r-xl">
              <div className="text-4xl font-extrabold text-slate-900">100%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Gemini Speed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-8 text-center text-slate-400 text-sm">
        <p>© 2026 AIaBLE Productivity Hub. Built with Google Gemini.</p>
      </footer>
    </div>
  );
}