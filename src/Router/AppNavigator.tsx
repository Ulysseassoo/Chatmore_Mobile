import { NavigationContainer } from "@react-navigation/native"
import React from "react"
import HomeStackScreens from "./Stacks/HomeStackScreens"
import PublicStackScreens from "./Stacks/PublicStackScreens"

const AppNavigator = () => {
	const loggedIn = false

	const actualScreen = loggedIn ? <HomeStackScreens /> : <PublicStackScreens />

	return <NavigationContainer>{actualScreen}</NavigationContainer>
}

export default AppNavigator
