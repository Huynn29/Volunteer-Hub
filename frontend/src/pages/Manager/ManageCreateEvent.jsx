import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { createEvent } from "../../api/event.api";
import toast from "react-hot-toast";
import { createEventNotification } from "../../api/notification.api";
import { createEventAI } from "../../api/ai.api";

const ManageCreateEvent = () => {
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiStep, setAiStep] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    startDate: "",
    endDate: "",
    banner: null,
  });

  const [bannerPreview, setBannerPreview] = useState(null);

  const handleOpenModel = () => setIsOpenModel(true);
  const handleCloseModel = () => {
    setIsOpenModel(false);
    setBannerPreview(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, banner: file }));

    if (file) {
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
    } else {
      setBannerPreview(null);
    }
  };

  const handleGenerateAI = async () => {
    if (!idea.trim()) {
      toast.error("Vui lòng nhập ý tưởng sự kiện");
      return;
    }

    try {
      setLoadingAI(true);

      setAiStep("Đang phân tích ý tưởng...");

      await new Promise((resolve) => setTimeout(resolve, 500));

      setAiStep("Đang viết nội dung sự kiện...");

      const res = await createEventAI(idea);

      setAiStep("Đang hoàn thiện sự kiện...");

      const data = res.data;

      console.log("AI EVENT:", data);

      setForm((prev) => ({
        ...prev,
        title: data.title || "",
        description: data.description || "",
        location: data.location || "",
        category: data.category || "",
        startDate: data.startDate?.slice(0, 10) || "",
        endDate: data.endDate?.slice(0, 10) || "",
        banner: data.banner || null,
      }));

      setBannerPreview(data.banner || null);

      setAiStep("");

      toast.success("✨ AI đã tạo sự kiện thành công");
    } catch (err) {
      console.error("AI ERROR:", err.response?.data || err);

      setAiStep("");

      toast.error(
        err.response?.data?.message ||
        "Không thể tạo sự kiện bằng AI"
      );
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.location ||
      !form.category 
    ) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      for (const pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await createEvent(data);
      toast.success("🎉 Tạo mới thành công, vui lòng chờ admin duyệt!");
      await createEventNotification(res.data.event._id)
      setIsOpenModel(false);
      setBannerPreview(null);
      setForm({
        title: "",
        description: "",
        location: "",
        category: "",
        startDate: "",
        endDate: "",
        banner: null,
      });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Hero Card giới thiệu */}
      <div className="max-w-xl text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-2xl mb-4 shadow-xs">
          <FaPlus />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Khởi tạo chiến dịch tình nguyện mới
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          Lan toả tinh thần thiện nguyện bằng cách tạo sự kiện, thiết lập mục tiêu và kêu gọi cộng đồng hàng chục nghìn tình nguyện viên cùng chung tay.
        </p>

        <button
          onClick={handleOpenModel}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#EC4899] shadow-lg shadow-indigo-500/25 hover:opacity-95 hover:scale-105 transition-all cursor-pointer"
        >
          <FaPlus />
          <span>Bắt đầu tạo sự kiện ngay</span>
        </button>
      </div>

      {/* MODAL TẠO SỰ KIỆN */}
      {isOpenModel && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-950/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-scaleIn">
            {/* Header Modal */}
            <div className="flex justify-between items-center px-6 py-4.5 border-b border-slate-100 bg-slate-50/60">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Tạo sự kiện mới
                </h2>
                <p className="text-[11px] text-slate-500">
                  Điền thông tin chi tiết hoặc sử dụng Trợ lý AI để tự động tạo
                </p>
              </div>
              <button
                onClick={handleCloseModel}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 flex items-center justify-center transition-colors text-xl cursor-pointer"
              >
                <IoClose />
              </button>
            </div>

            {/* Form Fields */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 p-6 overflow-y-auto"
            >
              {/* AI tạo sự kiện */}
              <div className="mb-8 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 shadow-sm">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-xl shadow-md">
                      ✨
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        AI Event Copilot
                      </h3>

                      <p className="text-sm text-slate-500">
                        Biến ý tưởng của bạn thành một sự kiện hoàn chỉnh
                      </p>
                    </div>

                  </div>

                  <span className="rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-600">
                    Gemini AI
                  </span>

                </div>


                {/* DESCRIPTION */}
                <div className="mb-4 rounded-2xl border border-indigo-100 bg-white/70 p-4">

                  <p className="text-sm font-medium text-slate-700">
                    💡 Bạn chỉ cần nhập một ý tưởng
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    AI sẽ tự tạo tiêu đề, mô tả, địa điểm, danh mục,
                    thời gian và banner cho sự kiện.
                  </p>

                </div>


                {/* INPUT */}
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  disabled={loadingAI}
                  placeholder="Ví dụ: Tổ chức chương trình hiến máu cho 300 sinh viên tại Đại học Công nghệ..."
                  className="min-h-[110px] w-full resize-none rounded-2xl border border-indigo-200 bg-white p-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />


                {/* QUICK IDEAS */}
                <div className="mt-4">

                  <p className="mb-2 text-xs font-semibold text-slate-500">
                    💡 Thử một ý tưởng
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {[
                      "🩸 Hiến máu nhân đạo",
                      "🌱 Trồng cây xanh",
                      "🧹 Dọn rác cộng đồng",
                      "📚 Dạy học trẻ em",
                      "❤️ Hỗ trợ người khó khăn",
                    ].map((item) => {

                      const text = item.replace(/^.{2}\s/, "");

                      return (
                        <button
                          key={item}
                          type="button"
                          disabled={loadingAI}
                          onClick={() => setIdea(text)}
                          className="rounded-full border border-indigo-100 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {item}
                        </button>
                      );
                    })}

                  </div>

                </div>


                {/* AI STATUS */}
                {loadingAI && (
                  <div className="mt-5 rounded-2xl border border-indigo-100 bg-white p-4">

                    <div className="mb-3 flex items-center gap-3">

                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />

                      <span className="text-sm font-semibold text-indigo-700">
                        {aiStep || "AI đang tạo sự kiện..."}
                      </span>

                    </div>


                    <div className="space-y-2 text-xs">

                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="text-green-500">✓</span>
                        Phân tích ý tưởng
                      </div>

                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="text-green-500">✓</span>
                        Tạo nội dung sự kiện
                      </div>

                      <div className="flex items-center gap-2 text-indigo-600">
                        <span className="animate-pulse">●</span>
                        Đang hoàn thiện
                      </div>

                    </div>

                  </div>
                )}


                {/* BUTTON */}
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={loadingAI}
                  className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loadingAI ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      AI đang tạo sự kiện...
                    </>
                  ) : (
                    <>
                      ✨
                      Tạo sự kiện bằng AI
                    </>
                  )}

                </button>


                {/* FOOTER */}
                {!loadingAI && (
                  <p className="mt-3 text-center text-[11px] text-slate-400">
                    Bạn vẫn có thể chỉnh sửa toàn bộ nội dung sau khi AI hoàn thành.
                  </p>
                )}

              </div>

              {/* Tiêu đề */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tiêu đề sự kiện *
                </label>
                <input
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề sự kiện..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mô tả chi tiết *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Nêu rõ mục tiêu, số lượng TNV cần tuyển, nội dung công việc..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none resize-none transition-all"
                />
              </div>

              {/* Địa điểm */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Địa điểm tổ chức *
                </label>
                <input
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh, hoặc Trực tuyến..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Danh mục */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Lĩnh vực / Danh mục *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                >
                  <option value="">-- Chọn danh mục phù hợp --</option>
                  <option value="Giáo dục & đào tạo">Giáo dục & đào tạo</option>
                  <option value="Y tế & chăm sóc sức khỏe">
                    Y tế & chăm sóc sức khỏe
                  </option>
                  <option value="Môi trường & bảo vệ thiên nhiên">
                    Môi trường & bảo vệ thiên nhiên
                  </option>
                  <option value="Văn hóa – nghệ thuật">
                    Văn hóa – nghệ thuật
                  </option>
                  <option value="Thể thao & giải trí">
                    Thể thao & giải trí
                  </option>
                  <option value="Hoạt động cộng đồng">
                    Hoạt động cộng đồng
                  </option>
                </select>
              </div>

              {/* Ngày bắt đầu & kết thúc */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Ngày bắt đầu *
                  </label>
                  <input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Ngày kết thúc *
                  </label>
                  <input
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Banner */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ảnh bìa sự kiện (Banner)
                </label>
                <input
                  name="banner"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-slate-500 border border-slate-200 rounded-xl file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-600 file:font-semibold hover:file:bg-indigo-100 cursor-pointer"
                />
                {bannerPreview && (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
                    <img
                      src={bannerPreview}
                      alt="Preview"
                      className="w-full max-h-56 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Nút Submit */}
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModel}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2.5 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer ${
                    loading
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#6366F1] to-[#EC4899] hover:opacity-95"
                  }`}
                >
                  {loading ? "Đang gửi xét duyệt..." : "Gửi xét duyệt sự kiện"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCreateEvent;
