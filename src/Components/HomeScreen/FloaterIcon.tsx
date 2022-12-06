import { Box, Center, Fab, Flex, Icon } from "native-base"
import React from "react"
import { Pressable } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { darktheme } from "../../Theme/globalTheme"
import { useNavigation } from "@react-navigation/core"

const FloaterIcon = () => {
	const navigation = useNavigation()
	return (
		<Fab
			renderInPortal={false}
			onPress={() => navigation.navigate("Contacts")}
			shadow={2}
			size="sm"
			bg={darktheme.accentColor}
			icon={<Icon color="white" as={MaterialIcons} name="add-box" size="xl" />}
			bottom="16"
			right="4"
		/>
	)
}

export default FloaterIcon
