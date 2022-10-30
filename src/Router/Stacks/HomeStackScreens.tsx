import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from "../Screens/HomeStack/Home"
import { Box, HStack, Icon, Pressable } from "native-base"
import { darktheme } from "../../Theme/globalTheme"
import { SimpleLineIcons, AntDesign } from "@expo/vector-icons"

type HomeStackParamList = {
	Home: undefined
}

const HomeStack = createNativeStackNavigator<HomeStackParamList>()

const HomeStackScreens = () => {
	return (
		<HomeStack.Navigator>
			<HomeStack.Screen
				name="Home"
				component={Home}
				options={{
					title: "ChatMore",
					headerStyle: {
						backgroundColor: darktheme.headerMenuColor
					},
					headerBackground: () => <Box borderBottomColor={"none"} />,
					headerTintColor: darktheme.textColor,
					headerRight: () => (
						<HStack space="4" alignItems="center">
							<Pressable onPress={() => console.log("This is a search!")}>
								<Icon as={AntDesign} name="search1" color={darktheme.textColor} />
							</Pressable>

							<Pressable onPress={() => console.log("This is a button!")}>
								<Icon as={SimpleLineIcons} name="options-vertical" color={darktheme.textColor} />
							</Pressable>
						</HStack>
					)
				}}
			/>
		</HomeStack.Navigator>
	)
}

export default HomeStackScreens
