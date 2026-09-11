import { useEffect, useState } from "react";
import { FaUsers, FaRegNewspaper, FaCalendarAlt } from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";
import toast from "react-hot-toast";
import { getAllUser } from "../../api/user.api";
import { getAllEvent } from "../../api/event.api";
import { getAllPost } from "../../api/post.api";
import { getTimeAgo } from "../../utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

const STAT_CARDS = [
  {
    key: "users",
    label: "Người dùng",
    icon: FaUsers,
    gradient: "from-indigo-500 to-indigo-600",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-100",
  },
  {
    key: "events",
    label: "Sự kiện",
    icon: FaCalendarAlt,
    gradient: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
  {
    key: "posts",
    label: "Bài đăng",
    icon: FaRegNewspaper,
    gradient: "from-pink-500 to-pink-600",
    bg: "bg-pink-50",
    text: "text-pink-600",
    border: "border-pink-100",
  },
];

const BAR_COLORS = ["#6366F1", "#10B981", "#EC4899"];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, events: 0, posts: 0 });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [usersRes, eventsRes, postsRes] = await Promise.all([
        getAllUser(),
        getAllEvent(),
        getAllPost(),
      ]);

      const users = usersRes.data.users || [];
      const events = eventsRes.data.events || [];
      const posts = postsRes.data.posts || [];

      setStats({
        users: users.length,
        events: events.length,
        posts: posts.length,
      });

      const latestEvents = events
        .slice(-3)
        .reverse()
        .map((e) => ({
          type: "event",
          text: `Sự kiện "${e.title}" vừa được thêm ${getTimeAgo(e.createdAt)}.`,
          time: e.createdAt,
        }));

      const latestPosts = posts
        .slice(-3)
        .reverse()
        .map((p) => {
          const short =
            p.content.length > 50
              ? p.content.slice(0, 50) + "..."
              : p.content;

          return {
            type: "post",
            text: `Bài viết "${short}" vừa được đăng ${getTimeAgo(
              p.createdAt
            )}.`,
            time: p.createdAt,
          };
        });

      const latestUsers = users
        .slice(-3)
        .reverse()
        .map((u) => ({
          type: "user",
          text: `Người dùng mới: ${u.name} vừa tham gia ${getTimeAgo(
            u.createdAt
          )}.`,
          time: u.createdAt,
        }));

      setRecentActivities([
        ...latestEvents,
        ...latestPosts,
        ...latestUsers,
      ]);

      setChartData([
        { name: "Người dùng", value: users.length },
        { name: "Sự kiện", value: events.length },
        { name: "Bài đăng", value: posts.length },
      ]);
    } catch (error) {
      console.error(error.message);
      toast.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[350px]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const typeIcon = {
    event: "📅",
    post: "📰",
    user: "👤",
  };

  const typeColor = {
    event: "bg-indigo-50 text-indigo-600",
    post: "bg-pink-50 text-pink-600",
    user: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Tổng quan hệ thống
        </h1>

        <p className="text-xs text-slate-500 mt-1">
          Thống kê toàn bộ dữ liệu VolunteerHub theo thời gian thực
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              className={`relative bg-white rounded-2xl border ${card.border} p-5 overflow-hidden shadow-xs hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    {card.label}
                  </p>

                  <p className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                    {stats[card.key]}
                  </p>

                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MdTrendingUp className="text-emerald-500" />
                    Tổng toàn bộ
                  </p>
                </div>

                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md`}
                >
                  <Icon className="text-white text-xl" />
                </div>
              </div>

              {/* decorative blob */}
              <div
                className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10 bg-gradient-to-br ${card.gradient}`}
              />
            </div>
          );
        })}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="font-bold text-sm text-slate-900">
              Biểu đồ thống kê
            </h3>

            <p className="text-xs text-slate-400">
              Số lượng theo từng danh mục
            </p>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={40}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />

              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={BAR_COLORS[idx % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="font-bold text-sm text-slate-900">
              Hoạt động gần đây
            </h3>

            <p className="text-xs text-slate-400">
              9 hoạt động mới nhất từ hệ thống
            </p>
          </div>

          <ul className="flex flex-col gap-2.5 max-h-[200px] overflow-y-auto pr-1">
            {recentActivities.length === 0 ? (
              <li className="text-xs text-slate-400 text-center py-4">
                Chưa có hoạt động nào
              </li>
            ) : (
              recentActivities.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
                      typeColor[a.type]
                    }`}
                  >
                    {typeIcon[a.type]}
                  </span>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {a.text}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
