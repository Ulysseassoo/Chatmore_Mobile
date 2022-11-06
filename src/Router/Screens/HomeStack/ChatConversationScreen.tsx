import { useRoute } from "@react-navigation/core"
import { Box, FlatList, Flex, Text, View } from "native-base"
import React, { useEffect } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { updateRoomMessages } from "../../../Api/API"
import useAuthStore from "../../../Store/authStore"
import useRoomStore from "../../../Store/roomStore"
import { darktheme } from "../../../Theme/globalTheme"
import ChatConversationBottom from "./ChatConversationBottom"
import { RouteProps } from "./ChatConversationHeader"
import ChatMessage from "./ChatMessage"

const ChatConversationScreen = () => {
	const insets = useSafeAreaInsets()
	const route = useRoute<RouteProps>()
	const rooms = useRoomStore((state) => state.rooms)
	const actualRoom = rooms.find((roomState) => roomState.room === route.params?.room_id)!
	const session = useAuthStore((state) => state.session)

	const getNotViewedMessages = () => {
		const count = actualRoom.messages.filter((message) => {
			if (message.user !== session?.user.id) return message.view === false
		})
		return count
	}

	const updateUserMessages = async () => {
		const notViewedMessages = getNotViewedMessages()
		if (notViewedMessages.length === 0) return
		await updateRoomMessages(notViewedMessages)
	}

	// console.log(getNotViewedMessages(session?.user.id))

	// useEffect(() => {

	// }, [])

	return (
		<Box bg={darktheme.primaryColor} height="full" position="relative" paddingTop={insets.top - 20} paddingBottom={insets.bottom + 2}>
			<Flex px="4" height="full" width="full" justifyContent={"space-between"}>
				<FlatList
					contentContainerStyle={{
						display: "flex",
						flexDirection: "column-reverse"
						// alignItems: "baseline"
					}}
					inverted
					renderItem={({ item }) => <ChatMessage item={item} />}
					data={actualRoom?.messages}
				/>
				<ChatConversationBottom />
			</Flex>
		</Box>
	)
}

export default ChatConversationScreen
