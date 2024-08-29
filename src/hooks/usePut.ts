// hooks/usePut.ts
import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from '@tanstack/react-query';
import api from '../api/axios';

const usePut = <T, TVariables = any>(
  url: string,
  options?: Omit<
    UseMutationOptions<T, unknown, TVariables, unknown>,
    'mutationFn'
  >,
): UseMutationResult<T, unknown, TVariables, unknown> => {
  return useMutation<T, unknown, TVariables, unknown>({
    mutationFn: (putData: TVariables) => api.put(url, putData),
    ...options,
  });
};

export default usePut;
