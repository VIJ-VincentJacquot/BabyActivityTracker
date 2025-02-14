import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { useActivities } from '../../context/ActivityContext';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

const HOUR_HEIGHT = 60;
const TIME_LABELS_WIDTH = 50;
const ACTIVITY_COLORS = {
  feed: '#4CAF50',
  sleep: '#2196F3',
  diaper: '#9C27B0',
};

export default function TimelineScreen() {
  const { activities, deleteActivity } = useActivities();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const screenWidth = Dimensions.get('window').width;

  const groupActivitiesByDate = () => {
    const grouped = activities.reduce((acc, activity) => {
      const date = format(parseISO(activity.startTime), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(activity);
      return acc;
    }, {} as Record<string, typeof activities>);

    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'feed':
        return 'water';
      case 'sleep':
        return 'moon';
      case 'diaper':
        return 'medical';
      default:
        return 'document';
    }
  };

  const formatTime = (time: string) => format(parseISO(time), 'HH:mm');

  const handleDelete = (id: string) => {
    deleteActivity(id);
    setSelectedActivity(null);
  };

  const getActivityHeight = (activity: any) => {
    if (!activity.endTime) return HOUR_HEIGHT / 2;
    const duration = differenceInMinutes(
      parseISO(activity.endTime),
      parseISO(activity.startTime)
    );
    return Math.max((duration / 60) * HOUR_HEIGHT, HOUR_HEIGHT / 2);
  };

  const getActivityPosition = (time: string) => {
    const date = parseISO(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return (hours + minutes / 60) * HOUR_HEIGHT;
  };

  const renderTimeLabels = () => {
    return Array.from({ length: 24 }, (_, i) => (
      <View key={i} style={styles.timeLabel}>
        <Text style={styles.timeLabelText}>
          {i.toString().padStart(2, '0')}:00
        </Text>
      </View>
    ));
  };

  const getActivityTitle = (activity: any) => {
    let title = formatTime(activity.startTime);
    if (activity.endTime) {
      title += ` - ${formatTime(activity.endTime)}`;
    }
    
    switch (activity.type) {
      case 'feed':
        return `${title} · Feeding`;
      case 'sleep':
        return `${title} · Sleep`;
      case 'diaper':
        return `${title} · ${activity.diaperType.charAt(0).toUpperCase() + activity.diaperType.slice(1)} diaper`;
      default:
        return title;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {groupActivitiesByDate().map(([date, dayActivities]) => (
        <View key={date} style={styles.dateGroup}>
          <Text style={styles.dateHeader}>
            {format(parseISO(date), 'EEEE, MMMM d')}
          </Text>
          <View style={styles.timelineContainer}>
            <View style={styles.timeLabels}>{renderTimeLabels()}</View>
            <View style={styles.activitiesContainer}>
              <View style={styles.hourLines}>
                {Array.from({ length: 24 }, (_, i) => (
                  <View key={i} style={styles.hourLine} />
                ))}
              </View>
              {dayActivities.map(activity => (
                <TouchableOpacity
                  key={activity.id}
                  style={[
                    styles.activityBlock,
                    {
                      top: getActivityPosition(activity.startTime),
                      height: getActivityHeight(activity),
                      backgroundColor: ACTIVITY_COLORS[activity.type as keyof typeof ACTIVITY_COLORS],
                      width: screenWidth - TIME_LABELS_WIDTH - 40,
                    },
                  ]}
                  onPress={() => setSelectedActivity(activity.id)}>
                  <View style={styles.activityContent}>
                    <View style={styles.activityHeader}>
                      <Ionicons
                        name={getActivityIcon(activity.type)}
                        size={16}
                        color="white"
                      />
                      <Text style={styles.activityTime} numberOfLines={1}>
                        {getActivityTitle(activity)}
                      </Text>
                    </View>
                    {activity.sides && (
                      <Text style={styles.activityDetail}>
                        Sides: {activity.sides.map(s => s.side).join(' → ')}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ))}

      <Modal
        visible={!!selectedActivity}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedActivity(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Activity Options</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleDelete(selectedActivity!)}>
              <Ionicons name="trash-outline" size={24} color="#ff4444" />
              <Text style={styles.deleteButtonText}>Delete Activity</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setSelectedActivity(null)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  dateGroup: {
    marginBottom: 20,
    padding: 16,
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  timelineContainer: {
    flexDirection: 'row',
    height: 24 * HOUR_HEIGHT,
  },
  timeLabels: {
    width: TIME_LABELS_WIDTH,
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeLabel: {
    height: HOUR_HEIGHT,
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  timeLabelText: {
    fontSize: 12,
    color: '#666',
  },
  activitiesContainer: {
    flex: 1,
    position: 'relative',
  },
  hourLines: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  hourLine: {
    height: HOUR_HEIGHT,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  activityBlock: {
    position: 'absolute',
    left: 8,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 40,
  },
  activityContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  activityTime: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  activityDetail: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: '#ff4444',
    fontSize: 16,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
