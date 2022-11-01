import { Avatar, Box, Center, FlatList, Flex, HStack, Spinner, Pressable, Text } from "native-base"
import React, { useEffect } from "react"
import { ListRenderItem } from "react-native"
import useAuthStore from "../../Store/authStore"
import useRoomStore, { RoomState } from "../../Store/roomStore"
import { darktheme } from "../../Theme/globalTheme"

const ChatUsersList = () => {
	const getChatrooms = useRoomStore((state) => state.getChatrooms)
	const rooms = useRoomStore((state) => state.rooms)
	const isLoading = useRoomStore((state) => state.isLoading)
	const session = useAuthStore((state) => state.session)

	useEffect(() => {
		if (session?.user !== undefined && isLoading) {
			getChatrooms(session.user)
		}
	}, [isLoading, session])

	if (isLoading) {
		return (
			<Center height="80%" width="full">
				<Spinner color={darktheme.accentColor} size={"lg"} />
			</Center>
		)
	}

	const renderItem: ListRenderItem<RoomState> = ({ item }) => {
		const user = item.users[0]

		return (
			<Box p="4" width="full">
				<Pressable
				// onPress={() => {
				// 	goToUserRoom(item.username)
				// }}
				>
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

						<Flex justifyContent={"space-between"}>
							<Text color="white" fontWeight={"bold"}>
								{user.username}
							</Text>
							<Text color="gray.400" ellipsizeMode="tail" numberOfLines={1} maxW={"xs"}>
								{user.about}
							</Text>
						</Flex>
					</HStack>
				</Pressable>
			</Box>
		)
	}

	return <FlatList renderItem={renderItem} data={rooms.filter((item) => item.messages.length > 0)} keyExtractor={(item) => item.room.toString()} />
}

export default ChatUsersList
