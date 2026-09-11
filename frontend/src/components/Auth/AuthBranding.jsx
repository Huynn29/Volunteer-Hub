import { Link } from "react-router-dom";
import { Heart, Users, Sparkles, ShieldCheck, ArrowUpRight, Globe2, Leaf } from "lucide-react";

/**
 * Left-side branding component for Auth pages (Desktop 2-column layout)
 */
const AuthBranding = () => {
  return (
    <div className="relative h-full flex flex-col justify-between p-8 lg:p-12 z-10 select-none overflow-hidden">
      {/* Background ambient lighting for branding */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand Logo */}
      <div className="relative">
        <Link
          to="/"
          className="inline-flex items-center gap-3 group focus:outline-none"
          title="Quay lại Trang chủ VolunteerHub"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 group-hover:scale-105 transition-all duration-300">
            <div className="w-full h-full bg-[#0B0F14]/60 backdrop-blur-sm rounded-[14px] flex items-center justify-center text-emerald-300">
              <Heart className="w-5 h-5 fill-emerald-400/30 stroke-emerald-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                Volunteer<span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Hub</span>
              </span>
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
                Community
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Center Hero & Community Illustration */}
      <div className="my-auto py-8 relative">
        {/* Slogan & Intro */}
        <div className="space-y-3 max-w-lg mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Nền tảng Tình nguyện Hàng đầu
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Kết nối đam mê, <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              lan tỏa giá trị cộng đồng.
            </span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Tham gia mạng lưới hơn 50,000 tình nguyện viên cùng hàng ngàn dự án thiện nguyện ý nghĩa trên khắp mọi miền đất nước.
          </p>
        </div>

        {/* Abstract Community & Volunteering Illustration Graphic */}
        <div className="relative rounded-2xl p-6 bg-gradient-to-b from-[#111922]/90 to-[#0c1219]/90 border border-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden group">
          {/* Subtle glowing lines and mesh in background */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Interactive Stat Cards Row */}
          <div className="grid grid-cols-2 gap-3 relative z-10 mb-4">
            <div className="p-3.5 rounded-xl bg-[#141d27]/70 border border-emerald-500/15 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-400 font-medium">Chiến dịch xanh</span>
              </div>
              <p className="text-lg font-bold text-white tracking-tight">1,250+ <span className="text-xs font-normal text-emerald-400">hoàn thành</span></p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141d27]/70 border border-teal-500/15 hover:border-teal-500/30 transition-all">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-1.5 rounded-lg bg-teal-500/15 text-teal-400">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-400 font-medium">Tình nguyện viên</span>
              </div>
              <p className="text-lg font-bold text-white tracking-tight">50,000+ <span className="text-xs font-normal text-teal-400">kết nối</span></p>
            </div>
          </div>

          {/* Impact Testimonial / Community Quote Box */}
          <div className="relative z-10 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-teal-950/30 border border-slate-800/90 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B0F14] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Volunteer 1"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B0F14] object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Volunteer 2"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B0F14] object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Volunteer 3"
                />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-200">Đã tham gia hôm nay</p>
                <p className="text-slate-400">+128 người vừa đăng ký dự án mới</p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Minh bạch 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer / Back Link */}
      <div className="relative pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors group"
        >
          <span>← Quay lại trang chủ</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-400">
            <Globe2 className="w-3.5 h-3.5 text-teal-400" /> Vietnam
          </span>
          <span>© 2026 VolunteerHub</span>
        </div>
      </div>
    </div>
  );
};

export default AuthBranding;

