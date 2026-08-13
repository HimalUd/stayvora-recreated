import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../utils/api';

export function useAdminHotels() {
  return useQuery({
    queryKey: ['admin', 'hotels'],
    queryFn: () => adminAPI.hotels().then(r => r.data.hotels || []),
  });
}

export function useDeleteHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminAPI.deleteHotel(id).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'hotels'] });
    },
  });
}
