import { useRoute } from "@react-navigation/core"
import { profile } from "console"
import { Avatar, Box, Center, Flex, HStack, Icon, Pressable, ScrollView, Text, VStack } from "native-base"
import React from "react"
import { Profile } from "../../../Interface/Types"
import { darktheme } from "../../../Theme/globalTheme"
import { MaterialIcons } from "@expo/vector-icons"

interface Params {
	profile: Profile
}

export interface RouteProps {
	key: string
	name: string
	path?: string
	params: Params
}

const ProfileUserScreen = () => {
	const { params } = useRoute<RouteProps>()
	const { profile } = params

	return (
		<Flex bg={darktheme.profileColor} flex="1">
			<Flex justifyContent={"space-between"} flex="1" pb="3">
				<Box>
					<Center pt="4">
						<Avatar
							source={{
								uri: profile?.avatar_url
							}}
							bg={darktheme.accentColor}
							size={"2xl"}>
							{profile?.username && profile?.username[0].toUpperCase() + profile?.username[1].toUpperCase()}
						</Avatar>

						<Text color="white" mt="3" fontSize={"2xl"}>
							{profile?.username}
						</Text>
					</Center>

					<Box mt="8" px="4">
						<Box
							bg={darktheme.headerMenuColor}
							p="2"
							borderRadius="xl"
							shadow="2"
							style={{
								shadowColor: darktheme.lineBreakColor
							}}>
							<Text color="white" fontSize={"lg"}>
								{profile.about}
							</Text>
							<Text color={darktheme.textColor} fontSize="sm">
								About
							</Text>
						</Box>

						<Box
							bg={darktheme.headerMenuColor}
							p="2"
							mt="4"
							borderRadius="xl"
							shadow="2"
							style={{
								shadowColor: darktheme.lineBreakColor
							}}>
							<Text color="white" fontSize={"lg"}>
								{profile.phone}
							</Text>
							<Text color={darktheme.textColor} fontSize="sm">
								Phone number
							</Text>
						</Box>
					</Box>
				</Box>

				<VStack px="4" space="3.5">
					<Pressable
						bg={darktheme.headerMenuColor}
						p="2"
						py="4"
						borderRadius="xl"
						shadow="2"
						_pressed={{
							bg: darktheme.lineBreakColor
						}}
						style={{
							shadowColor: darktheme.lineBreakColor
						}}>
						<HStack alignItems={"center"} space="1.5">
							<Icon as={MaterialIcons} name="delete" size={7} color={darktheme.importantColor} />
							<Box>
								<Text color={darktheme.importantColor} fontSize={"lg"}>
									Delete this discussion
								</Text>
							</Box>
						</HStack>
					</Pressable>

					<Pressable
						bg={darktheme.headerMenuColor}
						p="2"
						py="4"
						borderRadius="xl"
						shadow="2"
						_pressed={{
							bg: darktheme.lineBreakColor
						}}
						style={{
							shadowColor: darktheme.lineBreakColor
						}}>
						<HStack alignItems={"center"} space="1.5">
							<Icon as={MaterialIcons} name="block" size={7} color={darktheme.importantColor} />
							<Box>
								<Text color={darktheme.importantColor} fontSize={"lg"}>
									Block this user
								</Text>
							</Box>
						</HStack>
					</Pressable>
				</VStack>
			</Flex>
		</Flex>
	)
}

export default ProfileUserScreen
