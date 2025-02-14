import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { applyMiddleware, compose } from 'redux'
import { createStore } from 'redux'
import thunk from "redux-thunk"
import Reducers from "./Reducers"
import { GoogleOAuthProvider } from "@react-oauth/google";

//redux
const store = createStore(Reducers, compose(applyMiddleware(thunk)))

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>

    <GoogleOAuthProvider clientId="810354537421-ohdp6388hgpfbnu5r5s49g7ad9gfc1fo.apps.googleusercontent.com">
      <React.StrictMode>
        <BrowserRouter />
        <App />
        <BrowserRouter />
      </React.StrictMode>
    </GoogleOAuthProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
