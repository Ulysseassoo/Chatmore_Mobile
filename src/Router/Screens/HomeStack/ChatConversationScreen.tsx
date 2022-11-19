import { useRoute } from "@react-navigation/core"
import { Box, Center, FlatList, Flex, Pressable, Text, View } from "native-base"
import React, { useEffect, useMemo } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { updateRoomMessages } from "../../../Api/API"
import useIsUserBlocked from "../../../Hooks/useIsUserBlocked"
import { Message } from "../../../Interface/Types"
import useAuthStore from "../../../Store/authStore"
import useRoomStore from "../../../Store/roomStore"
import { supabase } from "../../../Supabase/supabaseClient"
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
	const updateViewRoomMessages = useRoomStore((state) => state.updateViewRoomMessages)
	const channels = supabase.getChannels()
	const isUserBlocked = useIsUserBlocked(actualRoom.users[0]?.id)
	const getChannelRoom = useMemo(() => {
		const channelRoom = channels.find((chan) => chan.topic.split(":")[1] === "room" + actualRoom?.room.toString()!)
		if (channelRoom) return channelRoom
		return null
	}, [channels])

	const getNotViewedMessages = () => {
		const count = actualRoom.messages
			.filter((message) => {
				if (message.user !== session?.user.id) return message.view === false
			})
			.map((message) => {
				let newMessage = { ...message }
				// @ts-ignore
				if (newMessage.images) {
					// @ts-ignore
					delete newMessage.images
				}
				return newMessage
			})
		return count
	}

	const setViewedMessage = () => {
		const notViewedMessages = getNotViewedMessages()
		if (notViewedMessages.length === 0) return []
		const viewedMessages = notViewedMessages.map((message) => {
			message.view = true
			return message
		})
		return viewedMessages
	}

	const updateUserMessages = async () => {
		try {
			const viewedMessages = setViewedMessage()
			if (viewedMessages.length === 0) return
			const messages: Message[] = await updateRoomMessages(viewedMessages)
			return messages
		} catch (error) {
			console.log(error)
		}
	}

	const updateMessagesInRoom = async () => {
		try {
			const messages = await updateUserMessages()
			if (messages === undefined) return
			updateViewRoomMessages(messages, session?.user.id)
			if (getChannelRoom !== null) {
				getChannelRoom.send({
					type: "broadcast",
					event: "readMessages",
					payload: { messages }
				})
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		updateMessagesInRoom()
	}, [actualRoom.messages])

	return (
		<Box bg={darktheme.primaryColor} height="full" position="relative" paddingTop={insets.top - 20} paddingBottom={insets.bottom + 2}>
			<Flex px="4" height="full" width="full" justifyContent={"space-between"}>
				<FlatList
					contentContainerStyle={{
						display: "flex"
						// flexDirection: "column-reverse"
						// alignItems: "baseline"
					}}
					inverted
					renderItem={({ item }) => <ChatMessage item={item} />}
					data={actualRoom?.messages}
				/>
				{isUserBlocked && (
					<Center>
						<Pressable
							_pressed={{
								bg: darktheme.lineBreakColor
							}}
							textAlign={"center"}
							my="2.5"
							shadow="6"
							py="2"
							px="4"
							bg={darktheme.headerMenuColor}
							borderRadius="md">
							<Text color={darktheme.textColor} fontSize="xs">
								You have blocked this user. Click here to unblock him.
							</Text>
						</Pressable>
					</Center>
				)}
				<ChatConversationBottom />
			</Flex>
		</Box>
	)
}

export default ChatConversationScreen
