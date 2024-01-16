import { useState } from "react";
import { Text, View, Modal, Button } from "react-native";

export default function Settings() {
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <Modal visible={modalVisible}>
      <View>
        <Text>Settings</Text>
        <Button title="close" onPress={() => setModalVisible(false)} />
      </View>
    </Modal>
  );
}
