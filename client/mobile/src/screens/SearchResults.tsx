
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function SearchResultsScreen({ route, navigation }) {
  const [flights, setFlights] = React.useState([]);

  React.useEffect(() => {
    // Qui andrà la chiamata API per cercare i voli
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await fetch('https://your-api/flights');
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Booking', { flight: item })}
    >
      <Text style={styles.flightNumber}>{item.flightNumber}</Text>
      <Text style={styles.route}>{item.departure} → {item.arrival}</Text>
      <Text style={styles.price}>€{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={flights}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  flightNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  route: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 5,
  },
});
