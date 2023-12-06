import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { Alert } from "react-native";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { AuthContext } from "../context/authContext";

export default function MenuBtn() {
  const authCtx = useContext(AuthContext);

  const navigation = useNavigation();
  return (
    <Menu>
      <MenuTrigger
        children={<MaterialIcons name="more-vert" size={24} color="white" />}
        customStyles={{ triggerOuterWrapper: { marginRight: 5 } }}
      />
      <MenuOptions>
        <MenuOption
          onSelect={() => navigation.navigate("Settings")}
          text="Settings"
        />
        <MenuOption
          onSelect={authCtx.logout}
          text="Logout"
        />
      </MenuOptions>
    </Menu>
  );
}
