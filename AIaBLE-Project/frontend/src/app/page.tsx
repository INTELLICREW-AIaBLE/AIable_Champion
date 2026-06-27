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
  Columns,
  Search,
  Scale,
  Brain,
  TrendingUp,
  Clock,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-slate-50 min-h-screen -mt-8 -mx-4 md:-mx-8 overflow-hidden pb-16">
      {/* Decorative Gradients & Grid Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-violet-100/50 via-indigo-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 md:px-8 text-center max-w-5xl mx-auto">
        {/* Team & Pitch Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-100/60 border border-violet-200 text-violet-800 text-xs font-semibold mb-8 hover:bg-violet-100 transition duration-300">
          <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
          <span>Project AIaBLE by INTELLICREW</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
          Smarter AI Interaction <br />
          For <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Modern Students</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
          AIaBLE is a smart prompt management & learning workspace built specifically for university students. Learn how to write prompts, plan assignments, explore prompt recipes, and fact-check AI outputs.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href="/home"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-base font-bold text-white hover:bg-violet-700 active:bg-violet-800 transition duration-200 shadow-lg shadow-violet-200 hover:-translate-y-0.5"
          >
            Get Started Now (Free)
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-8 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 transition duration-200 shadow-sm"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Survey & Market Pains Section (From Proposal Survey Data) */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto mb-16">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-100/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 uppercase tracking-wider mb-3">
                <AlertCircle className="w-4 h-4" /> The Student Dilemma
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6">
                Why generic AI tools waste your time
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                According to the Digital Education Council, **86% of students** use generative AI, but **58% are unsure** which AI tool to use and how to interact with it effectively. 
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                INTELLICREW conducted a survey showing that **87.6% of students** have to modify prompts multiple times to get a decent response, and **40.7% spend 15+ minutes** struggling to get usable output. AIaBLE was built to bridge this gap.
              </p>
            </div>
            
            {/* Visual Stats grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <div className="text-3xl font-black text-violet-600">87.6%</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Waste Time Prompting</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <div className="text-3xl font-black text-indigo-600">58%</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Unsure of Best AI Tool</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <div className="text-3xl font-black text-purple-600">40.7%</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Spend 15+ Mins per Task</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <div className="text-3xl font-black text-blue-600">96.9%</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Want a Task Guide</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Features Section (Covers all 6 Proposal Features) */}
      <section id="features" className="py-16 px-4 md:px-8 max-w-7xl mx-auto border-t border-slate-200/50">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">6 Core Capabilities</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            Comprehensive workflow management built for academic tasks
          </h3>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Prompt-Optimizer Engine */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-violet-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 mb-6 group-hover:scale-105 transition duration-300">
              <Wand2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Prompt-Optimizer Engine</h4>
            <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Features 1</p>
            <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
              Input rough prompts. AI transforms them into structured prompts following the framework: **Role + Context + Task + Format + Constraints** with a Before/After comparison.
            </p>
            <Link href="/home" className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 group-hover:gap-2 transition-all">
              Try Optimizer <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: AI Task-Matcher */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-105 transition duration-300">
              <GitBranch className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">AI Task-Matcher</h4>
            <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Features 2</p>
            <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
              Enter a large task brief. Our system decomposes it into logical workflow steps, and matches each step to the most suitable AI tool with reasoning.
            </p>
            <Link href="/home" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:gap-2 transition-all">
              Try Task-Matcher <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: AI Recipe Library */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-purple-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-105 transition duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">AI Recipe Library</h4>
            <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Features 3</p>
            <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
              Access 15+ curated prompt formulas designed specifically for students: Coding, Report writing, Presentation layouts, and Research.
            </p>
            <Link href="/home" className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 group-hover:gap-2 transition-all">
              Browse Recipes <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: AI Ethics Guardrail */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-amber-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-105 transition duration-300">
              <Scale className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">AI Ethics Guardrail</h4>
            <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Features 4 (Bonus)</p>
            <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
              Promotes responsible AI use by appending a **Critical Thinking Card** with 3-5 reflection questions under every prompt suggestion to prevent blind copying.
            </p>
            <Link href="/home" className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:gap-2 transition-all">
              Learn Ethics <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 5: AI Accuracy Validator */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-105 transition duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">AI Accuracy Validator</h4>
            <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Features 5 (Expansion)</p>
            <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
              Combat AI hallucinations. Paste AI text output to verify citations, statistics, and references using web APIs, presenting color-coded reliability.
            </p>
            <Link href="/home" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:gap-2 transition-all">
              Try Validator <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 6: Personal Sandbox */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-rose-100 transition duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-6 group-hover:scale-105 transition duration-300">
              <Columns className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Personal Sandbox</h4>
            <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Features 6 (Expansion)</p>
            <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
              A multi-model playground. Run a single optimized prompt across **Claude, Gemini, and GPT-4** side-by-side to compare output quality.
            </p>
            <Link href="/home" className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 group-hover:gap-2 transition-all">
              Try Sandbox <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Student Journey Workflow Section */}
      <section className="py-20 px-4 md:px-8 bg-slate-900 text-white -mx-4 md:-mx-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">How AIaBLE Works</span>
            <h3 className="text-3xl font-extrabold mt-3">From raw assignment to verified solution</h3>
            <p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto">
              Follow our structured workflow model to get the most out of generative AI without compromising academic integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Steps line connector */}
            <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-800 hidden md:block z-0" />
            
            <div className="bg-slate-800/40 border border-slate-800 p-6 rounded-2xl relative z-10">
              <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold mb-4">1</div>
              <h4 className="font-bold text-base mb-2">Choose Recipe or Draft Prompt</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Select a vetted template from the **AI Recipe Library** or key in a basic draft prompt.
              </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-6 rounded-2xl relative z-10">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-4">2</div>
              <h4 className="font-bold text-base mb-2">Optimize & Get AI Tool Match</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Optimize prompts with **Optimizer Engine** and use **Task-Matcher** to get the best AI suggestions for each task milestone.
              </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-6 rounded-2xl relative z-10">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold mb-4">3</div>
              <h4 className="font-bold text-base mb-2">Compare & Fact-Check Outputs</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Run prompts inside the **Sandbox** to compare models and run the output through the **Accuracy Validator**.
              </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-6 rounded-2xl relative z-10">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mb-4">4</div>
              <h4 className="font-bold text-base mb-2">Reflect & Finalize Output</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Answer questions in the **Critical Thinking Card (Ethics Guardrail)** to ensure work is original and accurate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="pt-20 px-4 md:px-8 text-center max-w-4xl mx-auto relative">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 uppercase tracking-widest mb-3">
          <GraduationCap className="w-4 h-4" /> Academic Excellence
        </div>
        <h3 className="text-3xl font-extrabold text-slate-900 mb-4">
          Ready to learn effectively alongside AI?
        </h3>
        <p className="text-slate-500 mb-8 max-w-lg mx-auto text-sm">
          No more blind copying. Build prompt engineering skills and ensure your assignments match academic standards with AIaBLE.
        </p>
        <Link
          href="/home"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-base font-bold text-white hover:bg-violet-700 active:bg-violet-800 transition duration-200 shadow-lg shadow-violet-200"
        >
          Enter AIaBLE Workspace
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="pt-20 px-4 md:px-8 text-center text-slate-400 text-xs border-t border-slate-200/50 mt-16 max-w-6xl mx-auto">
        <p>© 2026 AIaBLE Hub. Developed by Team INTELLICREW. Powered by Gemini & Next.js.</p>
      </footer>
    </div>
  );
}
