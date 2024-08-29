// hooks/usePost.ts
import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from '@tanstack/react-query';
import api from '../api/axios';

const usePost = <T, TVariables = any>(
  url: string,
  options?: Omit<
    UseMutationOptions<T, unknown, TVariables, unknown>,
    'mutationFn'
  >,
): UseMutationResult<T, unknown, TVariables, unknown> => {
  return useMutation<T, unknown, TVariables, unknown>({
    mutationFn: (postData: TVariables) => api.post(url, postData),
    ...options,
  });
};

export default usePost;
