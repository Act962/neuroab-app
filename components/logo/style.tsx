import { StyleSheet } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  wrapper: {},
  image: {
    width: RFValue(60),
    height: RFValue(60),
    objectFit: "contain",
    borderRadius: 8,
  },
});
