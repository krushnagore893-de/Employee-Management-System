// src/config/env.config.ts

import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export const config = { 
  group1: {
    idInstance: process.env.GREEN_API_ID,
    apiTokenInstance: process.env.GREEN_API_TOKEN
  },
  apiUrl: process.env.API_URL || '',
  apiToken: process.env.API_TOKEN || '',
  apiSecret: process.env.API_SECRET || '',
  apiKey: process.env.API_KEY || ''
};