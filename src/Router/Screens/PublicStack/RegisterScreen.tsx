import { useNavigation } from "@react-navigation/core"
import { Center, Flex, Text, View, Image } from "native-base"
import React from "react"
import { SafeAreaView } from "react-native"
import LoginForm from "../../../Components/LoginScreen/LoginForm"
import RegisterForm from "../../../Components/RegisterScreen/RegisterForm"
import { darktheme } from "../../../Theme/globalTheme"

const RegisterScreen = () => {
	const Logo = require("../../../../assets/Logo.png")
	const navigation = useNavigation()

	return (
		<SafeAreaView>
			<Flex bg={darktheme.primaryColor} height="full" width="full">
				<Center p="6">
					<Image source={Logo} height="100" width="100" alt="logo" />
				</Center>

				<RegisterForm />

				<Center flex="1" alignItems={"center"} justifyContent="center">
					<Text color="white">
						You already have an account ?{" "}
						<Text
							fontWeight={"bold"}
							textDecoration={"underline"}
							onPress={() => {
								navigation.navigate("Login")
							}}>
							Sign In
						</Text>
					</Text>
				</Center>
			</Flex>
		</SafeAreaView>
	)
}

export default RegisterScreen
