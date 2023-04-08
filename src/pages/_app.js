import '@/styles/globals.css'
import { Analytics } from '@vercel/analytics/react';
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }) {
  return(
    <>
      <Component {...pageProps} />
      <ToastContainer />
		  <Analytics />
    </>
  )
}
