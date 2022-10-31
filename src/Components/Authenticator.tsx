import React, { useEffect } from "react"
import useAuthStore from "../Store/authStore"
import { supabase } from "../Supabase/supabaseClient"

interface Props {
	children?: React.ReactNode
}

const Authenticator = ({ children }: Props) => {
	const setLoggedIn = useAuthStore((state) => state.setLoggedIn)
	const session = useAuthStore((state) => state.session)
	const setLoggedOut = useAuthStore((state) => state.setLoggedOut)

	const checkSession = async () => {
		const sessionSupabase = await supabase.auth.getSession()

		if (sessionSupabase.data.session !== null) {
			setLoggedIn(sessionSupabase.data.session)
		}
	}

	useEffect(() => {
		checkSession()

		const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
			// Check active session and set user informations
			// if (session !== null) {
			// 	if (session.user !== null) {
			// 		getAllUserInformations(session.user)
			// 	}
			// }
			if (session !== null) {
				setLoggedIn(session)
			}

			switch (event) {
				case "SIGNED_IN":
					// Update the user data if user connects is active
					if (session !== null) {
						setLoggedIn(session)
					}
					break
				case "SIGNED_OUT":
					setLoggedOut()
					break
				default:
					break
			}
		})
	}, [])

	return <>{children}</>
}

export default Authenticator
