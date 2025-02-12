import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useActivities } from '../../context/ActivityContext';
import Timer from '../../components/Timer';
import { formatDistanceToNow } from 'date-fns';

export default function FeedingScreen() {
  const {
    activeTimer,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    updateActiveSide,
    getLastFeeding,
  } = useActivities();
  const [selectedSide, setSelectedSide] = useState<'left' | 'right'>('left');

  const isFeeding = activeTimer?.type === 'feed';
  const lastFeeding = getLastFeeding();

  const handleStart = () => {
    startTimer('feed');
  };

  const handleStop = () => {
    stopTimer();
  };

  const handleSideChange = (side: 'left' | 'right') => {
    setSelectedSide(side);
    if (isFeeding) {
      updateActiveSide(side);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feeding Tracker</Text>

      {lastFeeding && !isFeeding && (
        <View style={styles.lastFeedingContainer}>
          <Text style={styles.lastFeedingTitle}>Last Feeding</Text>
          <Text style={styles.lastFeedingTime}>
            {formatDistanceToNow(new Date(lastFeeding.startTime), {
              addSuffix: true,
            })}
          </Text>
          {lastFeeding.sides && (
            <Text style={styles.lastFeedingSides}>
              Sides: {lastFeeding.sides.map(s => s.side).join(' → ')}
            </Text>
          )}
        </View>
      )}
      
      <View style={styles.sideSelector}>
        <TouchableOpacity
          style={[
            styles.sideButton,
            selectedSide === 'left' && styles.selectedSide,
          ]}
          onPress={() => handleSideChange('left')}>
          <Text style={[
            styles.sideButtonText,
            selectedSide === 'left' && styles.selectedSideText
          ]}>Left Side</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sideButton,
            selectedSide === 'right' && styles.selectedSide,
          ]}
          onPress={() => handleSideChange('right')}>
          <Text style={[
            styles.sideButtonText,
            selectedSide === 'right' && styles.selectedSideText
          ]}>Right Side</Text>
        </TouchableOpacity>
      </View>

      <Timer
        isRunning={isFeeding}
        onStart={handleStart}
        onStop={handleStop}
        onPause={pauseTimer}
        onResume={resumeTimer}
        startTime={activeTimer?.startTime}
        isPaused={activeTimer?.isPaused}
      />

      {isFeeding && activeTimer.sides && (
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>Current Session:</Text>
          {activeTimer.sides.map((side, index) => (
            <Text key={index} style={styles.sideInfo}>
              {side.side.charAt(0).toUpperCase() + side.side.slice(1)}: 
              {side.endTime ? ' Completed' : ' Active'}
            </Text>
          ))}
        </View>
      )}
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
  lastFeedingContainer: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  lastFeedingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  lastFeedingTime: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  lastFeedingSides: {
    fontSize: 14,
    color: '#666',
  },
  sideSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sideButton: {
    flex: 1,
    padding: 15,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedSide: {
    backgroundColor: '#007AFF',
  },
  sideButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectedSideText: {
    color: '#fff',
  },
  sessionInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sideInfo: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
});