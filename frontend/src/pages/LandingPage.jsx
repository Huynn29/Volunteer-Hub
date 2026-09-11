import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiUsers,
  FiHeart,
  FiTrendingUp,
  FiShield,
  FiStar,
  FiMail,
  FiPhone,
  FiMapPin,
  FiPlay,
  FiAward,
  FiZap,
  FiGlobe,
  FiChevronRight,
  FiMenu,
  FiX,
} from "react-icons/fi";
import {
  FaGithub,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
} from "react-icons/fa";
import { BiSolidQuoteAltLeft } from "react-icons/bi";
import { HiOutlineSparkles } from "react-icons/hi";
import { jwtDecode } from "jwt-decode";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const token = localStorage.getItem("token");

  // Xác định vai trò người dùng nếu đã đăng nhập để dẫn đúng trang
  let authDestination = "/feed";
  let authButtonText = "Vào Bảng Tin";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
      } else if (decoded.role === "admin") {
        authDestination = "/admin/dashboard";
        authButtonText = "Vào Trang Quản Trị Admin";
      }
    } catch {
      localStorage.removeItem("token");
    }
  }

  // Theo dõi cuộn trang để tăng cường hiệu ứng Sticky Blur Navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmailInput("");
    }
  };

  const navLinks = [
    { name: "Tính năng", href: "#features" },
    { name: "Dashboard Demo", href: "#mockup" },
    { name: "Số liệu tác động", href: "#social-proof" },
    { name: "Đánh giá", href: "#testimonials" },
    { name: "Tham gia", href: "#cta" },
  ];

  const stats = [
    { value: "50,000+", label: "Tình nguyện viên", growth: "+38% năm nay" },
    { value: "1,250+", label: "Chiến dịch hoàn thành", growth: "100% minh bạch" },
    { value: "85+", label: "Tổ chức & Đối tác", growth: "Toàn quốc" },
    { value: "99.8%", label: "Mức độ hài lòng", growth: "⭐ 4.9/5 xếp hạng" },
  ];

  const features = [
    {
      icon: <FiUsers className="w-6 h-6 text-[#6366F1]" />,
      accentBg: "bg-indigo-500/10",
      accentBorder: "group-hover:border-indigo-500/50",
      glowColor: "group-hover:shadow-[0_10px_35px_-10px_rgba(99,102,241,0.25)]",
      title: "Smart Matching Tình Nguyện",
      desc: "Thuật toán gợi ý chiến dịch thông minh dựa trên kỹ năng, sở trường và định vị địa lý của từng tình nguyện viên.",
      tag: "AI Powered",
    },
    {
      icon: <FiTrendingUp className="w-6 h-6 text-[#EC4899]" />,
      accentBg: "bg-pink-500/10",
      accentBorder: "group-hover:border-pink-500/50",
      glowColor: "group-hover:shadow-[0_10px_35px_-10px_rgba(236,72,153,0.25)]",
      title: "Báo Cáo Minh Bạch Real-time",
      desc: "Theo dõi số lượng người tham gia, phân bổ tài chính và tiến độ chiến dịch trực quan bằng biểu đồ thời gian thực.",
      tag: "Minh bạch 100%",
    },
    {
      icon: <FiZap className="w-6 h-6 text-amber-400" />,
      accentBg: "bg-amber-500/10",
      accentBorder: "group-hover:border-amber-500/50",
      glowColor: "group-hover:shadow-[0_10px_35px_-10px_rgba(245,158,11,0.25)]",
      title: "Bảng Tin & Tương Tác Sôi Động",
      desc: "Đăng tải bài viết, hình ảnh hoạt động, tương tác like/bình luận tức thì thông qua kiến trúc Socket Real-time.",
      tag: "Live Community",
    },
    {
      icon: <FiAward className="w-6 h-6 text-emerald-400" />,
      accentBg: "bg-emerald-500/10",
      accentBorder: "group-hover:border-emerald-500/50",
      glowColor: "group-hover:shadow-[0_10px_35px_-10px_rgba(16,185,129,0.25)]",
      title: "Chứng Nhận Điện Tử & Điểm Thưởng",
      desc: "Tự động cấp chứng nhận hoàn thành chiến dịch có mã xác thực số và vinh danh tình nguyện viên xuất sắc.",
      tag: "Gamification",
    },
    {
      icon: <FiShield className="w-6 h-6 text-cyan-400" />,
      accentBg: "bg-cyan-500/10",
      accentBorder: "group-hover:border-cyan-500/50",
      glowColor: "group-hover:shadow-[0_10px_35px_-10px_rgba(6,182,212,0.25)]",
      title: "Phân Quyền Tổ Chức Đa Tầng",
      desc: "Hệ thống bảo mật nghiêm ngặt phân định vai trò Admin, Manager chiến dịch và Thành viên rõ ràng, an toàn.",
      tag: "Enterprise Security",
    },
    {
      icon: <FiGlobe className="w-6 h-6 text-purple-400" />,
      accentBg: "bg-purple-500/10",
      accentBorder: "group-hover:border-purple-500/50",
      glowColor: "group-hover:shadow-[0_10px_35px_-10px_rgba(168,85,247,0.25)]",
      title: "Tối Ưu Mobile-First Mượt Mà",
      desc: "Giao diện responsive sắc nét, hoạt động mượt mà trên điện thoại, máy tính bảng và máy tính để bàn.",
      tag: "Responsive",
    },
  ];

  const testimonials = [
    {
      name: "Nguyễn Hoàng Minh",
      role: "Trưởng ban điều hành Quỹ Trẻ Em Xanh",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      quote:
        "VolunteerHub đã giải quyết triệt để bài toán điều phối hơn 500 tình nguyện viên cho chiến dịch Mùa Hè Xanh. Mọi thông tin, phân công và báo cáo đều được số hóa mượt mà và minh bạch.",
      rating: 5,
    },
    {
      name: "Trần Mai Anh",
      role: "Chủ tịch CLB Tình Nguyện Sinh Viên",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      quote:
        "Giao diện hiện đại, trực quan và cực kỳ thân thiện. Tính năng cấp chứng nhận số và thông báo trực tiếp giúp tỷ lệ tình nguyện viên gắn kết tăng hơn 65% so với trước đây.",
      rating: 5,
    },
    {
      name: "Lê Quốc Dũng",
      role: "Điều phối viên Cứu trợ Bão lũ Miền Trung",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      quote:
        "Khi triển khai các đợt viện trợ khẩn cấp, tốc độ là yếu tố sống còn. Nền tảng giúp chúng tôi tập hợp lực lượng và cập nhật tình hình địa bàn chỉ trong vài phút bấm máy.",
      rating: 5,
    },
  ];

  const partners = [
    "UNICEF Youth",
    "Red Cross Global",
    "Green Vietnam",
    "Youth Impact Org",
    "Hope Foundation",
    "Education For All",
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans selection:bg-[#6366F1] selection:text-white relative overflow-hidden">
      {/* Ambient Glow Orbs */}
      <div className="pointer-events-none absolute -top-40 -left-20 w-[550px] h-[550px] bg-[#6366F1]/20 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute top-[30%] -right-20 w-[600px] h-[600px] bg-[#EC4899]/15 rounded-full blur-[160px]" />
      <div className="pointer-events-none absolute top-[70%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />

      {/* Subtle Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* ========================================================================= */}
      {/* 1. STICKY BLUR NAVBAR                                                    */}
      {/* ========================================================================= */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#0F172A]/85 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20 py-3"
            : "bg-[#0F172A]/50 backdrop-blur-md border-b border-white/5 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] via-indigo-500 to-[#EC4899] flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 group-hover:shadow-indigo-500/50 transition-all duration-300">
              <FiHeart className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  Volunteer<span className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent">Hub</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                  SaaS v2.5
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group py-1"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#6366F1] to-[#EC4899] transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </div>

          {/* CTA Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {token ? (
              <Link
                to={authDestination}
                className="relative inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-[#6366F1] to-[#EC4899] shadow-md shadow-indigo-500/25 hover:shadow-[0_0_25px_rgba(99,102,241,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {authButtonText}
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] to-[#DB2777] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800/60 transition-all"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="relative inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-[#6366F1] to-[#EC4899] shadow-md shadow-indigo-500/25 hover:shadow-[0_0_25px_rgba(99,102,241,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    Bắt đầu ngay
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] to-[#DB2777] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/60 border border-slate-700/60 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-3 pb-6 bg-[#0F172A]/95 backdrop-blur-2xl border-b border-slate-800 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-slate-200 hover:bg-slate-800/60 rounded-lg text-base font-medium"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              {token ? (
                <Link
                  to={authDestination}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#6366F1] to-[#EC4899] rounded-xl shadow-lg shadow-indigo-500/25"
                >
                  {authButtonText}
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-sm font-medium text-slate-300 bg-slate-800/40 border border-slate-700/50 rounded-xl"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#6366F1] to-[#EC4899] rounded-xl shadow-lg shadow-indigo-500/25"
                  >
                    Bắt đầu ngay
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION WITH DASHBOARD MOCKUP                                    */}
      {/* ========================================================================= */}
      <header className="relative pt-12 pb-20 md:pt-20 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs md:text-sm font-medium text-slate-300 shadow-inner mb-6 backdrop-blur-md hover:border-indigo-500/40 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-[#EC4899] animate-ping" />
          <HiOutlineSparkles className="w-4 h-4 text-[#6366F1]" />
          <span>Giải pháp quản trị chiến dịch tình nguyện 4.0</span>
          <span className="text-slate-500">•</span>
          <a href="#features" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold">
            Khám phá ngay <FiChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.15]">
          Lan Tỏa Tác Động Xã Hội Bằng{" "}
          <span className="bg-gradient-to-r from-[#6366F1] via-purple-400 to-[#EC4899] bg-clip-text text-transparent">
            Nền Tảng Quản Trị Đột Phá
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl font-normal leading-relaxed">
          Tối ưu hóa quy trình tổ chức, gắn kết hàng chục ngàn tình nguyện viên và đo lường
          chỉ số tác động xã hội minh bạch trong thời gian thực trên một giao diện thống nhất.
        </p>

        {/* Hero CTA Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Primary CTA with Hover Glow */}
          <Link
            to={token ? authDestination : "/register"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-[#6366F1] to-[#EC4899] shadow-lg shadow-indigo-500/25 hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer group"
          >
            <span>{token ? authButtonText : "Tạo Chiến Dịch Miễn Phí"}</span>
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
          </Link>

          {/* Secondary CTA with Thin Border */}
          <a
            href="#mockup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium text-base text-slate-200 bg-slate-900/60 border border-slate-700/80 hover:border-slate-500 hover:bg-slate-800/80 backdrop-blur-md transition-all duration-300 cursor-pointer"
          >
            <FiPlay className="w-4 h-4 text-pink-400 fill-current" />
            <span>Xem Dashboard Demo</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-1.5">
            <FiCheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Miễn phí khởi tạo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiCheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Triển khai dưới 3 phút</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiCheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Bảo mật đạt chuẩn ISO</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DASHBOARD MOCKUP ILLUSTRATION                                             */}
        {/* ========================================================================= */}
        <div id="mockup" className="mt-16 w-full max-w-6xl relative">
          {/* Subtle Backlight Glow for Mockup */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#6366F1]/20 via-[#EC4899]/15 to-transparent blur-3xl -z-10 transform scale-95" />

          {/* Floating Micro-Badges */}
          <div className="hidden lg:flex items-center gap-3 absolute -top-6 -left-6 z-20 px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/70 backdrop-blur-xl shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold">
              <FiUsers className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs text-slate-400">Đăng ký mới hôm nay</div>
              <div className="text-sm font-bold text-white">+148 Tình nguyện viên</div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 absolute -bottom-6 -right-6 z-20 px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/70 backdrop-blur-xl shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#EC4899] flex items-center justify-center text-white">
              <FiStar className="w-5 h-5 fill-current text-yellow-300" />
            </div>
            <div className="text-left">
              <div className="text-xs text-slate-400">Tỷ lệ hoàn thành mục tiêu</div>
              <div className="text-sm font-bold text-emerald-400">99.4% Thành công</div>
            </div>
          </div>

          {/* Mockup Frame (Glassmorphism Window) */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-950/80 backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] overflow-hidden text-left">
            {/* Window Header */}
            <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/90 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-slate-400 font-mono hidden sm:inline-block">
                  volunteerhub.app/overview/impact-metrics
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Syncing
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline-block">Q3 / 2026</span>
              </div>
            </div>

            {/* Dashboard Inner Content */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="text-xs text-slate-400">Tổng tình nguyện viên</div>
                  <div className="text-2xl font-bold text-white mt-1">48,250</div>
                  <div className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1">
                    ↑ 24.5% <span className="text-slate-500 font-normal">tháng này</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="text-xs text-slate-400">Chiến dịch hoàn thành</div>
                  <div className="text-2xl font-bold text-white mt-1">1,128</div>
                  <div className="text-xs text-indigo-400 mt-1 font-medium flex items-center gap-1">
                    ★ 99.8% <span className="text-slate-500 font-normal">đạt chỉ tiêu</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="text-xs text-slate-400">Giờ công hiến xã hội</div>
                  <div className="text-2xl font-bold text-white mt-1">364,800h</div>
                  <div className="text-xs text-pink-400 mt-1 font-medium flex items-center gap-1">
                    ↑ 18.2% <span className="text-slate-500 font-normal">tăng trưởng</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="text-xs text-slate-400">Quỹ hỗ trợ quyên góp</div>
                  <div className="text-2xl font-bold text-white mt-1">8.42 Tỷ VNĐ</div>
                  <div className="text-xs text-teal-400 mt-1 font-medium flex items-center gap-1">
                    ✓ 100% <span className="text-slate-500 font-normal">sao kê minh bạch</span>
                  </div>
                </div>
              </div>

              {/* Main Panel Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Active Campaigns Table */}
                <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white text-base">Chiến dịch trọng điểm gần đây</h4>
                      <p className="text-xs text-slate-400">Cập nhật theo thời gian thực từ các đội ngũ</p>
                    </div>
                    <span className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">
                      Xem tất cả →
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        title: "Mùa Hè Xanh 2026 - Áo Xanh Đến Bản",
                        team: "Đoàn Thanh Niên & CLB Trẻ",
                        volunteers: "320 / 350",
                        progress: "91%",
                        status: "Đang diễn ra",
                        statusColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                      },
                      {
                        title: "Bếp Ăn 0 Đồng - San Sẻ Yêu Thương",
                        team: "Nhóm Thiện Nguyện Tâm An",
                        volunteers: "180 / 180",
                        progress: "100%",
                        status: "Đã đủ người",
                        statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                      },
                      {
                        title: "Trồng Rừng Phủ Xanh Đồi Trọc Tây Bắc",
                        team: "Quỹ Môi Trường Xanh",
                        volunteers: "412 / 500",
                        progress: "82%",
                        status: "Tuyển bổ sung",
                        statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="font-medium text-sm text-slate-100">{item.title}</div>
                          <div className="text-xs text-slate-400">{item.team}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xs font-semibold text-slate-300">
                              {item.volunteers} TNV
                            </div>
                            <div className="w-24 h-1.5 bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#6366F1] to-[#EC4899] rounded-full"
                                style={{ width: item.progress }}
                              />
                            </div>
                          </div>
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full border font-medium ${item.statusColor}`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Live Activity Stream */}
                <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white text-base">Hoạt động thời gian thực</h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  <div className="space-y-3.5 text-xs">
                    {[
                      {
                        name: "Lê Thu Hằng",
                        action: "vừa đăng ký tham gia",
                        target: "Mùa Hè Xanh 2026",
                        time: "2 phút trước",
                        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
                      },
                      {
                        name: "Nguyễn Tuấn Kiệt",
                        action: "đã check-in điểm cầu",
                        target: "Hà Giang Vùng Cao",
                        time: "12 phút trước",
                        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
                      },
                      {
                        name: "Quỹ Hy Vọng",
                        action: "hoàn tất xác nhận sao kê",
                        target: "Đợt 3/2026",
                        time: "35 phút trước",
                        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
                      },
                    ].map((act, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/30">
                        <img
                          src={act.avatar}
                          alt={act.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div className="flex-1 leading-tight">
                          <p className="text-slate-300">
                            <strong className="text-white font-medium">{act.name}</strong>{" "}
                            {act.action}{" "}
                            <span className="text-indigo-400 font-medium">{act.target}</span>
                          </p>
                          <span className="text-[10px] text-slate-500 mt-1 block">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. SOCIAL PROOF & PARTNERS STRIP                                         */}
      {/* ========================================================================= */}
      <section id="social-proof" className="py-16 border-y border-slate-800/80 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Partners Header */}
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Được đồng hành và tin dùng bởi hơn 85+ tổ chức phi lợi nhuận & doanh nghiệp
            </p>
          </div>

          {/* Partner Logos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity duration-300">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="px-4 py-2 text-sm md:text-base font-semibold text-slate-400 hover:text-white transition-colors cursor-default"
              >
                {partner}
              </div>
            ))}
          </div>

          {/* Numbers Counters Grid */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md text-center hover:border-indigo-500/40 transition-all duration-300"
              >
                <div className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-2 text-base font-semibold text-slate-200">{stat.label}</div>
                <div className="mt-1 text-xs text-indigo-400 font-medium">{stat.growth}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURES GRID (HOVER LIFT & GLOW CARDS)                               */}
      {/* ========================================================================= */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 inline-block mb-3">
            Hệ Sinh Thái Đột Phá
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Mọi Công Cụ Bạn Cần Để Vận Hành Chiến Dịch Đỉnh Cao
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Từ khâu lập kế hoạch, kêu gọi tình nguyện viên đến kiểm soát chất lượng và trao
            chứng nhận số — tất cả được tự động hóa chính xác.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800/90 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2.5 ${feature.accentBorder} ${feature.glowColor} cursor-default`}
            >
              {/* Corner subtle glow gradient */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-tr-2xl pointer-events-none" />

              {/* Tag Pill */}
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl ${feature.accentBg} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                  {feature.tag}
                </span>
              </div>

              {/* Card Title */}
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                {feature.title}
              </h3>

              {/* Card Desc */}
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">{feature.desc}</p>

              {/* Learn More link */}
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs font-semibold text-slate-300 group-hover:text-indigo-400 transition-colors">
                <span>Tìm hiểu quy trình</span>
                <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. USER TESTIMONIALS SECTION                                              */}
      {/* ========================================================================= */}
      <section id="testimonials" className="py-20 border-t border-slate-800/80 bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#EC4899] px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 inline-block mb-3">
              Cảm Nhận Thực Tế
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Người Dùng Nói Gì Về VolunteerHub
            </h2>
            <p className="mt-3 text-slate-400">
              Lắng nghe câu chuyện từ các thủ lĩnh cộng đồng và tình nguyện viên thực chiến.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col justify-between hover:border-slate-700 transition-all duration-300 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(item.rating)].map((_, r) => (
                      <FiStar key={r} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <BiSolidQuoteAltLeft className="text-2xl text-slate-600 mb-2" />
                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION (CTA) SECTION                                          */}
      {/* ========================================================================= */}
      <section id="cta" className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 bg-gradient-to-b from-slate-900/90 to-slate-950 p-8 sm:p-12 lg:p-16 text-center shadow-2xl backdrop-blur-2xl">
          {/* Ambient Inner Orb */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-[#6366F1]/30 to-[#EC4899]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Sẵn Sàng Kiến Tạo Sự Thay Đổi Tích Cực Cùng Chúng Tôi?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-300">
              Đăng ký ngay hôm nay để kết nối với mạng lưới hơn 50,000 tình nguyện viên và trải
              nghiệm sức mạnh quản trị chiến dịch thông minh không giới hạn.
            </p>

            {/* Subscription / Fast Signup Input */}
            <form onSubmit={handleSubscribe} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Nhập email của bạn..."
                required
                className="w-full px-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#6366F1] to-[#EC4899] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all shrink-0 cursor-pointer"
              >
                Nhận Bản Thử
              </button>
            </form>

            {subscribed && (
              <div className="mt-3 text-xs text-emerald-400 font-medium animate-fadeIn">
                ✓ Cảm ơn bạn! Chúng tôi đã gửi liên kết trải nghiệm vào hộp thư.
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <span>✓ Không cần cài đặt phức tạp</span>
              <span>✓ Miễn phí tài khoản cá nhân trọn đời</span>
              <span>✓ Hỗ trợ kỹ thuật 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MINIMALIST FOOTER                                                      */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-800/80 bg-[#0F172A] pt-16 pb-12 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
            {/* Brand column */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#EC4899] flex items-center justify-center text-white">
                  <FiHeart className="w-5 h-5 fill-current" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Volunteer<span className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent">Hub</span>
                </span>
              </Link>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Nền tảng công nghệ vì cộng đồng, kết nối tổ chức và tình nguyện viên tạo nên
                những giá trị xã hội bền vững và minh bạch.
              </p>
              <div className="space-y-2 text-xs text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <FiMail className="w-4 h-4 text-indigo-400" />
                  <span>support@volunteerhub.org</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="w-4 h-4 text-pink-400" />
                  <span>+84 (0) 28 3999 8888</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="w-4 h-4 text-emerald-400" />
                  <span>Tòa nhà Sáng Tạo Xã Hội, TP. Hồ Chí Minh</span>
                </div>
              </div>
            </div>

            {/* Links 1: Sản phẩm */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Sản phẩm</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Tính năng chính</a></li>
                <li><a href="#mockup" className="hover:text-white transition-colors">Dashboard Quản trị</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Cấp chứng nhận số</a></li>
                <li><a href="#social-proof" className="hover:text-white transition-colors">Minh bạch dòng tiền</a></li>
              </ul>
            </div>

            {/* Links 2: Tài nguyên */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Tài nguyên</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Tài liệu API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cẩm nang Tình nguyện</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quy chuẩn cộng đồng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Báo cáo tác động năm</a></li>
              </ul>
            </div>

            {/* Links 3: Pháp lý */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Pháp lý</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bảo vệ dữ liệu cá nhân</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bản quyền & Thương hiệu</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar & Social Icons */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © {new Date().getFullYear()} VolunteerHub Inc. All rights reserved. Thiết kế phong cách Modern Minimalist & Glassmorphism.
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" aria-label="Facebook" className="hover:text-white hover:scale-110 transition-all">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-white hover:scale-110 transition-all">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white hover:scale-110 transition-all">
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="GitHub" className="hover:text-white hover:scale-110 transition-all">
                <FaGithub className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Discord" className="hover:text-white hover:scale-110 transition-all">
                <FaDiscord className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

