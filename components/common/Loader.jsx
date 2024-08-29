import { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";

export default function Loader({ size = 50 }) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 360,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();
    return () => spinAnimation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="items-center justify-center w-full h-full bg-light-bg dark:bg-dark-bg">
      <View className="flex items-center justify-center">
        <Animated.View
          className="border-l-dark dark:border-l-light border-r-dark dark:border-r-light border-b-dark dark:border-b-light border-t-darkMuted dark:border-t-lightMuted"
          style={{
            width: size,
            height: size,
            borderWidth: size / 10,
            borderRadius: size / 2,
            transform: [{ rotate: spin }],
          }}
        />
      </View>
    </View>
  );
}
