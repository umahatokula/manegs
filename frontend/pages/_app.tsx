import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { hardhat, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Alert from '../components/Alert'

const { chains, provider, webSocketProvider } = configureChains(
  [
    polygonMumbai, hardhat
  ],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: 'IJtnJ4HYZXb0fXRm8grPnrCFGnyL7Z4X',
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div  className='h-screen bg-vote-50 pb-12 relative'>
          <Nav />
          <div className='w-11/12 md:w-6/12 mx-auto py-12'>
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
