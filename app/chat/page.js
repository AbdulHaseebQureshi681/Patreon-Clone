"use client"
import { User, Channel as StreamChannel } from 'stream-chat';
import { useCreateChatClient, Chat, Channel, ChannelHeader, MessageInput, ChannelList, MessageList, Thread, Window, ChannelSearch, InfiniteScroll} from 'stream-chat-react';
import { useState , useEffect } from 'react';
import 'stream-chat-react/dist/css/v2/index.css';
import { useSession } from 'next-auth/react';
import {StreamChat} from 'stream-chat';
import "@/app/layout.css"
import AddChannelButton from '@/components/AddChannelButton';
import { useChannelsStore } from "@/store/channels"
import { Button } from '@/components/ui/button';
import AddChannelForm from '@/components/AddChannelForm';
import {Menu, X} from 'lucide-react';
// your Stream app information

export default function Page() {
    const [showAddChannelForm, setShowAddChannelForm] = useState(false);
    const { createChannel } = useChannelsStore();
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();

    const apiKey = process.env.NEXT_PUBLIC_STREAM_KEY;
    const userId = session?.user?.id || session?.user?._id;
    const userName = session?.user?.name || 'Anonymous';
    const userToken = session?.user?.streamChatToken;
  const [channel, setChannel] = useState(null);

  const [client, setClient] = useState(null);
  const onAddChannel = async ()=>{
    const channelData = {
      channelType: 'team',
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
  
      const channel = client.channel('team', "jkjk", {
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

    // Close sidebar when clicking outside or pressing Escape
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [isOpen]);
  
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
        <AddChannelForm 
          className={`${showAddChannelForm ? 'block' : 'hidden'}`} 
          onSubmit={onAddChannel}
          onClose={() => setShowAddChannelForm(false)}
        />
        
        {/* Mobile backdrop - only visible on mobile when sidebar is open */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black opacity-60 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
        
        <div className={`str-chat__channel-list-wrapper fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:z-auto md:w-auto`}>

        <div className="str-chat__channel-list">
          <ChannelList 
            filters={ChannelFilters} 
            sort={ChannelSort} 
            options={ChannelOptions} 
            Paginator={InfiniteScroll}
            showChannelSearch={true}
            additionalChannelSearchProps={{
              searchFunction: (params, event) => {
                return customSearchFunction(params, event, client);
              },
            }}
            additionalChannelListProps={{
              loadMore: true,
              loadMoreThreshold: 0.8,
            }}
            />
          {/* Add Channel button positioned after the channel list */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 sticky bottom-0">
            <Button 
              onClick={() => setShowAddChannelForm(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
              + Add Channel
            </Button>
          </div>
              </div>
        </div>

        


        <Channel >
            <Button className="block md:hidden absolute top-4 right-4 z-80" onClick={() => setIsOpen(!isOpen)}> {isOpen ? <X size={28} /> : <Menu size={28} />} </Button>

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
