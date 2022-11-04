import { RealtimePresenceState } from "@supabase/supabase-js";
import create from 'zustand'
import { immer } from "zustand/middleware/immer";

type Presence = {
    presence_ref: string
    [key: string]: any
  }

type State =  {
    onlineUsers: RealtimePresenceState
}

type Actions = {
  setOnlineUsers: (users : RealtimePresenceState) => void
};

const initialState: State = {
    onlineUsers: {}
}

const useOnlineStore = create(
    immer<State & Actions>((set) => ({
      ...initialState,
      setOnlineUsers: (users) =>
        set((state) => {
          state.onlineUsers = users
        }),
    })))

  export default useOnlineStore;
