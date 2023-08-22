const express = require('express');
const http = require('http');
const path = require('path')
const cors = require('cors');
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const data = require('./data.json');
app.use(express.json()); 
app.use(cors());

app.get('/', (req,res) => 
	res.sendFile(path.resolve(__dirname,'index.html'))
)

app.get('/app.js',(req,res)=> res.sendFile(path.resolve(__dirname,'app.js')));
app.get('/admin.html',(req,res)=> res.sendFile(path.resolve(__dirname,'admin.html')));
app.get('/admin.js',(req,res)=> res.sendFile(path.resolve(__dirname,'admin.js')));
app.get('/admin.css',(req,res)=> res.sendFile(path.resolve(__dirname,'admin.css')));


app.get('/data',(req,res)=>{
	res.json(data);
})

io.on('connection',(socket)=>{
	console.log('connected');

	socket.on('handleForm',(msg)=>{
		let content = JSON.parse(fs.readFileSync('data.json', 'utf8'));
		// content.push({unit_id:content.length+1,...msg});
		content.push(msg);
		fs.writeFileSync('data.json', JSON.stringify(content));
		console.log('submitted');
		console.log(content.length);
		io.emit('updatedData',content);
	})
	
	socket.on('disconnect',()=>{
		console.log('server disconnected')
	})
})

server.listen(8080,()=>{
	console.log('server is running at port '+8080+'!')
})
