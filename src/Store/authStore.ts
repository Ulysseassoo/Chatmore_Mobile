import { UserHasBlocked } from './../Interface/Types';
import { Profile } from './../Interface/Profile';
import create from 'zustand'
import { immer } from "zustand/middleware/immer";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../Supabase/supabaseClient";

type State =  {
    isLoggedIn: boolean
    session: Session | null
    profile: Profile | null
    blockedUsers: UserHasBlocked[] | null
}

type Actions = {
  setLoggedIn: (session: Session) => void
  setLoggedOut: () => void;
  setProfile: (profile: Profile) => void;
  addBlockedUser: (userToBlock: UserHasBlocked) => void;
  deleteBlockedUser: (blocked_user_id: string) => void;
};

const initialState: State = {
	session: null,
	isLoggedIn: false,
  profile: null,
  blockedUsers: []
}

const useAuthStore = create(
    immer<State & Actions>((set) => ({
      ...initialState,
      setLoggedIn: async (session: Session) => {
          const {data} = await supabase.from("profiles").select("*").eq("id", session.user.id).single()
          const {data: blockedUsers} = await supabase.from("userHasBlocked").select("*").eq("blocking_user_id", session.user.id)
        set( (state) => {
          state.session = session;
          state.profile = data;
          state.isLoggedIn = true;
          state.blockedUsers = blockedUsers
        })
      },
      setProfile: async (profile) => set((state) => {
        state.profile = profile
      }),
      addBlockedUser: (userToBlock) => set((state) => {
        if(state.blockedUsers !== null) {
          state.blockedUsers = [...state.blockedUsers, userToBlock]
        }
      }),
      deleteBlockedUser: (blocked_user_id) => set((state) => {
        if(state.blockedUsers !== null) {
          state.blockedUsers = state.blockedUsers.filter((user) => blocked_user_id !== user.blocked_user_id)
        }
      }),
    setLoggedOut: () =>
        set((state) => {
          state.session = initialState.session;
          state.profile = initialState.profile;
          state.isLoggedIn = false;
        })
    }))
    
  );

  export default useAuthStore;
