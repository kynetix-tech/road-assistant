const config = {
    clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || '',
    domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN || '',
    audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE || ''
  };
  
export default config;
