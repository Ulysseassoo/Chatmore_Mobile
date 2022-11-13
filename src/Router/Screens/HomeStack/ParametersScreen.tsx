import { Box, HStack, Icon, Pressable, ScrollView, Text, VStack } from "native-base"
import React from "react"
import { darktheme } from "../../../Theme/globalTheme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/core"

const parameters = [
	{
		title: "Profile",
		icon: "account-settings",
		subtitle: "Change your profile picture, username, bio",
		param: "ProfileParams"
	},
	{
		title: "Discussions",
		icon: "message-cog",
		subtitle: "Themes, background images",
		param: "DiscussionsParams"
	}
]

const ParametersScreen = () => {
	const navigation = useNavigation()
	return (
		<ScrollView bg={darktheme.profileColor} p="5">
			{parameters.map((param) => (
				// @ts-ignore
				<Pressable key={param.title} onPress={() => navigation.navigate(param.param)}>
					<HStack key={param.title} alignItems="center" space="4" mb="4">
						<Icon as={MaterialCommunityIcons} name={param.icon} size={6} color={darktheme.textColor} />
						<VStack space="0.25">
							<Text fontSize={"lg"} color="white">
								{param.title}
							</Text>
							<Text fontSize={"sm"} color={darktheme.textColor}>
								{param.subtitle}
							</Text>
						</VStack>
					</HStack>
				</Pressable>
			))}
		</ScrollView>
	)
}

export default ParametersScreen
