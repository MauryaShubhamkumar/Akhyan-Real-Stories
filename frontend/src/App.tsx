import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import PublicOnlyRoute from "./components/shared/PublicOnlyRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-paper">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <SignupPage />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/post/:id"
              element={<PostPage />}
            />

            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}