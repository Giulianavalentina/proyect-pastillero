// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { MedicationService, Medication } from '../services/medicationService';

export default function MedicationsScreen() {
  const router = useRouter();
  const [medications, setMedications] = useState<Medication[]>([]);

  const loadMedications = async () => {
    const meds = await MedicationService.getAllMedications();
    setMedications(meds);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadMedications();
    }, [])
  );

  const addMedication = () => {
    // Crear un medicamento básico como ejemplo
    const newMed: Omit<Medication, 'id' | 'createdAt'> = {
      name: 'Nuevo Medicamento',
      dosage: '500mg',
      schedule: ['08:00'],
      quantity: 30,
      alarmsEnabled: true
    };
    
    MedicationService.saveMedication(newMed);
    loadMedications(); // Recargar la lista
    Alert.alert('✅', 'Medicamento agregado');
  };

  const deleteMedication = async (id: string) => {
    Alert.alert(
      'Eliminar Medicamento',
      '¿Estás seguro de que quieres eliminar este medicamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            const success = await MedicationService.deleteMedication(id);
            if (success) {
              await loadMedications();
              Alert.alert('✅', 'Medicamento eliminado');
            }
          }
        }
      ]
    );
  };

  // CAMBIO IMPORTANTE: Usar la pantalla de edición completa
  const editMedication = (medication: Medication) => {
    router.push(`/edit-medication?id=${medication.id}`);
  };

  const renderMedication = ({ item }: { item: Medication }) => (
    <TouchableOpacity onPress={() => editMedication(item)}>
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
          <Text style={styles.alarmStatus}>
            {item.alarmsEnabled ? '🔔 Alarmas activas' : '🔕 Alarmas desactivadas'}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity 
            onPress={() => editMedication(item)}
            style={styles.editButton}
          >
            <Ionicons name="create-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => deleteMedication(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💊 Pastillero Inteligente</Text>
      <Text style={styles.subtitle}>Toca un medicamento para editarlo</Text>
      
      {medications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="medical-outline" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>No hay medicamentos</Text>
          <Text style={styles.emptySubtext}>
            Toca el botón para agregar el primero
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
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
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
    alignItems: 'flex-start',
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
    marginBottom: 2,
  },
  alarmStatus: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
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