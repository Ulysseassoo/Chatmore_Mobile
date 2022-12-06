import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { Box, Flex, HStack, Icon, Menu, Pressable, Text } from "native-base"
import React from "react"
import { darktheme } from "../../Theme/globalTheme"
import { SimpleLineIcons, AntDesign } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/core"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const HomeHeader = (props: NativeStackHeaderProps) => {
	const navigation = useNavigation()
	const insets = useSafeAreaInsets()

	return (
		<Box bg={darktheme.headerMenuColor} paddingTop={insets.top - 12} paddingBottom={3} paddingX={5}>
			<Flex justifyContent={"space-between"} alignItems="center" flexDir="row" position="relative" overflow="hidden">
				<HStack space={8} alignItems="center">
					<Text color={darktheme.textColor} fontSize="xl" fontWeight="bold">
						ChatMore
					</Text>
				</HStack>

				<HStack space="4" alignItems="center">
					<Pressable
						_pressed={{
							bg: darktheme.lineBreakColor
						}}
						p="1.5"
						borderRadius="full">
						<Icon as={AntDesign} name="search1" color={darktheme.textColor} />
					</Pressable>
					<Menu
						bg={darktheme.headerMenuColor}
						w="190"
						color="white"
						trigger={(triggerProps) => {
							return (
								<Pressable
									accessibilityLabel="More options menu"
									{...triggerProps}
									_pressed={{
										bg: darktheme.lineBreakColor
									}}
									p="1.5"
									borderRadius="full">
									<Icon as={SimpleLineIcons} name="options-vertical" color={darktheme.textColor} />
								</Pressable>
							)
						}}>
						<Menu.Item color="white" onPress={() => navigation.navigate("Parameters")}>
							<Text color="white">Parameters</Text>
						</Menu.Item>
					</Menu>
				</HStack>
			</Flex>
		</Box>
	)
}

export default HomeHeader
