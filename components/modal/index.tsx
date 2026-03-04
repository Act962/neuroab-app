import { View, Text, Pressable, Modal, TextInput } from "react-native";
import React from "react";
import { styles } from "./style";

interface ModalAcessoProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  confirmButtonText?: string;
  confirmButtonStyle?: "confirm" | "admin";
}

export function ModalAcesso({
  visible,
  onClose,
  onConfirm,
  title,
  placeholder,
  value,
  onChangeText,
  confirmButtonText = "Confirmar",
  confirmButtonStyle = "confirm",
}: ModalAcessoProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredModal}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>{title}</Text>

          <TextInput
            placeholder={placeholder}
            placeholderTextColor="#888"
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry
            autoCapitalize="none"
          />

          <View style={styles.modalButtonContainer}>
            <Pressable
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[
                styles.modalButton,
                confirmButtonStyle === "admin"
                  ? styles.adminButton
                  : styles.confirmButton,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.modalButtonText}>{confirmButtonText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
