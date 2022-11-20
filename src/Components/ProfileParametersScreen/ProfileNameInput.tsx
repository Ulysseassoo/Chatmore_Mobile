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
import ActionSheetInput from "./ActionSheetInput"

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

	const updateUsername = (text: string) => {
		setUsernameText(text)
	}

	const changeUsername = async () => {
		try {
			if (profile !== null && usernameText !== undefined) {
				const updates = {
					id: profile.id,
					username: usernameText,
					updated_at: new Date().toISOString()
				}

				const { error, data } = await supabase.from("profiles").upsert(updates).select().single()
				if (error) throw error
				onClose()
				await setProfile(data)
				toast.show({
					description: "Your profile has been updated !",
					color: "green.500"
				})
			}
		} catch (error: any) {
			toast.show({
				description: error.error_description || error.message,
				color: "red.500"
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

			<ActionSheetInput
				isOpen={isOpen}
				onClose={onClose}
				onOpen={onOpen}
				defaultValue={profile?.username}
				onChangeText={updateUsername}
				saveInformation={changeUsername}
			/>
		</>
	)
}

export default ProfileNameInput
