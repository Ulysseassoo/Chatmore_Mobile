import { Avatar, Box, Flex, HStack, Icon, Text, Pressable } from "native-base"
import React, { useMemo } from "react"
import { darktheme } from "../../../Theme/globalTheme"
import { SimpleLineIcons, AntDesign } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useRoomStore from "../../../Store/roomStore"
import { useNavigation, useRoute } from "@react-navigation/core"
import useOnlineStore from "../../../Store/onlineStore"
import useUserIsTypying from "../../../Hooks/useUserIsTypying"
import useIsUserBlocked from "../../../Hooks/useIsUserBlocked"

interface Params {
	room_id: number
}

export interface RouteProps {
	key: string
	name: string
	path?: string
	params: Params
}

const ChatConversationHeader = () => {
	const navigation = useNavigation()
	const route = useRoute<RouteProps>()
	const insets = useSafeAreaInsets()
	const rooms = useRoomStore((state) => state.rooms)
	const actualRoom = rooms.find((roomState) => roomState.room === route.params?.room_id)
	const userToChat = actualRoom?.users[0]
	const isUserBlocked = useIsUserBlocked(userToChat?.id)
	const userIsTypying = useUserIsTypying(route.params.room_id)
	const onlineUsers = useOnlineStore((state) => state.onlineUsers)
	const isUserOnline = useMemo(() => {
		const isOnline = Object.keys(onlineUsers).find((userId) => userId === userToChat?.id)
		if (!isOnline) return false
		return true
	}, [onlineUsers, userToChat])

	if (!actualRoom || !userToChat) return <></>

	return (
		<Box bg={darktheme.headerMenuColor} paddingTop={insets.top - 14} paddingBottom={3} paddingX={4}>
			<Flex justifyContent={"space-between"} alignItems="center" flexDir="row" position="relative" overflow="hidden">
				<HStack space={2} alignItems="center" flex="1">
					<Pressable onPress={navigation.goBack}>
						<Icon as={AntDesign} name="arrowleft" color="white" size={6} />
					</Pressable>
					<HStack alignItems={"center"} space="4" flex="1">
						<Avatar
							source={{
								uri: userToChat?.avatar_url !== "" ? userToChat.avatar_url : undefined
							}}
							bg={darktheme.accentColor}
							size={"sm"}>
							{userToChat?.username && userToChat?.username[0].toUpperCase() + userToChat?.username[1].toUpperCase()}
						</Avatar>
						<Pressable
							_pressed={{
								bg: darktheme.lineBreakColor
							}}
							px="1.5"
							borderRadius={"md"}
							onPress={() =>
								navigation.navigate("ProfileUser", {
									profile: userToChat
								})
							}
							flex="1">
							<Text color="white" fontSize="lg" fontWeight="bold">
								{userToChat?.username}
							</Text>
							{!isUserBlocked && !userIsTypying && (
								<HStack space="1" alignItems={"center"}>
									<Box height="2" width="2" borderRadius={"full"} bg={isUserOnline ? "green.500" : "red.500"} />
									<Text fontSize={"xs"} color="white">
										{isUserOnline ? "Online" : "Offline"}
									</Text>
								</HStack>
							)}
							{!isUserBlocked && userIsTypying && (
								<Text color="white" fontSize={"xs"}>
									Is writing...
								</Text>
							)}
						</Pressable>
					</HStack>
				</HStack>

				<HStack space="4" alignItems="center" flex="0">
					<Pressable>
						<Icon as={SimpleLineIcons} name="options-vertical" color={"white"} />
					</Pressable>
				</HStack>
			</Flex>
		</Box>
	)
}

export default ChatConversationHeader
