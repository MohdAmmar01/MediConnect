import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/message.css';
import { FileUploader } from 'react-drag-drop-files';
import { FaFileArrowUp } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import ScrollToBottom from 'react-scroll-to-bottom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { io } from 'socket.io-client';
import ProtectedRoute from '../components/PrivatePage';
import loader from "../assets/loader/loader.gif";

const allowedFileTypes = ['PDF', 'DOC', 'JPEG', 'PNG', 'JPG'];

function Message() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [canChat, setCanChat] = useState(false);
  const users = useSelector(state => state.users);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const socketInstance = io('https://medi-connect-backend-beno.onrender.com');
    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, []);

  useEffect(() => {
    const getMessagesAndUser = async () => {
      setLoading(true);
      try {
        const [messagesRes, userRes] = await Promise.all([
          axios.post('https://medi-connect-backend-beno.onrender.com/api/messages/getMessagesOfUser', { members: [users?.userdata?._id, id] }),
          axios.post(`https://medi-connect-backend-beno.onrender.com/api/users/getUserById`, { id }),
        ]);
        if (messagesRes.data.success) {
          setMessages(messagesRes.data.message);
        }

        if (userRes.data.success) {
          setUser(userRes.data.message);
        } else {
          navigate('/chats');
        }
        setLoading(false)
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    getMessagesAndUser();
  }, [id, users?.userdata?._id]);

  useEffect(() => {
    socket?.emit('addUser', users?.userdata?._id);
  }, [socket, id]);

  useEffect(() => {
    socket?.on('getMessage', (data) => {
      setArrivalMessage({
        text: data.text,
        members: data.members,
        senderName: data.senderName,
        file: data.file,
        createdAt: new Date(),
      });
    });
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    const checkChatPermission = async () => {
      try {
        const response = await axios.post('https://medi-connect-backend-beno.onrender.com/api/messages/canChat', {
          userId: users?.userdata?.role === 'doctor' ? id : users?.userdata?._id,
          doctorId: users?.userdata?.role === 'doctor' ? users?.userdata?._id : id
        });

        if (response.data.success) {
          setCanChat(true);
        } else {
          setCanChat(false);
          toast.error("You cannot chat at this moment. You need to make an appointment.", { position: 'top-center' });
          navigate('/chats');
        }
      } catch (error) {
        toast.error("An error occurred while checking chat permission.", { position: 'top-center' });
      }
    };

    checkChatPermission();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!canChat) {
      toast.error("You cannot chat at this moment. You need to make an appointment.", { position: 'top-center' });
      return;
    }

    if (input != '') {
      const messageObj = {
        senderId: users?.userdata?._id,
        receiverId: id,
        text: input,
        senderName: users?.userdata?.name,
      };
      let fileUrl;

      let formData = new FormData();
      formData.append('members', JSON.stringify([users?.userdata?._id, id])); // Convert array to JSON string
      formData.append('text', input);
      formData.append('senderName', users?.userdata?.name);

      if (file) {
        formData.append('file', file); // File should be handled correctly
      }


      const res = await axios.post('https://medi-connect-backend-beno.onrender.com/api/messages/create-message', formData);
      if (res.data.success == true) {
        fileUrl = res.data.message.file;
      }

      messageObj.file = fileUrl; // Adjust the file handling as needed

      socket.emit('sendMessage', messageObj);
      setMessages([...messages, messageObj]);
      setInput('');
      setFile(null);


    }
  };

  const handleFileChange = (file) => {
    setFile(file);
  };

  const getFilePreview = (fileUrl) => {
    const fileExtension = fileUrl.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={fileUrl} className='message_preview_file' alt="File preview" />;
    }
    if (['mp4', 'webm'].includes(fileExtension)) {
      return <video className='message_preview_file' controls src={fileUrl} />;
    }
    return <a href={fileUrl} target='_blank' download>Download File</a>;
  };

  return (
    <ProtectedRoute>

      <div className="message-container">
        <Navbar currentPage="message" />
        <div className="message-container-body">
          {loading ? 
           <img src={loader} style={{ width: "50px", height: "50px" }} alt="loader" />
          : (
            <>
              <div className="message-container-heading">
                <h2>{`Chat With ${user?.name || 'User'}`}</h2>
                {user?.role === 'doctor' && <h3>{`(Dr. ${user?.name} is specialized in ${user?.specialisation})`}</h3>}
              </div>

              <div className="message-container-chat">
                <ScrollToBottom className="message-container-chat-messages">

                  {messages?.map((msg, index) => (
                    <div key={index} className={`message ${msg?.senderName == users?.userdata?.name ? 'user-message' : 'doctor-message'}`}>
                      <p>{msg.text}</p>
                      {msg.file && getFilePreview(msg.file)}
                    </div>
                  ))}
                </ScrollToBottom>

                {canChat ? (
                  <>
                    {file && <div className="file-name">{file.name}</div>}
                    <form className="message-container-chat-input" onSubmit={handleSendMessage}>
                      <FileUploader
                        handleChange={handleFileChange}
                        name="file"
                        types={allowedFileTypes}
                        children={<FaFileArrowUp size={25} />}
                        className="file-uploader"
                      />
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your message"
                        required
                      />
                      <button type="submit">Send</button>
                    </form>
                  </>
                ) : (
                  <div className="message-container-chat-disabled">
                    <p>You cannot chat at this moment. You need to make an appointment.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>

  );
}

export default Message;
