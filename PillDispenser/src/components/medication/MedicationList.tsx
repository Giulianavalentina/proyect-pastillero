// app/screens/MedicationsScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MedicationsScreen({ navigation }) {
  const [medications, setMedications] = useState([
    {
      id: '1',
      name: 'Aspirina',
      dosage: '500mg',
      schedule: ['08:00', '20:00'],
      quantity: 10
    }
  ]);

  const addMedication = () => {
    navigation.navigate('AddMedication', {
      onAdd: (newMed) => setMedications(prev => [...prev, newMed])
    });
  };

  const deleteMedication = (id) => {
    Alert.alert(
      'Eliminar Medicamento',
      '¿Estás seguro de que quieres eliminar este medicamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => setMedications(prev => prev.filter(med => med.id !== id))
        }
      ]
    );
  };

  const renderMedication = ({ item }) => (
    <View style={styles.medicationCard}>
      <View style={styles.medicationInfo}>
        <Text style={styles.medicationName}>{item.name}</Text>
        <Text style={styles.medicationDosage}>Dosis: {item.dosage}</Text>
        <Text style={styles.medicationSchedule}>
          Horarios: {item.schedule.join(', ')}
        </Text>
        <Text style={styles.medicationQuantity}>
          Cantidad: {item.quantity} pastillas
        </Text>
      </View>
      <TouchableOpacity 
        onPress={() => deleteMedication(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Medicamentos</Text>
      
      {medications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="medical-outline" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>No hay medicamentos agregados</Text>
          <Text style={styles.emptySubtext}>
            Presiona el botón para agregar tu primer medicamento
          </Text>
        </View>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.id}
          renderItem={renderMedication}
          style={styles.list}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={addMedication}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Agregar Medicamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  medicationCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  medicationDosage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  medicationSchedule: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  medicationQuantity: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});