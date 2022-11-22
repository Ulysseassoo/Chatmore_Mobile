import create from 'zustand'
import { SessionState } from "../Interface/StoreState"
import { immer } from "zustand/middleware/immer";
import { Session, User } from "@supabase/supabase-js";
import { Image, Message, Profile, Room, UserHasBlockedRoom } from "../Interface/Types";
import { getUserRooms, getRoom, getRoomMessages, getRoomBlockUsers } from "../Api/API";
import useAuthStore from "./authStore";
export interface RoomState {
	room: number
	users: Profile[]
	messages: Message[]
	index?: number
    blockedUsers: UserHasBlockedRoom[]
}

type State =  {
	rooms: RoomState[],
	isLoading: boolean
}

type Actions = {
    getChatrooms: (user: User) => void;
    addRoom: (room: RoomState) => void;
    addMessageToRoom: (message: Message | undefined) => void;
    emptyRooms: () => void;
    updateViewRoomMessages: (messages: Message[], connectedUserId: string | undefined) => void;
    deleteBlockedUser: ( roomId: number, profileId: string | undefined) => void;
    addBlockedUser: (blockUser: UserHasBlockedRoom) => void;
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
        const roomBlockUsers: any = await getRoomBlockUsers(data[i].room)
        const roomNew: RoomState = {
            room: 0,
            users: [],
            messages: [],
            blockedUsers: [],
            index: i
        }
        roomData.forEach((room: RoomInnerJoinData) => {
            roomNew.room = room.room
            if (room.user.id !== user.id) roomNew.users.push(room.user)
        })
        roomNew.messages = roomMessages.reverse()
        roomNew.blockedUsers = roomBlockUsers
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
        }),
    addMessageToRoom: (message) => set((state) => {
        if(message !== undefined) {
            const roomIndex = state.rooms.findIndex((room) => room.room === message.room)
            if(roomIndex !== -1) {
                state.rooms[roomIndex].messages = [message,...state.rooms[roomIndex].messages]
            }
        }
    }),
    updateViewRoomMessages: (messages) => {
            set((state) => {
                const roomIndex = state.rooms.findIndex((room) => room.room === messages[0].room)
                if(roomIndex !== -1) {
                    const room = {...state.rooms[roomIndex]}
                    const updatedMessages = room.messages.map((oldMessage) => messages.find((newMessage) => newMessage.id === oldMessage.id) || oldMessage)
                    state.rooms[roomIndex].messages = updatedMessages
                }
            })
    },
    emptyRooms: () => set((state) => {
        state.rooms = initialState.rooms
        state.isLoading = initialState.isLoading
    }),
    deleteBlockedUser: (roomId, profileId) => set((state) => {
        const roomIndex = state.rooms.findIndex((room) => room.room === roomId)
        if(roomIndex !== -1) {
            const room = {...state.rooms[roomIndex]}
            const updateBlockedUsers = room.blockedUsers.filter((userRoom) => userRoom.blocking_user_id !== profileId && userRoom.room_id !== roomId)
            state.rooms[roomIndex].blockedUsers = updateBlockedUsers
        }
    }),
    addBlockedUser: (blockUser) => set((state) => {
        const roomIndex = state.rooms.findIndex((room) => room.room === blockUser.room_id)
        if(roomIndex !== -1) {
            state.rooms[roomIndex].blockedUsers.push(blockUser)
        }
    })
        
    })),
    
    
  );

  export default useRoomStore;
