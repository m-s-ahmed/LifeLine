import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import AboutUs from "../pages/About/AboutUs";
import AsDonor from "../components/Register/AsDonor";
import AsOrganization from "../components/Register/AsOrganization";
import FindBlood from "../pages/FindBlood/FindBlood";
import random from "../pages/HowToGetBlood/HowToGetBlood";
import PrivateRoute from "../providers/PrivateRoute";
import Login from "../pages/Login/Login";
import MyProfile from "../pages/MyProfile/MyProfile";
import EditProfile from "../pages/EditProfile/EditProfile";
import Feedback from "../pages/Feedback/Feedback";
import NotificationDetails from "../pages/NotificationDetails";
import ContactPage2 from "../components/Contact/ContactPage2";
import Jobs from "../components/Jobs/Jobs";
import ApplyNow from "../components/ApplyNow/ApplyNow";
import OrganizationMembers from "../components/OrganizationMembers/OrganizationMembers";
import AdminRoute from "../providers/AdminRoute";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminDonors from "../pages/Admin/AdminDonors";
import AdminAnalytics from "../pages/Admin/AdminAnalytics";
import AdminResponseHistory from "../pages/Admin/AdminResponseHistory";
import ChatRoom from "../pages/Chat/ChatRoom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/about",
        Component: AboutUs,
      },
      {
        path: "/regasdonor",
        element: <AsDonor></AsDonor>,
      },
      {
        path: "/regasorganization",
        Component: AsOrganization,
      },
      {
        path: "/findblood",
        element: (
          <PrivateRoute>
            <FindBlood></FindBlood>
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/my-profile",
        element: (
          <PrivateRoute>
            <MyProfile></MyProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "/edit-profile",
        element: (
          <PrivateRoute>
            <EditProfile></EditProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "/feedback",
        Component: Feedback,
      },
      {
        path: "/random",
        Component: random,
      },
      {
        path: "/notifications/:id",
        element: <NotificationDetails></NotificationDetails>,
      },
      {
        path: "/contactpage",
        element: <ContactPage2></ContactPage2>,
      },
      {
        path: "/jobs",
        element: <Jobs></Jobs>,
      },

      {
        path: "/apply",
        element: <ApplyNow></ApplyNow>,
      },
      {
        path: "/orgmem",
        element: <OrganizationMembers></OrganizationMembers>,
      },
      {
        path: "/admin-login",
        element: <AdminLogin></AdminLogin>,
      },
      {
        path: "/admin-dashboard",
        element: (
          <AdminRoute>
            <AdminDashboard></AdminDashboard>
          </AdminRoute>
        ),
      },
      {
        path: "/admin-donors",
        element: (
          <AdminRoute>
            <AdminDonors />
          </AdminRoute>
        ),
      },
      {
        path: "/admin-analytics",
        element: (
          <AdminRoute>
            <AdminAnalytics />
          </AdminRoute>
        ),
      },
      {
        path: "/admin-response-history",
        element: (
          <AdminRoute>
            <AdminResponseHistory />
          </AdminRoute>
        ),
      },
      {
        path: "/chat/:conversationId",
        element: (
          <PrivateRoute>
            <ChatRoom />
          </PrivateRoute>
        ),
      },
      {
        path: "/*",
        element: <NotFound></NotFound>,
      },
    ],
  },
]);

export default router;
