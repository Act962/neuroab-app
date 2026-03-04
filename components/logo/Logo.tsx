import { Image } from "react-native";
import { styles } from "./style";

export function Logo() {
  return (
    <Image
      source={require("@/assets/logo-neurolab.png")}
      style={styles.image}
    />
  );
}
