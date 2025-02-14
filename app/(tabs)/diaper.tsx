import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useActivities } from '../../context/ActivityContext';
import { Ionicons } from '@expo/vector-icons';

export default function DiaperScreen() {
  const { addActivity } = useActivities();
  const [selectedType, setSelectedType] = useState<'wet' | 'dirty' | 'both' | null>(null);

  const logDiaperChange = () => {
    if (selectedType) {
      addActivity({
        type: 'diaper',
        startTime: new Date().toISOString(),
        diaperType: selectedType,
      });
      setSelectedType(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diaper Change</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.wetButton,
            selectedType === 'wet' && styles.selectedButton,
          ]}
          onPress={() => setSelectedType('wet')}>
          <Ionicons name="water" size={32} color="white" />
          <Text style={styles.buttonText}>Wet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.dirtyButton,
            selectedType === 'dirty' && styles.selectedButton,
          ]}
          onPress={() => setSelectedType('dirty')}>
          <Ionicons name="nutrition" size={32} color="white" />
          <Text style={styles.buttonText}>Dirty</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.bothButton,
            selectedType === 'both' && styles.selectedButton,
          ]}
          onPress={() => setSelectedType('both')}>
          <Ionicons name="sync" size={32} color="white" />
          <Text style={styles.buttonText}>Both</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          !selectedType && styles.saveButtonDisabled,
        ]}
        onPress={logDiaperChange}
        disabled={!selectedType}>
        <Text style={[
          styles.saveButtonText,
          !selectedType && styles.saveButtonTextDisabled,
        ]}>Save</Text>
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
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    gap: 10,
  },
  selectedButton: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  wetButton: {
    backgroundColor: '#2196F3',
  },
  dirtyButton: {
    backgroundColor: '#795548',
  },
  bothButton: {
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#9E9E9E',
  },
});
