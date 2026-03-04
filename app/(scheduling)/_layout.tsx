import { Stack } from 'expo-router';
import { useTheme } from '../../src/presentation/hooks';

export default function SchedulingLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="doctor/[id]" />
      <Stack.Screen name="booking" />
      <Stack.Screen name="confirmation" />
    </Stack>
  );
}
