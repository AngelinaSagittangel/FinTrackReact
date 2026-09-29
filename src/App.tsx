import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./layout/Layout";
import TransactionsProvider from "./context/TransactionsProvider";
import WalletsProvider from "./context/WalletsProvider";
import CategoriesProvider from "./context/CategoriesProvider";
import BudgetsProvider from "./context/BudgetsProvider";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Overview = lazy(() => import("./pages/Overview"));
const Activity = lazy(() => import("./pages/Activity"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Wallets = lazy(() => import("./pages/Wallets"));
const Budgets = lazy(() => import("./pages/Budgets"));
const Profile = lazy(() => import("./pages/Profile"));

function App() {
  return (
    <AuthProvider>
      <TransactionsProvider>
        <WalletsProvider>
          <CategoriesProvider>
            <BudgetsProvider>
              <BrowserRouter>
                <Suspense fallback={<div>Загрузка страницы...</div>}>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path="/" element={<Layout />}>
                        <Route index element={<Overview />} />
                        <Route path="activity" element={<Activity />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="wallets" element={<Wallets />} />
                        <Route path="budgets" element={<Budgets />} />
                        <Route path="profile" element={<Profile />} />
                      </Route>
                    </Route>
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </BudgetsProvider>
          </CategoriesProvider>
        </WalletsProvider>
      </TransactionsProvider>
    </AuthProvider>
  );
}

export default App;
