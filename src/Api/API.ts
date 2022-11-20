import { Message, UserHasBlocked } from "../Interface/Types";
import { supabase } from "../Supabase/supabaseClient";

export interface UserHasBlockedData {
	created_at: Date
	blocking_user_id: string | undefined
	blocked_user_id: string | undefined
}

export interface UserHasBlockedDelete {
	blocked_user_id: string | undefined 
	blocking_user_id: string | undefined
}

export const getUserRooms = async (user_id: string) => {
	try {
		const { data, error }: { data: any; error: any } = await supabase.from("userHasRoom").select("*").eq("user", user_id)
		if (error) throw error
		return data
	} catch (error) {
		console.log(error)
	}
}

export const getRoom = async (room_id: string) => {
	try {
		const { data, error } = await supabase.from("userHasRoom").select("*, user!inner(*)").eq("room", room_id)
		if (error) throw error
		return data
	} catch (error) {
		console.log(error)
	}
}

export const getRoomMessages = async (room_id: string) => {
	try {
		const { data, error } = await supabase.from("message").select("*, images!left(*)").eq("room", room_id).order("created_at", { ascending: true })
		if (error) throw error
		return data
	} catch (error) {
		console.log(error)
	}
}

export const createMessage = async (messageData :{
    created_at: string | null;
    room: number | undefined;
    user: string | undefined;
    content: string;
}) => {
	try {
		const { data, error } = await supabase.from("message").insert(messageData).select().single()
		if (error) throw error
		return data
	} catch (error: any) {
		console.log(error)
	}
}

export const deleteMessageById = async (messageID: number) => {
	try {
		const { error } = await supabase.from("message").delete().match({ id: messageID })
		if (error) throw Error
	} catch (error) {
		console.log(error)
	}
}

export const updateRoomMessages = async (messageData: Message[]) => {
	try {
		const { data, error } = await supabase.from("message").upsert(messageData).select()
		if (error) throw error
		return data
	} catch (error: any) {
		console.log(error)
	}
}

export const createUserBlock = async (userBlock: UserHasBlocked) => {
	try {
		const { data, error } = await supabase.from("userHasBlocked").insert(userBlock).select().single()
		if (error) throw error
		return data
	} catch (error: any) {
		console.log(error)
	}
}

export const deleteUserBlock = async (usersDelete: UserHasBlockedDelete) => {
	try {
		const { data, error } = await supabase.from("userHasBlocked").delete().match({
			blocking_user_id: usersDelete.blocking_user_id,
			blocked_user_id: usersDelete.blocked_user_id
		})
		if (error) throw error
		return data
	} catch (error: any) {
		console.log(error)
	}
}