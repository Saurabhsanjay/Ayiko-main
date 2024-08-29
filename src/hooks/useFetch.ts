import {useQuery, UseQueryResult, QueryKey} from '@tanstack/react-query';
import {fetcher} from '../api/fetcher';

const useFetch = <T>(
  queryKey: QueryKey,
  url: string,
  noCache: boolean = false,
  enabled: boolean = true, // Add enabled as a parameter
): UseQueryResult<T> => {
  return useQuery<T>({
    queryKey,
    queryFn: () => fetcher(url),
    staleTime: noCache ? 0 : 5 * 60 * 1000, // 5 minutes by default
    enabled, // Conditionally enable the query
  });
};

export default useFetch;
