import { Box, Text, View } from "native-base"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { darktheme } from "../../../Theme/globalTheme"

const ChatConversationScreen = () => {
	return (
		<Box bg={darktheme.primaryColor} height="full" position="relative" safeArea>
			<Box px="4" height="full" width="full">
				<Text color="white">Hahah</Text>
			</Box>
		</Box>
	)
}

export default ChatConversationScreen
