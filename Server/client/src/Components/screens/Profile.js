import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from "../../App"

const Profile=()=>{
    const [mypics,setPics]=useState([])
    const {state,dispatch}=useContext(UserContext)
    const [image,setImage]=useState("")
    useEffect(()=>{
        fetch("/myposts",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
            setPics(result.post)
        })
    },[])
    useEffect(()=>{
        if(image){
            const data=new FormData()
        data.append("file",image)
        data.append("upload_preset","ChatterBox-clone")
        data.append("cloud_name","valusa")
        fetch("https://api.cloudinary.com/v1_1/valusa/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            //console.log(data)
            //localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
            //dispatch({type:"UPDATEPIC",payload:data.url})
            fetch("/updatepic",{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:data.url
                })
            }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                dispatch({type:"UPDATEPIC",payload:result.pic})
            })
        })
        .catch(err=>{
            console.log(err)
        })
        }
     },[image])
        const updatePhoto=(file)=>{
        setImage(file)
        
    }
    return(
        <div style={{maxWidth:"1100px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div><img alt="Profile Pic" style={{width:"160px",height:"160px",borderRadius:"80px"}} 
                    src={state?state.pic:"loading..."}/>
                    <div>
                    <div className="file-field input-field">
                    <div className="btn  #64b5f6 blue darken-1">
                        <span>Update Profile</span>
                        <input type="file" className="already" onChange={(e)=>updatePhoto(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                    </div>
                </div>
                <div>
                    <h4>{state?state.name:"Loading"}</h4>
                    <h4>{state?state.email:"Loading"}</h4>
                    <div style={{display:"flex",justifyContent:"space-between",width:"115%"}}>
                        <h6>{mypics.length} posts</h6>
                        <h6>{state?state.followers.length:"0"} followers</h6>
                        <h6>{state?state.following.length:"0"} following</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    mypics.map(item=>{
                        return(
                            <img key={item._id} alt={item.title} className="item" src={item.image}/>
                        )
                    })
                }       

            </div>
        </div>
    )
}

export default Profile
