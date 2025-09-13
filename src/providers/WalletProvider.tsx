import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  sepolia,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from '@tanstack/react-query';
import { http } from 'viem';

const config = getDefaultConfig({
  appName: 'Secret Cap Vault',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_WALLET_CONNECT_PROJECT_ID',
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_RPC_URL || 'https://1rpc.io/sepolia'),
  },
  ssr: false,
});

const queryClient = new QueryClient();

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#059669',
            accentColorForeground: 'white',
            borderRadius: 'large',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};