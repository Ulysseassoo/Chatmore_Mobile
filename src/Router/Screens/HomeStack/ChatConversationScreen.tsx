import { useRoute } from "@react-navigation/core"
import { profile } from "console"
import { Box, Center, FlatList, Flex, Pressable, Text, useToast, View } from "native-base"
import React, { useEffect, useMemo } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { deleteUserBlock, updateRoomMessages, UserHasBlockedDelete } from "../../../Api/API"
import ChatDate from "../../../Components/HomeScreen/ChatDate"
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
	const deleteBlockedUser = useRoomStore((state) => state.deleteBlockedUser)
	const actualRoom = rooms.find((roomState) => roomState.room === route.params?.room_id)!
	const session = useAuthStore((state) => state.session)
	const profile = useAuthStore((state) => state.profile)
	const updateViewRoomMessages = useRoomStore((state) => state.updateViewRoomMessages)
	const channels = supabase.getChannels()
	const isUserBlocked = useIsUserBlocked(actualRoom.room)
	const toast = useToast()
	const getChannelRoom = useMemo(() => {
		const channelRoom = channels.find((chan) => chan.topic.split(":")[1] === "room" + actualRoom?.room.toString()!)
		if (channelRoom) return channelRoom
		return null
	}, [channels])

	const unblockUser = async () => {
		const deleteUsers: UserHasBlockedDelete = {
			blocking_user_id: session?.user.id,
			room_id: route.params.room_id
		}

		try {
			await deleteUserBlock(deleteUsers)
			// Delete store
			deleteBlockedUser(route.params.room_id, profile?.id)
			if (getChannelRoom !== null) {
				getChannelRoom.send({
					type: "broadcast",

					event: "deleteBlock",

					payload: { room_id: route.params.room_id, profile_id: profile?.id }
				})
			}
			toast.show({
				description: `${profile?.username} has been unblocked !`,
				bg: "green.500",
				placement: "top"
			})
		} catch (error: any) {
			console.log(error)
		}
	}

	const getNotViewedMessages = () => {
		let messagesFormatted: Message[] = []
		actualRoom.messages
			.map((dateMessage) =>
				dateMessage.messages.filter((message) => {
					if (message.user !== session?.user.id) return message.view === false
				})
			)
			.filter((mess) => mess.length > 0)
			.map((mapArray) =>
				mapArray.map((message) => {
					let newMessage = { ...message }
					if (newMessage.images) {
						delete newMessage.images
					}
					messagesFormatted.push(newMessage)
				})
			)

		return messagesFormatted
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
			const messages = await updateRoomMessages(viewedMessages)
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
					}}
					inverted
					renderItem={({ item }) => (
						<Box my="1">
							<ChatDate date={item.date} />
							<FlatList
								contentContainerStyle={{
									display: "flex"
								}}
								inverted
								renderItem={({ item }) => <ChatMessage item={item} />}
								data={item.messages}
							/>
						</Box>
					)}
					data={actualRoom?.messages}
				/>
				{isUserBlocked.hasConnectedUserBlockedRoom && (
					<Center>
						<Pressable
							_pressed={{
								bg: darktheme.lineBreakColor
							}}
							textAlign={"center"}
							my="2.5"
							shadow="6"
							onPress={unblockUser}
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
