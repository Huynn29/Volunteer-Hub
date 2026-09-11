import { TbCategoryFilled } from "react-icons/tb";
import { IoTime } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { FaTree, FaBookOpen, FaHeartbeat, FaUsers } from "react-icons/fa";
import { MdOutlineSportsSoccer } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { FaArrowRightLong } from "react-icons/fa6";
import { useClickOutside } from "../../hook";
import {
  convertDate,
  isThisMonth,
  isThisWeek,
  isThisYear,
  isToday,
  isTomorrow,
} from "../../utils";
import toast from "react-hot-toast";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getProfileUser } from "../../api/user.api";
import { createUserEvent } from "../../api/userEvent.api";
import { createUserRegisterNotification } from "../../api/notification.api";
const eventCategories = [
  {
    id: 0,
    category: "Tất cả",
    icon: <BiCategory />,
  },
  {
    id: 1,
    category: "Giáo dục & đào tạo",
    icon: <FaBookOpen />,
  },
  {
    id: 2,
    category: "Y tế & chăm sóc sức khỏe",
    icon: <FaHeartbeat />,
  },
  {
    id: 3,
    category: "Môi trường & bảo vệ thiên nhiên",
    icon: <FaTree />,
  },
  {
    id: 4,
    category: "Văn hóa – nghệ thuật",
    icon: <FaUsers />,
  },
  {
    id: 5,
    category: "Thể thao & giải trí",
    icon: <MdOutlineSportsSoccer />,
  },
  {
    id: 6,
    category: "Hoạt động cộng đồng",
    icon: <FaUsers />,
  },
];

const timeCategories = [
  {
    id: 1,
    time: "Tất cả",
  },
  {
    id: 2,
    time: "Hôm nay",
  },
  {
    id: 3,
    time: "Ngày mai",
  },
  {
    id: 4,
    time: "Trong tuần",
  },
  {
    id: 5,
    time: "Trong tháng",
  },
  {
    id: 6,
    time: "Trong năm",
  },
];

const EventList = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedTime, setSelectedTime] = useState("Tất cả");
  const { events } = useOutletContext();
  const [user, setUser] = useState(null);
  const categoryRef = useRef(null);
  const timeRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await getProfileUser();
      setUser(res.data.user);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterJoinEvent = async (eventId) => {
    try {
      if (!user) return toast.error("Bạn cần đăng nhập trước khi tham gia!");

      const data = {
        userId: user._id,
        eventId,
        role: user.role,
        status: "pending",
        startDay: new Date(),
      };

      const res = await createUserEvent(data);

      toast.success(res.data.message || "Đăng ký tham gia thành công!");
      await createUserRegisterNotification(eventId);
      window.location.reload();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi đăng ký sự kiện");
    }
  };

  useClickOutside(categoryRef, () => {
    if (openDropdown === "category") setOpenDropdown(null);
  });
  useClickOutside(timeRef, () => {
    if (openDropdown === "time") setOpenDropdown(null);
  });

  const handleToggle = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };
  const handleChangeSelectedCategory = (type) => {
    setSelectedCategory(type);
    setOpenDropdown(null);
  };
  const handleChangeSelectedTime = (type) => {
    setSelectedTime(type);
    setOpenDropdown(null);
  };
  const handleWatchDetail = (id) => {
    navigate(`/event/detail/${id}`);
  };
  const filteredEvents = events.filter((event) => {
    let passCategory =
      selectedCategory === "Tất cả" || event.category === selectedCategory;

    let passTime = true;
    if (selectedTime === "Hôm nay") passTime = isToday(event.startDate);
    else if (selectedTime === "Ngày mai")
      passTime = isTomorrow(event.startDate);
    else if (selectedTime === "Trong tuần")
      passTime = isThisWeek(event.startDate);
    else if (selectedTime === "Trong tháng")
      passTime = isThisMonth(event.startDate);
    else if (selectedTime === "Trong năm")
      passTime = isThisYear(event.startDate);

    return passCategory && passTime;
  });
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[350px]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header trang */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight">Khám phá sự kiện</h1>
            <p className="text-xs text-slate-500 mt-1">
              Tham gia cùng cộng đồng kết nối hơn 50,000 tình nguyện viên toàn quốc
            </p>
          </div>

          {/* Bộ lọc Danh mục & Thời gian */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Dropdown Danh mục */}
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => handleToggle("category")}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200/80 hover:bg-white text-slate-700 transition-colors shadow-2xs cursor-pointer"
              >
                <TbCategoryFilled className="text-indigo-500 text-sm" />
                <span>{selectedCategory === "Tất cả" ? "Danh mục" : selectedCategory}</span>
                {openDropdown === "category" ? (
                  <IoIosArrowUp className="text-slate-400" />
                ) : (
                  <IoIosArrowDown className="text-slate-400" />
                )}
              </button>

              {openDropdown === "category" && (
                <div className="flex flex-col p-2 gap-1 absolute right-0 top-full mt-2 w-[260px] rounded-2xl shadow-xl border border-slate-100 bg-white/95 backdrop-blur-xl z-50 animate-fadeIn">
                  {eventCategories.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleChangeSelectedCategory(item.category)}
                      className={`flex gap-2.5 items-center text-xs font-medium p-2.5 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer rounded-xl ${
                        selectedCategory === item.category ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-700"
                      }`}
                    >
                      <span className="text-base text-indigo-400">{item.icon}</span>
                      <span>{item.category}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown Thời gian */}
            <div className="relative" ref={timeRef}>
              <button
                onClick={() => handleToggle("time")}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200/80 hover:bg-white text-slate-700 transition-colors shadow-2xs cursor-pointer"
              >
                <IoTime className="text-pink-500 text-sm" />
                <span>{selectedTime === "Tất cả" ? "Thời gian" : selectedTime}</span>
                {openDropdown === "time" ? (
                  <IoIosArrowUp className="text-slate-400" />
                ) : (
                  <IoIosArrowDown className="text-slate-400" />
                )}
              </button>

              {openDropdown === "time" && (
                <div className="flex flex-col p-2 gap-1 absolute right-0 top-full mt-2 w-[200px] rounded-2xl shadow-xl border border-slate-100 bg-white/95 backdrop-blur-xl z-50 animate-fadeIn">
                  {timeCategories.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleChangeSelectedTime(item.time)}
                      className={`flex gap-2 items-center text-xs font-medium p-2.5 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer rounded-xl ${
                        selectedTime === item.time ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-700"
                      }`}
                    >
                      <span>{item.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter tags đã chọn */}
        {(selectedCategory !== "Tất cả" || selectedTime !== "Tất cả") && (
          <div className="flex gap-2 flex-wrap -mt-2">
            {selectedCategory !== "Tất cả" && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-semibold">
                {selectedCategory}
                <span
                  onClick={() => setSelectedCategory("Tất cả")}
                  className="cursor-pointer hover:text-indigo-900 text-xs"
                >
                  ✕
                </span>
              </span>
            )}
            {selectedTime !== "Tất cả" && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-pink-50 text-pink-700 border border-pink-100 rounded-full text-xs font-semibold">
                {selectedTime}
                <span
                  onClick={() => setSelectedTime("Tất cả")}
                  className="cursor-pointer hover:text-pink-900 text-xs"
                >
                  ✕
                </span>
              </span>
            )}
          </div>
        )}

        {/* Lưới Thẻ Sự kiện */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="font-bold text-slate-700 text-base">Không có sự kiện nào phù hợp</p>
              <p className="text-xs text-slate-400 mt-1">Thử điều chỉnh lại bộ lọc danh mục hoặc thời gian.</p>
            </div>
          ) : (
            filteredEvents
              .filter((ev) => ev)
              .map((event) => (
                <div
                  key={event._id}
                  onClick={() => handleWatchDetail(event._id)}
                  className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  {/* Banner ảnh kèm Category badge */}
                  <div className="relative w-full h-[180px] overflow-hidden bg-slate-100">
                    {event?.banner ? (
                      <img
                        src={event.banner}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                        Không có ảnh banner
                      </div>
                    )}

                    {event?.category && (
                      <span className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
                        {event.category}
                      </span>
                    )}
                  </div>

                  {/* Chi tiết thông tin */}
                  <div className="p-5 flex flex-col flex-1 gap-2.5">
                    {/* Thời gian */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50/60 px-2.5 py-1 rounded-lg w-fit">
                      <span>{convertDate(event.startDate)}</span>
                      <FaArrowRightLong className="text-[10px]" />
                      <span>{convertDate(event.endDate)}</span>
                    </div>

                    {/* Tiêu đề sự kiện */}
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {event.title}
                    </h3>

                    {/* Mô tả ngắn */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Địa điểm */}
                    <div className="text-xs text-slate-400 font-medium truncate mt-1">
                      📍 {event.location}
                    </div>

                    {/* Nút Đăng ký Tham gia */}
                    <div className="pt-3 mt-auto border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegisterJoinEvent(event._id);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#EC4899] shadow-md shadow-indigo-500/20 hover:opacity-95 hover:shadow-lg transition-all cursor-pointer"
                      >
                        Đăng ký tham gia
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
};

export default EventList;
