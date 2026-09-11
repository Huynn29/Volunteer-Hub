import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import AuthLayout from "../../components/Auth/AuthLayout";
import AuthInput from "../../components/Auth/AuthInput";
import SocialAuthButton from "../../components/Auth/SocialAuthButton";
import { login } from "../../api/auth.api";

const Login = () => {
  const navigate = useNavigate();

  // Form State
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("volunteerhub_remembered_email");
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Vui lòng nhập địa chỉ email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Định dạng email không hợp lệ";
    }

    if (!form.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear inline error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login({
        email: form.email.trim(),
        password: form.password,
      });

      // Save token
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Handle "Remember Me"
      if (rememberMe) {
        localStorage.setItem("volunteerhub_remembered_email", form.email.trim());
      } else {
        localStorage.removeItem("volunteerhub_remembered_email");
      }

      toast.success(res?.message || "Đăng nhập thành công!");

      // Role-based redirection:
      // Admin -> directly to /admin/dashboard
      // User / Manager -> to / (Dashboard / Feed)
      if (res?.data?.user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";
      toast.error(errorMsg);
      setErrors((prev) => ({
        ...prev,
        general: errorMsg,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Login Handler (stub / ready for OAuth provider)
  const handleGoogleLogin = () => {
    toast("Tính năng đăng nhập Google đang được kết nối!", {
      icon: "ℹ️",
    });
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header Title & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Chào mừng trở lại <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-sm text-slate-400">
            Đăng nhập để tiếp tục hành trình tình nguyện của bạn.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Input */}
          <AuthInput
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="example@gmail.com"
            value={form.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            icon={Mail}
            disabled={isSubmitting}
            autoComplete="email"
            required
          />

          {/* Password Input */}
          <AuthInput
            id="password"
            name="password"
            type="password"
            label="Mật khẩu"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={errors.password}
            icon={Lock}
            disabled={isSubmitting}
            autoComplete="current-password"
            required
            rightElement={
              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  toast("Vui lòng liên hệ ban quản trị để hỗ trợ đặt lại mật khẩu.", {
                    icon: "🔑",
                  });
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
              >
                Quên mật khẩu?
              </a>
            }
          />

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isSubmitting}
                className="w-4 h-4 rounded border-slate-700 bg-[#0D131B] text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 focus:ring-2 accent-emerald-500 transition-all cursor-pointer"
              />
              <span className="text-xs text-slate-300 group-hover:text-slate-200 transition-colors">
                Ghi nhớ đăng nhập
              </span>
            </label>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Đang xử lý đăng nhập...</span>
              </>
            ) : (
              <>
                <span>Đăng nhập</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative bg-[#101720] px-3 text-xs text-slate-400 uppercase tracking-wider font-medium">
            Hoặc tiếp tục với
          </div>
        </div>

        {/* Social Auth (Google) */}
        <SocialAuthButton
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          label="Đăng nhập với Google"
        />

        {/* Switch to Register */}
        <p className="text-center text-xs text-slate-400 pt-2">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline transition-colors inline-flex items-center gap-0.5"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
