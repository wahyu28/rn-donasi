import { ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SafeAreaLayoutProps extends ViewProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export default function SafeAreaLayout({
  children,
  noPadding = false,
  className = "",
  ...props
}: SafeAreaLayoutProps) {
  return (
    <SafeAreaView
      edges={["top", "right", "left"]}
      className={`flex-1 bg-gray-50 ${noPadding ? "" : "px-4"} ${className}`}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
}
