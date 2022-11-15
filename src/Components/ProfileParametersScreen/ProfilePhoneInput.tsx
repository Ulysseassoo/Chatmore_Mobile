import { profile } from "console"
import { Flex, Icon, Pressable, Text, useDisclose, useToast } from "native-base"
import React, { useState } from "react"
import useAuthStore from "../../Store/authStore"
import { darktheme } from "../../Theme/globalTheme"
import { MaterialIcons } from "@expo/vector-icons"
import ActionSheetInput from "./ActionSheetInput"
import { supabase } from "../../Supabase/supabaseClient"

const ProfilePhoneInput = () => {
	const profile = useAuthStore((state) => state.profile)
	const { isOpen, onOpen, onClose } = useDisclose()
	const [phoneNumber, setPhoneNumber] = useState(profile?.about)
	const setProfile = useAuthStore((state) => state.setProfile)
	const toast = useToast()

	const updateText = (text: string) => {
		setPhoneNumber(text)
	}

	const changeAbout = async () => {
		try {
			if (profile !== null) {
				const updates = {
					id: profile.id,
					phone: phoneNumber,
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
						Phone
					</Text>
					<Icon as={MaterialIcons} name="edit" size={5} color="white" />
				</Flex>
				<Text color={darktheme.textColor} fontSize="md" ellipsizeMode="tail" numberOfLines={1}>
					{profile?.phone}
				</Text>
			</Pressable>

			<ActionSheetInput
				isOpen={isOpen}
				onOpen={onOpen}
				onClose={onClose}
				onChangeText={updateText}
				defaultValue={profile?.phone}
				saveInformation={changeAbout}
			/>
		</>
	)
}

export default ProfilePhoneInput
