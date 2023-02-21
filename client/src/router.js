import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ChatWindow from "./components/ChatWindow";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { useNavigate } from 'react-router-dom';

const router = createBrowserRouter( [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/chat",
        element: <RouteChatWindow />
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

function RouteChatWindow () {
  const navigate = useNavigate();
  const token = localStorage.getItem( 'token' );
  if ( token ) {
    return <ChatWindow />;
  } else {
    navigate( '/login' );
    return null;
  }
}

export default router;
