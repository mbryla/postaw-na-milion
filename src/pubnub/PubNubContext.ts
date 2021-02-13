import PubNub from 'pubnub';
import { createContext } from 'react';

export const PubNubContext = createContext<PubNub | undefined>(undefined);

export const channel = 'events';
