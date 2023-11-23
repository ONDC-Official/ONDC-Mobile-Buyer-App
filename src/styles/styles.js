import { StyleSheet } from "react-native";

export const appStyles = StyleSheet.create({
  container: { flex: 1 },
  backgroundWhite: { backgroundColor: "white" },
  centerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginVertical: 8,
  },
  containedButtonLabel: {
    fontSize: 16,
  },
  containedButtonContainer: {
    height: 50,
  },
});
