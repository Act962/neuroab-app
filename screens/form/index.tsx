import { Button } from "@/components/buttom";
import { Input } from "@/components/input/Input";
import { LogoAbsolut } from "@/components/LogoAbsolut";
import { usePage } from "@/hooks/use-page";
import { colors } from "@/shared/colors";
import { store, USERS_TABLE } from "@/storge/store";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { CircleCheck, CircleDashed } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaskInput from "react-native-mask-input";
import { RFValue } from "react-native-responsive-fontsize";
import { styles } from "./style";

export function Form() {
  const router = useRouter();
  const { loadSavedConfigs, getNextPage } = usePage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const onSubmit = () => {
    if (!name || !phone) {
      Alert.alert("Erro", "Preencha todos os dados");
      return;
    }

    const id = Math.random().toString(30).substring(2, 20);
    try {
      store.setRow(USERS_TABLE, id, { name, email, phone });

      setName("");
      setEmail("");
      setPhone("");

      handleNextPage();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  function handleNextPage() {
    // const nextPage = getNextPage("form");
    // if (nextPage !== "roullete") {
    //   router.push(nextPage === "home" ? "/" : (`/${nextPage}` as any));
    //   return;
    // }
    router.push("/roullete");
  }

  useEffect(() => {
    loadSavedConfigs();
  }, []);

  return (
    <View style={styles.backgound}>
      <LogoAbsolut style={{ top: RFValue(20) }} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons
              name="arrow-back"
              size={RFValue(20)}
              color={colors["text-primary"]}
            />
          </TouchableOpacity>
          <Text style={styles.Title}>Cadastro</Text>
          <MaterialIcons
            style={{ opacity: 0 }}
            name="arrow-back"
            size={RFValue(20)}
            color={colors["text-primary"]}
          />
        </View>

        {/* NOME */}
        <View style={styles.inputContainer}>
          <Text style={styles.subTitile}>Nome</Text>
          <Input place="John" value={name} onChangeText={setName} />
        </View>

        {/* EMAIL */}
        <View style={styles.inputContainer}>
          <Text style={styles.subTitile}>Email</Text>
          <Input
            place="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* TELEFONE */}
        <View style={styles.inputContainer}>
          <Text style={styles.subTitile}>Telefone</Text>
          <MaskInput
            value={phone}
            onChangeText={setPhone}
            mask={[
              "(",
              /\d/,
              /\d/,
              ")",
              " ",
              /\d/,
              /\d/,
              /\d/,
              /\d/,
              /\d/,
              "-",
              /\d/,
              /\d/,
              /\d/,
              /\d/,
            ]}
            keyboardType="numeric"
            placeholder="(00) 00000-0000"
            style={styles.phoneInput}
          />
          <Pressable
            style={styles.inputContainer}
            onPress={() => setIsConfirmed(!isConfirmed)}
          >
            <View style={styles.checkboxContainer}>
              {isConfirmed ? (
                <CircleCheck
                  color={colors["text-primary"]}
                  size={RFValue(25)}
                />
              ) : (
                <CircleDashed
                  color={colors["text-primary"]}
                  size={RFValue(25)}
                />
              )}

              <Text style={styles.checkboxText}>
                Ao preencher com seus dados, você autoriza o uso das informações
                fornecidas para que possamos entrar em contato e melhorar nossos
                serviços, sempre respeitando a sua privacidade.
              </Text>
            </View>
          </Pressable>
        </View>

        {/* BOTÃO */}
        <View style={styles.containerButton}>
          <Button
            title="Começar"
            size={20}
            onPress={onSubmit}
            disable={!isConfirmed}
          />
          <Image
            source={require("@/assets/logo-neurolab.png")}
            style={styles.image}
          />
        </View>
      </ScrollView>
    </View>
  );
}
