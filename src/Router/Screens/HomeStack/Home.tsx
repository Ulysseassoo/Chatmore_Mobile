import { RealtimeChannel } from "@supabase/supabase-js"
import React, { useEffect } from "react"
import TabsView from "../../../Components/HomeScreen/TabsView"
import useAuthStore from "../../../Store/authStore"
import useOnlineStore from "../../../Store/onlineStore"
import useRoomStore from "../../../Store/roomStore"
import { supabase } from "../../../Supabase/supabaseClient"

const Home = () => {
	const session = useAuthStore((state) => state.session)
	const setOnlineUsers = useOnlineStore((state) => state.setOnlineUsers)
	const setRoomUsers = useOnlineStore((state) => state.setTypyingUsers)
	const rooms = useRoomStore((state) => state.rooms)
	const addMessageToRoom = useRoomStore((state) => state.addMessageToRoom)
	const updateViewRoomMessages = useRoomStore((state) => state.updateViewRoomMessages)
	const isLoading = useRoomStore((state) => state.isLoading)

	const subscribeToRooms = () => {
		if (rooms.length > 0) {
			rooms.map((room) => {
				const channel = supabase.channel("room" + room.room.toString(), {
					config: {
						presence: { key: session?.user.id }
					}
				})
				channel
					.on("broadcast", { event: "message" }, (payload) => {
						console.log(payload, "message sent")
						addMessageToRoom(payload.payload.message)
					})
					.on("presence", { event: "sync" }, () => setRoomUsers({ ...channel.presenceState() }, room.room.toString()))
					// .on("broadcast", { event: "readMessages" }, (payload) => updateViewRoomMessages(payload.payload.messages, session?.user.id))
					.subscribe(async (status) => {
						if (status === "SUBSCRIBED") {
							console.log(status, "to room", room.room)
						}
					})
			})
		}
	}

	useEffect(() => {
		if (session !== null) {
			const channel = supabase.channel("online-users", {
				config: {
					presence: {
						key: session?.user.id
					}
				}
			})

			// Set online users
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

	useEffect(() => {
		if (!isLoading) {
			// Subscribe to rooms
			subscribeToRooms()
		}
	}, [isLoading])

	return <TabsView />
}

export default Home
