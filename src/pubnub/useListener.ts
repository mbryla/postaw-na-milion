import { ListenerParameters } from 'pubnub';
import { useContext, useEffect, useMemo } from 'react';

import { channel, PubNubContext } from '../pubnub/PubNubContext';
import { Message } from './PubNubMessage';

export const useListener = (listener: (message: Message) => void) => {
  const listenerParameters: ListenerParameters = useMemo(
    () => ({
      message: (message) => {
        console.debug('received message', message);

        if (message.channel === channel) {
          listener(message.message as Message);
        }
      },
    }),
    [listener]
  );

  const pubnub = useContext(PubNubContext);

  if (!pubnub) {
    throw new Error('PubNubContext is undefined');
  }

  useEffect(() => {
    pubnub.addListener(listenerParameters);
    pubnub.subscribe({ channels: ['events'] });
    return () => pubnub?.removeListener(listenerParameters);
  }, [pubnub, listenerParameters]);
};
