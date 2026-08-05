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

      const res = await createEventAI(idea);

      const data = res.data;

      console.log(data);
      console.log(data.banner);

      setForm((prev) => ({
        ...prev,
        title: data.title,
        description: data.description,
        location: data.location,
        category: data.category,
        startDate: data.startDate?.slice(0, 10) || "",
        endDate: data.endDate?.slice(0, 10) || "",
        banner: data.banner,
      }));

      setBannerPreview(data.banner);

      toast.success("AI đã tạo nội dung thành công");
    } catch (err) {
      console.error(err);
      toast.error("Không thể tạo bằng AI");
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
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <button
        onClick={handleOpenModel}
        className="flex items-center gap-3 border border-gray-300 bg-white px-6 py-3 rounded-2xl shadow hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
      >
        <FaPlus className="text-indigo-600" />
        <span className="font-medium text-gray-800">Tạo sự kiện mới</span>
      </button>

      {isOpenModel && (
        <div className="fixed inset-0 backdrop-blur-[1px] bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl h-[90%] rounded-2xl shadow-lg flex flex-col relative">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-indigo-50">
              <h2 className="text-xl font-semibold text-indigo-700">
                Tạo sự kiện mới
              </h2>
              <button
                onClick={handleCloseModel}
                className="text-gray-600 hover:text-red-500 transition text-2xl"
              >
                <IoClose />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 p-6 overflow-y-auto"
            >
              {/* AI tạo sự kiện */}
              <div className="border border-purple-200 rounded-xl p-4 bg-purple-50">
                <label className="block text-sm font-semibold text-purple-700 mb-2">
                  ✨ Tạo sự kiện bằng AI
                </label>

                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={4}
                  placeholder="Ví dụ: Tổ chức chương trình hiến máu dành cho 300 sinh viên tại Đại học Công nghệ..."
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 resize-none focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={loadingAI}
                  className={`mt-3 px-5 py-2 rounded-xl text-white ${
                    loadingAI
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {loadingAI ? "Đang tạo..." : "✨ Tạo bằng AI"}
                </button>
              </div>

              {/* Tiêu đề */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề *
                </label>
                <input
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề sự kiện..."
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Nhập mô tả sự kiện..."
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"
                />
              </div>

              {/* Địa điểm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa điểm *
                </label>
                <input
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh..."
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              {/* Danh mục */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                >
                  <option value="">-- Chọn danh mục --</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày bắt đầu
                  </label>
                  <input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày kết thúc
                  </label>
                  <input
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Banner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh bìa (Banner)
                </label>
                <input
                  name="banner"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 border border-gray-300 rounded-xl file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                />
                {bannerPreview && (
                  <div className="mt-3">
                    <img
                      src={bannerPreview}
                      alt="Preview"
                      className="w-full max-h-60 object-cover rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 text-white rounded-xl font-medium shadow ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading ? "Đang gửi..." : "Xác nhận tạo sự kiện"}
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
