import { Badge, Flex, HStack, Pressable, Text, VStack } from "native-base"
import React from "react"
import useAuthStore from "../../Store/authStore"
import useRoomStore from "../../Store/roomStore"
import { darktheme } from "../../Theme/globalTheme"

interface Props {
	index: number
	title: string
	key: string
	activeIndex: number
	setIndex: React.Dispatch<React.SetStateAction<number>>
}

const Tab = ({ index, title, key, setIndex, activeIndex }: Props) => {
	const isActive = index === activeIndex
	const isDisc = index === 0
	const rooms = useRoomStore((state) => state.rooms)
	const session = useAuthStore((state) => state.session)

	const getRoomsNotViewed = () => {
		const roomsNotViewed = rooms.filter((room) => {
			if (room.messages.length === 0) {
				return false
			}
			const isOtherUserMessage = !!room.messages.find((message) => {
				if (message.user !== session?.user) return message.view === false
			})
			if (isOtherUserMessage) {
				return true
			}
			return false
		})
		return roomsNotViewed.length
	}

	if (isDisc) {
		return (
			<Flex flex="1" alignItems={"center"} p="3">
				<Pressable onPress={() => setIndex(index)}>
					<HStack space="1.5" alignItems="center">
						<Text color={isActive ? darktheme.accentColor : "white"} fontWeight={"bold"} textTransform="uppercase">
							{title}
						</Text>

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
			</Flex>
		)
	}

	return (
		<Flex flex="1" alignItems={"center"} p="3">
			<Pressable onPress={() => setIndex(index)}>
				<Text color={isActive ? darktheme.accentColor : "white"} fontWeight={"bold"} textTransform="uppercase">
					{title}
				</Text>
			</Pressable>
		</Flex>
	)
}

export default Tab
