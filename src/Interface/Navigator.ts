import { Profile } from "./Types"

export type RootStackParamList = {
	Login: undefined
	Register: undefined
    Home: undefined
    Contacts: undefined
    ChatConversation: {
        room_id: number | undefined
    }
    Parameters: undefined
    ProfileParams: undefined
    DiscussionsParams: undefined
	ProfileUser: {
		profile: Profile
        room_id: number
	}
}