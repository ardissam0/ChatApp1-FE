import React, {useEffect, useState} from 'react';
import Pusher from 'pusher-js';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import axios from './axios';

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('/messages/sync')
    .then(response => {
      console.log(response.data)
      setMessages(response.data)
    })
  }, []);

  useEffect(() => {
    const pusher = new Pusher('80267542f90cd63cc7df', {
      cluster: 'us2'
    });
 
    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      setMessages([...messages, newMessage])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  console.log(messages);

  return (
    <div className="app">
      <div className="app__body">
        {/* Sidebar */}
        <Sidebar />
        {/* Chat component */}
        <Chat messages={messages}/>
      </div>
    </div>
  );
};

export default App;
