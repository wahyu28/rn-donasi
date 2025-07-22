// hooks/useTabTransition.ts
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";

export const useTabTransition = () => {
  const isFocused = useIsFocused();
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(30);

  useEffect(() => {
    if (isFocused) {
      opacity.value = withTiming(1, { duration: 300 });
      translateX.value = withTiming(0, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateX.value = withTiming(30, { duration: 200 });
    }
  }, [isFocused]);

  return { opacity, translateX };
};
