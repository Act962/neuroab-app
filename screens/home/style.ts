import { colors } from "@/shared/colors";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    marginTop: RFValue(60),
  },
  lottie: {
    width: RFValue(200),
    height: RFValue(200),
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 100,
    marginBottom: 24,
  },

  Title: {
    fontSize: RFValue(36),
    fontWeight: "700",
    color: colors["text-primary"],
    fontFamily: "Nunito_400Regular",
    textAlign: "center",
  },
  Subtitle: {
    fontSize: RFValue(16),
    fontWeight: "400",
    color: colors["text-secondary"],
    textAlign: "center",
  },
  SubtitleFooter: {
    fontSize: RFValue(12),
    marginTop: RFValue(20),
    fontWeight: "400",
    color: colors["text-secondary"],
    textAlign: "center",
  },
  containerInstructions: {
    justifyContent: "center",
    backgroundColor: "#F81FB4",
    borderRadius: 10,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  containerFooter: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingLeft: 24,
    paddingRight: 24,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    paddingTop: RFValue(26),
    paddingHorizontal: RFValue(10),
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
  },
  backgound: {
    flex: 1,
    backgroundColor: "#8F8176",
  },
  dropdownContainer: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    top: 32,
    left: 0,
    zIndex: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: RFValue(14),
    color: "#6B21A8",
  },
  centeredModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "white",
    width: 320,
    padding: 20,
    borderRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: RFValue(18),
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#A855F7",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: RFValue(14),
    color: "#000",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: "#9CA3AF",
  },
  confirmButton: {
    backgroundColor: "#3B82F6",
  },
  adminButton: {
    backgroundColor: "#16A34A",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: RFValue(14),
  },
  contentCenter: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
