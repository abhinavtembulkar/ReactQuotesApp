import logo from './logo.svg';
import './App.css';
import TreeNode from './components/TreeNode'
import React, {useState} from 'react';
import Quotes from './components/Quotes';

function App() {
  
  let chat = { "post": "Server not connected !", "id": 100, "child": [ { "post": "aaaaaaaa", "id": "99.41315413709289", "child": [ {}, {} ] }, { "post": "ssssss", "id": "100.04884321567545", "child": [ {}, {} ] } ] }
  const [data, setData] = useState({
    id:chat.id,
    post:chat.post,
    child:chat.child,
    key:10*Math.random()
  })

  function makeReqs(reqstype,url){
    const xhttp = new XMLHttpRequest()
    xhttp.onload = async() =>{

      let jsonout = {}
      try{
        jsonout = JSON.parse(xhttp.responseText)
      }
      catch(error){
        console.log(xhttp.responseText)
      }

      setData({
        post:jsonout.post,
        id:jsonout.id,
        child:jsonout.child,
        key:10*Math.random()
      })
    }
    
    xhttp.open(reqstype,url,true)
    xhttp.send()
  }

  // makeReqs("GET","http://localhost:5000/")

  return (
    <div className="App" onLoad={makeReqs.bind(null,"GET","https://reactquoteappscode.herokuapp.com/")}>
      <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Quotes />
          <TreeNode post={data.post} id={data.id} key={10*Math.random()} child={data.child} rerender={setData}/>
          <a href={'https://reactquoteappscode.herokuapp.com/debug'} style={{color:"white"}}>DEBUG?</a>
      </header>
      <footer>
        <i>Quote update every 30 seconds</i>
      </footer>
    </div>
  );
}

export default App;
