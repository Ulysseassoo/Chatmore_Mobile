import { Box, Center, Flex, FormControl, HStack, Icon, Input, Pressable, useToast } from "native-base"
import React from "react"
import { darktheme } from "../../../Theme/globalTheme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Controller, useForm } from "react-hook-form"
import useRoomStore from "../../../Store/roomStore"
import { RouteProps } from "./ChatConversationHeader"
import { useRoute } from "@react-navigation/core"
import { Message } from "../../../Interface/Types"
import useAuthStore from "../../../Store/authStore"
import { createMessage } from "../../../Api/API"

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

	const { handleSubmit, control, setValue } = useForm<FormData>()
	const onSubmit = async (formData: FormData) => {
		const content = formData.message
		const newMessage: CreateMessage = {
			created_at: new Date(),
			content,
			room: actualRoom?.room,
			user: session?.user.id
		}
		try {
			if (content === "") throw new Error("You need to write something :)")
			const messageD = await createMessage(newMessage)
			setValue("message", "")
		} catch (error: any) {
			toast.show({
				description: error.error_description || error.message,
				colorScheme: "danger"
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
					render={({ field: { onChange, value, onBlur }, formState: { errors } }) => (
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
							onKeyPress={(e) => console.log(e)}
							value={value}
							onBlur={onBlur}
							defaultValue={""}
							InputRightElement={
								<Pressable px="4">
									<Icon as={MaterialCommunityIcons} name="image" color="gray.500" size={6} />
								</Pressable>
							}
						/>
					)}
				/>

				<Box p="4" height="10" width="10" borderRadius={"full"} bg={darktheme.accentColor}>
					<Center height="full" width="full">
						<Pressable onPress={handleSubmit(onSubmit)}>
							<Icon as={MaterialCommunityIcons} name="send" color="white" size={6} />
						</Pressable>
					</Center>
				</Box>
			</HStack>
		</FormControl>
	)
}

export default ChatConversationBottom
