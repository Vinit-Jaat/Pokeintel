import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{
      headerShown: true, 
      title: "Pokemons"
    }}>
    </Stack.Screen>
    <Stack.Screen name="details" options={{
      title: "Details",
      presentation: "modal",
      animation: "slide_from_right",
    }}>

    </Stack.Screen>
  </Stack>;
}
