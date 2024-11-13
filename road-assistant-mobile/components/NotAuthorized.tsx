// app/unauthorized.js

import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const UnauthorizedScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Для доступу до цієї функції потрібна авторизація, будь ласка перейдіть на домашню сторінку та авторизуйтесь, або зареєструйтесь
      </Text>
      
      <View style={styles.buttonContainer}>
        <Link href="/" asChild>
          <View style={styles.button}>
            <Text style={styles.buttonText}>На головну</Text>
          </View>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    width: '80%',
    backgroundColor: '#00235c',
    paddingVertical: 12,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UnauthorizedScreen;
