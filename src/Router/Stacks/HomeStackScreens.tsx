import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from "../Screens/HomeStack/Home"

type HomeStackParamList = {
	Home: undefined
}

const HomeStack = createNativeStackNavigator<HomeStackParamList>()

const HomeStackScreens = () => {
	return (
		<HomeStack.Navigator>
			<HomeStack.Screen name="Home" component={Home} />
		</HomeStack.Navigator>
	)
}

export default HomeStackScreens
