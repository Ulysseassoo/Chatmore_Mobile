import { Flex, Pressable, Text } from "native-base"
import React from "react"
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
