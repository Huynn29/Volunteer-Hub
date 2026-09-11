import Header from "../components/Header";
import { FaSearch, FaUser, FaArrowUp } from "react-icons/fa";
import { IoCreate } from "react-icons/io5";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import { getAllEventCreatedBy } from "../api/event.api";
import { IoMenu } from "react-icons/io5";
import toast from "react-hot-toast";

const ManageLayout = () => {
  const [isOpenYourEvent, setIsOpenYourEvent] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await getAllEventCreatedBy();
        setEvents(res.data.events);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, []);
  const handleLinkClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  useEffect(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return setFilteredEvents(events);
    setFilteredEvents(
      events.filter((e) => e.title?.toLowerCase().includes(keyword))
    );
  }, [search, events]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <ScrollToTop />
      <Header />

      {/* Nút Toggle mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-50 bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white p-3 rounded-full shadow-xl hover:scale-105 transition-transform"
        aria-label="Mở menu quản lý"
      >
        <IoMenu className="text-2xl" />
      </button>

      <div className="bg-slate-100/70 min-h-screen py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          {/* Sidebar */}
          <aside
            className={`fixed lg:static top-20 left-4 h-auto max-h-[85vh] lg:max-h-none overflow-y-auto w-[280px] bg-white rounded-2xl border border-slate-200/80 shadow-lg lg:shadow-xs p-4 transition-all duration-300 z-40 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-[320px] lg:translate-x-0"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 px-1">
              <span className="font-extrabold text-lg text-slate-900">Quản lý sự kiện</span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100">
                Manager
              </span>
            </div>

            {/* Tìm kiếm */}
            <div className="relative w-full mb-3">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện quản lý..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/80 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Nút Tạo sự kiện mới */}
            <NavLink
              onClick={handleLinkClick}
              to="/manage/create"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer mb-2.5 ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white hover:opacity-95"
                }`
              }
            >
              <IoCreate className="text-base" />
              <span>+ Tạo sự kiện mới</span>
            </NavLink>

            {/* Link Bài viết chờ duyệt */}
            <NavLink
              onClick={handleLinkClick}
              to="/manage/post"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer mb-1 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <FaHourglassHalf className="text-sky-500 text-sm" />
              <span>Bài viết chờ duyệt</span>
            </NavLink>

            {/* Link Người dùng chờ duyệt */}
            <NavLink
              onClick={handleLinkClick}
              to="/manage/user"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer mb-2 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <FaHourglassHalf className="text-amber-500 text-sm" />
              <span>Người dùng chờ duyệt</span>
            </NavLink>

            {/* Mục: Sự kiện do bạn tạo */}
            <div className="pt-2 border-t border-slate-100">
              <div
                onClick={() => setIsOpenYourEvent(!isOpenYourEvent)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FaUser className="text-indigo-400" />
                  <span>Sự kiện của bạn</span>
                </div>
                {isOpenYourEvent ? (
                  <IoIosArrowUp className="text-sm" />
                ) : (
                  <IoIosArrowDown className="text-sm" />
                )}
              </div>

              {isOpenYourEvent && (
                <div className="flex flex-col gap-1 mt-1 pl-2">
                  <NavLink
                    onClick={handleLinkClick}
                    to="approved"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-100"
                      }`
                    }
                  >
                    <FaCheckCircle className="text-emerald-500 text-sm" />
                    <span>Đã được duyệt</span>
                  </NavLink>

                  <NavLink
                    onClick={handleLinkClick}
                    to="pending"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-amber-50 text-amber-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-100"
                      }`
                    }
                  >
                    <FaHourglassHalf className="text-yellow-500 text-sm" />
                    <span>Chờ duyệt</span>
                  </NavLink>

                  <NavLink
                    onClick={handleLinkClick}
                    to="rejected"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-rose-50 text-rose-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-100"
                      }`
                    }
                  >
                    <MdCancel className="text-rose-500 text-sm" />
                    <span>Bị từ chối</span>
                  </NavLink>

                  <NavLink
                    onClick={handleLinkClick}
                    to="completed"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-sky-50 text-sky-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-100"
                      }`
                    }
                  >
                    <FaRegCalendarCheck className="text-blue-500 text-sm" />
                    <span>Hoàn thành</span>
                  </NavLink>
                </div>
              )}
            </div>
          </aside>

          {/* Khung Nội dung Quản lý */}
          <main className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs min-h-[85vh] relative w-full min-w-0">
            <Outlet context={{ events: filteredEvents, loading }} />
          </main>
        </div>

        {/* Nút Cuộn lên đầu */}
        <button
          onClick={handleScrollToTop}
          className="hidden lg:flex items-center justify-center w-11 h-11 fixed bottom-6 right-6 text-slate-600 bg-white shadow-xl border border-slate-200 rounded-full hover:bg-indigo-600 hover:text-white hover:scale-110 transition-all duration-200 cursor-pointer z-50"
          aria-label="Cuộn lên đầu"
        >
          <FaArrowUp />
        </button>
      </div>
    </>
  );
};

export default ManageLayout;
