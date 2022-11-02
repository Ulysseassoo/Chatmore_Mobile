import { useNavigation } from "@react-navigation/core"
import { Box, HStack, Avatar, Flex, Icon, Text, Pressable } from "native-base"
import React, { useMemo } from "react"
import { RoomState } from "../../Store/roomStore"
import { darktheme } from "../../Theme/globalTheme"
import { Ionicons } from "@expo/vector-icons"
import { Dimensions } from "react-native"

interface Props {
	item: RoomState
}

const ChatUsersListItem = ({ item }: Props) => {
	const user = item.users[0]
	const navigation = useNavigation()
	const actualMessage = useMemo(() => item.messages[0], [item.messages])
	const dimensions = Dimensions.get("screen")
	const goToUserRoom = (roomId: number) => {
		navigation.navigate("ChatConversation", {
			room_id: roomId
		})
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
						<HStack alignItems="center" space="1">
							<Icon as={Ionicons} name="checkmark-done-sharp" color={item.messages[0].view ? darktheme.accentColor : "gray.500"} />
							<Text color="gray.400" ellipsizeMode="tail" numberOfLines={1} maxW={"xs"} display="flex" flexDir="row" alignItems="center">
								{actualMessage.content}
							</Text>
						</HStack>
					</Flex>
				</HStack>
			</Pressable>
		</Box>
	)
}

export default ChatUsersListItem
