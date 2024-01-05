import { NextApiResponse } from "next";
import {Server as SocketIoServer} from 'socket.io'
import {Server as NetServer,Socket} from 'net'


export type NextApiResponseServerIo=NextApiResponse &{
    socket:Socket &{
        server:NetServer &{
            io:SocketIoServer;
        }
    }
}