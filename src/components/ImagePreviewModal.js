import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { getPhotoUri } from '../utils/media';
import { colors } from '../theme';

export default function ImagePreviewModal({ photo, visible, onClose }) {
  const uri = getPhotoUri(photo);
  if (!uri) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={12} accessibilityLabel="Close">
          <Ionicons name="close" size={28} color={colors.text} />
        </Pressable>
        <Image source={{ uri }} style={styles.image} contentFit="contain" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  closeBtn: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 2,
    padding: 8,
  },
  image: {
    width: '100%',
    height: '80%',
  },
});
