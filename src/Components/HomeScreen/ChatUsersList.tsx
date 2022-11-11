import { useNavigation } from "@react-navigation/core"
import { Avatar, Box, Center, FlatList, Flex, HStack, Spinner, Pressable, Text, Icon } from "native-base"
import React, { useCallback, useEffect } from "react"
import { ListRenderItem } from "react-native"
import useAuthStore from "../../Store/authStore"
import useRoomStore, { RoomState } from "../../Store/roomStore"
import { supabase } from "../../Supabase/supabaseClient"
import { darktheme } from "../../Theme/globalTheme"
import ChatUsersListItem from "./ChatUsersListItem"

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

	const renderItem: ListRenderItem<RoomState> = ({ item }) => <ChatUsersListItem item={item} />

	return <FlatList renderItem={renderItem} data={rooms.filter((item) => item.messages.length > 0)} keyExtractor={(item) => item.room.toString()} />
}

export default ChatUsersList
