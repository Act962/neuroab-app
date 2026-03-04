import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  wrapper: {},
  image: {
    width: RFValue(40),
    height: RFValue(40),
    position: "absolute",
    objectFit: "contain",
    borderRadius: 8,
    top: RFValue(5),
    right: RFValue(10),
  },
});
