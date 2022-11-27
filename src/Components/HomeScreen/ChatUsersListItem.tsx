import { useNavigation } from "@react-navigation/core"
import { Box, HStack, Avatar, Flex, Icon, Text, Pressable, Badge } from "native-base"
import React, { useMemo } from "react"
import { RoomState } from "../../Store/roomStore"
import { darktheme } from "../../Theme/globalTheme"
import { Ionicons } from "@expo/vector-icons"
import { Dimensions } from "react-native"
import useAuthStore from "../../Store/authStore"
import useUserIsTypying from "../../Hooks/useUserIsTypying"
import { dateFormatted } from "../../Router/Screens/HomeStack/ChatMessage"
import useIsUserBlocked from "../../Hooks/useIsUserBlocked"
import { MaterialCommunityIcons } from "@expo/vector-icons"

interface Props {
	item: RoomState
}

const ChatUsersListItem = ({ item }: Props) => {
	const user = item.users[0]
	const navigation = useNavigation()
	const session = useAuthStore((state) => state.session)
	const actualMessage = useMemo(() => item.messages[0].messages[0], [item.messages])
	const isUserBlocked = useIsUserBlocked(item.room)

	const dimensions = Dimensions.get("screen")
	const goToUserRoom = (roomId: number) => {
		navigation.navigate("ChatConversation", {
			room_id: roomId
		})
	}
	const isUserTypying = useUserIsTypying(item.room)

	const isFromConnectedUser = actualMessage.user === session?.user.id

	const getNotViewedMessages = (user_id: string | undefined) => {
		const count = item.messages
			.map((dateMessage) =>
				dateMessage.messages.filter((message) => {
					if (message.user !== user_id) return message.view === false
				})
			)
			.filter((mess) => mess.length > 0)
		return count.length
	}

	if (isUserBlocked.hasConnectedUserBlockedRoom) {
		return (
			<Box width={dimensions.width} position="relative">
				<Pressable
					onPress={() => {
						goToUserRoom(item.room)
					}}
					_pressed={{
						bg: darktheme.lineBreakColor
					}}
					p="4">
					<HStack space="4" alignItems={"center"}>
						<Avatar
							source={{
								uri: user.avatar_url !== "" ? user.avatar_url : undefined
							}}
							height="10"
							width="10"
							borderRadius={"full"}
							bg="yellow.500">
							{user.username && user?.username[0].toUpperCase() + user?.username[1].toUpperCase()}
						</Avatar>

						<Flex justifyContent={"space-between"} width={"full"} safeAreaRight pr="16">
							<Flex justifyContent={"space-between"} alignItems="center" flexDir="row">
								<Text color="white" fontWeight={"bold"}>
									{user.username}
								</Text>
							</Flex>
							<Flex justifyContent={"space-between"} flexDir="row">
								<HStack alignItems="center" space="1">
									<Text
										color={isUserTypying ? darktheme.accentColor : "gray.400"}
										ellipsizeMode="tail"
										numberOfLines={1}
										maxW={dimensions.width - 150}
										display="flex"
										flexDir="row"
										alignItems="center">
										You have blocked this user
									</Text>
								</HStack>
							</Flex>
						</Flex>
					</HStack>
				</Pressable>
			</Box>
		)
	}

	return (
		<Box width={dimensions.width} position="relative">
			<Pressable
				onPress={() => {
					goToUserRoom(item.room)
				}}
				_pressed={{
					bg: darktheme.lineBreakColor
				}}
				p="4">
				<HStack space="4" alignItems={"center"}>
					<Avatar
						source={{
							uri: user.avatar_url !== "" ? user.avatar_url : undefined
						}}
						height="10"
						width="10"
						borderRadius={"full"}
						bg="yellow.500">
						{user.username && user?.username[0].toUpperCase() + user?.username[1].toUpperCase()}
					</Avatar>

					<Flex justifyContent={"space-between"} width={"full"} safeAreaRight pr="16">
						<Flex justifyContent={"space-between"} alignItems="center" flexDir="row">
							<Text color="white" fontWeight={"bold"}>
								{user.username}
							</Text>

							{actualMessage.created_at && (
								<Text color="white" fontSize={"xs"}>
									{dateFormatted(actualMessage.created_at)}
								</Text>
							)}
						</Flex>
						<Flex justifyContent={"space-between"} flexDir="row">
							<HStack alignItems="center" space="1">
								{isFromConnectedUser && (
									<Icon as={Ionicons} name="checkmark-done-sharp" color={actualMessage.view ? darktheme.accentColor : "gray.500"} />
								)}
								<Text
									color={isUserTypying ? darktheme.accentColor : "gray.400"}
									ellipsizeMode="tail"
									numberOfLines={1}
									maxW={dimensions.width - 150}
									display="flex"
									flexDir="row"
									alignItems="center">
									{isUserTypying ? "Is writing..." : actualMessage.content}
								</Text>
								{actualMessage.images !== undefined && actualMessage.images.length > 0 && (
									<HStack alignItems="center" space="1">
										<Icon as={MaterialCommunityIcons} name="image" color="gray.500" size={4} />
										<Text color={isUserTypying ? darktheme.accentColor : "gray.400"}>Image</Text>
									</HStack>
								)}
							</HStack>
							{getNotViewedMessages(session?.user.id) > 0 && (
								<Badge bg={darktheme.accentColor} color="white" fontSize={"2xs"} borderRadius={"full"}>
									{getNotViewedMessages(session?.user.id)}
								</Badge>
							)}
						</Flex>
					</Flex>
				</HStack>
			</Pressable>
		</Box>
	)
}

export default ChatUsersListItem
