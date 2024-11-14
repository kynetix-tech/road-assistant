import ThemedButton from '@/components/ThemedButton';
import config from '@/config/auth0-config';
import { useApiTokenResolver } from '@/hooks/useApiTokenResolver';
import { UsersService } from '@/service/Api';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

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

  useFocusEffect(
    useCallback(() => {
      const fetchuserData = async () => {
        await loadUserData()
      };
      if (user) {
        fetchuserData();
      }
    }, [user])
  )

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
      Alert.alert('Увага!', 'Ваших немає даних в базі даних застосунку, \nвнесіть їх та натисніть "Зберегти зміни"');
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
      <Image source={require('@/assets/images/logov2.png')} style={styles.logoImg}/>
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
          <View style={styles.centeredContainer}>
            <ThemedButton
              onPress={handleSave}
              title="Зберегти зміни"
            />
          </View>                   
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
    </View>
  );
};

export default function HomeScreen() {
  return (
    <Home />
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
  },
  statsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  logoImg: {
    marginTop: 30,
    height: 110,
    width: 110
  }
});
