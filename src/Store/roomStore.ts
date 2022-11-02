import create from 'zustand'
import { SessionState } from "../Interface/StoreState"
import { immer } from "zustand/middleware/immer";
import { Session, User } from "@supabase/supabase-js";
import { Message, Profile, Room } from "../Interface/Types";
import { getUserRooms, getRoom, getRoomMessages } from "../Api/API";
export interface RoomState {
	room: number
	users: Profile[]
	messages: Message[]
	index?: number
}

type State =  {
	rooms: RoomState[],
	isLoading: boolean
}

type Actions = {
    getChatrooms: (user: User) => void;
    addRoom: (room: RoomState) => void;
};

const initialState: State = {
	rooms: [],
	isLoading: true
}

interface  RoomsState {
	rooms: RoomState[]
}

interface  RoomInnerJoinData {
	room: number
	user: Profile
}

const getUserChatRooms = async (user: User) => {
    const data = await getUserRooms(user?.id!)

    let newRooms: RoomsState = {
        rooms: []
    }

    for (let i = 0; i < data.length; i++) {
        const roomData: any = await getRoom(data[i].room)
        const roomMessages: any = await getRoomMessages(data[i].room)
        const roomNew: RoomState = {
            room: 0,
            users: [],
            messages: [],
            index: i
        }
        roomData.forEach((room: RoomInnerJoinData) => {
            roomNew.room = room.room
            if (room.user.id !== user.id) roomNew.users.push(room.user)
        })
        roomNew.messages = roomMessages
        newRooms.rooms.push(roomNew)
    }

    return newRooms
}

const useRoomStore = create(
    immer<State & Actions>((set) => ({
      ...initialState,
    getChatrooms: async (user) =>{
        const rooms = await getUserChatRooms(user)
        set(  (state) => {
          state.rooms = rooms.rooms
          state.isLoading = false
        })
    },
    addRoom: (room) =>
        set( (state) => {
          state.rooms.push(room)
        })
    })),
    
    
  );

  export default useRoomStore;
