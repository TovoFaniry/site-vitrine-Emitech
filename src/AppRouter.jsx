import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import MpianatraList from "../pages/MpianatraList";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/membres" element={<MpianatraList />} />
      </Routes>
    </BrowserRouter>
  );
}