import { Box, Text, View } from "native-base"
import React from "react"
import HeaderTabs from "../../../Components/HomeScreen/HeaderTabs"
import { darktheme } from "../../../Theme/globalTheme"

const Home = () => {
	return (
		<>
			<HeaderTabs />
			<Box bg={darktheme.primaryColor} height="full"></Box>
		</>
	)
}

export default Home
