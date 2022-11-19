import React from "react"
import useAuthStore from "../Store/authStore"

const useIsUserBlocked = (user_id: string | undefined) => {
	const blockedUsers = useAuthStore((state) => state.blockedUsers)
	const isUserBlocked = !!blockedUsers?.find((user) => user.blocked_user_id === user_id)
	return isUserBlocked
}

export default useIsUserBlocked
