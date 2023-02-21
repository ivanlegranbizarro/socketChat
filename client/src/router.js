import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ChatWindow from "./components/ChatWindow";
import Login from "./pages/Login";
import Register from "./pages/Register";

const router = createBrowserRouter( [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/chat",
        element: <ChatWindow />
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
  }
] );

export default router;
