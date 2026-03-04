import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  header: {
    position: "relative",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconHeader: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  checkboxText: {
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 6,
    marginBottom: 24,
  },
  addButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  prizeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 8,
  },
  prizeInfo: {
    width: "80%",
  },
  prizeName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  prizeDetail: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  prizeDetailSmall: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: "#ffffff",
  },
});
