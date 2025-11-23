import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FAQPage from "./pages/FAQPage";

function App() {
  return (
    <BrowserRouter>
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
            </ul>
          </div>
        </div>

        {/* Main content area */}
        <main className="max-w-3xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/faq" element={<FAQPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;