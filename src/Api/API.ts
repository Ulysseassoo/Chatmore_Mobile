import { Message } from "../Interface/Types";
import { CreateMessage } from "../Router/Screens/HomeStack/ChatConversationBottom";
import { supabase } from "../Supabase/supabaseClient";

export const getUserRooms = async (user_id: string) => {
	try {
		const { data, error }: { data: any; error: any } = await supabase.from("userHasRoom").select("*").eq("user", user_id)
		if (error) throw error
		return data
	} catch (error) {
		return error
	}
}

export const getRoom = async (room_id: string) => {
	try {
		const { data, error } = await supabase.from("userHasRoom").select("*, user!inner(*)").eq("room", room_id)
		if (error) throw error
		return data
	} catch (error) {
		return error
	}
}

export const getRoomMessages = async (room_id: string) => {
	try {
		const { data, error } = await supabase.from("message").select("*, images!left(*)").eq("room", room_id).order("created_at", { ascending: false })
		if (error) throw error
		return data
	} catch (error) {
		return error
	}
}

export const createMessage = async (messageData: CreateMessage) => {
	try {
		const { data, error } = await supabase.from("message").insert(messageData).select().single()
		if (error) throw error
		return data
	} catch (error: any) {
		return error
	}
}

export const deleteMessageById = async (messageID: number) => {
	try {
		const { error } = await supabase.from("message").delete().match({ id: messageID })
		if (error) throw Error
	} catch (error) {
		return error
	}
}

export const updateRoomMessages = async (messageData: Message[]) => {
	try {
		console.log("messageData", messageData)
		const { data, error } = await supabase.from("message").upsert(messageData).select()
		if (error) throw error
		console.log("data", data)
		return data
	} catch (error: any) {
		return error
	}
}