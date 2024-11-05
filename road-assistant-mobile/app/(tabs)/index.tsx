import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import {useAuth0, Auth0Provider} from 'react-native-auth0';
import config from '@/config/auth0-config';
import { useApiTokenResolver } from '@/hooks/useApiTokenResolver';
import { AppService, OpenAPI } from '@/service/Api';

const Home = () => {
  useApiTokenResolver()
  const {authorize, clearSession, user, error, getCredentials, isLoading } = useAuth0();

  const onLogin = async () => {
    try {
      await authorize(
        {
          audience: config.audience,
          scope: 'openid profile email'
        }
      );
      let credentials = await getCredentials();
      console.log(credentials?.accessToken)
      Alert.alert('AccessToken: ' + credentials?.accessToken);
    } catch (e) {
      console.log(e);
    }
  };

  const loggedIn = user !== undefined && user !== null;

  const onLogout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log('Log out cancelled');
    }
  };

  if (isLoading) {
    return <View style={styles.container}><Text>Loading</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Auth0Sample - Login </Text>
      {user && <Text>You are logged in as {user.name}</Text>}
      {!user && <Text>You are not logged in</Text>}
      {error && <Text>{error.message}</Text>}
      <Button
        onPress={loggedIn ? onLogout : onLogin}
        title={loggedIn ? 'Log Out' : 'Log In'}
      />
      <Button 
        // onPress={() => fetch('http://10.0.2.2:8080/public').then(console.log)}
        onPress={() => AppService.getPrivate().then(console.log)}
        title='Test'
      />
    </View>
  );
};

export default function HomeScreen() {
  return (
    <Auth0Provider domain={config.domain} clientId={config.clientId}>
      <Home />
    </Auth0Provider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
