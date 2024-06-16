import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store/store"
import { RootCmp } from "./RootCmp"
import { createClient } from "@supabase/supabase-js"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import "./assets/styles/main.scss"

const supabase = createClient(
  "https://xsjwgpefjvojzodrgato.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzandncGVmanZvanpvZHJnYXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU0MDk4NDIsImV4cCI6MjAyMDk4NTg0Mn0.C_knKrGIqZKoB8dqEon7mbIBMJojx6ClxUF7p5o4jH4"
)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <RootCmp />
      </Router>
    </SessionContextProvider>
  </Provider>
)
