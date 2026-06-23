import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

export default function TableHorizontalScroll({ children, style }) {
  const [scrollX, setScrollX] = useState(0);
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const scrollable = contentWidth > layoutWidth + 1;
  const thumbWidth = scrollable
    ? Math.max(48, (layoutWidth / contentWidth) * layoutWidth)
    : layoutWidth;
  const maxScroll = Math.max(contentWidth - layoutWidth, 1);
  const thumbLeft = scrollable ? (scrollX / maxScroll) * (layoutWidth - thumbWidth) : 0;

  return (
    <View style={style}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
        onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
        onContentSizeChange={(w) => setContentWidth(w)}
      >
        {children}
      </ScrollView>
      {scrollable ? (
        <View style={styles.track}>
          <View style={[styles.thumb, { width: thumbWidth, left: thumbLeft }]} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    marginTop: 10,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(201, 168, 76, 0.18)',
    overflow: 'hidden',
    position: 'relative',
  },
  thumb: {
    position: 'absolute',
    top: 0,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.gold,
  },
});
