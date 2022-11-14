import {
	Actionsheet,
	Box,
	Flex,
	FormControl,
	HStack,
	Icon,
	Input,
	KeyboardAvoidingView,
	Pressable,
	Text,
	useDisclose,
	useToast,
	VStack,
	WarningOutlineIcon
} from "native-base"
import React, { useEffect, useRef, useState } from "react"
import useAuthStore from "../../Store/authStore"
import { darktheme } from "../../Theme/globalTheme"
import { MaterialIcons } from "@expo/vector-icons"
import { Dimensions, TextInput } from "react-native"
import { supabase } from "../../Supabase/supabaseClient"

const ProfileNameInput = () => {
	const profile = useAuthStore((state) => state.profile)
	const setProfile = useAuthStore((state) => state.setProfile)
	const [usernameText, setUsernameText] = useState(profile?.username)
	const { isOpen, onOpen, onClose } = useDisclose()
	const w = Dimensions.get("screen").width
	const usernameRef = useRef<null | TextInput>(null)
	const toast = useToast()

	useEffect(() => {
		if (isOpen && usernameRef.current !== null) {
			usernameRef.current.focus()
		}
	}, [isOpen])

	const changeUsername = async () => {
		try {
			if (profile !== null) {
				const updates = {
					id: profile.id,
					username: usernameText,
					updated_at: new Date()
				}

				const { error, data } = await supabase.from("profiles").upsert(updates).select().single()
				if (error) throw error
				onClose()
				await setProfile(data)
				toast.show({
					description: "Your profile picture has been updated !",
					colorScheme: "success"
				})
			}
		} catch (error: any) {
			toast.show({
				description: error.error_description || error.message,
				colorScheme: "danger"
			})
		}
	}

	return (
		<>
			<Pressable onPress={onOpen} width={w - 160}>
				<VStack>
					<HStack space="4" alignItems="center">
						<Text color="white" fontWeight={"bold"} fontSize="lg">
							{profile?.username}
						</Text>
						<Icon as={MaterialIcons} name="edit" size={5} color="white" />
					</HStack>
					<Text color={darktheme.textColor} fontSize="sm">
						Online
					</Text>
				</VStack>
			</Pressable>

			<Actionsheet isOpen={isOpen} onClose={onClose} flex="1" display="flex">
				<KeyboardAvoidingView behavior="position">
					<Actionsheet.Content bg={darktheme.headerMenuColor}>
						<Actionsheet.Item
							bg={darktheme.headerMenuColor}
							_pressed={{
								bg: darktheme.headerMenuColor
							}}
							width={w}>
							<VStack space="2">
								<FormControl width={w}>
									<FormControl.Label>
										<Text color="white" fontSize={"md"} fontWeight="bold">
											Enter your username
										</Text>
									</FormControl.Label>
									<Input
										w={w - 30}
										ref={usernameRef}
										borderBottomColor={darktheme.accentColor}
										fontSize="sm"
										color="white"
										placeholder=""
										autoFocus={true}
										defaultValue={profile?.username}
										variant="underlined"
										selectionColor={darktheme.accentColor}
										selectTextOnFocus
										onChangeText={(text) => setUsernameText(text)}
									/>
								</FormControl>
								<Flex width={w - 30} alignItems="flex-end">
									<HStack space="3">
										<Pressable
											onPress={onClose}
											_pressed={{
												bg: darktheme.lineBreakColor
											}}>
											<Text color={darktheme.textColor} py="2" px="3" textTransform={"uppercase"}>
												Cancel
											</Text>
										</Pressable>

										<Pressable
											onPress={changeUsername}
											_pressed={{
												bg: darktheme.lineBreakColor
											}}>
											<Text color={darktheme.textColor} py="2" px="3" textTransform={"uppercase"}>
												Save
											</Text>
										</Pressable>
									</HStack>
								</Flex>
							</VStack>
						</Actionsheet.Item>
					</Actionsheet.Content>
				</KeyboardAvoidingView>
			</Actionsheet>
		</>
	)
}

export default ProfileNameInput
