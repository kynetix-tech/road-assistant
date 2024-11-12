import ThemedButton from '@/components/ThemedButton';
import config from '@/config/auth0-config';
import { useApiTokenResolver } from '@/hooks/useApiTokenResolver';
import { AppService, UsersService } from '@/service/Api';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import { Auth0Provider, useAuth0 } from 'react-native-auth0';

const Home = () => {
  useApiTokenResolver();
  const { authorize, clearSession, user, error, getCredentials, isLoading } = useAuth0();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Other');
  const [recognizedSigns, setRecognizedSigns] = useState(0);
  const [commentsAdded, setCommentsAdded] = useState(0);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      loadUserData()
    }
  }, [user]);

  const onLogin = async () => {
    try {
      await authorize({
        audience: config.audience,
        scope: 'openid profile email'
      });
      let credentials = await getCredentials();
      console.log(credentials?.accessToken);
      // Alert.alert('AccessToken: ' + credentials?.accessToken);
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

  const loadUserData = async () => {
    try {
      const userData = await UsersService.getCurrentUser();
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setGender(userData.gender);
      setRecognizedSigns(userData.rating.recognizedSigns);
      setCommentsAdded(userData.rating.addedComments);
    } catch (error) {
      console.log("Користувач не знайдений або сталася помилка:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  }

  const handleSave = async () => {
    const requestBody = {
      email,
      firstName,
      lastName,
      gender,
    };
    try {
      await UsersService.upsert(requestBody);
      Alert.alert('Дані успішно збережені!');
      Keyboard.dismiss();
      loadUserData();
    } catch (error) {
      console.log('Помилка при збереженні даних:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>RSD</Text>
      {!user && <Text>Ви не авторизовані, увійдіть або зареєструйтесь будь ласка</Text>}
      {error && <Text>{error.message}</Text>}

      {loggedIn && (
        <View style={styles.formContainer}>
          <Text>Email:</Text>
          <TextInput
            value={email}
            editable={false}
            style={styles.input}
          />

          <Text>Ім’я:</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />

          <Text>Прізвище:</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />

          <Text>Стать:</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
            >
              <Picker.Item label="Чоловіча" value="Male" />
              <Picker.Item label="Жіноча" value="Female" />
              <Picker.Item label="Інше" value="Other" />
            </Picker>
          </View>

          <ThemedButton
            onPress={handleSave}
            title="Зберегти зміни"
          />
          
          <View style={styles.divider} />
          <Text style={styles.statsHeader}>Ваша статистика</Text>
          <Text>Кількість розпізнаних знаків: {recognizedSigns}</Text>
          <Text>Кількість доданих коментарів: {commentsAdded}</Text>
        </View>
      )}

      <ThemedButton
        onPress={loggedIn ? onLogout : onLogin}
        title={loggedIn ? 'Вийти з системи' : 'Увійти в систему (Зареєструватись)'}
      />

      <Button
        onPress={() => AppService.getPrivate().then(console.log)}
        title="Test"
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
  formContainer: {
    width: '80%',
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontWeight: '500'
  },
  picker: {
    height: 55,
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 20,
  },
  statsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
