import { FC, ReactNode, useMemo } from 'react';
import PubNub from 'pubnub';

import { PubNubContext } from './PubNubContext';

export interface PubNubProviderProps {
  authKey: string;
  children: ReactNode;
}

export const PubNubProvider: FC<PubNubProviderProps> = ({
  authKey,
  children,
}) => {
  const uuid = useMemo(() => PubNub.generateUUID(), []);

  const pubnub = useMemo(() => {
    console.debug('Generating new PubNub instance');
    return new PubNub({
      publishKey: process.env.REACT_APP_PUBLISH_KEY || '',
      subscribeKey: process.env.REACT_APP_SUBSCRIBE_KEY || '',
      // authKey,
      uuid,
    });
  }, [authKey, uuid]);

  if (!authKey) {
    return null;
  }

  return (
    <PubNubContext.Provider value={pubnub}>{children}</PubNubContext.Provider>
  );
};
