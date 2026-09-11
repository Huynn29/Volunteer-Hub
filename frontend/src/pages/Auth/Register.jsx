import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, Lock, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import AuthLayout from "../../components/Auth/AuthLayout";
import AuthInput from "../../components/Auth/AuthInput";
import SocialAuthButton from "../../components/Auth/SocialAuthButton";
import GoogleAuthModal from "../../components/Auth/GoogleAuthModal";
import { triggerGoogleAuth } from "../../utils/googleAuth";
import { register } from "../../api/auth.api";

const Register = () => {
  const navigate = useNavigate();

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên của bạn";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Họ và tên phải có ít nhất 2 ký tự";
    }

    if (!form.email.trim()) {
      newErrors.email = "Vui lòng nhập địa chỉ email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Định dạng email không hợp lệ";
    }

    if (!form.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có độ dài tối thiểu 6 ký tự";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
    }

    if (!agreeTerms) {
      newErrors.terms = "Bạn cần đồng ý với Điều khoản & Chính sách";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
      const res = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      toast.success(res?.data?.message || res?.message || "Đăng ký tài khoản thành công!");
      navigate("/login");
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Đăng ký thất bại. Vui lòng thử lại!";
      toast.error(errorMsg);
      setErrors((prev) => ({
        ...prev,
        general: errorMsg,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuthSuccess = (data) => {
    if (data?.token) {
      localStorage.setItem("token", data.token);
    }
    toast.success(data?.message || "Đăng nhập Google thành công!");
    if (data?.user?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleGoogleRegister = () => {
    triggerGoogleAuth({
      onSuccess: handleGoogleAuthSuccess,
      onError: (errMsg) => toast.error(errMsg),
      onRequiresConfig: () => setIsGoogleModalOpen(true),
    });
  };

  return (
    <AuthLayout>
      <div className="space-y-5">
        {/* Header Title & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Tạo tài khoản
          </h1>
          <p className="text-sm text-slate-400">
            Tham gia cộng đồng tình nguyện VolunteerHub.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          {/* Họ và tên */}
          <AuthInput
            id="name"
            name="name"
            type="text"
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            value={form.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={errors.name}
            icon={User}
            disabled={isSubmitting}
            autoComplete="name"
            required
          />

          {/* Email */}
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

          {/* Mật khẩu */}
          <AuthInput
            id="password"
            name="password"
            type="password"
            label="Mật khẩu"
            placeholder="Tối thiểu 6 ký tự"
            value={form.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={errors.password}
            icon={Lock}
            disabled={isSubmitting}
            autoComplete="new-password"
            required
          />

          {/* Xác nhận mật khẩu */}
          <AuthInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
            icon={Lock}
            disabled={isSubmitting}
            autoComplete="new-password"
            required
          />

          {/* Checkbox Đồng ý điều khoản */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (errors.terms) {
                    setErrors((prev) => ({ ...prev, terms: "" }));
                  }
                }}
                disabled={isSubmitting}
                className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-[#0D131B] text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 focus:ring-2 accent-emerald-500 transition-all cursor-pointer shrink-0"
              />
              <span className="text-xs text-slate-300 leading-snug">
                Tôi đồng ý với{" "}
                <a
                  href="#terms"
                  onClick={(e) => {
                    e.preventDefault();
                    toast("Quy chế dịch vụ và bảo mật thông tin chuẩn mực tại VolunteerHub", {
                      icon: "📜",
                    });
                  }}
                  className="text-emerald-400 hover:text-emerald-300 hover:underline"
                >
                  Điều khoản dịch vụ
                </a>{" "}
                và{" "}
                <a
                  href="#privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    toast("Cam kết bảo vệ 100% dữ liệu người dùng", {
                      icon: "🛡️",
                    });
                  }}
                  className="text-emerald-400 hover:text-emerald-300 hover:underline"
                >
                  Chính sách bảo mật
                </a>
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs text-rose-400 mt-1 pl-6.5">
                {errors.terms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Đang tạo tài khoản...</span>
              </>
            ) : (
              <>
                <span>Tạo tài khoản</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative bg-[#101720] px-3 text-xs text-slate-400 uppercase tracking-wider font-medium">
            Hoặc đăng ký nhanh
          </div>
        </div>

        {/* Google Signup */}
        <SocialAuthButton
          onClick={handleGoogleRegister}
          disabled={isSubmitting}
          label="Đăng ký với Google"
        />

        {/* Switch to Login */}
        <p className="text-center text-xs text-slate-400 pt-1">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline transition-colors inline-flex items-center gap-0.5"
          >
            Đăng nhập
          </Link>
        </p>
      </div>

      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleAuthSuccess}
      />
    </AuthLayout>
  );
};

export default Register;
