
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

export default function HomeScreen({ navigation }) {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    navigation.navigate('SearchResults', data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cerca Voli</Text>
      
      <Controller
        control={control}
        name="departureAirport"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Aeroporto di partenza"
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="departureDate"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Data partenza"
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <TouchableOpacity 
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>Cerca</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
