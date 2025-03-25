"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type ToastProps = {
    title?: string;
    description?: string;
    action?: React.ReactNode;
    variant?: "default" | "destructive";
    duration?: number;
};

type ToastContextType = {
    toast: (props: ToastProps) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>([]);

    const toast = React.useCallback((props: ToastProps) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { ...props, id }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, props.duration || 5000);
    }, []);

    const removeToast = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={cn(
                            "bg-white dark:bg-gray-800 border shadow-lg rounded-md p-4 flex gap-2 items-start",
                            t.variant === "destructive" && "border-red-500"
                        )}
                    >
                        <div className="flex-1">
                            {t.title && (
                                <h4 className={cn("font-semibold", t.variant === "destructive" && "text-red-500")}>
                                    {t.title}
                                </h4>
                            )}
                            {t.description && <p className="text-sm">{t.description}</p>}
                        </div>
                        <button onClick={() => removeToast(t.id)} className="text-gray-500 hover:text-gray-700">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

// Export a simplified version for components that don't use hooks
export const toast = (props: ToastProps) => {
    // Create a temporary div to render the toast
    const container = document.createElement("div");
    document.body.appendChild(container);

    const toastElement = document.createElement("div");
    toastElement.className = cn(
        "fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border shadow-lg rounded-md p-4 flex gap-2 items-start",
        props.variant === "destructive" && "border-red-500"
    );

    const contentDiv = document.createElement("div");
    contentDiv.className = "flex-1";

    if (props.title) {
        const title = document.createElement("h4");
        title.className = cn("font-semibold", props.variant === "destructive" && "text-red-500");
        title.textContent = props.title;
        contentDiv.appendChild(title);
    }

    if (props.description) {
        const description = document.createElement("p");
        description.className = "text-sm";
        description.textContent = props.description;
        contentDiv.appendChild(description);
    }

    toastElement.appendChild(contentDiv);

    const closeButton = document.createElement("button");
    closeButton.className = "text-gray-500 hover:text-gray-700";
    closeButton.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    closeButton.onclick = () => document.body.removeChild(container);

    toastElement.appendChild(closeButton);
    container.appendChild(toastElement);

    setTimeout(() => {
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
    }, props.duration || 5000);
};
