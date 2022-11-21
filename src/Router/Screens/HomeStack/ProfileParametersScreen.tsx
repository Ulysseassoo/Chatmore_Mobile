import { Box, Flex, HStack } from "native-base"
import React from "react"
import BackgroundImage from "../../../Components/ProfileParametersScreen/BackgroundImage"
import ProfileAboutInput from "../../../Components/ProfileParametersScreen/ProfileAboutInput"
import ProfileNameInput from "../../../Components/ProfileParametersScreen/ProfileNameInput"
import ProfilePhoneInput from "../../../Components/ProfileParametersScreen/ProfilePhoneInput"
import ProfilePictureInput from "../../../Components/ProfileParametersScreen/ProfilePictureInput"
import { darktheme } from "../../../Theme/globalTheme"

const ProfileParametersScreen = () => {
	return (
		<Flex height="full" bg={darktheme.profileColor} flex="1">
			<BackgroundImage />
			<Box flex="1" borderTopRadius={"3xl"} bg={darktheme.profileColor} position="relative" top="-20" p="5" zIndex={10}>
				<HStack position="relative" alignItems="flex-start" space="5">
					<ProfilePictureInput />
					<ProfileNameInput />
				</HStack>
				<ProfileAboutInput />
				<ProfilePhoneInput />
			</Box>
		</Flex>
	)
}

export default ProfileParametersScreen
