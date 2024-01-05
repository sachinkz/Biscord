import qs from 'query-string'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSocket } from '@/components/providers/socket-provider'

interface ChatQueryProps{
    queryKey:string;
    apiUrl:string;
    paramKey:"channelId" | "conversationId"
    paramValue:string
}
let param:any=undefined;

export const useChatQuery=({queryKey,apiUrl,paramKey,paramValue}:ChatQueryProps)=>{

    const {isConnected}=useSocket();


    const fetchMessages=async ({pageParams=undefined})=>{


        const url=qs.stringifyUrl({
            url:apiUrl,
            query:{
                cursor:pageParams? pageParams: param,
                [paramKey]:paramValue,
            }
        },{skipNull:true})
        
        const res=await fetch(url)
        const d=await res.json()
        param=d.nextCursor;
        return d
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: [queryKey],
        //@ts-ignore
        queryFn:fetchMessages,
        getNextPageParam: (lastPage) =>lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000,
    });
    
    return {data,fetchNextPage,hasNextPage,status,isFetchingNextPage}
}   