import { Box, HStack, Icon, Pressable, ScrollView, Text, VStack } from "native-base"
import React from "react"
import { darktheme } from "../../../Theme/globalTheme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/core"
import { supabase } from "../../../Supabase/supabaseClient"
import useAuthStore from "../../../Store/authStore"
import useRoomStore from "../../../Store/roomStore"

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
	const setLoggedOut = useAuthStore((state) => state.setLoggedOut)
	const emptyRooms = useRoomStore((state) => state.emptyRooms)

	const logoutUser = async () => {
		try {
			const { error } = await supabase.auth.signOut()
			// console.log("signedOut")
			if (error) throw error
			emptyRooms()
			setLoggedOut()
		} catch (error: any) {
			console.log(error)
		}
	}
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
			<Pressable onPress={logoutUser}>
				<HStack alignItems="center" space="4" mb="4">
					<Icon as={MaterialCommunityIcons} name={"logout"} size={6} color={darktheme.importantColor} />
					<VStack space="0.25">
						<Text fontSize={"lg"} color="white">
							Logout
						</Text>
						<Text fontSize={"sm"} color={darktheme.textColor}>
							Disconnect from your account
						</Text>
					</VStack>
				</HStack>
			</Pressable>
		</ScrollView>
	)
}

export default ParametersScreen
