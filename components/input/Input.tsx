import { TextInput, TextInputProps, View } from "react-native";
import { styles } from "./styles";

type Props = TextInputProps & {
  place: string;
};

export function Input({ place, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      <TextInput style={styles.input} placeholder={place} {...rest}></TextInput>
    </View>
  );
}
