import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useActivities } from '../../context/ActivityContext';
import { Ionicons } from '@expo/vector-icons';

export default function DiaperScreen() {
  const { addActivity } = useActivities();

  const logDiaperChange = (type: 'wet' | 'dirty' | 'both') => {
    addActivity({
      type: 'diaper',
      startTime: new Date().toISOString(),
      diaperType: type,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diaper Change</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.wetButton]}
          onPress={() => logDiaperChange('wet')}>
          <Ionicons name="water" size={32} color="white" />
          <Text style={styles.buttonText}>Wet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dirtyButton]}
          onPress={() => logDiaperChange('dirty')}>
          <Ionicons name="nutrition" size={32} color="white" />
          <Text style={styles.buttonText}>Dirty</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.bothButton]}
          onPress={() => logDiaperChange('both')}>
          <Ionicons name="sync" size={32} color="white" />
          <Text style={styles.buttonText}>Both</Text>
        </TouchableOpacity>
      </View>
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
});