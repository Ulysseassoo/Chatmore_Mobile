import { Box, Center, Flex, HStack, Icon, Image, KeyboardAvoidingView, Pressable, Text, View, VStack } from "native-base"
import React, { useState } from "react"
import { Platform } from "react-native"
import BackgroundImage from "../../../Components/ProfileParametersScreen/BackgroundImage"
import ProfileAboutInput from "../../../Components/ProfileParametersScreen/ProfileAboutInput"
import ProfileNameInput from "../../../Components/ProfileParametersScreen/ProfileNameInput"
import ProfilePictureInput from "../../../Components/ProfileParametersScreen/ProfilePictureInput"
import useAuthStore from "../../../Store/authStore"
import { darktheme } from "../../../Theme/globalTheme"

const ProfileParametersScreen = () => {
	const profile = useAuthStore((state) => state.profile)
	return (
		<Flex height="full" bg={darktheme.profileColor} flex="1">
			<BackgroundImage />
			<Box flex="1" borderTopRadius={"3xl"} bg={darktheme.profileColor} position="relative" top="-20" p="5" zIndex={10}>
				<HStack position="relative" alignItems="flex-start" space="5">
					<ProfilePictureInput />
					<ProfileNameInput />
				</HStack>
				<ProfileAboutInput />
			</Box>
		</Flex>
	)
}

export default ProfileParametersScreen
