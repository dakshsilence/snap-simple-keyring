import type { FunctionComponent, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import { connectSnap, isConnected } from './utils';
import { defaultSnapOrigin } from './config';

export type AppProps = {
  children: ReactNode;
};

export const App: FunctionComponent<AppProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isConnectedTemp, setIsConnectedTemp] = useState(false);
  const [snapVersion, setSnapVersion] = useState<string>('');
  useEffect(() => {
    (async () => {
      const isConnectedRes = await isConnected();
      if (isConnectedRes) {
        setIsConnectedTemp(true);
        const version = (await window.ethereum.request({
          method: 'wallet_invokeSnap',
          params: {
            snapId: defaultSnapOrigin,
            request: { method: 'snap.internal.snapVersion' },
          },
        })) as string;
        setSnapVersion(version);
        setLoading(false);
      } else {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <>Loading...</>;

  if (isConnectedTemp === false)
    return (
      <>
        <button
          onClick={() => {
            connectSnap();
          }}
        >
          Connect
        </button>
      </>
    );
  return <>{snapVersion}</>;
};
