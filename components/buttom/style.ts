import { colors } from "@/shared/colors";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  main: {
    width: "100%",
  },
  container: {
    backgroundColor: colors["button-secondary"],
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: "100%",
  },
  title: {
    color: "#FFFFFF",
    fontSize: RFValue(14),
    fontWeight: "500",
  },
});
