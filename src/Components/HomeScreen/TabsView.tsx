import { Box, Center, Flex, HStack, Pressable, Text, useColorModeValue } from "native-base"
import React from "react"
import { Animated, Dimensions, StatusBar } from "react-native"
import { NavigationState, SceneMap, SceneRendererProps, TabView } from "react-native-tab-view"
import { darktheme } from "../../Theme/globalTheme"
import ChatUsersList from "./ChatUsersList"
import FloaterIcon from "./FloaterIcon"
import Tab from "./Tab"

const routes = [
	{
		index: 0,
		key: "first",
		title: "Disc."
	},
	{
		index: 1,
		key: "second",
		title: "Statut"
	},
	{
		index: 2,
		key: "third",
		title: "Appels"
	}
]

const TabsView = () => {
	const [index, setIndex] = React.useState(0)

	return (
		<>
			<Box bg={darktheme.headerMenuColor}>
				<HStack space="4" position="relative">
					{routes.map((item) => (
						<Tab {...item} setIndex={setIndex} activeIndex={index} key={item.key} />
					))}
				</HStack>
			</Box>

			<Box bg={darktheme.primaryColor} height="full" position="relative">
				{index === 0 && <ChatUsersList />}
				<FloaterIcon />
			</Box>
		</>
	)
}

export default TabsView
