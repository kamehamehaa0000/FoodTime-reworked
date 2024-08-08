import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GlobalProvider } from './contexts/globalContext.jsx'
import { QueryClientProvider, QueryClient } from 'react-query'
const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </QueryClientProvider>
)
