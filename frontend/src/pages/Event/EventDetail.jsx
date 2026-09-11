import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaArrowRightLong, FaS } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";
import { LikeUnLike } from "../../api/like.api";
import { createComment } from "../../api/comment.api";
import { getProfileUser } from "../../api/user.api";
import { createPost, getPostByIdEventApproved } from "../../api/post.api";
import { getEventById } from "../../api/event.api";
import { FaPlus } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdDescription } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

import {
  countAllUserByEventId,
  countJoiningUserByEventId,
  countPendingUserByEventId,
  createUserEvent,
  deleteUserEvent,
  getAllUsersByEventId,
  getUserEvent,
} from "../../api/userEvent.api";
import { convertDate, getPostTimeAgo } from "../../utils";
import {
  createCommentNotification,
  createLikeNotification,
  createPostNotification,
  createUserRegisterNotification,
} from "../../api/notification.api";

const EventDetail = () => {
  const [isSelectIntrodution, setIsSelectIntrodution] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [content, setContent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [event, setEvent] = useState({});
  const [participants, setParticipants] = useState([]);
const [showParticipants, setShowParticipants] = useState(false);
  const [userEvents, setUserEvents] = useState([]);
const [isJoined, setIsJoined] = useState(false);
const [isPending, setIsPending] = useState(false);
const [isRejected, setIsRejected] = useState(false);
const [isCompleted, setIsCompleted] = useState(false);
  const eventId = useParams();
  const location = useLocation();
  const { openCommentModal: openFromNotify, postId } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [bannerPreview, setBannerPreview] = useState([]);
  const [form, setForm] = useState({
    content: "",
    images: [],
  });
  const [openCreateModel, setOpenCreateModel] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]); 


  const fetchParticipants = async () => {
  try {
    const res = await getAllUsersByEventId(eventId.id); 
    setParticipants(res.data.users);
    setShowParticipants(true);
  } catch (err) {
    toast.error(err?.response?.data?.message || err.message);
  }
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          resUser,
          resEvent,
          cntAllUser,
          cntPending,
          cntJoining,
          resPost,
          resUserEvent,
        ] = await Promise.all([
          getProfileUser(),
          getEventById(eventId.id),
          countAllUserByEventId(eventId.id),
          countPendingUserByEventId(eventId.id),
          countJoiningUserByEventId(eventId.id),
          getPostByIdEventApproved(eventId.id),
          getUserEvent(),
        ]);

        setUser(resUser.data.user);
        setPosts(resPost.data?.posts || []);
        setFilteredPosts(resPost.data?.posts || []);
        setUserEvents(resUserEvent.data.userEvents);
        setEvent({
          ...resEvent.data.event,
          numOfUser: cntAllUser.data.numOfAllUser,
          numOfPendingUser: cntPending.data.numOfPendingUser,
          numOfJoiningUser: cntJoining.data.numOfJoiningUser,
        });
      } catch (err) {
        console.error(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  useEffect(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) {
      setFilteredPosts(posts);
      return;
    }
    const filtered = posts.filter(
      (p) =>
        p.content?.toLowerCase().includes(keyword) ||
        p.event?.title?.toLowerCase().includes(keyword)
    );
    setFilteredPosts(filtered);
  }, [search, posts]);
  useEffect(() => {
    if (openFromNotify && postId) {
      const post = posts.find((p) => p._id === postId);
      if (post) {
        setCurrentPost(post);
        setOpenCommentModal(true);
      }
    }
  }, [openFromNotify, postId, posts]);

  const handleOpenCreatePost = () => {
    if (!isJoined) {
      toast.error("⚠️ Vui lòng tham gia sự kiện trước khi tạo bài viết!");
      return;
    }
    setOpenCreateModel(true);
    setForm({
      content: "",
      images: [],
    });
    setBannerPreview([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...files],
    }));

    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setBannerPreview((prev) => [...prev, ...newPreviews]);

    e.target.value = null;
  };


  useEffect(() => {
    return () => {
      bannerPreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [bannerPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.content) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("eventId", eventId.id);
      formData.append("content", form.content);

      if (form.images && form.images.length > 0) {
        for (const img of form.images) {
          formData.append("images", img);
        }
      }

      const res = await createPost(formData);
      toast.success("🎉 Tạo bài đăng thành công, vui lòng chờ admin duyệt!");

      await createPostNotification(res.data.post._id);
      setOpenCreateModel(false);
      setBannerPreview([]);
      setForm({
        content: "",
        images: [],
      });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const resUser = await getProfileUser();
        setUser(resUser.data.user);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);



  //  Mở modal bình luận
  const handleOpenModal = (post) => {
    setCurrentPost(post);
    setOpenCommentModal(true);
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await LikeUnLike(postId);

      if (res.data.liked) {
        createLikeNotification(postId); // không cần await, cho chạy song song
      }

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, liked: res.data.liked, likeCount: res.data.likeCount }
            : p
        )
      );
    } catch (error) {
      console.error(
        "Lỗi khi like:",
        error.response?.data?.message || error.message
      );
    }
  };
useEffect(() => {
  if (!userEvents || !event || !user?._id) return;

  const eventStatus = userEvents.find(
    (u) => u.eventId?._id === event._id
  )?.status;

  setIsPending(eventStatus === "pending");
  setIsJoined(eventStatus === "joining" || eventStatus === "accepted");
  setIsRejected(eventStatus === "rejected");
  setIsCompleted(eventStatus === "completed");
}, [userEvents, event, user]);

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
      const resUserEvent = await getUserEvent();
      setUserEvents(resUserEvent.data.userEvents);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi đăng ký sự kiện");
    }
  };

   
const handleOutEvent = async (eventId) => {
  if (!user) return toast.error("Bạn cần đăng nhập trước khi rời sự kiện!");

  toast((t) => (
    <span>
      Rời khỏi sự kiện này?
      <div className="mt-2 flex gap-2">
        <button
          className="bg-red-400 text-white px-3 py-1 rounded"
          onClick={async () => {
            try {
              const res = await deleteUserEvent({ userId: user._id, eventId });
              toast.success(res.data.message || "Đã rời sự kiện!");
              const resUserEvent = await getUserEvent();
              setUserEvents(resUserEvent.data.userEvents);
            } catch (error) {
              toast.error(error?.response?.data?.message || "Lỗi khi rời sự kiện!");
            }
            toast.dismiss(t.id);
          }}
        >
          Có
        </button>
        <button
          className="bg-gray-300 px-3 py-1 rounded"
          onClick={() => toast.dismiss(t.id)}
        >
          Hủy
        </button>
      </div>
    </span>
  ));
};

  const handleSubmitComment = async (e, postId) => {
    e.preventDefault();
    if (!content) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      const res = await createComment({ content, postId });
      toast.success(res?.message || "Tạo bình luận thành công");

            await createCommentNotification(postId);
      
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                comments: [...p.comments, { content: content, userId: user }],
              }
            : p
        )
      );

      setCurrentPost((prev) => ({
        ...prev,
        comments: [...prev.comments, { content: content, userId: user }],
      }));
      setContent("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Đăng nhập thất bại"
      );
    }
  };

  //  Ẩn cuộn khi mở modal
  useEffect(() => {
    document.body.style.overflow = openCommentModal ? "hidden" : "auto";
  }, [openCommentModal]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[350px]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {event && (
        <div className="flex flex-col gap-6">
          {/* Header Sự kiện */}
          <div className="flex flex-col gap-4">
            {/* Banner nếu có */}
            {event?.banner && (
              <div className="w-full h-[240px] sm:h-[320px] rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/80">
                <img
                  src={event.banner}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50/80 px-3 py-1.5 rounded-xl border border-indigo-100/60 w-fit">
                <span>{convertDate(event.startDate)}</span>
                <FaArrowRightLong className="text-[10px]" />
                <span>{convertDate(event.endDate)}</span>
              </div>

              {event?.category && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-900 text-white shadow-xs">
                  {event.category}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {event.title}
            </h1>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <FaLocationDot className="text-pink-500 text-sm" />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Navigation Bar chi tiết: Tab & Trạng thái tham gia */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            {/* Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSelectIntrodution(true)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isSelectIntrodution
                    ? "bg-indigo-50 text-indigo-600 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                Giới thiệu
              </button>
              <button
                onClick={() => setIsSelectIntrodution(false)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  !isSelectIntrodution
                    ? "bg-indigo-50 text-indigo-600 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                Thảo luận ({posts.length})
              </button>
            </div>

            {/* Trạng thái / Hành động Tham gia */}
            <div className="flex items-center gap-3 flex-wrap">
              {isPending ? (
                <div className="px-4 py-2 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-xl cursor-default">
                  ⏳ Đang chờ duyệt
                </div>
              ) : isRejected ? (
                <div className="px-4 py-2 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 rounded-xl cursor-default">
                  ✕ Bị từ chối
                </div>
              ) : isCompleted ? (
                <div className="px-4 py-2 text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 rounded-xl cursor-default">
                  ✓ Đã hoàn thành
                </div>
              ) : isJoined ? (
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl cursor-default">
                    ✓ Đang tham gia
                  </div>
                  <button
                    onClick={() => handleOutEvent(event._id)}
                    className="px-3.5 py-2 text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Rời sự kiện
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleRegisterJoinEvent(event._id)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#EC4899] shadow-md shadow-indigo-500/20 hover:opacity-95 rounded-xl transition-all cursor-pointer"
                >
                  Đăng ký tham gia
                </button>
              )}

              {/* Tìm kiếm bài viết trong sự kiện */}
              {!isSelectIntrodution && (
                <div className="relative w-48">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="text"
                    placeholder="Tìm bài viết..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-50 pl-8 pr-3 py-2 border border-slate-200/80 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NỘI DUNG TAB */}
      {isSelectIntrodution ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Chi tiết */}
          <div className="flex flex-col gap-4 p-6 bg-slate-50/50 border border-slate-200/80 rounded-2xl shadow-2xs">
            <div className="text-base font-bold text-slate-900 border-b border-slate-200/60 pb-3">
              Thông tin chi tiết
            </div>
            <div className="flex flex-col gap-3.5 text-xs">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm">
                  <FaUsers />
                </div>
                <span><strong>{event.numOfUser || 0}</strong> người đã tương tác với sự kiện</span>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 text-sm">
                  <FaUser />
                </div>
                <span>Tổ chức bởi <strong>{event?.createBy?.name || "Ẩn danh"}</strong></span>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm">
                  <FaLocationDot />
                </div>
                <span>{event.location}</span>
              </div>

              <div className="flex items-start gap-3 text-slate-600 pt-2 border-t border-slate-200/60 leading-relaxed">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm shrink-0">
                  <MdDescription />
                </div>
                <p className="mt-1">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Card Thống kê Tham gia */}
          <div className="flex flex-col gap-4 p-6 bg-slate-50/50 border border-slate-200/80 rounded-2xl shadow-2xs">
            <div className="text-base font-bold text-slate-900 border-b border-slate-200/60 pb-3 flex justify-between items-center">
              <span>Thống kê tình nguyện viên</span>
              <button
                onClick={fetchParticipants}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                Xem danh sách →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200/60 text-center shadow-2xs">
                <span className="text-2xl font-extrabold text-amber-500">
                  {event.numOfPendingUser || 0}
                </span>
                <span className="text-[11px] font-medium text-slate-500 mt-1">
                  Đang chờ duyệt
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200/60 text-center shadow-2xs">
                <span className="text-2xl font-extrabold text-emerald-600">
                  {(event.numOfJoiningUser || 0) + 1}
                </span>
                <span className="text-[11px] font-medium text-slate-500 mt-1">
                  Đang tham gia
                </span>
              </div>
            </div>

            {(user?._id === event?.createBy?._id || user?.role === "admin") && (
              <button
                onClick={fetchParticipants}
                className="w-full py-2.5 px-4 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                Xem danh sách người tham gia
              </button>
            )}

            {showParticipants && (
              <div className="fixed inset-0 backdrop-blur-md bg-slate-950/50 flex justify-center items-center z-50 p-4">
                <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[80vh]">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                    <h3 className="font-bold text-base text-slate-900">Danh sách tình nguyện viên</h3>
                    <button
                      onClick={() => setShowParticipants(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <ul className="flex flex-col gap-2.5 overflow-y-auto flex-1 pr-1">
                    {participants && participants.length > 0 ? (
                      participants.map((p) => (
                        <li key={p._id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
                          {p.userId?.avatar ? (
                            <img src={p.userId.avatar} className="w-9 h-9 rounded-xl object-cover ring-1 ring-indigo-500/20" />
                          ) : (
                            <div className="w-9 h-9 bg-indigo-100 text-indigo-600 font-bold rounded-xl flex items-center justify-center text-xs">
                              {p.userId?.name ? p.userId.name[0] : "U"}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-slate-800 truncate">{p.userId?.name}</span>
                            <span className="text-[10px] text-slate-400 capitalize">{p.role || "Tình nguyện viên"}</span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-slate-400 text-center py-6">Chưa có người tham gia</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200/60 flex flex-col gap-2">
              <span className="font-bold text-xs text-slate-700">Đơn vị / Người tổ chức</span>
              <div className="flex items-center gap-3">
                {event?.createBy?.avatar ? (
                  <img
                    src={event?.createBy?.avatar}
                    alt="avatar"
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/20"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-xl">
                    <CgProfile />
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-800">{event?.createBy?.name || "Ẩn danh"}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={handleOpenCreatePost}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all my-6 cursor-pointer w-fit"
          >
            <FaPlus />
            <span>Tạo bài viết mới</span>
          </button>

          {openCreateModel && (
            <div className="fixed inset-0 backdrop-blur-[1px] bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-3xl h-[90%] rounded-2xl shadow-lg flex flex-col relative">
                <div className="flex justify-between items-center px-6 py-4 border-b bg-indigo-50">
                  <h2 className="text-xl font-semibold text-indigo-700">
                    Tạo bài viết mới
                  </h2>
                  <button
                    onClick={() => setOpenCreateModel(false)}
                    className="text-gray-600 hover:text-red-500 transition text-2xl"
                  >
                    <IoClose />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5 p-6 overflow-y-auto"
                >
                  {/* Tiêu đề */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề *
                    </label>
                    <input
                      name="content"
                      type="text"
                      value={form.content}
                      onChange={handleChange}
                      placeholder="Nhập tiêu đề nội dung..."
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ảnh bìa (Banner)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 border border-gray-300 rounded-xl 
             file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 
             file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                    />

                    {bannerPreview && bannerPreview.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                        {bannerPreview.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`preview-${index}`}
                            className="w-full h-40 object-cover rounded-xl"
                          />
                        ))}
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
                      {loading ? "Đang gửi..." : "Xác nhận tạo bài đăng"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="px-4 py-6 min-h-screen flex flex-col gap-6">
            {/* 🔹 Nếu không có bài viết */}
            {filteredPosts.length === 0 ? (
              <div className="text-center text-gray-600 text-lg font-medium mt-10">
                Hiện chưa có bài viết nào
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="flex flex-col bg-white rounded-xl border border-gray-300 shadow-md shadow-gray-200"
                >
                  {/* Header */}
                  <div className="p-4 flex gap-3 items-center border-b border-gray-200">
                    <img
                      src={event?.banner || "/default-banner.png"}
                      alt="avatar"
                      className="size-15 rounded-full object-cover"
                    />

                    <div className="flex flex-col">
                      <div className="font-bold text-[15px]">
                        {event?.title || "Chưa có nhóm"}
                      </div>
                      <div className="flex gap-2 items-center text-[13px] text-gray-600">
                        {post?.userId?.avatar ? (
                          <img
                            src={post?.userId?.avatar}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="p-1 text-3xl rounded-full">
                            <CgProfile />
                          </div>
                        )}
                        <div>{post?.userId?.name}</div>
                        <div>{getPostTimeAgo(post)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Nội dung */}
                  <div className="p-4 flex flex-col gap-2">
                    <div className="text-[15px]">{post.content}</div>
                    {post.images?.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {post.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`post-img-${idx}`}
                            className="w-full h-[250px] object-cover rounded-xl"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Like count */}
                  <div className="flex items-center gap-2 p-4 border-t border-b border-gray-200 text-gray-600">
                    <BiSolidLike className="text-blue-500" />
                    <span>{post.likeCount || 0} lượt thích</span>
                  </div>

                  {/* Nút Like & Comment */}
                  <div className="flex border-t">
                    <button
                      onClick={() => handleLikePost(post._id)}
                      className="flex-1 py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition duration-200 cursor-pointer"
                    >
                      {post.liked ? (
                        <BiSolidLike className="text-blue-500" />
                      ) : (
                        <BiLike />
                      )}
                      <span>{post.liked ? "Đã thích" : "Thích"}</span>
                    </button>

                    <button
                      onClick={() => handleOpenModal(post)}
                      className="flex-1 py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition duration-200 cursor-pointer"
                    >
                      <FaRegComment />
                      <span>Bình luận</span>
                    </button>
                  </div>
                </div>
              ))
            )}
            {/* Modal bình luận */}
            {openCommentModal && currentPost && (
              <div className="fixed inset-0 backdrop-blur-[1px] bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50">
                <div className="bg-white w-full max-w-3xl h-[90%] rounded-2xl shadow-lg flex flex-col relative">
                  {/* Header */}
                  <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white rounded-xl z-10">
                    <div className="text-xl font-semibold">
                      Bài viết của {currentPost.userId?.name}
                    </div>
                    <button
                      onClick={() => setOpenCommentModal(false)}
                      className="text-3xl hover:text-gray-500 font-bold cursor-pointer"
                    >
                      <IoClose />
                    </button>
                  </div>

                  {/* Nội dung bài viết */}
                  <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-2">
                    {/* Header */}
                    <div className="p-4 flex gap-3 items-center border-b border-gray-200">
                      <img
                        src={
                          currentPost?.eventId?.banner || "/default-banner.png"
                        }
                        alt="avatar"
                        className="size-15 rounded-xl object-cover"
                      />
                      <div className="flex flex-col ">
                        <div
                          className="font-bold text-[2
                
                5px] cursor-pointer hover:text-gray-600 transition duration-300"
                        >
                          {currentPost.eventId?.title || "Chưa có nhóm"}
                        </div>
                        <div className="flex gap-2 items-center text-[13px] text-gray-600">
                          {currentPost?.userId?.avatar ? (
                            <img
                              src={currentPost?.userId?.avatar}
                              alt="avatar"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="p-1 text-3xl rounded-full">
                              <CgProfile />
                            </div>
                          )}
                          <div>{currentPost?.userId?.name}</div>
                          <div>{getPostTimeAgo(currentPost)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-[15px]">{currentPost.content}</div>

                    {currentPost.images?.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {currentPost.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`post-img-${idx}`}
                            className="w-full h-auto object-cover rounded-xl"
                          />
                        ))}
                      </div>
                    )}
                    {/* Like count */}
                    <div className="flex items-center gap-2 p-4 border-t border-b border-gray-200 text-gray-600">
                      <BiSolidLike className="text-blue-500" />
                      <span>{currentPost.likeCount || 0} lượt thích</span>
                    </div>

                    {/* Nút Like & Comment */}
                    <div className="flex border-t">
                      <button
                        onClick={() => handleLikePost(currentPost._id)}
                        className="flex-1 py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition duration-200 cursor-pointer"
                      >
                        {currentPost.liked ? (
                          <BiSolidLike className="text-blue-500" />
                        ) : (
                          <BiLike />
                        )}
                        <span>{currentPost.liked ? "Đã thích" : "Thích"}</span>
                      </button>

                      <button
                        onClick={() => handleOpenModal(currentPost)}
                        className="flex-1 py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition duration-200 cursor-pointer"
                      >
                        <FaRegComment />
                        <span>Bình luận</span>
                      </button>
                    </div>
                    {/* Bình luận */}
                    <div className="space-y-2 mt-4">
                      {currentPost.comments.map((c, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          {c?.userId?.avatar ? (
                            <img
                              src={c?.userId?.avatar}
                              alt="avatar"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="p-1 text-3xl rounded-full">
                              <CgProfile />
                            </div>
                          )}
                          <div className="bg-gray-100 p-2 rounded-xl flex flex-col gap-2 flex-1">
                            <span className="font-semibold text-sm">
                              {c.userId.name}
                            </span>
                            <div>{c.content}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Input comment */}
                  <form
                    className="flex gap-2 p-4 border-t border-gray-200"
                    onSubmit={(e) => handleSubmitComment(e, currentPost._id)}
                  >
                    <input
                      type="text"
                      value={content || ""}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Viết bình luận..."
                      className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-500 cursor-pointer">
                      Gửi
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default EventDetail;
