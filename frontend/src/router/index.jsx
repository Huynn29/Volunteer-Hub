import { createBrowserRouter } from "react-router-dom";


import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Layout from "../layout/Layout";
import AdminLayout from "../layout/AdminLayout";
import ManageLayout from "../layout/ManageLayout";

import EventList from "../pages/Event/EventList";
import EventJoining from "../pages/Event/EventJoining";
import EventPendingJoin from "../pages/Event/EventPendingJoin";
import EventCompleted from "../pages/Event/EventCompleted";
import EventRejected from "../pages/Event/EventRejected";
import EventLayout from "../layout/EventLayout";
import EventDetail from "../pages/Event/EventDetail";

import Home from "../pages/Home";
import Profile from "../pages/Profile";

import ManagePost from "../pages/Manager/ManagePost";
import ManageApproved from "../pages/Manager/ManageApproved";
import ManagePending from "../pages/Manager/ManagePending";
import ManageRejected from "../pages/Manager/ManageRejected";
import ManageCompleted from "../pages/Manager/ManageCompleted";
import ManageUser from "../pages/Manager/ManageUser";
import ManageCreateEvent from "../pages/Manager/ManageCreateEvent";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminListEvent from "../pages/Admin/AdminListEvent";
import AdminListUser from "../pages/Admin/AdminListUser";
import AdminListPost from "../pages/Admin/AdminListPost";
import LandingPage from "../pages/LandingPage";

import { jwtDecode } from "jwt-decode";

// Điều hướng thông minh:
// - Chưa có token -> Mở Landing Page giới thiệu
// - Có token nhưng là admin -> Chuyển hướng trực tiếp vào /admin/dashboard
// - Có token (user / manager) -> Mở Bảng tin (Layout + Home)
const RootRoute = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <LandingPage />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      return <LandingPage />;
    }
    if (decoded.role === "admin") {
      window.location.replace("/admin/dashboard");
      return null;
    }
  } catch {
    localStorage.removeItem("token");
    return <LandingPage />;
  }

  return <Layout />;
};

export const routers = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "landing",
    element: <LandingPage />,
  },
  {
    path: "feed",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "event",
    element: <EventLayout />,
    children: [
      {
        path: "home",
        element: <EventList />,
      },
      {
        path: "detail/:id",
        element: <EventDetail />,
      },
      {
        path: "joining",
        element: <EventJoining />,
      },
      {
        path: "pending-join",
        element: <EventPendingJoin />,
      },
      {
        path: "rejected",
        element: <EventRejected />,
      },
      {
        path: "completed",
        element: <EventCompleted />,
      }
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "manage",
    element: <ManageLayout />,
    children: [
      {
        path: "create",
        element: <ManageCreateEvent />,
      },
      {
        path: "post",
        element: <ManagePost />,
      },
      {
        path: "user",
        element: <ManageUser />,
      },
      {
        path: "approved",
        element: <ManageApproved />,
      },
      {
        path: "pending",
        element: <ManagePending />,
      },
      {
        path: "rejected",
        element: <ManageRejected />,
      },
      {
        path: "completed",
        element: <ManageCompleted />,
      },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "list/posts",
        element: <AdminListPost />,
      },
      {
        path: "list/events",
        element: <AdminListEvent />,
      },
      {
        path: "list/users",
        element: <AdminListUser />,
      }
    ],
  },
]);
