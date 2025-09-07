import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FarmerDashboard from "./pages/FarmerDashboard";
import InvestorDashboard from "./pages/InvestorDashboard";
import ExploreFarms from "./pages/ExploreFarms";
import FarmerOptions from "./pages/FarmerOptions";
import AddFarmListing from "./pages/AddFarmListing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/farmer/options" element={<FarmerOptions />} />
          <Route path="/farmer/add-listing" element={<AddFarmListing />} />
          <Route path="/investor" element={<InvestorDashboard />} />
          <Route path="/explore" element={<ExploreFarms />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
