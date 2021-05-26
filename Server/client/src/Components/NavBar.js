import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'

const NavBar= ()=>{
    const {state,dispatch}=useContext(UserContext)
    const history=useHistory()
    const renderList=()=>{
      if(state){
        return [
          <li><Link to="/profile">Profile</Link></li>,
          <li><Link to="/create">CreatePost</Link></li>,
          <li><Link to="/myfollowingpost">Posts of Users I follow</Link></li>,
          <li>
            <button className="btn #62828 red darken-1" onClick={()=>{
              localStorage.clear()
              dispatch({type:"CLEAR"})
              history.push("/signin")
            }}>
                    Logout
                </button>
          </li>
        ]
      }
      else{
        return [
          <li><Link to="/signin">Signin</Link></li>,
          <li><Link to="/signup">Signup</Link></li>
        ]
      }
    }
    return(
        <nav>
    <div className="nav-wrapper  #64b5f6 blue darken-2">
      <Link to={state?"/":"/signin"} className="brand-logo left">ChatterBox</Link>
      <ul id="nav-mobile" className="right">
        {renderList()}
      </ul>
    </div>
  </nav>
    );
}
export default NavBar;