import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from '../screens/Login'
import Signup from "../screens/Signup";

const Stack = createNativeStackNavigator();

const Authentication = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Authentication;
