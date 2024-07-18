import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import { PORT, FRONTEND_URL } from './config.js';
import { corsOptions } from './config.js';
import { setupSocketAuth } from './middleware/auth.js';
import { setupSocketHandlers } from './socketHandlers.js';
import { fetchAllUsers } from './services/userService.js';

export { express, cors, http, Server, dotenv, PORT, FRONTEND_URL, corsOptions, setupSocketAuth, setupSocketHandlers, fetchAllUsers } 