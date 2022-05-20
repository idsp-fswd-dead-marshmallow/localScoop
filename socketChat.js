
module.exports = function(io) {

    //moving it in searate file later
    const moment = require('moment');
    const users=[]
    //-------------------------------------------
    
    // Run when client connects
    io.on('connection', socket => {

        socket.on('joinRoom', ({ username, room }) => {
            const user = userJoin(socket.id, username, room);

            socket.join(user.room);

            socket.emit('message', formatMessage("admin", 'Welcome to ChatCord!'));
            
            socket.broadcast.to(user.room).emit('message',
                    formatMessage("admin", `${user.username} has joined the chat`));


            //send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        } )


        //listen for chatInputMessage
        socket.on('chatMessage',(msg)=>{
            const user = getCurrentUser(socket.id)

            io.to(user.room).emit('message', formatMessage(user.username,msg) )
        })


        socket.on ('disconnect',()=>{
            const user = userLeave(socket.id)
            if(user){
                io.to(user.room).emit('message',formatMessage('admin', `${user.username} is dead`))
            }


            //send users and room info 
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });

        })

    });



///---------------------------------- related functions - move to different file--------------------

    //geting an object from the messge input data
    function formatMessage(username, text) {
        return {username, text, time: moment().format('h:mm a')
        };
    }

    //join user to chat
    function userJoin(id, username, room) {
        const user = { id, username, room };
        users.push(user);
        return user;
    }


// Get current user
    function getCurrentUser(id) {
        return users.find(user => user.id === id);
    }

// User leaves chat
    function userLeave(id) {
        const index = users.findIndex(user => user.id === id);  //DataBase Needed

        if (index !== -1) {
            return users.splice(index, 1)[0];
        }
    }

// Get room users
    function getRoomUsers(room) {
        return users.filter(user => user.room === room);
    }
//-------------------------------------------------------------------

    
}


