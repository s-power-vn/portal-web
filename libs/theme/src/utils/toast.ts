import { toast } from 'sonner';

export function success(message: string) {
  toast.success('Thành công', {
    description: message
  });
}

export function error(message: string) {
  toast.error('Lỗi', {
    description: message
  });
}

export function info(message: string) {
  toast.info('Thông báo', {
    description: message
  });
}

export function warning(message: string) {
  toast.warning('Cảnh báo', {
    description: message
  });
}
