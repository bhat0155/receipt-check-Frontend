import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import Homepage from "./pages/Homepage";
import FAQPage from "./pages/FAQPage";
import RecentRecalls from "./pages/RecentRecalls";
import { HomeProvider } from "./states/HomeContext";

function App() {
  return (
    <BrowserRouter>
      <HomeProvider>
           <div className="min-h-screen bg-base-200">
        {/* Navbar */}
        <div className="navbar bg-base-100 shadow-sm">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost normal-case text-xl">
              Receipt Recall Checker
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal p-0">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "font-semibold" : undefined
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/faq"
                  className={({ isActive }) =>
                    isActive ? "font-semibold" : undefined
                  }
                >
                  FAQ
                </NavLink>
              </li>
              {/* recent recalls */}
               <li>
                <NavLink
                  to="/recent-recalls"
                  className={({ isActive }) =>
                    isActive ? "font-semibold" : undefined
                  }
                >
                  Recalls
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Main content area */}
        <main className="max-w-3xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/recent-recalls" element={<RecentRecalls />} />
          </Routes>
        </main>
      </div>
      </HomeProvider>
    </BrowserRouter>
  );
}

export default App;