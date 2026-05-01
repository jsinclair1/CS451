import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import BudgetsPage from "./pages/BudgetsPage";
import AddBudgetPage from "./pages/AddBudgetPage";
import TransactionsPage from "./pages/TransactionsPage";
import AddTransactionPage from "./pages/AddTransactionPage";
import CategoriesPage from "./pages/CategoriesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage"; 
import SettingsPage from "./pages/SettingsPage"; 

export default function App() {
  const [page, setPage] = useState("landing");

  if (page === "landing") return <LandingPage onNavigate={setPage} />;
  
  if (page === "login") 
  return (
    <LoginPage
      onBack={() => setPage("landing")}
      onSuccess={() => setPage("dashboard")}
      onNavigate={setPage}
    />
  );
  
  if (page === "register") return <RegisterPage onBack={() => setPage("landing")} onSuccess={() => setPage("dashboard")} />;
  
  if (page === "dashboard") return <DashboardPage onNavigate={setPage} />;
  if (page === "budgets") return <BudgetsPage onNavigate={setPage} />;
  if (page === "transactions") return <TransactionsPage onNavigate={setPage} />;
  if (page === "add-transaction") return <AddTransactionPage onNavigate={setPage} />;
  if (page === "add-budget") return <AddBudgetPage onNavigate={setPage} />;
  if (page === "categories") return <CategoriesPage onNavigate={setPage} />;

  if (page === "profile") return <ProfilePage onNavigate={setPage} />;
  if (page === "settings") return <SettingsPage onNavigate={setPage} />;

  return <LandingPage onNavigate={setPage} />;
}