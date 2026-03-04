import { colors } from "@/shared/colors";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    marginBottom: 24,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  imagem: {
    width: RFValue(200),
    height: RFValue(100),
  },
  Title: {
    fontSize: RFValue(32),
    fontWeight: "700",
    color: colors["text-primary"],
    textAlign: "center",
    marginBottom: 16,
  },
  subTitile: {
    fontSize: RFValue(16),
    fontWeight: "600",
    color: colors["text-primary"],
    marginBottom: 4,
  },
  containerInstructions: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#de8328",
    borderRadius: 10,
    padding: 16,
  },
  containerButton: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
    gap: 16,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  phoneInput: {
    color: "#333333",
    fontSize: RFValue(16),
    backgroundColor: "#FFFFFF",
    fontWeight: "600",
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    width: "100%",
    minHeight: 65,
    borderColor: colors["border-input-primary"],
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  backgound: {
    flex: 1,
    paddingHorizontal: RFValue(16),
    position: "relative",
    paddingTop: RFValue(16),
    backgroundColor: "#8F8176",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    alignContent: "center",
  },
  checkboxIcon: {
    fontSize: RFValue(20),
    marginRight: 10,
    marginTop: 2,
  },
  checkboxText: {
    flex: 1,
    fontSize: RFValue(12),
    color: colors["text-secondary"],
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: RFValue(120),
    height: RFValue(120),
    borderRadius: 10,
  },
});
