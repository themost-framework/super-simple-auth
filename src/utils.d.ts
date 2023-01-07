import { Application } from "express";
import { Server } from 'http';

export declare function serveApplication(app: Application, port: any, host: any): Promise<Server>;
export declare function getServerAddress(server: Server);