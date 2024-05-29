import { Route, Routes, BrowserRouter } from "react-router-dom";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Dashboard } from "./pages/Dashboard";
import { SendMoney } from "./components/SendMoney";
function App() {
  return (
    <BrowserRouter>
      <AppContent></AppContent>
    </BrowserRouter>
  );
}
function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<SendMoney />} />
      </Routes>
    </>
  )

}

export default App;
