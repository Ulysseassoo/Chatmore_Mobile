import { Box, Center, Flex, HStack, Image, Text, View, VStack } from "native-base"
import React, { useState } from "react"
import BackgroundImage from "../../../Components/ProfileParametersScreen/BackgroundImage"
import ProfilePictureInput from "../../../Components/ProfileParametersScreen/ProfilePictureInput"
import useAuthStore from "../../../Store/authStore"
import { darktheme } from "../../../Theme/globalTheme"

const ProfileParametersScreen = () => {
	const profile = useAuthStore((state) => state.profile)
	return (
		<Flex height="full" bg={darktheme.profileColor}>
			<BackgroundImage />
			<Box flex="1" borderTopRadius={"3xl"} bg={darktheme.profileColor} position="relative" top="-20" p="5" zIndex={10}>
				<HStack position="relative" alignItems="flex-start" space="5">
					<ProfilePictureInput />
					<VStack>
						<Text color="white" fontWeight={"bold"} fontSize="lg">
							{profile?.username}
						</Text>
						<Text color={darktheme.textColor} fontSize="sm">
							Online
						</Text>
					</VStack>
				</HStack>
			</Box>
		</Flex>
	)
}

export default ProfileParametersScreen
