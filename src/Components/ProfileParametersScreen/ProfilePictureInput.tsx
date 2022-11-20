import { Actionsheet, Box, Center, Icon, Image, Pressable, Spinner, Text, useDisclose, useToast } from "native-base"
import React, { useState } from "react"
import useAuthStore from "../../Store/authStore"
import { darktheme } from "../../Theme/globalTheme"
import { MaterialIcons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { supabase } from "../../Supabase/supabaseClient"
import { decode } from "base64-arraybuffer"

const ProfilePictureInput = () => {
	const profile = useAuthStore((state) => state.profile)
	const setProfile = useAuthStore((state) => state.setProfile)
	const { isOpen, onOpen, onClose } = useDisclose()
	const [isLoadingPicture, setIsLoadingPicture] = useState(false)
	const toast = useToast()

	const changeImage = async (image: ImagePicker.ImageInfo) => {
		const file = image
		const fileExt = file.uri.split(".").pop()
		const fileName = `${Math.random()}.${fileExt}`
		const filePath = `${fileName}`
		try {
			let { error: uploadError, data: imageData } = await supabase.storage.from("avatars").upload(filePath, decode(file.base64!), {
				contentType: `image/${fileExt}`
			})

			if (uploadError) {
				throw uploadError
			}

			const avatar_url = imageData?.path
			if (avatar_url !== undefined && profile !== null) {
				const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(avatar_url)
				const updates = {
					id: profile.id,
					avatar_url: urlData.publicUrl,
					updated_at: new Date().toISOString(),
					username: profile.username
				}
				// Get updated profile back
				let { error: newError, data: newData } = await supabase.from("profiles").upsert(updates).select().single()
				if (newError) throw Error
				if (newData !== null) {
					await setProfile(newData)
					setIsLoadingPicture(false)
					toast.show({
						description: "Your profile picture has been updated !",
						colorScheme: "success"
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
			setIsLoadingPicture(true)
			changeImage(result)
			onClose()
		} else {
			toast.show({
				description: "You did not select any image.",
				color: "red.500"
			})
		}
	}

	const profileImage = () => {
		if (profile?.avatar_url === undefined || profile?.avatar_url === "" || profile?.avatar_url === null) {
			return (
				<Box bg={darktheme.lineBreakColor} boxSize={"100"} borderRadius="full">
					{/* <Text color="white">You don't have any profile picture.</Text> */}
				</Box>
			)
		}

		return (
			<Image
				source={{
					uri: profile.avatar_url
				}}
				alt="profile input picture"
				boxSize={"100"}
			/>
		)
	}

	return (
		<>
			<Box borderRadius="full" borderColor={"white"} borderWidth="2" position="relative" top="-35" shadow="4" overflow={"hidden"}>
				<Pressable onPress={onOpen}>
					{profileImage()}
					<Box bg="rgba(0, 0, 0, 0.322)" height="full" width="full" zIndex={1} position="absolute" top="0" left="0" right="0">
						<Center height="full" width="full">
							{isLoadingPicture ? (
								<Spinner color={darktheme.accentColor} size="lg" />
							) : (
								<Icon as={MaterialIcons} name="photo-camera" size={12} opacity="0.9" color={"white"} />
							)}
						</Center>
					</Box>
				</Pressable>
			</Box>

			<Actionsheet isOpen={isOpen} onClose={onClose}>
				<Actionsheet.Content bg={darktheme.headerMenuColor}>
					<Actionsheet.Item
						onPress={pickImageAsync}
						bg={darktheme.headerMenuColor}
						startIcon={<Icon as={MaterialIcons} size="6" name="photo-library" />}>
						<Text color="white">Gallery</Text>
					</Actionsheet.Item>
				</Actionsheet.Content>
			</Actionsheet>
		</>
	)
}

export default ProfilePictureInput
