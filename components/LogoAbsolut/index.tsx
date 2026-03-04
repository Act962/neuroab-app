import { Image, ImageProps } from "react-native";
import { styles } from "./style";

type Props = ImageProps & {};

export function LogoAbsolut({ ...props }: Props) {
  return (
    <Image
      {...props}
      source={require("@/assets/logo-neurolab.png")}
      style={styles.image}
    />
  );
}
