import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ChatWindow from "./components/ChatWindow";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter( [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/chat",
        element: <PrivateRoute path="/chat" element={<ChatWindow />} />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Register />
  },
  {
    path: "*",
    element: <NotFound />
  }
] );

export default router;
