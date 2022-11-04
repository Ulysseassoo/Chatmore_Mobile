import React, { useEffect } from "react"
import TabsView from "../../../Components/HomeScreen/TabsView"
import useAuthStore from "../../../Store/authStore"
import useOnlineStore from "../../../Store/onlineStore"
import { supabase } from "../../../Supabase/supabaseClient"

const Home = () => {
	const session = useAuthStore((state) => state.session)
	const setOnlineUsers = useOnlineStore((state) => state.setOnlineUsers)

	useEffect(() => {
		if (session !== null) {
			const channel = supabase.channel("online-users", {
				config: {
					presence: {
						key: session?.user.id
					}
				}
			})

			channel.on("presence", { event: "sync" }, () => {
				setOnlineUsers({ ...channel.presenceState() })
			})

			channel.subscribe(async (status) => {
				if (status === "SUBSCRIBED") {
					await channel.track({ online_at: new Date().toISOString() })
				}
			})
		}
	}, [session])

	return <TabsView />
}

export default Home
