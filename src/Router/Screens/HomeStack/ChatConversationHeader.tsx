import { Avatar, Box, Flex, HStack, Icon, Text } from "native-base"
import React from "react"
import { Pressable } from "react-native"
import { darktheme } from "../../../Theme/globalTheme"
import { SimpleLineIcons, AntDesign } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import useRoomStore from "../../../Store/roomStore"
import { ParamListBase, useNavigation, useRoute } from "@react-navigation/core"
import { RootStackParamList } from "../../../Interface/Navigator"

interface Params {
	room_id: number
}

interface RouteProps {
	key: string
	name: string
	path?: string
	params: Params
}

const ChatConversationHeader = () => {
	const navigation = useNavigation()
	const route = useRoute<RouteProps>()
	const insets = useSafeAreaInsets()
	const rooms = useRoomStore((state) => state.rooms)
	const actualRoom = rooms.find((roomState) => roomState.room === route.params?.room_id)
	const userToChat = actualRoom?.users[0]

	if (!actualRoom) return <></>

	return (
		<Box bg={darktheme.headerMenuColor} paddingTop={insets.top - 14} paddingBottom={3} paddingX={4}>
			<Flex justifyContent={"space-between"} alignItems="center" flexDir="row" position="relative" overflow="hidden">
				<HStack space={2} alignItems="center">
					<Pressable onPress={navigation.goBack}>
						<Icon as={AntDesign} name="arrowleft" color="white" size={6} />
					</Pressable>
					<HStack alignItems={"center"} space="4">
						<Avatar
							source={{
								uri: userToChat?.avatar_url
							}}
							size={"sm"}>
							{userToChat?.username && userToChat?.username[0].toUpperCase() + userToChat?.username[1].toUpperCase()}
						</Avatar>
						<Text color="white" fontSize="lg" fontWeight="bold">
							{userToChat?.username}
						</Text>
					</HStack>
				</HStack>

				<HStack space="4" alignItems="center">
					<Pressable>
						<Icon as={SimpleLineIcons} name="options-vertical" color={"white"} />
					</Pressable>
				</HStack>
			</Flex>
		</Box>
	)
}

export default ChatConversationHeader
