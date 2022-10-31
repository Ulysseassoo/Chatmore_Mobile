import { Avatar, Box, FlatList, Flex, HStack, Icon, Image, Input, Pressable, Text, View, VStack } from "native-base"
import React, { useEffect, useRef, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { darktheme } from "../../../Theme/globalTheme"
import { FontAwesome } from "@expo/vector-icons"
import { supabase } from "../../../Supabase/supabaseClient"
import { FlatListProps, ListRenderItem, TextInput } from "react-native"
import { Profile } from "../../../Interface/Profile"
import useSettingsStore from "../../../Store/settingsStore"
import useRoomStore, { RoomState } from "../../../Store/roomStore"
import useAuthStore from "../../../Store/authStore"
import { useNavigation } from "@react-navigation/core"
import { User } from "@supabase/supabase-js"

const ContactScreen = () => {
	const contactProfiles = useSettingsStore((state) => state.contactProfiles)
	const rooms = useRoomStore((state) => state.rooms)
	const addRoom = useRoomStore((state) => state.addRoom)
	const session = useAuthStore((state) => state.session)
	const navigation = useNavigation()

	const checkIfUserHasRoom = (newUserId: string) => {
		const check = rooms.filter((room) => room.users[0].id === newUserId)
		if (check.length === 0) return true
		return false
	}

	const createRoom = async (userId: string, user: User) => {
		// Create a room
		const { data: roomData, error: roomError }: { data: any; error: any } = await supabase
			.from("room")
			.insert({ created_at: new Date() })
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
			messages: []
		}
		return newRoom
	}

	const getUserRoom = async (username: string | undefined) => {
		// Get ID of User to add
		const { data: userData, error }: { data: any; error: any } = await supabase.from("profiles").select("*").eq("username", username).single()
		if (error) throw Error
		const { id: userId } = userData
		// We need to check if that user doesn't already have a relation with the existing user
		if (!checkIfUserHasRoom(userId)) {
			// toast.error("You already have a conversation with that user !")
			return
		}
		const newRoom = await createRoom(userId, userData)
		addRoom(newRoom)
		return newRoom
	}

	const goToUserRoom = async (username: string | undefined) => {
		const room = await getUserRoom(username)
		navigation.navigate("ChatConversation", {
			room_id: room?.room
		})
	}

	const renderItem: ListRenderItem<{
		id: string
		updated_at?: string | undefined
		username?: string | undefined
		avatar_url?: string | undefined
		email?: string | undefined
		about?: string | undefined
		phone?: string | undefined
	}> = ({ item }) => (
		<Box p="2" width="full" mb={2}>
			<Pressable
				onPress={() => {
					goToUserRoom(item.username)
				}}>
				<HStack space="4" alignItems={"center"}>
					<Avatar
						source={{
							uri: item.avatar_url
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
				<FlatList data={contactProfiles} renderItem={renderItem} keyExtractor={({ id }) => id} />
			</SafeAreaView>
		</Box>
	)
}

export default ContactScreen
