import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";
import { FaSort } from "react-icons/fa";
import { useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { useClickOutside } from "../hook";
import { MdEventNote } from "react-icons/md";
import { useEffect } from "react";
import { getAllPostFull } from "../api/post.api";
import { getProfileUser } from "../api/user.api";
import { getEventByUserIdAndStatus } from "../api/userEvent.api";
import { FaArrowUp } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";

const sortCategories = [
  { id: 1, title: "Đang tham gia" },
  { id: 2, title: "Tất cả" },
  { id: 3, title: "Mới nhất" },
  { id: 4, title: "Cũ nhất" },
  { id: 5, title: "Top" },
];

const Layout = () => {
  const [posts, setPosts] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedSort, setSelectedSort] = useState("Tất cả");
  const [user, setUser] = useState(null);
  const [eventJoining, setEventJoining] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  const navigate = useNavigate();
  const ref = useRef(null);
  useClickOutside(ref, () => {
    setOpenDropdown(null);
  });
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleChangeSelectedSort = (type) => {
    handleScrollToTop();
    setSelectedSort(type);
    setOpenDropdown(null);
  };
  const handleToggle = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  useEffect(() => {
    const fetchEventJoing = async () => {
      try {
        setLoading(true);
        const resEventJoining = await getEventByUserIdAndStatus("joining");
        const eventsWithId =
          (resEventJoining?.data?.events || []).filter((ev) => ev._id);

        setEventJoining(eventsWithId);
      } catch (error) {
        console.error(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEventJoing();
  }, []);
  useEffect(() => {
    const keyword = search.toLowerCase().trim();
    let filtered = posts;

    if (keyword) {
      filtered = filtered.filter(
        (p) =>
          p.content?.toLowerCase().includes(keyword) ||
          p.event.title?.toLowerCase().includes(keyword)
      );
    }
    setFilteredPosts(filtered);
  }, [search, posts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resPost = await getAllPostFull(selectedSort);
        const postsData = resPost.data?.posts || [];
        setPosts(postsData);
      } catch (error) {
        console.error(error?.response?.data?.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSort]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getProfileUser();
        setUser(res.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        console.error(error.message || "Chưa login hoặc token hết hạn");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="bg-slate-100/70 min-h-screen py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          {/* Sidebar cố định hiện đại */}
          <aside className="hidden lg:block sticky top-20">
            <div className="flex flex-col gap-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
              {/* Profile Card */}
              <NavLink
                to="profile"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 group"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/40 transition-all shadow-xs"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-2xl">
                    <CgProfile />
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="font-bold text-sm text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {user?.name || "Người dùng"}
                  </div>
                  <div className="text-xs text-slate-500">Xem hồ sơ cá nhân</div>
                </div>
              </NavLink>

              {/* Navigation Link Sự kiện */}
              <NavLink
                to="/event/home"
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <MdEventNote className="text-xl text-indigo-500" />
                <span>Khám phá Sự kiện</span>
              </NavLink>

              {/* Thanh Tìm kiếm Bảng tin */}
              <div className="relative w-full">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/80 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Bộ lọc Sắp xếp */}
              <div className="relative" ref={ref}>
                <button
                  onClick={() => handleToggle("category")}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-white text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <FaSort className="text-indigo-500 text-xs" />
                    <span>Lọc: {selectedSort}</span>
                  </div>
                  {openDropdown === "category" ? (
                    <IoIosArrowUp className="text-slate-400" />
                  ) : (
                    <IoIosArrowDown className="text-slate-400" />
                  )}
                </button>

                {openDropdown === "category" && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fadeIn">
                    {sortCategories.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleChangeSelectedSort(item.title)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                          selectedSort === item.title
                            ? "bg-indigo-50 text-indigo-600 font-semibold"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-[1px] bg-slate-100 my-1" />

              {/* Sự kiện đang tham gia */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Đang tham gia ({eventJoining.length})
                </span>
              </div>

              <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
                {eventJoining.length === 0 ? (
                  <div className="text-xs text-slate-400 text-center py-4">
                    Chưa tham gia sự kiện nào
                  </div>
                ) : (
                  eventJoining.map((ev, idx) => (
                    <NavLink
                      key={`${ev._id}-${idx}`}
                      to={`/event/detail/${ev._id}`}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/60 hover:bg-indigo-50/40 border border-transparent hover:border-indigo-100 transition-all duration-200 group"
                    >
                      <div
                        style={{
                          backgroundImage: `url(${ev.banner || "/default-banner.jpg"})`,
                        }}
                        className="w-11 h-11 bg-cover bg-center rounded-lg shrink-0 shadow-2xs"
                      />
                      <h3 className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 line-clamp-2 leading-tight">
                        {ev.title}
                      </h3>
                    </NavLink>
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* Cột Nội dung chính (Feed / Posts) */}
          <main className="w-full min-w-0">
            <Outlet context={{ posts: filteredPosts, setPosts, user, loading }} />
          </main>
        </div>

        {/* Nút Cuộn lên đầu */}
        <button
          onClick={handleScrollToTop}
          className="hidden md:flex items-center justify-center w-11 h-11 fixed bottom-6 right-6 text-slate-600 bg-white shadow-xl border border-slate-200 rounded-full hover:bg-indigo-600 hover:text-white hover:scale-110 transition-all duration-200 cursor-pointer z-50"
          aria-label="Cuộn lên đầu"
        >
          <FaArrowUp />
        </button>
      </div>
    </>
  );
};

export default Layout;
