import { useNavigation } from "@react-navigation/core"
import { Box, Center, Flex, Image, Text, View } from "native-base"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import LoginForm from "../../../Components/LoginScreen/LoginForm"
import { darktheme } from "../../../Theme/globalTheme"

const LoginScreen = () => {
	const Logo = require("../../../../assets/Logo.png")
	const navigation = useNavigation()
	return (
		<SafeAreaView>
			<Flex bg={darktheme.primaryColor} height="full" width="full">
				<Center p="6">
					<Image source={Logo} height="100" width="100" alt="logo" />
				</Center>

				<LoginForm />

				<Center flex="1" alignItems={"center"} justifyContent="center">
					<Text color="white">
						Don't have an account ?{" "}
						<Text
							fontWeight={"bold"}
							textDecoration={"underline"}
							onPress={() => {
								navigation.navigate("Register")
							}}>
							Sign Up
						</Text>
					</Text>
				</Center>
			</Flex>
		</SafeAreaView>
	)
}

export default LoginScreen
