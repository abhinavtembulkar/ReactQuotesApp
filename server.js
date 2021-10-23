const express = require('express')
const app = express()
const http = require('http').createServer(app)
const cors = require('cors');
const path = require('path')

app.use(express.urlencoded());
app.use(express.json());
app.use(cors())

let postlist = []


class TreeNode{
    constructor(id,post){
        this.id = id
        this.left = null
        this.right = null
        this.post = post
    }
};

function searchnode(root,searchid)
{
    if(root==null)
    {
        console.log("NULL")
        return null
    }
    
    if(root.id == searchid)
        return root
    
    if(root.id>searchid)
        return searchnode(root.left,searchid)
    else
        return searchnode(root.right,searchid)
}

function canAdd(treenode)
{
    if(treenode==null)
        return "No"
        
    if(treenode.left != null && treenode.right != null)
        return "No"

    if(treenode.left == null)
        return "left"

    if(treenode.right == null)
        return "right"
}

function insertnode(root,searchid,post)
{
    let treenode = searchnode(root,searchid)
    let status = canAdd(treenode)
    
    if(status == "No") return null
    else
    {
        let newId = assignId(searchid,status)
        let newnode = new TreeNode(newId,post)
        postlist.push(newnode)

        if(treenode.id > newId)
        {
            if(status != "left")
            {
                newId = assignId(searchid,"left")
                newnode.id = newId   
            }
            treenode.left = newnode
            console.log('ADDED LEFT')
        }
        else
        {
            if(status != "right")
            {
                newId = assignId(searchid,"right")
                newnode.id = newId   
            }
            treenode.right = newnode
            console.log('ADDED RIGHT')
        }
        
        return newnode
    }    
}

function assignId(searchid,flag="none")
{
    let random = parseFloat(searchid) + (Math.random()-0.5)
    if(flag == 'left')
        random = parseFloat(searchid) + (Math.random()-1.5)
    if(flag == 'right')
        random = parseFloat(searchid) + (Math.random()+0.5)

    if ([searchid,98.5,99,99.5,100,100.5,101,101.5].forEach((val)=>{if(val==random){return true}}))
    {
        console.log('REASSIGN ID')
        return assignId(searchid,flag).toString()
    }

    return random.toString()
}

function jsondfs(root,rootjson)
{
    if(root == null)
        return
    
    rootjson["post"] = root.post
    rootjson["id"] = root.id
    rootjson["child"] = [{},{}]
    
    jsondfs(root.left,rootjson["child"][0])
    jsondfs(root.right,rootjson["child"][1])

    return 
}

const PORT = process.env.PORT || 5000

if(process.env.NODE_ENV=='production'){
    app.use(express.static('client/build'))
    app.get('/',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


Root = new TreeNode(100,"Tell us your thoughts and comments on this qoute, 2 replies allowed only per comment")
postlist.push(Root)


app.post('/data',(req,res)=>{
    console.log(req.body.postname,req.body.id)
    let searchid = req.body.id
    let postbody = req.body.postname.filter(elem=>elem!=='')  
    let poststatus = insertnode(Root,searchid,postbody[0])

    if(poststatus!=null)
    {
        console.log('POST SUCCESS')
        postlist.push(poststatus.id)
        res.redirect('/data')
    }
    else{
        console.log('POST FAILURE')
        res.sendStatus(500)
    }
})

// let outjson = { "post": "Hello world", "id": 100, "child": [ { "post": "aaaaaaaa", "id": "99.41315413709289", "child": [ {}, {} ] }, { "post": "ssssss", "id": "100.04884321567545", "child": [ {}, {} ] } ] }

app.get('/data',(req,res)=>{
    let outjson = {}
    jsondfs(Root,outjson)
    outjson = JSON.stringify(outjson, null, "\t");
    res.send(outjson)
})


app.get('/debug',(req,res)=>{
    console.log('OUTPUT')
    let list = "<ul>"
    postlist.forEach(element => {
        list+=("<li>Treenode: "+element.id +" " + element.post+"</li><br>")
    })
    list+="</ul>"
    res.send(list)
})


http.listen(PORT,()=>{
    console.log('server running on',PORT)
})