// app/services/alarmService.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false, // Cambiar a false para evitar errores
  }),
});

export class AlarmService {
  static async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        return false; // No notificaciones en web
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  static async scheduleAlarm(
    medicationName: string, 
    dosage: string, 
    time: string, 
    alarmId: string
  ): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('Permisos de notificación no concedidos');
        return false;
      }

      const [hours, minutes] = time.split(':').map(Number);
      
      await Notifications.scheduleNotificationAsync({
        identifier: alarmId,
        content: {
          title: '💊 Hora de tu medicamento',
          body: `Es hora de tomar: ${medicationName} - ${dosage}`,
          sound: true,
          data: { medicationName, dosage, time },
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });
      
      console.log(`Alarma programada para ${time}`);
      return true;
    } catch (error) {
      console.error('Error programando alarma:', error);
      return false;
    }
  }

  static async cancelAlarm(alarmId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(alarmId);
    } catch (error) {
      console.error('Error cancelando alarma:', error);
    }
  }

  static async cancelAllAlarms(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error cancelando todas las alarmas:', error);
    }
  }
}