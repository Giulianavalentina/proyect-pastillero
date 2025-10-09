// app/screens/AddMedicationScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddMedicationScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [quantity, setQuantity] = useState('');
  const [schedule, setSchedule] = useState(['08:00']);

  const addTimeSlot = () => {
    setSchedule(prev => [...prev, '08:00']);
  };

  const updateTimeSlot = (index, time) => {
    setSchedule(prev => prev.map((slot, i) => i === index ? time : slot));
  };

  const removeTimeSlot = (index) => {
    if (schedule.length > 1) {
      setSchedule(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (!name.trim() || !dosage.trim() || !quantity.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const newMedication = {
      id: Date.now().toString(),
      name: name.trim(),
      dosage: dosage.trim(),
      quantity: parseInt(quantity),
      schedule: schedule
    };

    route.params?.onAdd(newMedication);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del Medicamento</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Aspirina, Paracetamol"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dosis</Text>
          <TextInput
            style={styles.input}
            value={dosage}
            onChangeText={setDosage}
            placeholder="Ej: 500mg, 10ml"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cantidad de Pastillas</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Ej: 30"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Horarios de Alarma</Text>
          {schedule.map((time, index) => (
            <View key={index} style={styles.timeSlot}>
              <TextInput
                style={styles.timeInput}
                value={time}
                onChangeText={(text) => updateTimeSlot(index, text)}
                placeholder="HH:MM"
                placeholderTextColor="#999"
              />
              {schedule.length > 1 && (
                <TouchableOpacity 
                  onPress={() => removeTimeSlot(index)}
                  style={styles.removeTimeButton}
                >
                  <Ionicons name="remove-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          <TouchableOpacity onPress={addTimeSlot} style={styles.addTimeButton}>
            <Ionicons name="add-circle" size={20} color="#007AFF" />
            <Text style={styles.addTimeText}>Agregar otro horario</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar Medicamento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 8,
  },
  removeTimeButton: {
    padding: 4,
  },
  addTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  addTimeText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});