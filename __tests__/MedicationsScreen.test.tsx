/// <reference types="jest" />
import { render, screen, fireEvent } from '@testing-library/react-native';

// Importamos el tipo Medication del servicio para usarlo en los mocks
// Asumiendo que has movido el mock de expo-router a jest-setup.js
import { MedicationService, Medication } from '@/services/medicationService';

// 1. Simular el Alert nativo (debe quedarse aquí ya que usa 'global')
jest.spyOn(global, 'alert').mockImplementation(() => {});

// 2. Simular el servicio de datos (¡USANDO ALIAS @/!)
const mockGetAllMedications = jest.fn();

jest.mock('@/services/medicationService', () => ({
  MedicationService: {
    getAllMedications: mockGetAllMedications,
    saveMedication: jest.fn(), 
    deleteMedication: jest.fn(),
  },
}));

// 3. Importar el componente (¡USANDO ALIAS @/!)
import MedicationsScreen from '@/app/(tabs)/index'; 

// --- INICIO DEL ÚNICO BLOQUE DESCRIBE ---
describe('MedicationsScreen', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    jest.clearAllMocks();
  });

  // --- PRUEBA 1: Estado Vacío ---
  test('Muestra el texto de estado vacío cuando no hay medicamentos', async () => {
    // Configurar el mock para que devuelva una lista vacía
    mockGetAllMedications.mockResolvedValue([]); 
    render(<MedicationsScreen />);
    
    // Verificamos que el texto 'No hay medicamentos' esté en la pantalla
    const emptyText = await screen.findByText('No hay medicamentos');
    expect(emptyText).toBeOnTheScreen();
  });
  
  // --- PRUEBA 2: Estado con Datos ---
  test('Muestra la lista de medicamentos cargados', async () => {
    // Crear datos de ejemplo
    const mockMeds: Medication[] = [
      { 
        id: '1', 
        name: 'Aspirina', 
        dosage: '100mg', 
        schedule: ['10:00'], 
        quantity: 10, 
        alarmsEnabled: true,
        createdAt: Date.now().toString()
      }
    ];

    // Configurar el mock para que devuelva el medicamento
    mockGetAllMedications.mockResolvedValue(mockMeds); 
    render(<MedicationsScreen />);
    
    // Verificamos que el nombre del medicamento aparezca en la lista
    const medName = await screen.findByText('Aspirina');
    expect(medName).toBeOnTheScreen();
  });
  
  // --- PRUEBA 3: Interacción (Botón Agregar) ---
  test('Llama a saveMedication y recarga la lista al presionar Agregar', async () => {
    // Configurar el mock inicial
    mockGetAllMedications.mockResolvedValue([]); 
    render(<MedicationsScreen />);
    
    // Encontrar y simular el clic
    const addButton = await screen.findByText('Agregar Medicamento');
    fireEvent.press(addButton);

    // Verificamos que las funciones se hayan llamado correctamente
    expect(MedicationService.saveMedication).toHaveBeenCalledTimes(1);
    
    // Verificamos que la lista se haya intentado recargar
    // (1 vez por el useFocusEffect inicial + 1 vez después de guardar)
    expect(mockGetAllMedications).toHaveBeenCalledTimes(2); 
  });
});