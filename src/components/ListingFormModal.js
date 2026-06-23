import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AdminSelect from './AdminSelect';
import RemoteImage from './RemoteImage';
import { GoldButton, OutlineGoldButton } from './AdminUI';
import { api } from '../api';
import {
  EMPTY_LISTING_FORM,
  LISTING_CATEGORIES,
  LISTING_CONDITIONS,
} from '../constants/listings';
import { adminStyles, colors, fonts } from '../theme';

function buildFormFromListing(listing) {
  if (!listing) return { ...EMPTY_LISTING_FORM };
  return {
    ...EMPTY_LISTING_FORM,
    ...Object.fromEntries(
      Object.keys(EMPTY_LISTING_FORM).map((k) => [k, listing[k] ?? EMPTY_LISTING_FORM[k]])
    ),
  };
}

export default function ListingFormModal({ listing, onClose, onSaved }) {
  const isEdit = !!listing;
  const [form, setForm] = useState(() => buildFormFromListing(listing));
  const [existingPhotos, setExistingPhotos] = useState(listing?.photos || []);
  const [newPhotos, setNewPhotos] = useState([]);
  const [titleEdited, setTitleEdited] = useState(isEdit);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (titleEdited) return;
    const parts = [form.designer, form.category, form.primaryColour].filter(Boolean);
    if (parts.length) set('title', parts.join(' — '));
  }, [form.designer, form.category, form.primaryColour, titleEdited]);

  const pickPhotos = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo library permission is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.85,
      mediaTypes: ['images'],
    });
    if (!result.canceled) {
      setNewPhotos((prev) => [...prev, ...result.assets]);
    }
  };

  const save = async () => {
    setError('');
    if (!form.title || !form.designer || !form.category || !form.primaryColour) {
      setError('Title, designer, category and primary colour are required.');
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        fd.append(k, k === 'featured' ? String(v) : v);
      });
      newPhotos.forEach((asset, i) => {
        fd.append('photos', {
          uri: asset.uri,
          type: asset.mimeType || 'image/jpeg',
          name: asset.fileName || `photo-${i}.jpg`,
        });
      });
      if (isEdit) {
        fd.append('keepPhotos', JSON.stringify(existingPhotos.map((p) => p.filename)));
        await api.updateListing(listing._id, fd);
      } else {
        await api.createListing(fd);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const field = (label, key, props = {}) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={adminStyles.input}
        value={String(form[key] ?? '')}
        onChangeText={(v) => set(key, v)}
        placeholderTextColor={colors.textDim}
        {...props}
      />
    </View>
  );

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modal}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>{isEdit ? 'Edit Listing' : 'Add New Listing'}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Listing Title (auto-generated, editable)</Text>
            <TextInput
              style={adminStyles.input}
              value={form.title}
              onChangeText={(v) => {
                setTitleEdited(true);
                set('title', v);
              }}
              placeholder="Sabyasachi — Bridal Lehenga — Deep Red"
              placeholderTextColor={colors.textDim}
            />
          </View>

          <View style={styles.row}>
            {field('Designer / Brand *', 'designer')}
            <AdminSelect
              label="Category *"
              value={form.category}
              onChange={(v) => set('category', v)}
              options={[{ value: '', label: 'Select…' }, ...LISTING_CATEGORIES.map((c) => ({ value: c, label: c }))]}
            />
          </View>

          <View style={styles.row}>
            {field('Primary Colour *', 'primaryColour')}
            {field('Secondary Colour', 'secondaryColour')}
          </View>

          <View style={styles.row}>
            {field('Fabric Type', 'fabricType')}
            {field('Size (if applicable)', 'size')}
          </View>

          <View style={styles.row}>
            <AdminSelect
              label="Condition"
              value={form.condition}
              onChange={(v) => set('condition', v)}
              options={LISTING_CONDITIONS.map((c) => ({ value: c, label: c }))}
            />
            <AdminSelect
              label="Status"
              value={form.status}
              onChange={(v) => set('status', v)}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'live', label: 'Live' },
                { value: 'sold', label: 'Sold' },
                { value: 'hidden', label: 'Hidden' },
              ]}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Public Description</Text>
            <TextInput
              style={[adminStyles.input, styles.textarea]}
              value={form.description}
              onChangeText={(v) => set('description', v)}
              multiline
              placeholderTextColor={colors.textDim}
            />
          </View>

          <View style={styles.row}>
            {field('Internal Price ₹ (admin only)', 'internalPrice', { keyboardType: 'numeric' })}
            <View style={styles.switchRow}>
              <Text style={styles.label}>Featured on homepage</Text>
              <Switch
                value={form.featured}
                onValueChange={(v) => set('featured', v)}
                trackColor={{ false: colors.dark, true: colors.goldDeep }}
                thumbColor={form.featured ? colors.gold : colors.textDim}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Internal Notes (admin only)</Text>
            <TextInput
              style={[adminStyles.input, styles.textareaSm]}
              value={form.internalNotes}
              onChangeText={(v) => set('internalNotes', v)}
              multiline
              placeholderTextColor={colors.textDim}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Photos</Text>
            {existingPhotos.length > 0 && (
              <View style={styles.photoRow}>
                {existingPhotos.map((p) => (
                  <View key={p.filename} style={styles.photoWrap}>
                    <RemoteImage photo={p} style={styles.photoThumb} contentFit="cover" />
                    <Pressable
                      onPress={() => setExistingPhotos((ps) => ps.filter((x) => x.filename !== p.filename))}
                      style={styles.photoRemove}
                    >
                      <Ionicons name="close" size={12} color={colors.text} />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
            <OutlineGoldButton label="Add Photos" small onPress={pickPhotos} />
            {newPhotos.length > 0 && (
              <Text style={styles.photoHint}>{newPhotos.length} new photo(s) selected</Text>
            )}
          </View>

          {error ? <Text style={adminStyles.errorText}>{error}</Text> : null}

          <View style={styles.footer}>
            <OutlineGoldButton label="Cancel" small onPress={onClose} />
            <GoldButton
              label={isEdit ? 'Save Changes' : 'Create Listing'}
              small
              onPress={save}
              loading={busy}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: colors.card,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 20,
    color: colors.gold,
  },
  field: {
    marginBottom: 14,
  },
  row: {
    gap: 14,
    marginBottom: 4,
  },
  label: {
    marginBottom: 6,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  textarea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  textareaSm: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  switchRow: {
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  photoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  photoWrap: {
    position: 'relative',
  },
  photoThumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    borderRadius: 999,
    backgroundColor: colors.dark,
    padding: 4,
  },
  photoHint: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  footer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});
