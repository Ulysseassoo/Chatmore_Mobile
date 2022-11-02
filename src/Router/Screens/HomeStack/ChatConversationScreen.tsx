import { useRoute } from "@react-navigation/core"
import { Box, FlatList, Flex, Text, View } from "native-base"
import React from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useAuthStore from "../../../Store/authStore"
import useRoomStore from "../../../Store/roomStore"
import { darktheme } from "../../../Theme/globalTheme"
import ChatConversationBottom from "./ChatConversationBottom"
import { RouteProps } from "./ChatConversationHeader"

const ChatConversationScreen = () => {
	const insets = useSafeAreaInsets()
	const route = useRoute<RouteProps>()
	const rooms = useRoomStore((state) => state.rooms)
	const session = useAuthStore((state) => state.session)
	const actualRoom = rooms.find((roomState) => roomState.room === route.params?.room_id)!
	return (
		<Box bg={darktheme.primaryColor} height="full" position="relative" paddingTop={insets.top - 41} paddingBottom={insets.top - 38}>
			<Flex px="4" height="full" width="full" justifyContent={"space-between"}>
				<FlatList renderItem={({ item }) => <Text color="white">{item.content}</Text>} data={actualRoom?.messages} />
				<ChatConversationBottom />
			</Flex>
		</Box>
	)
}

export default ChatConversationScreen
