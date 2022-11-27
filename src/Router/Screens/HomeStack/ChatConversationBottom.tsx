import { Center, FormControl, HStack, Icon, Input, Pressable, useToast } from "native-base"
import React, { useMemo } from "react"
import { darktheme } from "../../../Theme/globalTheme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Controller, useForm } from "react-hook-form"
import useRoomStore from "../../../Store/roomStore"
import { RouteProps } from "./ChatConversationHeader"
import { useRoute } from "@react-navigation/core"
import useAuthStore from "../../../Store/authStore"
import { createImageMessage, createMessage } from "../../../Api/API"
import { supabase } from "../../../Supabase/supabaseClient"
import useIsUserBlocked from "../../../Hooks/useIsUserBlocked"
import * as ImagePicker from "expo-image-picker"
import { decode } from "base64-arraybuffer"

interface FormData {
	message: string
}

export interface CreateMessage {
	created_at: Date
	content: string
	room: number | undefined
	user: string | undefined
}

const ChatConversationBottom = () => {
	const route = useRoute<RouteProps>()
	const toast = useToast()
	const rooms = useRoomStore((state) => state.rooms)
	const session = useAuthStore((state) => state.session)
	const actualRoom = rooms.find((roomState) => roomState.room === route.params?.room_id)
	const channels = supabase.getChannels()
	const addMessageToRoom = useRoomStore((state) => state.addMessageToRoom)
	const isUserBlocked = useIsUserBlocked(actualRoom?.room)
	const getChannelRoom = useMemo(() => {
		const channelRoom = channels.find((chan) => chan.topic.split(":")[1] === "room" + actualRoom?.room.toString()!)
		if (channelRoom) return channelRoom
		return null
	}, [channels])

	const { handleSubmit, control, setValue } = useForm<FormData>()
	const onSubmit = async (formData: FormData) => {
		const content = formData.message
		const newMessage = {
			created_at: new Date().toISOString(),
			content,
			room: actualRoom?.room,
			user: session?.user.id,
			isBlocked: isUserBlocked.isRoomBlocked
		}
		try {
			if (content === "") throw new Error("You need to write something :)")
			const message = await createMessage(newMessage)
			addMessageToRoom(message)
			if (getChannelRoom !== null && !!message?.isBlocked === false) {
				getChannelRoom.send({
					type: "broadcast",

					event: "message",

					payload: { message }
				})
			}
			setValue("message", "")
			if (getChannelRoom !== null) {
				getChannelRoom.untrack()
			}
		} catch (error: any) {
			toast.show({
				description: error.error_description || error.message,
				colorScheme: "danger"
			})
		}
	}

	const sendImage = async (image: ImagePicker.ImageInfo) => {
		const file = image
		const fileExt = file.uri.split(".").pop()
		const fileName = `${Math.random()}.${fileExt}`
		const filePath = `${fileName}`

		const newMessage = {
			created_at: new Date().toISOString(),
			content: "",
			room: route.params.room_id,
			user: session?.user.id
		}

		try {
			if (fileExt !== ("png" && "jpeg")) throw Error("You need to upload a correct image(PNG, JPEG)!")
			let { error: uploadError, data: imageData } = await supabase.storage.from("users-images").upload(filePath, decode(file.base64!), {
				contentType: `image/${fileExt}`
			})

			if (uploadError) {
				throw uploadError
			}

			const message = await createMessage(newMessage)
			if (message !== undefined) {
				const imageUrl = imageData?.path
				const newImage = {
					created_at: new Date().toISOString(),
					message_id: message.id,
					message_room_id: route.params.room_id,
					message_user_id: session?.user.id,
					url: imageUrl!
				}
				const image = await createImageMessage(newImage)
				const newMessage = {
					...message,
					images: [image]
				}
				addMessageToRoom(newMessage)
				if (getChannelRoom !== null) {
					getChannelRoom.send({
						type: "broadcast",

						event: "message",

						payload: {
							message: newMessage
						}
					})
				}
			}
		} catch (error: any) {
			toast.show({
				description: error.error_description || error.message,
				colorScheme: "danger"
			})
		}
	}

	// Get image from user gallery
	const pickImageAsync = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			quality: 1,
			base64: true
		})

		if (!result.cancelled) {
			sendImage(result)
		} else {
			toast.show({
				description: "You did not select any image.",
				color: "red.500"
			})
		}
	}

	return (
		<FormControl>
			<HStack width="full" height="10" borderRadius="full" position="relative" flexDir={"row"} space="2">
				<Controller
					control={control}
					name="message"
					rules={{
						required: {
							value: true,
							message: "This field is required"
						}
					}}
					render={({ field: { onChange, value, onBlur }, formState: { errors } }) => {
						const blur = () => {
							onBlur()
							if (getChannelRoom !== null) {
								// Untrack presence when typying
								getChannelRoom.untrack()
							}
						}

						return (
							<Input
								variant="unstyled"
								flex="1"
								py="1"
								px="4"
								bg={darktheme.headerMenuColor}
								borderColor={darktheme.secondaryColor}
								shadow="3"
								color="white"
								borderRadius="full"
								placeholder="Message"
								fontSize={"md"}
								onChangeText={onChange}
								onKeyPress={() => {
									if (getChannelRoom !== null && actualRoom !== undefined && !isUserBlocked.isRoomBlocked) {
										getChannelRoom.track({ isTyping: Date.now(), room: actualRoom.room })
									}
								}}
								value={value}
								onBlur={blur}
								defaultValue={""}
								InputRightElement={
									<Pressable
										px="2"
										py="2"
										borderRadius={"full"}
										onPress={pickImageAsync}
										_pressed={{
											bg: darktheme.lineBreakColor
										}}>
										<Icon as={MaterialCommunityIcons} name="image" color="gray.500" size={6} />
									</Pressable>
								}
							/>
						)
					}}
				/>

				<Pressable p="4" height="10" width="10" borderRadius={"full"} bg={darktheme.accentColor}>
					<Center height="full" width="full">
						<Pressable onPress={handleSubmit(onSubmit)}>
							<Icon as={MaterialCommunityIcons} name="send" color="white" size={6} />
						</Pressable>
					</Center>
				</Pressable>
			</HStack>
		</FormControl>
	)
}

export default ChatConversationBottom
