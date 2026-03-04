import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  Animated,
} from "react-native";
import { styles } from "./style";
import { RFValue } from "react-native-responsive-fontsize";
import { useRef, useEffect } from "react";

type Props = TouchableOpacityProps & {
  title: string;
  size?: number;
  disable?: boolean;
};

export function Button({ title, size = 16, disable, ...rest }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const disableOpacityAnim = useRef(
    new Animated.Value(disable ? 0.5 : 1)
  ).current;

  useEffect(() => {
    Animated.timing(disableOpacityAnim, {
      toValue: disable ? 0.5 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [disable, disableOpacityAnim]);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={disable}
      style={styles.main}
      {...rest}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale: scaleAnim }],
            opacity: Animated.multiply(disableOpacityAnim, opacityAnim),
          },
        ]}
      >
        <Text style={[styles.title, { fontSize: RFValue(size) }]}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
