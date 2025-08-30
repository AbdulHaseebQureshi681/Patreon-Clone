"use client"
import { User, Channel as StreamChannel } from 'stream-chat';
import { useCreateChatClient, Chat, Channel, ChannelHeader, MessageInput, ChannelList,MessageList, Thread, Window  , ChannelSearch} from 'stream-chat-react';
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
    const userToken = session?.user?.streamChatToken;
  const [channel, setChannel] = useState(null);

  const [client, setClient] = useState(null);
  
    useEffect(() => {
      if (status !== "authenticated" || !apiKey || !userToken || !userId) {
        if (status === "loading") return; // Do nothing while loading
        console.error("Missing Stream Chat connection parameters for user:", userId, { apiKey, userToken, userId, status });
        return;
      }
  
      const newClient = StreamChat.getInstance(apiKey);
  
      newClient.connectUser(
        { id: userId, name: userName },
        userToken,
      ).then(() => {
        setClient(newClient);
        console.log("StreamChat client connected successfully for user:", userId);
      }).catch(error => {
        console.error("StreamChat client connection error for user:", userId, error);
      });
  
      return () => {
        if (newClient) {
          newClient.disconnectUser();
        }
      };
    }, [apiKey, userToken, userId, userName, status]);
  
    const userid2 = "68ad1fa3c0cc8ad2d6a03d04"
    useEffect(() => {
      if (!client || !userId) return;
  
      const channel = client.channel('messaging', slug, {
        image: 'https://getstream.io/random_png/?name=react',
        name: slug || 'Chat Room',
        members: [userId], // Start with only current user
      });
  
      setChannel(channel);
      
      // Watch the channel to ensure it's properly initialized
      channel.watch().then(() => {
        console.log("Channel watched successfully:", channel);
        // After channel is created, add the second user
        if (userId !== userid2) {
          channel.addMembers([userid2]).then(() => {
            console.log("Second user added to channel successfully");
          }).catch(error => {
            console.error("Error adding second user to channel:", error);
          });
        }
      }).catch(error => {
        console.error("Error watching channel:", error);
      });
    }, [client, userId, slug]);
  
    if (!client || !channel) return <div>Loading chat...</div>;
  
    const ChannelSort = { last_message_at: -1 };
    const ChannelFilters = {
      members: { $in: [userId] },
    };
    const ChannelOptions = {
      limit: 10,
    };

  return <Chat client={client} theme='str-chat__theme-custom' >
    <div className="str-chat__main-layout ">
      {/* <ChannelSearch/> */}
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
