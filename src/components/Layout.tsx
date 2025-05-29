
import { Outlet, useLocation, useParams } from "react-router-dom";
import ChatDock from "./ChatDock";

const Layout = () => {
  const location = useLocation();
  const params = useParams();
  
  // Determine context ID based on current route
  const getContextId = () => {
    if (location.pathname === "/") {
      return "home";
    }
    if (location.pathname.startsWith("/users/") && params.id) {
      return params.id;
    }
    return "home";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <ChatDock contextId={getContextId()} />
    </div>
  );
};

export default Layout;
