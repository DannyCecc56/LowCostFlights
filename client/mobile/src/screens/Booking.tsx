import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

export default function BookingScreen({ route, navigation }) {
  const { flight } = route.params;
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('https://your-api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightId: flight.id,
          ...data
        }),
      });

      if (response.ok) {
        Alert.alert('Successo', 'Prenotazione completata!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Errore', 'Errore durante la prenotazione');
      }
    } catch (error) {
      Alert.alert('Errore', 'Errore di rete');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conferma Prenotazione</Text>
      
      <View style={styles.flightInfo}>
        <Text>Volo: {flight.flightNumber}</Text>
        <Text>Da: {flight.departure}</Text>
        <Text>A: {flight.arrival}</Text>
        <Text>Prezzo: €{flight.price}</Text>
      </View>

      <Controller
        control={control}
        name="passengerName"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nome passeggero"
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        rules={{ required: true, pattern: /^\S+@\S+$/i }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
          />
        )}
      />

      <TouchableOpacity 
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>Conferma Prenotazione</Text>
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
  flightInfo: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
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
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});