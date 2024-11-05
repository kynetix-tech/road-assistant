import { OpenAPI } from '@/service/Api';
import { useCallback, useEffect } from 'react';
import { useAuth0 } from 'react-native-auth0';

export const useApiTokenResolver = () => {
  const { getCredentials } = useAuth0();

  const resolver = useCallback(async () => {
    try {
      const credentials = await getCredentials();
      return credentials?.accessToken || '';
    } catch {
      return '';
    }
  }, [getCredentials]);

  useEffect(() => {
    OpenAPI.TOKEN = resolver;
  }, [resolver]);
};
