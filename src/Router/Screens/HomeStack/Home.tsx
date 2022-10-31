import React, { useEffect } from "react"
import TabsView from "../../../Components/HomeScreen/TabsView"
import useAuthStore from "../../../Store/authStore"
import useRoomStore from "../../../Store/roomStore"

const Home = () => {
	const getChatrooms = useRoomStore((state) => state.getChatrooms)
	const isLoading = useRoomStore((state) => state.isLoading)
	const session = useAuthStore((state) => state.session)

	// useEffect(() => {
	// 	if (session?.user !== undefined && !isLoading) {
	// 		getChatrooms(session.user)
	// 	}
	// }, [isLoading, session])

	return <TabsView />
}

export default Home
