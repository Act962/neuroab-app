import { Image } from "react-native";
import { styles } from "./style";

export function Logo() {
  return (
    <Image
      source={require("@/assets/logo-neurolab-basic.jpeg")}
      style={styles.image}
    />
  );
}
