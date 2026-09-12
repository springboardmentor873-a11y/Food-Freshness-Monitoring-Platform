import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";
import { NotificationsProvider } from "./context/NotificationsProvider";
import { AuthProvider } from "./context/AuthContext";
import ToastProvider from "./components/ui/Toast";
import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationsProvider>
          <BrowserRouter>
            <AppRouter />
            <ToastProvider />
          </BrowserRouter>
        </NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
