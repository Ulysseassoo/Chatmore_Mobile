import { Center, Image, Text } from "native-base"
import React from "react"
import useAuthStore from "../../Store/authStore"
import { darktheme } from "../../Theme/globalTheme"

const BackgroundImage = () => {
	const profile = useAuthStore((state) => state.profile)

	if (profile?.avatar_url === undefined || profile?.avatar_url === "" || profile?.avatar_url === null) {
		return (
			<Center bg={darktheme.lineBreakColor} height="250">
				<Text color="white">You don't have any profile picture.</Text>
			</Center>
		)
	}

	return (
		<Image
			height="250"
			source={{
				uri: profile?.avatar_url
			}}
			alt="user profile avatar"
		/>
	)
}

export default BackgroundImage
