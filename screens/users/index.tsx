import { Input } from "@/components/input/Input";
import {
  clearTable,
  initializeStore,
  store,
  USERS_TABLE,
} from "@/storge/store";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import tw from "twrnc";

const SAVED_FILES_TABLE = "saved_files";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  nota: string;
}

interface SavedFile {
  uri: string;
  name: string;
  date: string;
}

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [nota, setNota] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const CORRECT_KEY = "Fala1234@";

  const handleClear = async (): Promise<void> => {
    try {
      await clearTable(USERS_TABLE);
      get();
      Alert.alert("Sucesso", "Todos os dados foram apagados.");
    } catch (error) {
      console.error("Erro ao limpar storage:", error);
      Alert.alert("Erro", "Não foi possível limpar os dados.");
    }
  };

  const handleClearConfirmation = (): void => {
    if (password === CORRECT_KEY) {
      handleClear();
      setModalVisible(false);
      setPassword("");
    } else {
      Alert.alert("Senha incorreta", "A chave digitada está incorreta.");
    }
  };

  const UpdateItems = async (user: User): Promise<void> => {
    try {
      const response = await fetch(
        "https://nasago.bubbleapps.io/version-test/api/1.1/wf/form_totem",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        },
      );

      const json = await response.json();
      console.log(json);
    } catch (error) {
      Alert.alert("Erro de conexão ou inesperado.");
      console.error("Erro:", error);
    }
  };

  const loopUpdateItems = async (): Promise<void> => {
    setLoading(true);
    for (const item of users) {
      await UpdateItems(item);
    }
    setLoading(false);
    Alert.alert("Dados enviados com sucesso!");
    setNota("");
  };

  const get = (): void => {
    const data = store.getTable(USERS_TABLE);
    const response: User[] = Object.entries(data).map(
      ([id, user]: [string, any]) => ({
        id,
        name: String(user.name),
        email: String(user.email),
        phone: String(user.phone),
        game: String("Roleta"),
        nota: String("Leads da clinica tercio resende"),
      }),
    );
    setUsers(response);
  };

  const getSavedFiles = (): SavedFile[] => {
    const data = store.getTable(SAVED_FILES_TABLE);
    return Object.values(data).map((file: any) => ({
      uri: String(file.uri),
      name: String(file.name),
      date: String(file.date),
    }));
  };

  const saveUsersToFile = async (): Promise<void> => {
    try {
      const header = "Nome,Email,Telefone,Nota";
      const rows = users.map(
        (user) =>
          `"${user.name || ""}","${user.email || ""}","${user.phone || ""}","${user.nota || ""}"`,
      );

      const csvContent = [header, ...rows].join("\n");
      const date = new Date().toISOString().split("T")[0];
      const fileName = `usuarios_${date}_${Date.now()}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const fileId = Date.now().toString();
      store.setCell(SAVED_FILES_TABLE, fileId, "uri", fileUri);
      store.setCell(SAVED_FILES_TABLE, fileId, "name", fileName);
      store.setCell(SAVED_FILES_TABLE, fileId, "date", date);

      Alert.alert("Arquivo salvo", `Salvo como: ${fileName}`, [
        {
          text: "Compartilhar",
          onPress: async () => {
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(fileUri);
            }
          },
        },
        { text: "OK" },
      ]);
    } catch (error) {
      console.error("Erro ao salvar arquivo:", error);
      Alert.alert("Erro", "Não foi possível salvar o arquivo.");
    }
  };

  const exportUsersToCSV = async (): Promise<void> => {
    try {
      const header = "Nome,Email,Telefone,Nota";
      const rows = users.map(
        (user) =>
          `"${user.name || ""}","${user.email || ""}","${user.phone || ""}","${user.nota || ""}"`,
      );

      const csvContent = [header, ...rows].join("\n");
      const date = new Date().toISOString().split("T")[0];
      const fileName = `usuarios_${date}_${Date.now()}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      Alert.alert("Sucesso", "CSV exportado com sucesso!", [
        {
          text: "Compartilhar",
          onPress: async () => {
            try {
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
              } else {
                Alert.alert(
                  "Erro",
                  "Compartilhamento não disponível neste dispositivo.",
                );
              }
            } catch (error) {
              console.error("Erro ao compartilhar:", error);
            }
          },
        },
        { text: "OK" },
      ]);
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      Alert.alert("Erro", "Não foi possível gerar o CSV.");
    }
  };

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        await initializeStore();
        get();
      } catch (e) {
        console.error("Erro ao inicializar banco:", e);
        Alert.alert("Erro", "Não foi possível carregar o banco de dados.");
      }
    };
    loadData();
  }, [nota]);

  return (
    <View style={tw`flex-1 items-center mt-8 px-4`}>
      <Text style={tw`text-xl font-medium`}>Inscritos</Text>
      <View style={tw`mt-6 w-full`}>
        {users.length > 0 && (
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-base text-center min-w-30`}>Nome</Text>
            <Text style={tw`text-base text-center min-w-30`}>Email</Text>
            <Text style={tw`text-base text-center min-w-30`}>Telefone</Text>
          </View>
        )}

        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: 500, color: "#333333" }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{ fontSize: 12, fontWeight: 500, color: "#333333" }}
                >
                  {item.email}
                </Text>
                <Text
                  style={{ fontSize: 12, fontWeight: 500, color: "#333333" }}
                >
                  {item.phone}
                </Text>
              </View>
            </View>
          )}
        />

        {users.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <Pressable
              style={tw`bg-purple-500 p-4 rounded-md`}
              onPress={() => setUploadModalVisible(true)}
            >
              <Text style={tw`text-white font-bold`}>Subir dados</Text>
            </Pressable>

            <Pressable
              style={tw`bg-blue-500 p-4 rounded-md`}
              onPress={saveUsersToFile}
            >
              <Text style={tw`text-white font-bold`}>Salvar arquivo</Text>
            </Pressable>

            <Pressable
              style={tw`bg-green-600 p-4 rounded-md`}
              onPress={exportUsersToCSV}
            >
              <Text style={tw`text-white font-bold`}>Exportar CSV</Text>
            </Pressable>

            <Pressable
              style={tw`bg-red-500 p-4 rounded-md`}
              onPress={() => setModalVisible(true)}
            >
              <Text style={tw`text-white font-bold`}>Limpar dados</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* 🔐 Modal limpar */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white p-6 rounded-lg w-80`}>
            <Text style={tw`text-lg font-bold mb-4`}>
              Digite a chave para limpar
            </Text>
            <TextInput
              placeholder="Digite aqui..."
              style={tw`border border-gray-400 rounded-md p-2 mb-4`}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={tw`flex-row justify-between`}>
              <Pressable
                style={tw`bg-gray-400 px-4 py-2 rounded-md`}
                onPress={() => {
                  setModalVisible(false);
                  setPassword("");
                }}
              >
                <Text style={tw`text-white font-bold`}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={tw`bg-red-500 px-4 py-2 rounded-md`}
                onPress={handleClearConfirmation}
              >
                <Text style={tw`text-white font-bold`}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* 🚀 Modal Upload */}
      <Modal
        transparent
        visible={uploadModalVisible}
        animationType="slide"
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 24,
              gap: 8,
              width: 350,
            }}
          >
            <Text style={tw`text-lg font-bold mb-4`}>
              Deseja realmente enviar os dados?
            </Text>
            <Text style={tw`mb-4`}>
              Isso irá enviar todos os inscritos para o servidor.
            </Text>
            <Input
              place="Digite uma nota"
              value={nota}
              onChangeText={(value: string) => setNota(value)}
            />
            <View style={tw`flex-row justify-between`}>
              <Pressable
                style={tw`bg-gray-400 px-4 py-2 rounded-md`}
                onPress={() => setUploadModalVisible(false)}
                disabled={loading}
              >
                <Text style={tw`text-white font-bold`}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={tw`bg-purple-500 px-4 py-2 rounded-md`}
                disabled={loading}
                onPress={async () => {
                  await loopUpdateItems();
                  setUploadModalVisible(false);
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={tw`text-white font-bold`}>Confirmar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
