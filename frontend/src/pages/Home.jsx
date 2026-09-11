import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { createComment } from "../api/comment.api";
import { LikeUnLike } from "../api/like.api";
import { getPostTimeAgo } from "../utils";
import toast from "react-hot-toast";
import {
  createCommentNotification,
  createLikeNotification,
} from "../api/notification.api";

const Home = () => {
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const { posts, setPosts, user, loading } = useOutletContext();
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  // Mở modal bình luận
  const handleOpenModal = (post) => {
    setCurrentPost(post);
    setOpenCommentModal(true);
  };

  // Like / Unlike bài viết
  const handleLikePost = async (postId) => {
    try {
      const res = await LikeUnLike(postId);
      if (res.data.liked) {
        createLikeNotification(postId); // chạy song song
      }
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, liked: res.data.liked, likeCount: res.data.likeCount }
            : p
        )
      );
    } catch (error) {
      console.error("Lỗi khi like:", error.response?.data?.message || error.message);
    }
  };

  // Gửi bình luận
  const handleSubmitComment = async (e, postId) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }

    try {
      const res = await createComment({ content, postId });
      toast.success(res?.data?.message || "Bình luận thành công");

      await createCommentNotification(postId);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                comments: [...p.comments, { content, userId: user, _id: Date.now() }],
              }
            : p
        )
      );

      setCurrentPost((prev) => ({
        ...prev,
        comments: [...prev.comments, { content, userId: user, _id: Date.now() }],
      }));

      setContent("");
    } catch (error) {
      console.error("❌ Lỗi khi bình luận:", error);
      toast.error(error.response?.data?.message || error.message || "Lỗi khi bình luận");
    }
  };

  // Ẩn cuộn khi mở modal
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
    <div className="py-4 px-1 sm:px-4 flex flex-col gap-6 max-w-4xl mx-auto">
      {posts.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[300px] bg-white rounded-2xl border border-slate-200/80 p-8 text-center">
          <div className="text-slate-400 text-lg font-medium">Chưa có bài viết nào</div>
          <p className="text-slate-500 text-sm mt-1">Các hoạt động và bài đăng từ chiến dịch sẽ xuất hiện ở đây.</p>
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Header bài viết */}
            <div className="p-4 sm:p-5 flex gap-3.5 items-center border-b border-slate-100">
              <img
                src={post?.event?.banner || "/default-banner.png"}
                alt="banner"
                className="w-14 h-14 rounded-xl object-cover shadow-sm border border-slate-100"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <div
                  onClick={() => navigate(`/event/detail/${post.event._id}`)}
                  className="font-bold text-lg sm:text-xl text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors duration-200 truncate"
                >
                  {post.event?.title || "Chưa có nhóm"}
                </div>
                <div className="flex flex-wrap gap-2 items-center text-xs text-slate-500 mt-1">
                  {post.userId?.avatar ? (
                    <img
                      src={post.userId.avatar}
                      alt="avatar"
                      className="w-6 h-6 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                  ) : (
                    <div className="text-lg text-slate-400">
                      <CgProfile />
                    </div>
                  )}
                  <span className="font-semibold text-slate-700">{post.userId?.name || "Người dùng"}</span>
                  <span>•</span>
                  <span>{getPostTimeAgo(post)}</span>
                </div>
              </div>
            </div>

            {/* Nội dung bài viết */}
            <div className="p-4 sm:p-5 flex flex-col gap-3">
              <div className="text-[15px] text-slate-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
              {post.images?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2 rounded-xl overflow-hidden">
                  {post.images.map((img, idx) => (
                    <img
                      key={`${post._id}--${idx}`}
                      src={img}
                      alt={`post-img-${idx}`}
                      className="w-full h-[220px] object-cover rounded-xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thống kê Like */}
            <div className="flex items-center gap-2 px-5 py-2.5 border-t border-b border-slate-100 text-xs font-medium text-slate-500 bg-slate-50/50">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-50 text-indigo-600">
                <BiSolidLike className="text-xs" />
              </span>
              <span>{post.likeCount || 0} lượt thích</span>
            </div>

            {/* Nút Tương tác Like & Comment */}
            <div className="flex border-t border-slate-100 divide-x divide-slate-100">
              <button
                onClick={() => handleLikePost(post._id)}
                className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  post.liked
                    ? "text-indigo-600 bg-indigo-50/50 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                }`}
              >
                {post.liked ? <BiSolidLike className="text-indigo-600 text-lg" /> : <BiLike className="text-lg" />}
                <span>{post.liked ? "Đã thích" : "Thích"}</span>
              </button>

              <button
                onClick={() => handleOpenModal(post)}
                className="flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
              >
                <FaRegComment className="text-base" />
                <span>Bình luận</span>
              </button>
            </div>
          </div>
        ))
      )}

      {/* Modal bình luận */}
      {openCommentModal && currentPost && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-950/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col relative overflow-hidden border border-slate-100">
            {/* Header modal */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <div className="text-base sm:text-lg font-bold text-slate-800">
                Bài viết của {currentPost.userId?.name || "Người dùng"}
              </div>
              <button
                onClick={() => setOpenCommentModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors text-2xl cursor-pointer"
              >
                <IoClose />
              </button>
            </div>

            {/* Nội dung modal */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col gap-4">
              {/* Header post preview */}
              <div className="flex gap-3 items-center pb-4 border-b border-slate-100">
                <img
                  src={currentPost?.event?.banner || "/default-banner.png"}
                  alt="banner"
                  className="w-14 h-14 rounded-xl object-cover border border-slate-100"
                />
                <div className="flex flex-col">
                  <div className="font-bold text-base text-slate-900">
                    {currentPost.event?.title || "Chưa có nhóm"}
                  </div>
                  <div className="flex gap-2 items-center text-xs text-slate-500 mt-1">
                    {currentPost.userId?.avatar ? (
                      <img
                        src={currentPost.userId.avatar}
                        alt="avatar"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="text-base text-slate-400">
                        <CgProfile />
                      </div>
                    )}
                    <span>{currentPost.userId?.name || "Người dùng"}</span>
                  </div>
                </div>
              </div>

              {/* Nội dung text */}
              <div className="text-[15px] text-slate-700 leading-relaxed">{currentPost.content}</div>

              {/* Hình ảnh */}
              {currentPost.images?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 rounded-xl overflow-hidden">
                  {currentPost.images.map((img, idx) => (
                    <img
                      key={`${currentPost._id}--${idx}`}
                      src={img}
                      alt={`post-img-${idx}`}
                      className="w-full h-[180px] object-cover rounded-xl"
                    />
                  ))}
                </div>
              )}

              {/* Danh sách bình luận */}
              <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Tất cả bình luận ({(currentPost.comments || []).length})
                </div>
                {(currentPost.comments || []).length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                ) : (
                  (currentPost.comments || []).map((c, idx) => (
                    <div
                      key={`${c._id || "temp"}-${c.userId?._id || "user"}-${idx}`}
                      className="flex items-start gap-2.5"
                    >
                      {c.userId?.avatar ? (
                        <img
                          src={c.userId.avatar}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover mt-1"
                        />
                      ) : (
                        <div className="text-2xl text-slate-400 mt-1">
                          <CgProfile />
                        </div>
                      )}
                      <div className="bg-slate-100 p-3 rounded-2xl flex flex-col gap-1 flex-1">
                        <span className="font-semibold text-xs text-slate-800">
                          {c.userId?.name || "Người dùng"}
                        </span>
                        <div className="text-sm text-slate-700">{c.content}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Form gửi bình luận */}
            <form
              className="flex gap-2 p-4 border-t border-slate-100 bg-white"
              onSubmit={(e) => handleSubmitComment(e, currentPost._id)}
            >
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all cursor-pointer">
                Gửi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
