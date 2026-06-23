import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminStyles, colors, fonts } from '../theme';

export default function AdminSelect({ label, value, options, onChange, placeholder = 'Select…' }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable onPress={() => setOpen(true)} style={[adminStyles.input, styles.trigger]}>
        <Text style={[styles.value, !selected && styles.placeholder]}>
          {selected?.label || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label || 'Choose'}</Text>
            <ScrollView>
              {options.map((opt) => (
                <Pressable
                  key={opt.value || opt.label}
                  onPress={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  style={[styles.option, value === opt.value && styles.optionActive]}
                >
                  <Text style={[styles.optionText, value === opt.value && styles.optionTextActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    marginBottom: 6,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  value: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
  },
  placeholder: {
    color: colors.textDim,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  sheet: {
    maxHeight: '60%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 16,
  },
  sheetTitle: {
    marginBottom: 12,
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.gold,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  optionActive: {
    backgroundColor: 'rgba(201, 168, 76, 0.12)',
  },
  optionText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.text,
  },
  optionTextActive: {
    color: colors.gold,
    fontFamily: fonts.bodySemiBold,
  },
});
