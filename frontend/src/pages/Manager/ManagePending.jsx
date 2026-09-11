import { FaArrowRightLong } from "react-icons/fa6";
import { convertDate } from "../../utils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllEventCreatedByAndStatus } from "../../api/event.api";

const ManagePending = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const handleWatchDetail = (id) => {
    navigate(`/event/detail/${id}`);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await getAllEventCreatedByAndStatus("pending");
        setEvents(res.data.events);
      } catch (error) {
        console.error(error.response.data.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[350px]">
        <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="pb-4 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sự kiện đang chờ duyệt</h1>
            <p className="text-xs text-slate-500 mt-1">Danh sách sự kiện đang được ban quản trị xét duyệt thông tin</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            {events.length} Đang chờ
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="font-bold text-slate-700 text-base">Không có sự kiện nào đang chờ duyệt</p>
              <p className="text-xs text-slate-400 mt-1">Các sự kiện mới tạo sẽ xuất hiện tại đây cho tới khi được duyệt.</p>
            </div>
          ) : (
            events
              .filter((ev) => ev)
              .map((event) => (
                <div
                  key={event?._id}
                  onClick={() => handleWatchDetail(event?._id)}
                  className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  {/* Banner */}
                  <div className="relative w-full h-[180px] overflow-hidden bg-slate-100">
                    {event?.banner ? (
                      <img
                        src={event?.banner}
                        alt={event?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                        Không có ảnh banner
                      </div>
                    )}

                    {event?.category && (
                      <span className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
                        {event?.category}
                      </span>
                    )}

                    <span className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
                      ⏳ Chờ duyệt
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1 gap-2.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50/60 px-2.5 py-1 rounded-lg w-fit">
                      <span>{convertDate(event?.startDate)}</span>
                      <FaArrowRightLong className="text-[10px]" />
                      <span>{convertDate(event?.endDate)}</span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {event?.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {event?.description}
                    </p>

                    <div className="text-xs text-slate-400 font-medium truncate mt-auto pt-2 border-t border-slate-100">
                      📍 {event?.location}
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

export default ManagePending;
