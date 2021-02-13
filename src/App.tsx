import React, { useState } from 'react';

import { AuthKeyInput } from './components/AuthKeyInput';
import { ModeSelector } from './components/ModeSelector';
import { AdminLayout } from './layouts/AdminLayout';
import { PlayerLayout } from './layouts/PlayerLayout';
import { PubNubProvider } from './pubnub/PubNubProvider';

export const App = () => {
  const [mode, setMode] = useState<'admin' | 'player' | undefined>();
  const [authKey, setAuthKey] = useState('');

  return (
    <main>
      {mode === undefined && <ModeSelector setMode={setMode} />}
      {mode === 'player' && (
        <PubNubProvider authKey="public">
          <PlayerLayout />
        </PubNubProvider>
      )}
      {mode === 'admin' && (
        <div style={{ padding: '20px' }}>
          {authKey && (
            <PubNubProvider authKey={authKey}>
              <AdminLayout />
            </PubNubProvider>
          )}
          <AuthKeyInput authKey={authKey} setAuthKey={setAuthKey} />
        </div>
      )}
    </main>
  );
};
