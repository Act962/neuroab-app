import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../../styles";

interface AdminModalProps {
  visible: boolean;
  password: string;
  onChangePassword: (text: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function AdminModal({
  visible,
  password,
  onChangePassword,
  onCancel,
  onConfirm,
}: AdminModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Publicidades</Text>

          <TextInput
            placeholder="Digite a chave"
            placeholderTextColor="#888"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={onChangePassword}
          />

          <View style={styles.modalButtons}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
