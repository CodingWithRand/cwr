"use client"
import { TypeAnimation } from "react-type-animation";
import "./page.css";
import Client from "@/glient/util";
import { useEffect } from "react";
import Neutral from "@/geutral/util";
import {
  Radios,
  RadioToast,
  MusicLibrary,
  MusicLibraryDialog,
  MyMusicPlayer
} from "./components/client/constructor-components/music";
import { BookContent, BookShelf } from "./components/client/constructor-components/books";
import { MusicStateProvider } from "./components/client/utility-components";
import Script from "next/script";
import { useGlobal } from "@/glient/global";

export default function Lounge() {
  const { Components } = Client
  const { NavBar, CWRFooter, Dynamic } = Components
  const { Coroussel, Image } = Dynamic

  const { authUser } = useGlobal();

  useEffect(() => {
    const headingBannerTitle = document.querySelector("#heading-banner .title");
    const typingText = document.querySelector("#heading-banner .typing-text");
    const blurMask = document.querySelector("#heading-banner .transparent-mask");
    (async () => {
      blurMask.style.opacity = "1";
      await Neutral.Functions.asyncDelay(2000)
      headingBannerTitle.style.opacity = "1";
      headingBannerTitle.style.transform = "translateY(0)";
      await Neutral.Functions.asyncDelay(1000)
      typingText.style.opacity = "1";
    })();
  }, []);

  return (
    <MusicStateProvider>
      <NavBar arbitraryCSSRules={
        <style>{`
          nav, nav ul {
            background-color: #9b3331
          }
          .locked a.reg-btn.si {
            background-color: rgb(218, 140, 139)
          }
          .locked a.reg-btn.si:hover {
            background-color: rgb(168, 106, 105)
          }
          .locked a.reg-btn.su {
            background-color: rgba(192, 84, 82, 1)
          }
            .locked a.reg-btn.su:hover {
            background-color: rgba(150, 64, 62, 1)
          }
        `}</style>
      }/>
      <main style={{ backgroundColor: "rgb(218, 140, 139)"}}>
        <section id="heading-lofi-video" className="full-page">
          <div id="heading-banner" className="full-page absolute z-10">
            <div className="transparent-mask"></div>
            <h1 className="title banner-text text-white">Rand&apos;s Lounge</h1>
            <TypeAnimation 
              sequence={[
                "Place to relax your mind, and my mind too.",
                4000,
                "Also great for studying, focusing, and working.",
                4000,
                "Lofi, Jazz, Synthwave, and more.",
                3000,
                "I even have a manga collection here lol.",
                3000,
              ]}
              className="typing-text text-white text-sm nmob:text-lg sm:text-xl md:text-2xl lg:text-4xl font-comic-relief"
              style={{ opacity: 0, transition: "opacity 1s ease-in" }}
              repeat={Infinity}
              deletionSpeed={80}
            />
          </div>
          <iframe className="full-page" src="https://www.youtube.com/embed/1Tl2FtV06qo?si=bsjj586f15V7Id9b&amp;autoplay=1&amp;loop=1&amp;mute=1&amp;controls=0&amp;rel=0" title="YouTube video player" loading="lazy" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </section>
        <section className="break bg-black">
          <div>
            <div className="flex flex-row items-center justify-evenly">
              <Image id="smile-listen-to-music" alt="smile listen to music" name="smile listen to music.png" dir="stickers/" constant />
              <h1 id="music-on-your-demand" className="relative z-[2] art-text py-[1em] md:py-[2em] font-bangers text-3xl nmob:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#1DB954]">Music on your demand!</h1>
            </div>
            {
              // Development
              // (authUser.isAuthUser && authUser.isAuthUser.email_confirmed_at) &&
              // Production
              ((process.env.NODE_ENV === "production" && !(authUser.isAuthUser && authUser.isAuthUser.email_confirmed_at)) || (process.env.NODE_ENV !== "production" && (authUser.isAuthUser && authUser.isAuthUser.email_confirmed_at))) &&
              <div className="w-full absolute bottom-0 h-full z-[4]" style={{ backdropFilter: 'blur(1rem)' }}></div>
            }
          </div>
          {   
              // Development
              // (authUser.isAuthUser && authUser.isAuthUser.email_confirmed_at) &&
              // Production
              ((process.env.NODE_ENV === "production" && !(authUser.isAuthUser && authUser.isAuthUser.email_confirmed_at)) || (process.env.NODE_ENV !== "production" && (authUser.isAuthUser && authUser.isAuthUser.email_confirmed_at))) &&
              <div className="z-[5] locked">
                  <h1>Sign up for more access!</h1>
                  <div className="flex flex-row items-center gap-x-8 my-8">
                    <a className="reg-btn su" href="/registration?page=register">Sign Up</a>
                    <a className="reg-btn si" href="/registration?page=login">Log In</a>
                  </div>
              </div>
          }
        </section>
        {
          // Development
          // !(authUser.isAuthUser && authUser.isAuthUser.email_confirmed_at) && 
          // Production
          ((process.env.NODE_ENV === "production" && (authUser.isAuthUser && authUser.isAuthUser.email_confirmed_at)) || (process.env.NODE_ENV !== "production" && !(authUser.isAuthUser && authUser.isAuthUser.email_confirmed_at))) &&
          <>
            <section id="music">
              <Coroussel
                totalPages={3}
                corousselElements={[
                  <Radios key={1} name="Lofi" data={{
                    // "f-c": "C4qJeIjNd2U",

                    "hh-rs": "X4VbdwhkE10",
                    "hh-sc": "JD-kMIpDfnY",
                    "a-rs": "1Tl2FtV06qo",
                    "pp-fs": "N0snMcR6aaA",
                    "j-cs": "E2vONfzoyRI",
                    "s-rd": "CwPCy1GLS38",
                    "m-sm": "IxPANmjPaek",
                    "c-rs": "jXAEIWcGXwE",
                    "s-cg": "4xDzrJKXOOY",
                  }} functions={{
                    getIframeId: (pn, mn) => {
                      switch (`${pn} - ${mn}`) {
                        // case "Festival - Christmas": return "f-c";

                        case "Hip Hop - Relax/Study": return "hh-rs";
                        case "Hip Hop - Sleep/Chill": return "hh-sc";
                        case "Asian - Relax/Study": return "a-rs";
                        case "Sad - Rainy Days": return "s-rd";
                        case "Medieval - Scribing Manuscripts": return "m-sm";
                        case "Peacful Piano - Focus/Study": return "pp-fs";
                        case "Classical - Read/Study": return "c-rs";
                        case "Synthwave - Chill/Gaming": return "s-cg";
                        case "Jazz - Chill/Study": return "j-cs";
                      }
                    },
                    getIframeDescription: (id) => {
                      return id === "hh-rs" ? "Hip Hop - Relax/Study" : 
                        id === "hh-sc" ? "Hip Hop - Sleep/Chill" : 
                        id === "a-rs" ? "Asian - Relax/Study" : 
                        id === "s-rd" ? "Sad - Rainy Days" : 
                        id === "m-sm" ? "Medieval - Scribing Manuscripts" :
                        id === "pp-fs" ? "Peacful Piano - Focus/Study" : 
                        id === "c-rs" ? "Classical - Read/Study" : 
                        id === "s-cg" ? "Synthwave - Chill/Gaming" : 
                        id === "j-cs" ? "Jazz - Chill/Study" : ""
                        
                        // id === "f-c" ? "Festival - Christmas" : ""
                    },
                    setToasterIsPlayingState: (iframeId, state, setStateFunction) => {
                      switch (iframeId) {
                        // case "f-c":
                        //     setStateFunction((prev) => ({...prev, playlist: "Festival", music: "Christmas", state, category: "Lofi Radio", subcategory: undefined }));
                        //     break;

                        case "hh-rs":
                            setStateFunction((prev) => ({...prev, playlist: "Hip Hop", music: "Relax/Study", state, category: "Lofi Radio", subcategory: undefined }));
                            break;
                        case "hh-sc":
                            setStateFunction((prev) => ({...prev, playlist: "Hip Hop", music: "Sleep/Chill", state, category: "Lofi Radio", subcategory: undefined }));
                            break;
                        case "c-rs":
                            setStateFunction((prev) => ({...prev, playlist: "Classical", music: "Read/Study", state, category: "Lofi Radio", subcategory: undefined }));
                            break;
                        case "a-rs":
                            setStateFunction((prev) => ({...prev, playlist: "Asian", music: "Relax/Study", state, category: "Lofi Radio", subcategory: undefined }));
                            break;
                        case "s-rd":
                            setStateFunction((prev) => ({...prev, playlist: "Sad", music: "Rainy Days", state, category: "Lofi Radio", subcategory: undefined }));
                            break;
                        case "m-sm":
                            setStateFunction((prev) => ({...prev, playlist: "Medieval", music: "Scribing Manuscripts", state, category: "Lofi Radio", subcategory: undefined }));
                            break;
                        case "pp-fs":
                            setStateFunction((prev) => ({...prev, playlist: "Peacful Piano", music: "Focus/Study", state, category: "Lofi Radio", subcategory: undefined }));
                            break;
                        case "s-cg":
                            setStateFunction((prev) => ({...prev, playlist: "Synthwave", music: "Chill/Gaming", state, category: "Lofi Radio", subcategory: undefined }));
                            break;
                        case "j-cs":
                            setStateFunction((prev) => ({...prev, playlist: "Jazz", music: "Chill/Study", state, category: "Lofi Radio", subcategory: undefined }));
                            break;
                      }
                    }
                  }}/>,
                  <Radios key={2} name="Jazz" data={{
                    "j-fj": "LqpBBSdxvDg",
                    "j-gj": "lq_bftO4_Bs",
                  }} functions={{
                    getIframeId: (pn, mn) => {
                      switch (`${pn} - ${mn}`) {
                        case "Jazzoppa - Fieren Jazz": return "j-fj";
                        case "Jazzoppa - Ghibli Jazz": return "j-gj";
                      }
                    },
                    getIframeDescription: (id) => {
                      return id === "j-fj" ? "Jazzoppa - Fieren Jazz" : 
                        id === "j-gj" ? "Jazzoppa - Ghibli Jazz" : ""
                    },
                    setToasterIsPlayingState: (iframeId, state, setStateFunction) => {
                      switch (iframeId) {
                        case "j-fj":
                            setStateFunction((prev) => ({...prev, playlist: "Jazzoppa", music: "Fieren Jazz", state, category: "Jazz Radio", subcategory: undefined }));
                            break;
                        case "j-gj":
                            setStateFunction((prev) => ({...prev, playlist: "Jazzoppa", music: "Ghibli Jazz", state, category: "Jazz Radio", subcategory: undefined }));
                            break;
                      }
                    }
                  }}/>,
                  <MusicLibrary key={3} />,
                  // <MyMusicPlayer key={4} />
                ]}
                corousselWrappersStyle={[
                  {},
                  {},
                  {
                    overflow: "hidden"
                  }
                ]}
                backgroundImageDir={false}
              />
            </section>
            <section className="break flex flex-col items-center" style={{ backgroundImage: "linear-gradient(black 50%, rgb(169, 95, 47))" }}>
              <div className="w-full flex flex-row items-center justify-evenly">
                <div>
                  <Image id="falling-book" alt="falling book" name="falling-book.png" constant  />
                </div>
                <h1 id="im-a-bookworm" className="relative z-10 art-text py-[1em] md:py-[2em] font-bangers text-3xl nmob:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#1DB954]">I&apos;m a bookworm!</h1>
              </div>
              <Image cls="w-full" alt="bookpile" name="pile of books.png" style={{ maskImage: "linear-gradient(black 80%, transparent 100%)" }} constant/>
            </section>
            <section className="h-screen w-screen flex items-center justify-center" style={{
              backgroundColor: "rgb(169, 95, 47)",
            }}>
              <Image cls="w-full h-full" alt="old library" name="old-library-bg.jpg" style={{ 
                position: "absolute",
                zIndex: 0,
                maskImage: "linear-gradient(transparent, black 20%)",
                objectFit: "cover",
              }} constant />
              <BookShelf />
            </section>
          </>
        }
      </main>
      <CWRFooter arbitraryCSSRules={
        <style>{`
          footer {
            background-color: rgb(155, 51, 49)
          }
          footer > :last-child {
            background-image: linear-gradient(to bottom, transparent, #ffa0cf)
          }
        `}</style>
      } />
      <MusicLibraryDialog />
      <BookContent />
      <RadioToast radioNameList={["Lofi", "Jazz"]}/>
      <Script src="https://www.youtube.com/iframe_api" />
    </MusicStateProvider>
  );
}


