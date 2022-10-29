import create from 'zustand'
import { SessionState } from "../Interface/StoreState"
import { immer } from "zustand/middleware/immer";
import { Session } from "@supabase/supabase-js";

type State =  {
    isLoggedIn: boolean
    session: Session | null
}

type Actions = {
  setLoggedIn: (session: Session) => void
  setLoggedOut: () => void;
};

const initialState: State = {
	session: null,
	isLoggedIn: false
}

const useAuthStore = create(
    immer<State & Actions>((set) => ({
      ...initialState,
      setLoggedIn: (session: Session) =>
        set((state) => {
          state.session = session;
          state.isLoggedIn = true;
        }),
    setLoggedOut: () =>
        set((state) => {
          state.session = initialState.session;
          state.isLoggedIn = false;
        })
    }))
    
  );

  export default useAuthStore;
