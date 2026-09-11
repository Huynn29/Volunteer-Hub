import { FaHome } from "react-icons/fa";
import { IoMdMenu, IoMdNotifications } from "react-icons/io";
import { MdEventNote } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { CiLogout } from "react-icons/ci";
import { MdOutlineContactPage } from "react-icons/md";
import { logout } from "../api/auth.api";
import { BiEdit } from "react-icons/bi";
import { FaCrown } from "react-icons/fa";
import { getNotificationsById, markAsRead } from "../api/notification.api";
import toast from "react-hot-toast";
import { socket } from "../socket/index";
import { getProfileUser } from "../api/user.api";

const navItems = [
  { path: "/", label: "Dashboard", icon: <FaHome /> },
  { path: "/event/home", label: "Sự kiện", icon: <MdEventNote /> },
];

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeTab, setActiveTab] = useState("unread"); // unread, read, all
  const [notificationUnread, setNotificationUnread] = useState([]);
  const [notificationRead, setNotificationRead] = useState([]);
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfileUser();
        setUser(res.data.user);
      } catch (error) {
        console.error(error.message || "Chưa login hoặc token hết hạn");
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) socket.connect();
    socket.on("connect", () => {
      socket.emit("register", user._id);
    });
    socket.on("new_notification", (noti) => {
      if (noti.userId === user._id) {
        setNotificationUnread((prev) => [noti, ...prev]);
        toast.success("🔔 Bạn có thông báo mới!");
      }
    });
    return () => {
      socket.off("connect");
      socket.off("new_notification");
      socket.disconnect();
    };
  }, [user?._id]);

  const handleClickNotification = async (n) => {
    setOpenDropdown(null);

    if (!n.isRead) {
      try {
        await markAsRead(n._id);
        setNotificationUnread((prev) =>
          prev.filter((item) => item._id !== n._id)
        );
        setNotificationRead((prev) => [n, ...prev]);
        n.isRead = true;
      } catch (err) {
        console.error(err?.response?.data?.message || err);
      }
    }

    if (n.type === "new_user_register") {
      navigate(`/manage/user`, {
        state: {
          isWatchDetail: !!n.userId,
          senderId: n.senderId?._id || null,
        },
      });
    } else if (n.type === "approve_post") {
      navigate(`/event/detail/${n.postId.eventId}`, {
        state: {
          openCommentModal: !!n.postId,
          postId: n.postId?._id || null,
        },
      });
    } else if (n.type === "approve_event") {
      navigate(`/event/detail/${n.postId.eventId}`, {
        state: {
          openCommentModal: !!n.postId,
          postId: n.postId?._id || null,
        },
      });
    } else if (n.type === "new_post") {
      navigate(`/manage/post`, {
        state: {
          openCommentModal: !!n.postId,
          postId: n.postId?._id || null,
        },
      });
    } else {
      navigate(`/event/detail/${n.postId.eventId}`, {
        state: {
          openCommentModal: !!n.postId,
          postId: n.postId?._id || null,
        },
      });
    }
  };

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await getNotificationsById();
        const unread = res.data.notifications.filter((n) => !n.isRead);
        const read = res.data.notifications.filter((n) => n.isRead);
        setNotificationUnread(unread);
        setNotificationRead(read);
      } catch (error) {
        console.error(error?.response?.data?.message || error);
      }
    };
    fetchNotification();
  }, []);

  const toggleDropdown = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  return (
    <header className="sticky top-0 z-50 w-full flex justify-between items-center bg-white/90 backdrop-blur-xl text-slate-800 border-b border-slate-200/80 shadow-xs py-2.5 px-4 lg:px-8">
      {/* Brand Logo */}
      <Link
        to="/"
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div
          className="w-10 h-10 rounded-xl bg-cover bg-center shadow-sm border border-slate-200/60 group-hover:scale-105 transition-transform duration-200"
          style={{ backgroundImage: `url(${logo})` }}
        />
        <div className="text-xl font-extrabold tracking-tight text-slate-900">
          Volunteer<span className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent">Hub</span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {(user?.role === "manager" || user?.role === "admin") && (
          <NavLink
            key="/manage"
            to="/manage/approved"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`
            }
          >
            <BiEdit className="text-base text-indigo-500" />
            <span>Quản lý</span>
          </NavLink>
        )}

        {user?.role === "admin" && (
          <NavLink
            key="/admin"
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-amber-50 text-amber-600 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`
            }
          >
            <FaCrown className="text-amber-500 text-base" />
            <span>Admin</span>
          </NavLink>
        )}
      </div>

      {/* Action Icons & Profile */}
      <div className="flex items-center gap-3 relative">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => toggleDropdown("menu")}
          className="md:hidden p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-xl"
        >
          <IoMdMenu />
        </button>

        {/* Mobile Dropdown Menu */}
        {openDropdown === "menu" && (
          <div className="absolute top-full right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-100 p-2.5 rounded-2xl z-50 animate-fadeIn">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpenDropdown(null)}
                className="flex items-center gap-2.5 py-2.5 px-3 hover:bg-slate-100 rounded-xl text-sm font-medium text-slate-700"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}

            {(user?.role === "manager" || user?.role === "admin") && (
              <NavLink
                key="/manage/approved"
                to="/manage/approved"
                onClick={() => setOpenDropdown(null)}
                className="flex items-center gap-2.5 py-2.5 px-3 hover:bg-slate-100 rounded-xl text-sm font-medium text-slate-700"
              >
                <BiEdit className="text-indigo-500" />
                <span>Quản lý</span>
              </NavLink>
            )}

            {user?.role === "admin" && (
              <NavLink
                key="/admin"
                to="/admin/dashboard"
                onClick={() => setOpenDropdown(null)}
                className="flex items-center gap-2.5 py-2.5 px-3 hover:bg-slate-100 rounded-xl text-sm font-medium text-slate-700"
              >
                <FaCrown className="text-amber-500" />
                <span>Admin</span>
              </NavLink>
            )}
          </div>
        )}

        {/* Nút thông báo */}
        <button
          onClick={() => toggleDropdown("notification")}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer relative"
        >
          <IoMdNotifications className="text-xl" />
          {notificationUnread.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-pulse">
              {notificationUnread.length}
            </span>
          )}
        </button>

        {/* Nút Avatar */}
        <button
          onClick={() => toggleDropdown("avatar")}
          className="rounded-xl transition-transform hover:scale-105 duration-200 cursor-pointer"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20 shadow-xs"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 text-2xl">
              <CgProfile />
            </div>
          )}
        </button>

        {/* DROPDOWN THÔNG BÁO */}
        {openDropdown === "notification" && (
          <div className="absolute top-full right-0 mt-3 w-[360px] bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-100 rounded-2xl max-h-[460px] overflow-hidden z-50 animate-fadeIn">
            <div className="px-5 py-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <span className="font-bold text-slate-900 text-sm">Thông báo</span>
              <span className="text-xs text-indigo-600 font-medium">Mới nhất</span>
            </div>

            {/* TAB */}
            <div className="flex border-b border-slate-100 bg-slate-50/30 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("unread")}
                className={`flex-1 py-2.5 text-center transition-colors ${
                  activeTab === "unread"
                    ? "border-b-2 border-indigo-600 text-indigo-600 bg-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Chưa đọc ({notificationUnread.length})
              </button>
              <button
                onClick={() => setActiveTab("read")}
                className={`flex-1 py-2.5 text-center transition-colors ${
                  activeTab === "read"
                    ? "border-b-2 border-indigo-600 text-indigo-600 bg-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Đã đọc ({notificationRead.length})
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 py-2.5 text-center transition-colors ${
                  activeTab === "all"
                    ? "border-b-2 border-indigo-600 text-indigo-600 bg-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Tất cả
              </button>
            </div>

            {/* LIST */}
            <ul className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto">
              {(() => {
                let list = [];
                if (activeTab === "unread") list = notificationUnread;
                else if (activeTab === "read") list = notificationRead;
                else list = [...notificationUnread, ...notificationRead];
                if (list.length === 0)
                  return (
                    <p className="text-slate-400 text-xs text-center py-8">
                      Chưa có thông báo nào
                    </p>
                  );
                return list.map((n) => (
                  <li
                    key={n._id}
                    onClick={() => handleClickNotification(n)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      n.isRead
                        ? "opacity-60 hover:bg-slate-50"
                        : "bg-indigo-50/20 hover:bg-indigo-50/50"
                    }`}
                  >
                    {n.senderId?.avatar ? (
                      <img
                        src={n.senderId.avatar}
                        alt="avatar"
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center shrink-0">
                        <CgProfile className="text-slate-500 text-xl" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs leading-relaxed ${
                          n.isRead ? "text-slate-500" : "text-slate-800 font-medium"
                        }`}
                      >
                        {n.content}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(n.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </li>
                ));
              })()}
            </ul>
          </div>
        )}

        {/* DROPDOWN AVATAR */}
        {openDropdown === "avatar" && (
          <div className="absolute top-full right-0 mt-3 bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-100 p-2.5 rounded-2xl w-52 z-50 animate-fadeIn">
            <Link
              to="/profile"
              onClick={() => setOpenDropdown(null)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700"
            >
              <MdOutlineContactPage className="text-indigo-600 text-lg" />
              <span>Hồ sơ cá nhân</span>
            </Link>

            <button
              onClick={logout}
              className="w-full mt-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-rose-50 transition-colors text-sm font-medium text-rose-600 cursor-pointer"
            >
              <CiLogout className="text-rose-500 text-lg" />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
