import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

import './App.css'
import { SessionProvider } from './context/session-provider'

const queryClient = new QueryClient()

export default function App() {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <></>
      </QueryClientProvider>
    </SessionProvider>
  )
}
