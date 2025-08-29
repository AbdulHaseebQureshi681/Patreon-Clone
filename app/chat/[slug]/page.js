"use client"
import { User, Channel as StreamChannel } from 'stream-chat';
import { useCreateChatClient, Chat, Channel, ChannelHeader, MessageInput, ChannelList,MessageList, Thread, Window  , useMessageContext} from 'stream-chat-react';
import { useState , useEffect } from 'react';
import 'stream-chat-react/dist/css/v2/index.css';
import { useSession } from 'next-auth/react';
import {StreamChat} from 'stream-chat';
import { useParams } from 'next/navigation';
import "@/app/layout.css"
// your Stream app information

export default function Page() {
    const { data: session, status } = useSession();
    const {slug} = useParams();
    const apiKey = process.env.NEXT_PUBLIC_STREAM_KEY;
    const userId = session?.user?.id || session?.user?._id;
    const userName = session?.user?.name || 'Anonymous';
    const userToken = session?.user?.streamChatToken 
  const [channel, setChannel] = useState();
  
  const [client, setClient] = useState(null);
  
    useEffect(() => {
      if (!apiKey || !userToken || !userId) return;
  
      const newClient = StreamChat.getInstance(apiKey);
  
      newClient.connectUser(
        { id: userId, name: userName },
        userToken,
      ).then(() => {
        setClient(newClient);
      }).catch(error => {
        console.error("StreamChat client connection error:", error);
      });
  
      return () => {
        if (newClient) {
          newClient.disconnectUser();
        }
      };
    }, [apiKey, userToken, userId, userName]);
  
    useEffect(() => {
      if (!client || !userId) return;
  
      const channel = client.channel('messaging', slug, {
        image: 'https://getstream.io/random_png/?name=react',
        name: slug || 'Chat Room',
        members: [userId],
      });
  
      setChannel(channel);
    }, [client, userId]);
  
    if (!client || !channel) return <div>Loading chat...</div>;

    const ChannelSort = { last_message_at: -1 };
    const ChannelFilters = {
      members: { $in: [userId] },
    };
    const ChannelOptions = {
      limit: 10,
    };
    // const CustomMessage = () => {
    //   const { message } = useMessageContext();
    //   return (
    //     <div>
    //       <b style={{ marginRight: '4px' }}>{message.user?.name}</b> {message.text}
    //     </div>
    //   );
    // };
  return <Chat client={client} theme='str-chat__theme-custom' >
    <div className="str-chat__main-layout">
     <ChannelList filters={ChannelFilters} sort={ChannelSort} options={ChannelOptions} />
      <Channel >
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </div>
    </Chat>;
    }
