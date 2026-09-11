import { useState } from "react";
import { X, Sparkles, KeyRound, ArrowRight, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { googleLogin } from "../../api/auth.api";

const GoogleAuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [testEmail, setTestEmail] = useState("volunteer.google@gmail.com");
  const [testName, setTestName] = useState("Google Volunteer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTestGoogleLogin = async (e) => {
    e.preventDefault();
    if (!testEmail.trim()) {
      toast.error("Vui lòng nhập email thử nghiệm");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await googleLogin({
        userInfo: {
          email: testEmail.trim(),
          name: testName.trim() || testEmail.split("@")[0],
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(testEmail.trim())}`,
          googleId: `google_mock_${Date.now()}`,
        },
      });

      toast.success(res?.data?.message || "Đăng nhập Google thành công!");
      onSuccess?.(res.data);
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyEnvSample = () => {
    navigator.clipboard.writeText("VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com");
    setCopied(true);
    toast.success("Đã sao chép cấu hình mẫu vào clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#101720] border border-slate-800/80 rounded-2xl shadow-2xl p-6 text-slate-200 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Đăng nhập với Google
            </h3>
            <p className="text-xs text-slate-400">
              Kết nối tài khoản Google với VolunteerHub
            </p>
          </div>
        </div>

        {/* Section 1: Quick Dev-mode Test Login */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
              Đăng nhập thử nghiệm ngay (Dev Mode)
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            Hệ thống backend đã sẵn sàng 100%! Bạn có thể đăng nhập ngay với thông tin Google mô phỏng bên dưới để trải nghiệm luồng tạo tài khoản và chuyển trang:
          </p>

          <form onSubmit={handleTestGoogleLogin} className="space-y-2.5">
            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Tên hiển thị Google:
              </label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Google User"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Email Google:
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="user@gmail.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs shadow-md shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <span>Xác nhận đăng nhập với tài khoản này</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Section 2: Instructions to configure real Client ID */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              Kết nối Google Client ID thực tế:
            </span>
            <button
              onClick={copyEnvSample}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : null}
              {copied ? "Đã chép" : "Sao chép"}
            </button>
          </div>
          <p className="text-slate-400 leading-relaxed mb-2 text-[11px]">
            Thêm dòng sau vào file <code className="text-amber-400 bg-slate-900 px-1 py-0.5 rounded">frontend/.env</code> để bật popup Google chính thức:
          </p>
          <div className="p-2 bg-slate-900 rounded-lg text-[11px] font-mono text-slate-300 break-all select-all border border-slate-800">
            VITE_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthModal;
