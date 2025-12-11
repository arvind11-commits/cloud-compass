import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Roadmap from "./pages/Roadmap";
import CheckIn from "./pages/CheckIn";
import Resources from "./pages/Resources";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, isLoading, login, signup, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={login} onSignup={signup} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index user={user} onLogout={logout} />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
