import { Image } from 'expo-image';
import { getPhotoUri, resolveMediaUrl } from '../utils/media';

export default function RemoteImage({ uri, photo, style, contentFit = 'cover', ...props }) {
  const resolved = uri ? resolveMediaUrl(uri) : getPhotoUri(photo);
  if (!resolved) return null;
  return <Image source={{ uri: resolved }} style={style} contentFit={contentFit} {...props} />;
}
