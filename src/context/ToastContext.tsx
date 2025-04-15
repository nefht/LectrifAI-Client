import { useState, createContext, useContext, ReactNode } from "react";
import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

interface ToastMessage {
  id: number;
  status: "success" | "error" | "warning";
  message: string;
  timeout?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (status: "success" | "error" | "warning", message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const { toasts, showToast, ToastContainer } = useToastProvider();

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      <ToastContainer />
      {children}
    </ToastContext.Provider>
  );
};

export const useToastProvider = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    status: "success" | "error" | "warning",
    message: string,
    timeout?: number
  ) => {
    const newToast = { id: Date.now(), status, message };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Tự động xóa thông báo sau 5 giây
    setTimeout(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => toast.id !== newToast.id)
      );
    }, timeout ?? 5000);
  };

  const getIcon = (status: "success" | "error" | "warning") => {
    switch (status) {
      case "success":
        return <HiCheck className="h-5 w-5" />;
      case "error":
        return <HiX className="h-5 w-5" />;
      case "warning":
        return <HiExclamation className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const ToastContainer = () => (
    <div className="fixed top-5 right-5 z-[999] flex flex-col gap-2 shadow-lg">
      {toasts.map((toast) => (
        <Toast key={toast.id}>
          <div
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-lg ${
              toast.status === "success"
                ? "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
                : toast.status === "error"
                ? "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
                : "bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200"
            }`}
          >
            {getIcon(toast.status)}
          </div>
          <div
            className={`ml-3 mr-2 text-sm font-semibold ${
              toast.status === "success"
                ? "text-green-500"
                : toast.status === "error"
                ? "text-red-500"
                : "text-orange-500"
            }`}
          >
            {toast.message}
          </div>
          <Toast.Toggle
            onDismiss={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        </Toast>
      ))}
    </div>
  );
  return { toasts, showToast, ToastContainer };
};

export { ToastContext, ToastProvider };
