import { Link, Outlet, useNavigate, NavLink } from "react-router-dom";
import {
  MdSpaceDashboard,
  MdOutlineEventNote,
  MdMenu,
  MdArticle,
  MdOutlineContactPage,
  MdClose,
} from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { FaUser, FaCrown } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import { getProfileUser } from "../api/user.api";
import { logout } from "../api/auth.api";
import {
  getNotificationsByIdAdmin,
  markAsRead,
} from "../api/notification.api";
import { socket } from "../socket/index";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  {
    to: "/admin/dashboard",
    icon: MdSpaceDashboard,
    label: "Dashboard",
  },
  {
    to: "/admin/list/users",
    icon: FaUser,
    label: "Người dùng",
  },
  {
    to: "/admin/list/events",
    icon: MdOutlineEventNote,
    label: "Sự kiện",
  },
  {
    to: "/admin/list/posts",
    icon: MdArticle,
    label: "Bài đăng",
  },
];

const AdminLayout = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [notificationUnread, setNotificationUnread] = useState([]);
  const [notificationRead, setNotificationRead] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("unread");

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // =========================
  // SOCKET NOTIFICATION
  // =========================
  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      socket.emit("register", user._id);
    };

    const handleNewNotification = (noti) => {
      if (noti.userId === user._id) {
        setNotificationUnread((prev) => [noti, ...prev]);

        toast.success("🔔 Bạn có thông báo mới!");
      }
    };

    socket.on("connect", handleConnect);
    socket.on("new_notification", handleNewNotification);

    if (socket.connected) {
      socket.emit("register", user._id);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("new_notification", handleNewNotification);
    };
  }, [user?._id]);

  // =========================
  // CLICK OUTSIDE DROPDOWN
  // =========================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================
  // GET CURRENT USER
  // =========================
  const fetchUser = async () => {
    try {
      setLoading(true);

      const res = await getProfileUser();

      setUser(res.data.user);
    } catch (error) {
      console.error(
        error?.response?.data?.message || error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET NOTIFICATIONS
  // =========================
  const fetchNotification = async () => {
    try {
      const res = await getNotificationsByIdAdmin();

      const notifications = res.data.notifications || [];

      setNotificationUnread(
        notifications.filter((n) => !n.isRead)
      );

      setNotificationRead(
        notifications.filter((n) => n.isRead)
      );
    } catch (error) {
      console.error(
        error?.response?.data?.message || error
      );
    }
  };

  useEffect(() => {
    fetchUser();
    fetchNotification();
  }, []);

  // =========================
  // CHECK ADMIN ROLE
  // =========================
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  // =========================
  // RESPONSIVE SIDEBAR
  // =========================
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // =========================
  // DROPDOWN
  // =========================
  const toggleDropdown = (type) => {
    setOpenDropdown(
      openDropdown === type ? null : type
    );
  };

  // =========================
  // NOTIFICATION CLICK
  // =========================
  const handleClickNotification = async (n) => {
    setOpenDropdown(null);

    if (!n.isRead) {
      try {
        await markAsRead(n._id);

        setNotificationUnread((prev) =>
          prev.filter((i) => i._id !== n._id)
        );

        setNotificationRead((prev) => [
          { ...n, isRead: true },
          ...prev,
        ]);
      } catch (err) {
        console.error(
          err?.response?.data?.message || err
        );
      }
    }

    // Thông báo sự kiện mới
    if (n.type === "new_event") {
      navigate("/admin/list/events", {
        state: {
          isModalOpen: n.eventId?._id || null,
          eventId: n.eventId?._id || null,
        },
      });
    }

    // Thông báo bài đăng mới
    else if (n.type === "new_post") {
      navigate("/admin/list/posts", {
        state: {
          isWatchDetail: n.postId?._id || null,
          postId: n.postId?._id || null,
        },
      });
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-800 border-t-indigo-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // =========================
  // NOTIFICATION LIST
  // =========================
  const notiList =
    activeTab === "unread"
      ? notificationUnread
      : activeTab === "read"
      ? notificationRead
      : [
          ...notificationUnread,
          ...notificationRead,
        ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* ── SIDEBAR ── */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-[72px]"
        } shrink-0 transition-all duration-300 bg-slate-950 text-white flex flex-col`}
      >
        {/* Brand */}
        <div
          onClick={() =>
            navigate("/admin/dashboard")
          }
          className="flex items-center gap-3 px-4 py-5 cursor-pointer border-b border-white/5 select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
            <FaCrown className="text-white text-base" />
          </div>

          {sidebarOpen && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold text-white tracking-wide">
                Admin Panel
              </span>

              <span className="text-[10px] text-indigo-400 font-medium">
                VolunteerHub
              </span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 pt-4 flex-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon
                className={`text-lg shrink-0 ${
                  !sidebarOpen ? "mx-auto" : ""
                }`}
              />

              {sidebarOpen && (
                <span>{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom user card */}
        {sidebarOpen && (
          <div className="px-4 py-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/30 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-indigo-900 text-indigo-300 flex items-center justify-center shrink-0">
                  <CgProfile className="text-lg" />
                </div>
              )}

              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user.name}
                </p>

                <p className="text-[10px] text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── MAIN ── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* HEADER */}
        <header
          ref={dropdownRef}
          className="relative sticky top-0 z-40 flex items-center justify-between px-6 py-3 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm"
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              {sidebarOpen ? (
                <MdClose className="text-xl" />
              ) : (
                <MdMenu className="text-xl" />
              )}
            </button>

            <div>
              <h1 className="text-sm font-extrabold text-slate-900 leading-tight tracking-tight">
                Admin Dashboard
              </h1>

              <p className="text-[11px] text-slate-400 leading-none">
                Bảng điều khiển quản trị
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2.5">
            {/* Notification bell */}
            <button
              onClick={() =>
                toggleDropdown("notification")
              }
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <IoMdNotifications className="text-xl" />

              {notificationUnread.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full animate-pulse">
                  {notificationUnread.length}
                </span>
              )}
            </button>

            {/* Avatar */}
            <button
              onClick={() => toggleDropdown("avatar")}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all cursor-pointer"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-7 h-7 rounded-lg object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <CgProfile className="text-sm" />
                </div>
              )}

              <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate hidden sm:block">
                {user.name}
              </span>
            </button>
          </div>

          {/* Notification Dropdown */}
          {openDropdown === "notification" && (
            <div className="absolute top-[calc(100%+8px)] right-20 w-[360px] bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-300/40 border border-slate-200/80 rounded-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">
                  Thông báo
                </span>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {notificationUnread.length} chưa đọc
                </span>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100">
                {[
                  {
                    key: "unread",
                    label: "Chưa đọc",
                  },
                  {
                    key: "read",
                    label: "Đã đọc",
                  },
                  {
                    key: "all",
                    label: "Tất cả",
                  },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() =>
                      setActiveTab(t.key)
                    }
                    className={`flex-1 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === t.key
                        ? "border-b-2 border-indigo-500 text-indigo-600"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* List */}
              <ul className="max-h-[320px] overflow-y-auto divide-y divide-slate-50">
                {notiList.length === 0 ? (
                  <li className="py-8 text-center text-xs text-slate-400">
                    Không có thông báo
                  </li>
                ) : (
                  notiList.map((n) => (
                    <li
                      key={n._id}
                      onClick={() =>
                        handleClickNotification(n)
                      }
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                        n.isRead
                          ? "opacity-60 hover:bg-slate-50"
                          : "bg-indigo-50/40 hover:bg-indigo-50"
                      }`}
                    >
                      {n.senderId?.avatar ? (
                        <img
                          src={n.senderId.avatar}
                          alt="sender"
                          className="w-9 h-9 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          <CgProfile className="text-slate-500 text-lg" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs leading-relaxed line-clamp-2 ${
                            n.isRead
                              ? "text-slate-500"
                              : "text-slate-800 font-medium"
                          }`}
                        >
                          {n.content}
                        </p>

                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(
                            n.createdAt
                          ).toLocaleString("vi-VN")}
                        </p>
                      </div>

                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5"></span>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {/* Avatar Dropdown */}
          {openDropdown === "avatar" && (
            <div className="absolute top-[calc(100%+8px)] right-4 w-52 bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-300/40 border border-slate-200/80 rounded-2xl p-2 overflow-hidden z-50">
              <div className="px-3 py-2.5 mb-1 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user.name}
                </p>

                <p className="text-[10px] text-slate-400 truncate">
                  {user.email}
                </p>
              </div>

              <Link
                to="/profile"
                onClick={() =>
                  setOpenDropdown(null)
                }
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-700"
              >
                <MdOutlineContactPage className="text-indigo-500 text-base" />

                <span className="text-xs font-medium">
                  Profile
                </span>
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors mt-0.5 cursor-pointer"
              >
                <CiLogout className="text-base" />

                <span className="text-xs font-medium">
                  Đăng xuất
                </span>
              </button>
            </div>
          )}
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs min-h-full p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;