"use client"

import { auth } from "./supabase";
import { useContext, createContext, useState, useEffect } from "react";

const GlobalState = createContext(undefined);

export function Global({ children }){
  const [isAuthUser, getCurrentUser] = useState();
  const [authEvent, setAuthEvent] = useState();

  useEffect(() => {
    const { data } = auth.onAuthStateChange((event, session) => {
      setAuthEvent(event)
      if(session) getCurrentUser(session.user)
      else getCurrentUser(null)
      // console.log(isAuthUser);
    });
    return () => data.subscription.unsubscribe()
  }, [])
  
  const [theme, setTheme] = useState("default-os");
  const [onExceptionPage, setOnExceptionPage] = useState(false);
  const [device, detectDevice] = useState("");
  const [windowSize, setWindowSize] = useState([0, 0]);

  useEffect(() => {
    function detectingDevice(){
      setWindowSize([window.innerWidth, window.innerHeight]);
      if(window.innerWidth < 640) detectDevice("xs")
      else if(window.innerWidth < 768) detectDevice("sm")
      else if(window.innerWidth < 1024) detectDevice("md")
      else if(window.innerWidth < 1280) detectDevice("lg")
      else if(window.innerWidth < 1536) detectDevice("xl")
      else detectDevice("2xl");
    };

    detectingDevice();
    
    window.addEventListener("resize", detectingDevice);
    return () => window.removeEventListener("resize", detectDevice);
  }, []);

  useEffect(() => {
    if(localStorage.getItem("theme") === null) localStorage.setItem("theme", theme)
    setTheme(localStorage.getItem("theme"))
  }, [])

  useEffect(() => localStorage.setItem("theme", theme), [theme])

  return(
    <GlobalState.Provider value={{
      theme: {theme, setTheme},
      authUser: {isAuthUser},
      authEvent: {authEvent},
      exceptionPage: {onExceptionPage, setOnExceptionPage},
      device: {device},
      winSize: {windowSize},
    }}>
      {children}
    </GlobalState.Provider>
  );
};

export function useGlobal(){
  const context = useContext(GlobalState);
  if(!context){
    throw new Error("useGlobal must be used within a Global component!");
  };
  return context;
};