import Link from 'next/link';
import { 
  ArrowRight, 
  Wand2, 
  GitBranch, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle, 
  GraduationCap, 
  Zap, 
  ChevronRight,
  Code2,
  FileText,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-slate-50 min-h-screen -mt-8 -mx-4 md:-mx-8 overflow-hidden pb-16">
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-200/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 md:px-8 text-center max-w-5xl mx-auto">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold mb-8 hover:bg-violet-100/60 transition duration-300 cursor-pointer">
          <Sparkles className="w-3.5 h-3.5 text-violet-500 animate-spin" style={{ animationDuration: '3s' }} />
          <span>The Next-Gen Academic AI Workspace</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
          Smarter Studies. <br />
          Better Prompts. <br />
          <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Unleash AIaBLE.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
          AIaBLE bridges the gap between students and Artificial Intelligence. Optimize prompts, match assignments to step-by-step tasks, explore hundreds of expert recipes, and validate outputs.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href="/home"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-base font-bold text-white hover:bg-violet-700 active:bg-violet-800 transition duration-200 shadow-lg shadow-violet-200 hover:-translate-y-0.5"
          >
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-8 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 transition duration-200 shadow-sm"
          >
            See How It Works
          </a>
        </div>
      </section>

      {/* Visual App Mockup Preview */}
      <section className="relative px-4 md:px-8 max-w-5xl mx-auto mb-24">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 md:p-4 overflow-hidden relative group">
          {/* Glass window controls */}
          <div className="flex items-center gap-1.5 mb-3 px-2">
            <span className="w-3 h-3 rounded-full bg-rose-400 block" />
            <span className="w-3 h-3 rounded-full bg-amber-400 block" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 block" />
            <span className="text-xs text-slate-400 ml-4 font-mono select-none">aiable.workspace/dashboard</span>
          </div>
          {/* Dashboard Preview Image/Mock */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden relative">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Welcome to Alable, U!</h3>
                  <p className="text-xs text-slate-400">Your AI-powered productivity platform.</p>
                </div>
                <div className="h-6 w-24 bg-violet-100 rounded-md flex items-center justify-center text-[10px] font-bold text-violet-700">
                  Active Session
                </div>
              </div>
              
              {/* Fake Cards grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-violet-300 transition cursor-pointer">
                  <Wand2 className="w-4 h-4 text-violet-600 mb-2" />
                  <div className="font-bold text-xs text-slate-800">Optimize Prompt</div>
                  <div className="text-[10px] text-slate-400">Refine raw scripts</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-blue-300 transition cursor-pointer">
                  <GitBranch className="w-4 h-4 text-blue-600 mb-2" />
                  <div className="font-bold text-xs text-slate-800">Match Task</div>
                  <div className="text-[10px] text-slate-400">Step-by-step guides</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-purple-300 transition cursor-pointer">
                  <BookOpen className="w-4 h-4 text-purple-600 mb-2" />
                  <div className="font-bold text-xs text-slate-800">Browse Recipes</div>
                  <div className="text-[10px] text-slate-400">Curated prompts</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-300 transition cursor-pointer">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 mb-2" />
                  <div className="font-bold text-xs text-slate-800">Verify Output</div>
                  <div className="text-[10px] text-slate-400">Source checker</div>
                </div>
              </div>

              {/* Fake main content layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-800">Popular AI Recipes</span>
                    <span className="text-[10px] text-violet-600 font-bold">View all</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-semibold text-slate-700">Debug Python Code</span>
                      <span className="px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 text-[9px] font-bold">Coding</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-semibold text-slate-700">Format APA Essay</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[9px] font-bold">Report</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                  <span className="text-xs font-bold text-slate-800 block mb-3">Recent Tasks</span>
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-100 rounded-full w-full" />
                    <div className="h-2 bg-slate-100 rounded-full w-4/5" />
                    <div className="h-2 bg-slate-100 rounded-full w-3/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features / Capabilities Section */}
      <section id="features" className="py-20 px-4 md:px-8 max-w-7xl mx-auto border-t border-slate-200/50">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">Key Features</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            Work smarter and learn deeper with four core modules
          </h3>
        </div>

        {/* Features Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-violet-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 mb-6 group-hover:scale-110 transition duration-300">
              <Wand2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Prompt Optimizer</h4>
            <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">
              Turn ambiguous, single-line queries into structured prompts with clearly defined goals, variables, and output requirements.
            </p>
            <Link href="/home" className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 group-hover:gap-2.5 transition-all">
              Optimize prompt <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition duration-300">
              <GitBranch className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Task Matcher</h4>
            <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">
              Deconstruct complex assignments or essay briefs into customized milestones, giving you a clear plan of action.
            </p>
            <Link href="/home" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:gap-2.5 transition-all">
              Build workflow <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-purple-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">AI Recipe Library</h4>
            <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">
              Explore hundreds of ready-made, highly-optimized prompt templates tailored for programming, research, design, and essay writing.
            </p>
            <Link href="/home" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:gap-2.5 transition-all">
              Browse library <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Output Validator</h4>
            <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">
              Verify accuracy and test the credibility of AI outputs against trusted reference materials, ensuring no hallucinations.
            </p>
            <Link href="/home" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:gap-2.5 transition-all">
              Validate output <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive / Visual Walkthrough */}
      <section className="py-16 px-4 md:px-8 bg-slate-900 text-white -mx-4 md:-mx-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Ethics First</span>
            <h3 className="text-3xl font-bold mt-2">Promoting responsible AI usage</h3>
            <p className="text-slate-400 text-sm mt-3">
              We focus on building critical thinking skills. AIaBLE includes dedicated checkers and guideposts to ensure students use AI to learn, not just to copy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-xl">
              <span className="text-violet-400 font-bold text-sm">Step 01</span>
              <h4 className="font-bold text-lg mt-2 mb-3">Learn the How</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Rather than giving you simple answers, our task matching module explains the core concepts behind every assignment milestone.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-xl">
              <span className="text-violet-400 font-bold text-sm">Step 02</span>
              <h4 className="font-bold text-lg mt-2 mb-3">Master Prompting</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Build your AI skills. The Prompt Optimizer structures prompts so that you understand the factors that drive better responses.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-xl">
              <span className="text-violet-400 font-bold text-sm">Step 03</span>
              <h4 className="font-bold text-lg mt-2 mb-3">Double Check Everything</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Validate facts using the validation panel. Verify citations, sources, and arguments before finalizing your work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="pt-20 px-4 md:px-8 text-center max-w-4xl mx-auto relative">
        <h3 className="text-3xl font-extrabold text-slate-900 mb-4">
          Ready to transform the way you use AI?
        </h3>
        <p className="text-slate-500 mb-8 max-w-lg mx-auto text-sm">
          Join your fellow students on AIaBLE. Experience rapid prompt engineering and task management powered by Google Gemini.
        </p>
        <Link
          href="/home"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-base font-bold text-white hover:bg-violet-700 active:bg-violet-800 transition duration-200 shadow-lg shadow-violet-200"
        >
          Enter Workspace
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="pt-20 px-4 md:px-8 text-center text-slate-400 text-xs border-t border-slate-200/50 mt-16 max-w-6xl mx-auto">
        <p>© 2026 AIaBLE Platform. Powered by Google Gemini and Next.js.</p>
      </footer>
    </div>
  );
}
