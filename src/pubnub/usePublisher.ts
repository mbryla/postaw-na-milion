import { useCallback, useContext } from 'react';

import { channel, PubNubContext } from '../pubnub/PubNubContext';
import { Message } from './PubNubMessage';

export const usePublisher = () => {
  const pubnub = useContext(PubNubContext);

  if (!pubnub) {
    throw new Error('PubNubContext is undefined');
  }

  const publish = useCallback(
    (message: Message) =>
      pubnub.publish({
        channel,
        message,
      }),
    [pubnub]
  );

  return publish;
};
