import { Box, Center, Flex, Icon } from "native-base"
import React from "react"
import { Pressable } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { darktheme } from "../../Theme/globalTheme"
import { useNavigation } from "@react-navigation/core"

const FloaterIcon = () => {
	const navigation = useNavigation()
	return (
		<Box bg={darktheme.accentColor} height="16" width="16" position={"absolute"} bottom="20" right="6" borderRadius={"full"}>
			<Center width="full" height="full">
				<Pressable onPress={() => navigation.navigate("Contacts")}>
					<Icon as={MaterialIcons} name="add-box" size="xl" color="white" />
				</Pressable>
			</Center>
		</Box>
	)
}

export default FloaterIcon
