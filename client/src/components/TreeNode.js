import React from "react";
import axios from "axios";

const TreeNode = ({post, id, child, rerender})=>{

    function renderChild(treenode){
        if(Object.keys(treenode).length!==0)
            return (<li key={10*Math.random()}><TreeNode rerender={rerender}  post={treenode.post} id={treenode.id} child={treenode.child} key={10*Math.random()}/></li>)
    }

    async function onSubmitHandler(event){
        event.preventDefault()
        console.log(event.target.postname.value,event.target.id.defaultValue)

        try{
            const response = await axios.post('https://reactquoteappscode.herokuapp.com/',{
            postname: [event.target.postname.value,""],
            id: event.target.id.defaultValue
            })
        
            if(response.status === 200){
                // makeReqs("GET","http://localhost:5000/")
                // console.log(response.data)
                rerender(response.data)
            }
        }
        catch(err){
            console.log(err)
            window.alert("Cannot add new nodes, already filled. Add only two nodes per comment")
        }
    }

    return (
        <div>
            <p style={{ fontSize:16,margin:0 }}>{post}</p>
            <form onSubmit={onSubmitHandler}>
                <input type='text' name='postname'/>
                <input type="hidden" defaultValue={id} name="id" />
                <input type="submit" />
            </form>
            <ul>
                {child.map((treenode)=>renderChild(treenode))}   
            </ul>
        </div>
    )
}

export default TreeNode