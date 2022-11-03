import { useNavigation } from "@react-navigation/core"
import { Box, HStack, Avatar, Flex, Icon, Text, Pressable, Badge } from "native-base"
import React, { useMemo } from "react"
import { RoomState } from "../../Store/roomStore"
import { darktheme } from "../../Theme/globalTheme"
import { Ionicons } from "@expo/vector-icons"
import { Dimensions } from "react-native"
import useAuthStore from "../../Store/authStore"

interface Props {
	item: RoomState
}

const ChatUsersListItem = ({ item }: Props) => {
	const user = item.users[0]
	const navigation = useNavigation()
	const session = useAuthStore((state) => state.session)
	const actualMessage = useMemo(() => item.messages[item.messages.length - 1], [item.messages])
	const dimensions = Dimensions.get("screen")
	const goToUserRoom = (roomId: number) => {
		navigation.navigate("ChatConversation", {
			room_id: roomId
		})
	}

	const isFromConnectedUser = actualMessage.user === session?.user.id

	const getNotViewedMessages = (user_id: string | undefined) => {
		const count = item.messages.filter((message) => {
			if (message.user !== user_id) return message.view === false
		})
		return count.length
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
							uri: user.avatar_url
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
								<Text color="white">
									{new Date(actualMessage.created_at).getHours()}:{new Date(actualMessage.created_at).getMinutes()}
								</Text>
							)}
						</Flex>
						<Flex justifyContent={"space-between"} flexDir="row">
							<HStack alignItems="center" space="1">
								{isFromConnectedUser && (
									<Icon as={Ionicons} name="checkmark-done-sharp" color={item.messages[0].view ? darktheme.accentColor : "gray.500"} />
								)}
								<Text
									color="gray.400"
									ellipsizeMode="tail"
									numberOfLines={1}
									maxW={dimensions.width - 150}
									display="flex"
									flexDir="row"
									alignItems="center">
									{actualMessage.content}
								</Text>
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
