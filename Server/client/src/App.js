import React,{createContext,useEffect,useReducer,useContext} from 'react'
import NavBar from './Components/NavBar'
import './App.css'
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './Components/screens/Home'
import Profile from "./Components/screens/Profile"
import Signin from "./Components/screens/Signin"
import Signup from "./Components/screens/Signup"
import CreatePost from "./Components/screens/CreatePost"
import {reducer,initialState} from "./reducers/userReducer"
import UserProfile from "./Components/screens/UserProfile"
import SubscribeUserPosts from "./Components/screens/SubscribeUserPosts"

export const UserContext=createContext()


const Routing=()=>{
    const history=useHistory()
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        const user=JSON.parse(localStorage.getItem("user"))
        if(user){
            dispatch({type:"USER",payload:user})
        }
        else{
            history.push("/signin")
        }
    },[])
    return(
        <Switch>
            <Route exact path="/">
                 <Home/>
            </Route>
            <Route exact path="/profile">
                <Profile/>
            </Route>
            <Route path="/Signin">
                <Signin/>
            </Route>
            <Route path="/Signup">
                <Signup/>
            </Route>
            <Route path="/create">
                <CreatePost/>
            </Route>
            <Route path="/profile/:userid">
                <UserProfile/>
            </Route>
            <Route path="/myfollowingpost">
                <SubscribeUserPosts/>
            </Route>
        </Switch>
    )
}

function App() {
    const [state,dispatch]=useReducer(reducer,initialState)
    return (
        <UserContext.Provider value={{state,dispatch}}>
        <BrowserRouter>
            <NavBar/>
            <Routing/>
        </BrowserRouter>
        </UserContext.Provider>
  );
}

export default App;
