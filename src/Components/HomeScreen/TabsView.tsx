import { Badge, Box, Center, Flex, HStack, Pressable, Text, useColorModeValue, VStack } from "native-base"
import React from "react"
import { Animated, Dimensions, StatusBar } from "react-native"
import { NavigationState, SceneMap, SceneRendererProps, TabView } from "react-native-tab-view"
import useAuthStore from "../../Store/authStore"
import useRoomStore from "../../Store/roomStore"
import { darktheme } from "../../Theme/globalTheme"
import ChatUsersList from "./ChatUsersList"
import FloaterIcon from "./FloaterIcon"

const TabsView = () => {
	const rooms = useRoomStore((state) => state.rooms)
	const session = useAuthStore((state) => state.session)

	const getRoomsNotViewed = () => {
		const roomsNotViewed = rooms.filter((room) => {
			if (room.messages.length === 0) {
				return false
			}
			const isOtherUserMessage = !!room.messages.find((dateMessage) =>
				dateMessage.messages.find((message) => {
					if (message.user !== session?.user.id) return message.view === false
				})
			)

			return isOtherUserMessage
		})

		return roomsNotViewed.length
	}

	return (
		<>
			<Box bg={darktheme.primaryColor} height="full" position="relative">
				<Flex flexDir="row" borderRadius={"full"} shadow="4" bg={darktheme.headerMenuColor} p="1" mx="4" mt="4">
					<Pressable p="1" flex="1" alignItems={"center"} borderRadius="full" bg={darktheme.lineBreakColor}>
						<HStack space="2">
							<Text color="white">Chats</Text>
							{getRoomsNotViewed() !== 0 && (
								<Badge
									rounded="full"
									zIndex={1}
									variant="solid"
									alignSelf="flex-end"
									bg={darktheme.accentColor}
									_text={{
										fontSize: 10
									}}>
									{getRoomsNotViewed()}
								</Badge>
							)}
						</HStack>
					</Pressable>
					<Pressable p="1" flex="1" alignItems={"center"}>
						<HStack alignItems={"center"} space="2">
							<Text color="white">Groups</Text>
							<Text fontSize={"2xs"} color={darktheme.lineBreakColor}>
								(Coming soon)
							</Text>
						</HStack>
					</Pressable>
				</Flex>
				<ChatUsersList />
				<FloaterIcon />
			</Box>
		</>
	)
}

export default TabsView
