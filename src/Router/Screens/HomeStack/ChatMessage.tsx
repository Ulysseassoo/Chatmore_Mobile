import { Actionsheet, Box, Center, Flex, HStack, Icon, Pressable, Text, useDisclose, useToast } from "native-base"
import React, { useMemo } from "react"
import { deleteMessageById } from "../../../Api/API"
import { Message } from "../../../Interface/Types"
import useAuthStore from "../../../Store/authStore"
import { darktheme } from "../../../Theme/globalTheme"
import { MaterialIcons } from "@expo/vector-icons"

interface Props {
	item: Message
}

const ChatMessage = ({ item }: Props) => {
	const session = useAuthStore((state) => state.session)
	const { isOpen, onOpen, onClose } = useDisclose()
	const toast = useToast()

	const isFromConnectedUser = useMemo(() => {
		return item.user === session?.user.id
	}, [])

	const dateFormatted = (created_at: string) => {
		const splittedDate = new Date(created_at)
			.toLocaleTimeString([], {
				hourCycle: "h23",
				hour: "2-digit",
				minute: "2-digit",
				second: "numeric"
			})
			.split(":")

		return `${splittedDate[0]}:${splittedDate[1]}`
	}

	const deleteMessage = async (id: number) => {
		try {
			const message = await deleteMessageById(id)
			console.log(message)
			toast.show({
				description: "Message deleted !",
				colorScheme: "green"
			})
			onClose()
		} catch (error: any) {
			toast.show({
				description: error.error_description || error.message,
				colorScheme: "danger"
			})
		}
	}

	return (
		<>
			<Pressable
				p="2"
				bg={isFromConnectedUser ? darktheme.accentColor : darktheme.headerMenuColor}
				borderRadius="md"
				mb="2.5"
				shadow="6"
				maxW="80"
				_pressed={{
					bg: isFromConnectedUser ? darktheme.accentColorHover : darktheme.headerMenuColor
				}}
				onLongPress={() => {
					if (isFromConnectedUser) {
						onOpen()
					}
				}}
				alignSelf={isFromConnectedUser ? "flex-end" : "flex-start"}>
				<HStack space="4" alignItems="flex-end" justifyContent={"space-between"} flexDir="row" flexWrap="wrap">
					<Text color="white">{item.content}</Text>
					{item.created_at && (
						<Text color={"white"} fontSize="2xs">
							{dateFormatted(item.created_at)}
						</Text>
					)}
				</HStack>
			</Pressable>

			<Actionsheet isOpen={isOpen} onClose={onClose}>
				<Actionsheet.Content>
					<Actionsheet.Item onPress={() => deleteMessage(item.id)} startIcon={<Icon as={MaterialIcons} size="6" name="delete" />}>
						Delete
					</Actionsheet.Item>
				</Actionsheet.Content>
			</Actionsheet>
		</>
	)
}

export default ChatMessage
