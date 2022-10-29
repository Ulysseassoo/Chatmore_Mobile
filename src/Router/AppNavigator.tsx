import { NavigationContainer } from "@react-navigation/native"
import React from "react"
import useAuthStore from "../Store/authStore"
import HomeStackScreens from "./Stacks/HomeStackScreens"
import PublicStackScreens from "./Stacks/PublicStackScreens"

const AppNavigator = () => {
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

	const actualScreen = isLoggedIn ? <HomeStackScreens /> : <PublicStackScreens />

	return <NavigationContainer>{actualScreen}</NavigationContainer>
}

export default AppNavigator
