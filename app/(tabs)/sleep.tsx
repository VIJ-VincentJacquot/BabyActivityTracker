import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useActivities } from '../../context/ActivityContext';
import Timer from '../../components/Timer';

export default function SleepScreen() {
  const { activeTimer, startTimer, stopTimer } = useActivities();

  const isSleeping = activeTimer?.type === 'sleep';

  const handleStart = () => {
    startTimer('sleep');
  };

  const handleStop = () => {
    stopTimer();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sleep Tracker</Text>
      <Timer
        isRunning={isSleeping}
        onStart={handleStart}
        onStop={handleStop}
        startTime={activeTimer?.startTime}
      />
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
});