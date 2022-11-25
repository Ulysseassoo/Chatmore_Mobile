import { Actionsheet, Box, Center, Flex, HStack, Icon, Image as ImageComponent, Pressable, Text, useDisclose, useToast } from "native-base"
import React, { useEffect, useMemo } from "react"
import { deleteImageById, deleteMessageById } from "../../../Api/API"
import { Message, Image } from "../../../Interface/Types"
import useAuthStore from "../../../Store/authStore"
import { darktheme } from "../../../Theme/globalTheme"
import { MaterialIcons } from "@expo/vector-icons"
import { supabase } from "../../../Supabase/supabaseClient"
import useRoomStore from "../../../Store/roomStore"

interface Props {
	item: Message & {
		images: Image[]
	}
}

export const dateFormatted = (created_at: string) => {
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

const ChatMessage = ({ item }: Props) => {
	const session = useAuthStore((state) => state.session)
	const [imageSrc, setImageSrc] = React.useState<string | ArrayBuffer | null>("")
	const { isOpen, onOpen, onClose } = useDisclose()
	const removeMessageFromRoom = useRoomStore((state) => state.removeMessageFromRoom)
	const channels = supabase.getChannels()
	const getChannelRoom = useMemo(() => {
		const channelRoom = channels.find((chan) => chan.topic.split(":")[1] === "room" + item.room.toString())
		if (channelRoom) return channelRoom
		return null
	}, [channels])
	const toast = useToast()

	useEffect(() => {
		if (item.images?.length > 0) {
			getImageSource(item.images[0].url)
		}
	}, [item.images])

	const isFromConnectedUser = useMemo(() => {
		return item.user === session?.user.id
	}, [])

	const getImageSource = async (source: string | null) => {
		if (source === null) throw Error
		try {
			const { data, error } = await supabase.storage.from("users-images").download(source)
			if (error) {
				throw error
			}
			if (data !== null) {
				const fileReaderInstance = new FileReader()
				fileReaderInstance.readAsDataURL(data)
				fileReaderInstance.onload = () => {
					const base64data = fileReaderInstance.result
					setImageSrc(base64data)
				}
			}
		} catch (error: any) {
			toast.show({
				description: error.message || "Error downloading image: ",
				color: "red.500",
				placement: "top"
			})
		}
	}

	const deleteMessage = async (id: number) => {
		try {
			if (item.images !== undefined && item.images.length > 0 && item.images[0].url !== null) {
				// Delete image + bucket
				const { error } = await supabase.storage.from("users-images").remove([item.images[0].url])
				if (error) throw error
				await deleteImageById(item.images[0].id)
			}
			await deleteMessageById(id)
			removeMessageFromRoom(item)
			if (getChannelRoom !== null) {
				getChannelRoom.send({
					type: "broadcast",

					event: "deleteMessage",

					payload: { message: item }
				})
			}
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

	const showMessageContent = () => {
		if (item?.images !== undefined && item.images.length > 0) {
			return (
				<HStack
					height="250"
					width="250"
					position="relative"
					space="4"
					alignItems="flex-end"
					justifyContent={"space-between"}
					borderRadius="md"
					flexDir="row"
					flexWrap="wrap">
					{imageSrc !== "" && imageSrc !== null && (
						<ImageComponent
							// @ts-ignore
							source={{
								uri: imageSrc
							}}
							height="250"
							width="250"
							borderRadius="md"
							alt="image"
							position="absolute"
							top="0"
							left="0"
							right="0"
						/>
					)}
					<Text color="white">{item.content}</Text>
					{item.created_at && (
						<Text color={"white"} fontSize="2xs" position="absolute" bottom="0" right="1">
							{dateFormatted(item.created_at)}
						</Text>
					)}
				</HStack>
			)
		}

		return (
			<HStack position="relative" space="4" alignItems="flex-end" justifyContent={"space-between"} flexDir="row" flexWrap="wrap">
				<Text color="white">{item.content}</Text>
				{item.created_at && (
					<Text color={"white"} fontSize="2xs">
						{dateFormatted(item.created_at)}
					</Text>
				)}
			</HStack>
		)
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
				{showMessageContent()}
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
