"use client"
import { User, Channel as StreamChannel } from 'stream-chat';
import { useCreateChatClient, Chat, Channel, ChannelHeader, MessageInput, ChannelList,MessageList, Thread, Window  , ChannelSearch , InfiniteScroll} from 'stream-chat-react';
import { useState , useEffect } from 'react';
import 'stream-chat-react/dist/css/v2/index.css';
import { useSession } from 'next-auth/react';
import {StreamChat} from 'stream-chat';
import "@/app/layout.css"
import AddChannelButton from '@/components/AddChannelButton';
import { useChannelsStore } from "@/store/channels"
import { Button } from '@/components/ui/button';
import AddChannelForm from '@/components/AddChannelForm';
// your Stream app information

export default function Page() {
    const [showAddChannelForm, setShowAddChannelForm] = useState(false);
    const { createChannel } = useChannelsStore();

    const { data: session, status } = useSession();

    const apiKey = process.env.NEXT_PUBLIC_STREAM_KEY;
    const userId = session?.user?.id || session?.user?._id;
    const userName = session?.user?.name || 'Anonymous';
    const userToken = session?.user?.streamChatToken;
  const [channel, setChannel] = useState(null);

  const [client, setClient] = useState(null);
  const onAddChannel = async ()=>{
    const channelData = {
      channelType: 'messaging',
      channelId: 'new-channel-2id',
      channelName: 'ahhh88',
      members: [userId],
      channelData: {}
    };
    await createChannel(channelData);
  }
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
  

    useEffect(() => {
      if (!client || !userId) return;
  
      const channel = client.channel('messaging', "jkjk", {
        image: 'https://getstream.io/random_png/?name=react',
        name: 'Chat Room',
        members: [userId], // Start with only current user
      });
  
      setChannel(channel);
      
      // Watch the channel to ensure it's properly initialized
      channel.watch().then(() => {
        console.log("Channel watched successfully:", channel);
        // After channel is created, add the second user
      }).catch(error => {
        console.error("Error watching channel:", error);
      });
    }, [client, userId]);
  
    if (!client || !channel) return <div>Loading chat...</div>;
  
    const ChannelSort = { last_message_at: -1 };
    const ChannelFilters = {
      members: { $in: [userId] },
    };
    const ChannelOptions = {
      limit: 10,
    };
      
      const customSearchFunction = async (params, event, client) => {
        console.log('Search function called with params:', params);
        console.log('Event:', event);
        
        const { setResults, setSearching, setQuery, query } = params;
        const searchValue = event?.target?.value || query || '';
        
        setSearching(true);
        setQuery(searchValue);
        
        try {
          let searchFilters;
          
          if (searchValue && searchValue.trim().length > 0) {
            // If there's a search query, use autocomplete
            searchFilters = {
              name: { $autocomplete: searchValue.trim() },
              members: { $in: [userId] },
            };
          } else {
            // If no search query, just show all user channels
            searchFilters = {
              members: { $in: [userId] },
            };
          }
          
          const searchOptions = {
            limit: 10,
          };
          
          const results = await client.queryChannels(searchFilters, ChannelSort, searchOptions);
          console.log('Search results:', results);
          setResults(results);
        } catch (error) {
          console.error('Error searching channels:', error);
          setResults([]);
        } finally {
          setSearching(false);
        }
      };
  
    return <Chat client={client} theme='str-chat__theme-custom' >
      <div className="str-chat__main-layout ">
        {/* <ChannelSearch/> */}
        <AddChannelForm 
          className={`${showAddChannelForm ? 'block' : 'hidden'}`} 
          onSubmit={onAddChannel}
          onClose={() => setShowAddChannelForm(false)}
        />
       <ChannelList 
         filters={ChannelFilters} 
         sort={ChannelSort} 
         options={ChannelOptions} 
         Paginator={InfiniteScroll}
         showChannelSearch
         additionalChannelSearchProps={{
          searchFunction: (params, event) => {
            return customSearchFunction(params, event, client);
          },
        }}
        // Infinite scroll configuration for channel list
        additionalChannelListProps={{
          loadMore: true, // Enable load more functionality
          loadMoreThreshold: 0.8, // Load more when 80% scrolled
        }}
       />
        <Channel >
            <Button onClick={() => setShowAddChannelForm(true)}>Add Channel</Button>

          <Window>
            <ChannelHeader />
            <MessageList 
              messageLimit={50} // Number of messages to load initially
              threadListMessageLimit={20} // Messages in thread view
            />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </div>
      </Chat>;
      }
