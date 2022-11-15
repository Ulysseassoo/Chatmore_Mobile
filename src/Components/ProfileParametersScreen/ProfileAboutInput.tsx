import {
	Actionsheet,
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
	VStack
} from "native-base"
import React, { useRef, useState } from "react"
import { darktheme } from "../../Theme/globalTheme"
import { MaterialIcons } from "@expo/vector-icons"
import useAuthStore from "../../Store/authStore"
import { TextInput } from "react-native"
import ActionSheetInput from "./ActionSheetInput"
import { supabase } from "../../Supabase/supabaseClient"

const ProfileAboutInput = () => {
	const profile = useAuthStore((state) => state.profile)
	const { isOpen, onOpen, onClose } = useDisclose()
	const [aboutText, setAboutText] = useState(profile?.about)
	const setProfile = useAuthStore((state) => state.setProfile)
	const toast = useToast()

	const updateText = (text: string) => {
		setAboutText(text)
	}

	const changeAbout = async () => {
		try {
			if (profile !== null) {
				const updates = {
					id: profile.id,
					about: aboutText,
					updated_at: new Date()
				}

				const { error, data } = await supabase.from("profiles").upsert(updates).select().single()
				if (error) throw error
				onClose()
				await setProfile(data)
				toast.show({
					description: "Your profile has been updated !",
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
			<Pressable
				p="2"
				borderRadius={"xl"}
				_pressed={{
					bg: darktheme.headerMenuColor
				}}
				onPress={onOpen}>
				<Flex justifyContent={"space-between"} flexDir="row">
					<Text fontSize={"lg"} fontWeight="bold" color="white">
						About
					</Text>
					<Icon as={MaterialIcons} name="edit" size={5} color="white" />
				</Flex>
				<Text color={darktheme.textColor} fontSize="md" ellipsizeMode="tail" numberOfLines={3}>
					{profile?.about}
				</Text>
			</Pressable>

			<ActionSheetInput
				isOpen={isOpen}
				onOpen={onOpen}
				onClose={onClose}
				onChangeText={updateText}
				defaultValue={profile?.about}
				saveInformation={changeAbout}
			/>
		</>
	)
}

export default ProfileAboutInput
