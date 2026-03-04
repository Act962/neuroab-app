import { Button } from "@/components/buttom";
import { Logo } from "@/components/logo/Logo";
import { ModalAcesso } from "@/components/modal";
import { usePage } from "@/hooks/use-page";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { Cog } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { styles } from "./style";

export function Home() {
  const router = useRouter();
  const { loadSavedConfigs, getNextPage } = usePage();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalAdminVisible, setModalAdminVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [chave, setChave] = useState("");
  const [senhaAdmin, setSenhaAdmin] = useState("");

  function acessoRestrito() {
    if (chave !== "Fala1234@") {
      Alert.alert("Código inválido");
      setChave("");
      return;
    }
    setModalAdminVisible(false);
    setModalVisible(false);
    setDropdownVisible(false);
    setChave("");
    router.push("/users");
  }

  function acessoAdmin() {
    if (senhaAdmin !== "Premio1234@") {
      Alert.alert("Senha inválida");
      setSenhaAdmin("");
      return;
    }
    setModalAdminVisible(false);
    setDropdownVisible(false);
    router.push("/admin");
    setSenhaAdmin("");
  }
  function handleNextPage() {
    // const nextPage = getNextPage("home");
    // if (nextPage) {
    //   router.push(nextPage === "home" ? "/" : (`/${nextPage}` as any));
    //   return;
    // }
    router.push("/form");
  }

  return (
    <View style={styles.backgound}>
      <View style={styles.header}>
        <Pressable onPress={() => setDropdownVisible(!dropdownVisible)}>
          <Cog size={24} color="gray" />
        </Pressable>

        {/* 🔽 Dropdown */}
        {dropdownVisible && (
          <View style={styles.dropdownContainer}>
            <Pressable
              onPress={() => {
                setDropdownVisible(false);
                setModalVisible(true);
              }}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownText}>🔑 Acesso Restrito</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setDropdownVisible(false);
                setModalAdminVisible(true);
              }}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownText}>⚙️ Área Admin</Text>
            </Pressable>
          </View>
        )}
        <Logo />
      </View>

      <View style={styles.container}>
        {/* Conteúdo principal */}

        <View style={styles.contentCenter}>
          <Text style={styles.Title}>Roleta da Sorte</Text>
          <Text style={styles.Subtitle}>
            Gire a roleta e ganhe prêmios incríveis!
          </Text>
          <View style={styles.containerFooter}>
            <LottieView
              source={require("@/animations/Roullete.json")}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Button title="Prosseguir" onPress={handleNextPage} />
          </View>
          <Text style={styles.SubtitleFooter}>
            Preencha seus dados e teste sua sorte!
          </Text>
        </View>

        {/* 🔒 Modal: Acesso Restrito */}
        <ModalAcesso
          onChangeText={(e) => setChave(e)}
          onClose={() => setModalVisible(false)}
          title="Acesso restrito"
          onConfirm={acessoRestrito}
          placeholder="Sua senha aqui"
          value={chave}
          visible={modalVisible}
          confirmButtonText="Confirmar"
          confirmButtonStyle="confirm"
        />
        {/* 🔒 Modal: Área Admin */}
        <ModalAcesso
          onChangeText={(e) => setSenhaAdmin(e)}
          onClose={() => setModalAdminVisible(false)}
          title="Admin"
          onConfirm={acessoAdmin}
          placeholder="Sua senha aqui"
          value={senhaAdmin}
          visible={modalAdminVisible}
          confirmButtonText="Confirmar"
          confirmButtonStyle="admin"
        />
      </View>
    </View>
  );
}
