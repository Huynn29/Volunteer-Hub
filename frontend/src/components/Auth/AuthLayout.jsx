import { Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import AuthBranding from "./AuthBranding";

/**
 * Modern Split-screen Auth Layout for VolunteerHub
 * Desktop: 2-column layout (Left: Branding & Illustration, Right: Auth Form)
 * Mobile: Single-column responsive layout with clean top header
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#0B0F14] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Background ambient lighting effects */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full flex-1 flex flex-col lg:grid lg:grid-cols-12 min-h-screen relative z-10">
        
        {/* Left Section: Branding & Community Illustration (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-5 border-r border-slate-800/80 bg-gradient-to-b from-[#0D131B]/95 via-[#0B0F14] to-[#0A0D12]">
          <AuthBranding />
        </div>

        {/* Right Section: Form Container */}
        <div className="flex-1 lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-y-auto">
          
          {/* Mobile Top Branding Bar (Visible only on mobile/tablet) */}
          <div className="lg:hidden flex items-center justify-between py-2 mb-6">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-md shadow-emerald-500/20">
                <div className="w-full h-full bg-[#0B0F14] rounded-[10px] flex items-center justify-center text-emerald-300">
                  <Heart className="w-4 h-4 fill-emerald-400/30 stroke-emerald-300" />
                </div>
              </div>
              <span className="text-xl font-black text-white">
                Volunteer<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Hub</span>
              </span>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-[#0E151E]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </Link>
          </div>

          {/* Centered Auth Card */}
          <div className="w-full max-w-[440px] mx-auto my-auto py-4">
            <div className="relative rounded-3xl bg-[#101720]/80 border border-emerald-500/15 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] p-6 sm:p-9 overflow-hidden transition-all">
              {/* Subtle top card glow line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent" />
              
              {children}
            </div>
          </div>

          {/* Mobile Footer note */}
          <div className="lg:hidden text-center text-xs text-slate-400 py-3">
            <span>© 2026 VolunteerHub • Lan tỏa giá trị cộng đồng</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;

