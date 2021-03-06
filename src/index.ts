import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { FirestoreStore } from '@google-cloud/connect-firestore';

import firestoreClient from './config/firestore';
import isLoggedMiddleware from './middlewares/islogged';
import registerMiddleware from './middlewares/register';
import loginMiddleware from './middlewares/login';
import logoutMiddleware from './middlewares/logout';
import getMiddleware from './middlewares/get';
import addMiddleware from './middlewares/add';
import deleteMiddleware from './middlewares/delete';
import isAuthMiddleware from './middlewares/isauth';

function main() {
  
  const corsMiddleware = cors({
    origin: process.env.FRONTEND!,
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 200,
    credentials: true
  });

  const bodyParserMiddleware = express.json();

  const sessionMiddleware = session({
    secret: '$ruptiva#secret$',
    name: 'ruptiva',
    cookie: {
      maxAge: 1 * 1000 * 60 * 30,
      httpOnly: true,
      secure: false
    },
    store: new FirestoreStore({
      dataset: firestoreClient,
      kind: 'express-sessions'
    }),
    resave: false,
    saveUninitialized: false
  });

  const app = express();

  app.use('/api/', corsMiddleware, bodyParserMiddleware, sessionMiddleware);

  app.post('/api/logged', isLoggedMiddleware);

  app.post('/api/register', registerMiddleware);

  app.post('/api/login', loginMiddleware);

  app.post('/api/logout', isAuthMiddleware, logoutMiddleware);

  app.post('/api/user/repositories/get', isAuthMiddleware, getMiddleware);

  app.post('/api/user/repositories/add', isAuthMiddleware, addMiddleware);

  app.post('/api/user/repositories/delete', isAuthMiddleware, deleteMiddleware);

  app.listen(4000, () =>
    console.log(
      'Application server ready to receive incoming requests on http://localhost:4000.'
    )
  );
  
};


main();
