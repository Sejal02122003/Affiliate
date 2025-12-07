import { toast } from 'sonner';

export const showToast = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  info: (msg: string) => toast(msg),
  loading: (msg: string) => toast.loading(msg),
  dismiss: (id?: number | string) => toast.dismiss(id),
};
