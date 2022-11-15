import { profile } from "console"
import { Actionsheet, VStack, FormControl, Input, Flex, HStack, Text, KeyboardAvoidingView, Pressable } from "native-base"
import React, { useEffect, useRef } from "react"
import { darktheme } from "../../Theme/globalTheme"
import { Dimensions, TextInput } from "react-native"

interface Props {
	isOpen: boolean
	onClose: () => void
	onOpen: () => void
	defaultValue: string | undefined
	onChangeText: (text: string) => void
	saveInformation: () => void
}

const ActionSheetInput = ({ isOpen, onClose, onOpen, onChangeText, defaultValue, saveInformation }: Props) => {
	const w = Dimensions.get("screen").width
	const ref = useRef<null | TextInput>(null)

	useEffect(() => {
		if (isOpen && ref.current !== null) {
			ref.current.focus()
		}
	}, [isOpen])

	return (
		<Actionsheet isOpen={isOpen} onClose={onClose} flex="1" display="flex">
			<KeyboardAvoidingView behavior="position">
				<Actionsheet.Content bg={darktheme.headerMenuColor}>
					<Actionsheet.Item
						bg={darktheme.headerMenuColor}
						_pressed={{
							bg: darktheme.headerMenuColor
						}}
						width={w}>
						<VStack space="2">
							<FormControl width={w}>
								<FormControl.Label>
									<Text color="white" fontSize={"md"} fontWeight="bold">
										Enter your about status
									</Text>
								</FormControl.Label>
								<Input
									w={w - 30}
									ref={ref}
									borderBottomColor={darktheme.accentColor}
									fontSize="sm"
									color="white"
									placeholder=""
									autoFocus={true}
									defaultValue={defaultValue}
									variant="underlined"
									selectionColor={darktheme.accentColor}
									selectTextOnFocus
									onChangeText={(text) => onChangeText(text)}
								/>
							</FormControl>
							<Flex width={w - 30} alignItems="flex-end">
								<HStack space="3">
									<Pressable
										onPress={onClose}
										_pressed={{
											bg: darktheme.lineBreakColor
										}}>
										<Text color={darktheme.textColor} py="2" px="3" textTransform={"uppercase"}>
											Cancel
										</Text>
									</Pressable>

									<Pressable
										onPress={saveInformation}
										_pressed={{
											bg: darktheme.lineBreakColor
										}}>
										<Text color={darktheme.textColor} py="2" px="3" textTransform={"uppercase"}>
											Save
										</Text>
									</Pressable>
								</HStack>
							</Flex>
						</VStack>
					</Actionsheet.Item>
				</Actionsheet.Content>
			</KeyboardAvoidingView>
		</Actionsheet>
	)
}

export default ActionSheetInput
