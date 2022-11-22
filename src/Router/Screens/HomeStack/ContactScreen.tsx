import { Avatar, Box, FlatList, Flex, HStack, Pressable, Text } from "native-base"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { darktheme } from "../../../Theme/globalTheme"
import { supabase } from "../../../Supabase/supabaseClient"
import { ListRenderItem } from "react-native"
import useSettingsStore from "../../../Store/settingsStore"
import useRoomStore, { RoomState } from "../../../Store/roomStore"
import useAuthStore from "../../../Store/authStore"
import { useNavigation } from "@react-navigation/core"
import { User } from "@supabase/supabase-js"
import { Profile } from "../../../Interface/Types"

const ContactScreen = () => {
	const contactProfiles = useSettingsStore((state) => state.contactProfiles)
	const rooms = useRoomStore((state) => state.rooms)
	const addRoom = useRoomStore((state) => state.addRoom)
	const session = useAuthStore((state) => state.session)
	const profile = useAuthStore((state) => state.profile)
	const navigation = useNavigation()

	const checkIfUserHasRoom = (newUserId: string) => {
		const check = rooms.filter((room) => room.users[0].id === newUserId)
		if (check.length === 0) return true
		return false
	}

	const createRoom = async (userId: string, user: Profile) => {
		// Create a room
		const { data: roomData, error: roomError }: { data: any; error: any } = await supabase
			.from("room")
			.insert({ created_at: new Date().toISOString() })
			.select()
			.single()
		if (roomError) throw roomError
		const { id: roomId } = roomData
		// Create ChatRoom between users
		const { error: chatUserRoomError }: { error: any } = await supabase.from("userHasRoom").insert({ room: roomId, user: userId })
		if (chatUserRoomError) throw chatUserRoomError
		const { error: userRoomError }: { error: any } = await supabase.from("userHasRoom").insert({ room: roomId, user: session?.user.id })
		if (userRoomError) throw userRoomError
		const newRoom: RoomState = {
			room: roomId,
			users: [user],
			messages: [],
			blockedUsers: []
		}
		return newRoom
	}

	const sendRoomToUser = (room: RoomState) => {
		const channelHome = supabase.channel("home" + room.users[0].id, {
			config: {
				presence: { key: session?.user.id }
			}
		})

		channelHome.subscribe(async (status) => {
			if (status === "SUBSCRIBED") {
				console.log(status, "to", channelHome.topic)
				channelHome.send({
					type: "broadcast",

					event: "room",

					payload: { room: { ...room, users: [profile] } }
				})
			}
		})
	}

	const getUserRoom = async (username: string | undefined) => {
		// Get ID of User to add
		const { data: userData, error }: { data: any; error: any } = await supabase.from("profiles").select("*").eq("username", username).single()
		if (error) throw Error
		const { id: userId } = userData
		// We need to check if that user doesn't already have a relation with the existing user
		if (!checkIfUserHasRoom(userId)) {
			const check = rooms.filter((room) => room.users[0].id === userId)
			return check[0]
		}
		const newRoom = await createRoom(userId, userData)
		addRoom(newRoom)
		sendRoomToUser(newRoom)
		return newRoom
	}

	const goToUserRoom = async (username: string | undefined) => {
		const room = await getUserRoom(username)
		navigation.navigate("ChatConversation", {
			room_id: room?.room
		})
	}

	const getActualRoomsUser = () => {
		const users = rooms.map((room) => room.users[0])
		return users
	}

	const renderItem: ListRenderItem<Profile> = ({ item }) => (
		<Box p="2" width="full" mb={2}>
			<Pressable
				onPress={() => {
					goToUserRoom(item.username)
				}}
				_pressed={{
					bg: darktheme.lineBreakColor
				}}
				px="4"
				py="2"
				borderRadius="xl">
				<HStack space="4" alignItems={"center"}>
					<Avatar
						source={{
							uri: item.avatar_url !== "" ? item.avatar_url : undefined
						}}
						height="10"
						width="10"
						borderRadius={"full"}
						bg="yellow.500">
						{item.username && item?.username[0].toUpperCase() + item?.username[1].toUpperCase()}
					</Avatar>

					<Flex justifyContent={"space-between"}>
						<Text color="white" fontWeight={"bold"}>
							{item.username}
						</Text>
						<Text color="gray.400" ellipsizeMode="tail" numberOfLines={1} maxW={"xs"}>
							{item.about}
						</Text>
					</Flex>
				</HStack>
			</Pressable>
		</Box>
	)

	return (
		<Box bg={darktheme.primaryColor} height="full" position="relative">
			<SafeAreaView>
				<Text px="6" color={darktheme.textColor} fontSize={"md"}>
					{contactProfiles.length === 0 ? "Contacts actuels" : "Contacts recherchés"}
				</Text>
				{contactProfiles.length <= 0 ? (
					<FlatList data={getActualRoomsUser()} renderItem={renderItem} keyExtractor={({ id }) => id} />
				) : (
					<FlatList data={contactProfiles} renderItem={renderItem} keyExtractor={({ id }) => id} />
				)}
			</SafeAreaView>
		</Box>
	)
}

export default ContactScreen
