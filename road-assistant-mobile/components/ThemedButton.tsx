import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ThemedButton(props: any) {
  const { onPress, title = 'Save', disabled } = props;
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={disabled}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '80%',
    backgroundColor: '#00235c',
    paddingVertical: 12,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
    textAlign: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
