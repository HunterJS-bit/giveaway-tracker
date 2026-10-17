export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
}

export const useToast = () => {
    const toasts = useState<Toast[]>('global-toasts', () => []);

    const addToast = (message: string, type: Toast['type'] = 'success', duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const toast: Toast = { id, message, type, duration };

        toasts.value.push(toast);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    };

    const removeToast = (id: string) => {
        toasts.value = toasts.value.filter(t => t.id !== id);
    };

    return {
        toasts,
        addToast,
        removeToast
    };
};
