import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from "../Screens/HomeStack/Home"
import LoginScreen from "../Screens/PublicStack/LoginScreen"
import RegisterScreen from "../Screens/PublicStack/RegisterScreen"

type PublicStackParamList = {
	Login: undefined
	Register: undefined
}

const PublicStack = createNativeStackNavigator<PublicStackParamList>()

const PublicStackScreens = () => {
	return (
		<PublicStack.Navigator>
			<PublicStack.Screen
				name="Login"
				component={LoginScreen}
				options={{
					headerTitle: "",
					header: () => <></>
				}}
			/>
			<PublicStack.Screen
				name="Register"
				component={RegisterScreen}
				options={{
					headerTitle: "",
					header: () => <></>
				}}
			/>
		</PublicStack.Navigator>
	)
}

export default PublicStackScreens
