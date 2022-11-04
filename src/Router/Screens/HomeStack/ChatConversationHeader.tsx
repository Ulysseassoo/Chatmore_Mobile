import { Avatar, Box, Flex, HStack, Icon, Text } from "native-base"
import React, { useEffect, useMemo, useState } from "react"
import { Pressable } from "react-native"
import { darktheme } from "../../../Theme/globalTheme"
import { SimpleLineIcons, AntDesign } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import useRoomStore from "../../../Store/roomStore"
import { ParamListBase, useNavigation, useRoute } from "@react-navigation/core"
import { RootStackParamList } from "../../../Interface/Navigator"
import useOnlineStore from "../../../Store/onlineStore"
import { supabase } from "../../../Supabase/supabaseClient"
import useAuthStore from "../../../Store/authStore"
// import { getChannelRoom } from "./ChatConversationBottom"

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
	const [userIsTypying, setUserIsTypying] = useState(false)
	const roomUsers = useOnlineStore((state) => state.typyingUsersRooms)
	const isUserTypying = () => {
		if (actualRoom !== undefined) {
			const roomRealtime = roomUsers[actualRoom?.room!]
			if (roomRealtime !== undefined) {
				const isUserExisting = Object.keys(roomRealtime).find((id) => id === userToChat!.id)
				if (isUserExisting) {
					setUserIsTypying(true)
					return
				}
			}
		}
		return setUserIsTypying(false)
	}

	const onlineUsers = useOnlineStore((state) => state.onlineUsers)
	const isUserOnline = useMemo(() => {
		const isOnline = Object.keys(onlineUsers).find((userId) => userId === userToChat?.id)
		if (!isOnline) return false
		return true
	}, [onlineUsers, userToChat])

	if (!actualRoom) return <></>

	useEffect(() => {
		isUserTypying()
	}, [actualRoom, roomUsers])

	return (
		<Box bg={darktheme.headerMenuColor} paddingTop={insets.top - 14} paddingBottom={3} paddingX={4}>
			<Flex justifyContent={"space-between"} alignItems="center" flexDir="row" position="relative" overflow="hidden">
				<HStack space={2} alignItems="center">
					<Pressable onPress={navigation.goBack}>
						<Icon as={AntDesign} name="arrowleft" color="white" size={6} />
					</Pressable>
					<HStack alignItems={"center"} space="4">
						<Avatar
							source={{
								uri: userToChat?.avatar_url
							}}
							bg={darktheme.accentColor}
							size={"sm"}>
							{userToChat?.username && userToChat?.username[0].toUpperCase() + userToChat?.username[1].toUpperCase()}
						</Avatar>
						<Box>
							<Text color="white" fontSize="lg" fontWeight="bold">
								{userToChat?.username}
							</Text>
							{!userIsTypying && (
								<HStack space="1" alignItems={"center"}>
									<Box height="2" width="2" borderRadius={"full"} bg={isUserOnline ? "green.500" : "red.500"} />
									<Text fontSize={"xs"} color="white">
										{isUserOnline ? "Online" : "Offline"}
									</Text>
								</HStack>
							)}
							{userIsTypying && (
								<Text color="white" fontSize={"xs"}>
									Is writing...
								</Text>
							)}
						</Box>
					</HStack>
				</HStack>

				<HStack space="4" alignItems="center">
					<Pressable>
						<Icon as={SimpleLineIcons} name="options-vertical" color={"white"} />
					</Pressable>
				</HStack>
			</Flex>
		</Box>
	)
}

export default ChatConversationHeader
