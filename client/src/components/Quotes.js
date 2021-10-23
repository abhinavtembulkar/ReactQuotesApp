import React, { useEffect, useState } from "react";


function Quotes(){
    
    const [state, setState] = useState({
        post:"Your work is to discover your work and then with all your heart to give yourself to it.",
        key:0,
        author:"Buddha"
    })
    
    useEffect(()=>{
        const TIME_IN_SECONDS = 30
        setInterval(getQuote.bind(null,"GET","https://api.quotable.io/random"),TIME_IN_SECONDS*1000)
    },[])

    function getQuote(reqstype,url){
        const xhttp = new XMLHttpRequest()
        xhttp.onload = async() =>{
    
          let jsonout = {}
          try{
            jsonout = JSON.parse(xhttp.responseText)
          }
          catch(error){
            console.log(jsonout)
          }
    
          setState({
            post:jsonout.content,
            author:jsonout.author,
            key:jsonout._id
          })
        }
        
        xhttp.open(reqstype,url,true)
        xhttp.send()
      }

    return (
        <div>
            <div>
                <h4><i>{state.post}</i></h4>
            </div>
            <div>
                <h6>{state.author}</h6>
            </div>
        </div>
    )         
}
        
export default Quotes