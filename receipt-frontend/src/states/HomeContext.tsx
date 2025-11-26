import { createContext, useContext, useState, type ReactNode } from "react";
import type { HomeState,HomeActions } from "./homeTypes";

// initial state for home flow
const initialState: HomeState = {
     file: null,
    status : "idle",
    sessionId: null,
    purchasedItems: [],
    recallMatches: null,
    error: null,
}

// things context will expose
interface HomeContextValue {
    state: HomeState,
    actions: HomeActions
}

// create a context, starts undefined untill a provider sets it
const HomeContext = createContext<HomeContextValue|undefined>(undefined)

// provider component: Owns state and action implementation
export function HomeProvider({children}: {children: ReactNode}){
    const [state, setState] = useState<HomeState>(initialState);

    const actions: HomeActions = {
        setFile(file: File | null ){
            setState((prev)=>{
               return(
                { ...prev,
                file}
               )
            })
        },

        setStatus(status){
            setState((prev)=>({
                ...prev,
                status
            }))
        },

        setSessionId(id){
            setState((prev)=>({
                ...prev,
                sessionId: id
            }))
        },

        setPurchasedItems(items){
            setState((prev)=>({
                ...prev,
                purchasedItems: items
            }))
        },

        setRecallMatches(matches){
            setState((prev)=>({
                ...prev,
                recallMatches: matches
            }))
        },

      
     setError(error) {
      setState((prev) => ({
        ...prev,
        error,
      }));
    },

    resetAll() {
      setState(initialState);
    },
  
    }

        return(
            <HomeContext.Provider value={{state: state, actions}}>
            {children}
            </HomeContext.Provider>
        )
}

// custom hook so components can easily use context

export function useHomeContext(): HomeContextValue {
    const context = useContext(HomeContext);
    if(!context){
        throw new Error("useHomeContext must be within HomeProvider")
    }
    return context
}