// app/services/medicationService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string[];
  quantity: number;
  alarmsEnabled: boolean;
  createdAt: string;
}

export interface AlarmInfo {
  medicationId: string;
  medicationName: string;
  dosage: string;
  time: string;
  alarmId: string;
  enabled: boolean;
}

const STORAGE_KEY = 'medications';

export class MedicationService {
  // Obtener todos los medicamentos
  static async getAllMedications(): Promise<Medication[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting medications:', error);
      return [];
    }
  }

  // Guardar un nuevo medicamento
  static async saveMedication(medication: Omit<Medication, 'id' | 'createdAt'>): Promise<boolean> {
    try {
      const medications = await this.getAllMedications();
      const newMedication: Medication = {
        ...medication,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      medications.push(newMedication);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
      return true;
    } catch (error) {
      console.error('Error saving medication:', error);
      return false;
    }
  }

  // Obtener un medicamento por ID
  static async getMedicationById(id: string): Promise<Medication | null> {
    try {
      const medications = await this.getAllMedications();
      return medications.find(med => med.id === id) || null;
    } catch (error) {
      console.error('Error getting medication:', error);
      return null;
    }
  }

  // Actualizar un medicamento existente
  static async updateMedication(id: string, updates: Partial<Medication>): Promise<boolean> {
    try {
      const medications = await this.getAllMedications();
      const index = medications.findIndex(med => med.id === id);
      
      if (index !== -1) {
        medications[index] = { ...medications[index], ...updates };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating medication:', error);
      return false;
    }
  }

  // Eliminar un medicamento
  static async deleteMedication(id: string): Promise<boolean> {
    try {
      const medications = await this.getAllMedications();
      const filtered = medications.filter(med => med.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting medication:', error);
      return false;
    }
  }

  // Obtener todas las alarmas activas
  static async getActiveAlarms(): Promise<AlarmInfo[]> {
    try {
      const medications = await this.getAllMedications();
      const alarms: AlarmInfo[] = [];

      medications.forEach(medication => {
        if (medication.alarmsEnabled) {
          medication.schedule.forEach(time => {
            alarms.push({
              medicationId: medication.id,
              medicationName: medication.name,
              dosage: medication.dosage,
              time: time,
              alarmId: `${medication.id}_${time.replace(':', '')}`,
              enabled: medication.alarmsEnabled
            });
          });
        }
      });

      // Ordenar por hora
      return alarms.sort((a, b) => a.time.localeCompare(b.time));
    } catch (error) {
      console.error('Error getting active alarms:', error);
      return [];
    }
  }

  // Activar/desactivar alarmas
  static async toggleAlarm(alarmId: string, enabled: boolean): Promise<boolean> {
    try {
      const medications = await this.getAllMedications();
      
      // Encontrar el medicamento por alarmId (formato: medicationId_time)
      const medicationId = alarmId.split('_')[0];
      const medicationIndex = medications.findIndex(med => med.id === medicationId);
      
      if (medicationIndex !== -1) {
        medications[medicationIndex].alarmsEnabled = enabled;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error toggling alarm:', error);
      return false;
    }
  }
}