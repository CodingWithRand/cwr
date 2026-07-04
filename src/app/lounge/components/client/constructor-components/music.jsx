

import Client from "@/glient/util";
import { useRef, useState, useEffect } from "react";
import musicId from "../../musicId.json";
import { Direction, Range } from "react-range";
import { useGlobal } from "@/glient/global";
import { 
    useMusic,
    DiceSVG,
    playMusic,
    getRandomMusic,
    nextMusicInLib,
    PlaylistLibCard,
    MusicLibraryCard,
    MusicCard,
    CategoryTitle
} from "../utility-components";

function Radio({ name, id, src, functions }){
    return (
        <div className="item gap-y-2 lrc" popover="auto" onClick={(e) => e.target.togglePopover()}>
            <iframe id={id} className={`relative z-[2] ${name.toLowerCase()} radio`} src={`${src}?controls=0&enablejsapi=1`} title="YouTube video player" loading="lazy" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <div className="ctrl-btn-sec relative z-[1] flex flex-col items-center gap-y-2">
                <h3 className="radio-name font-comic-relief text-white text-lg">{functions.getIframeDescription(id)}</h3>
                <button id={id} className="round-btn control-btn" onClick={(e) => functions.play(e, id)} onMouseEnter={functions.selection} onMouseLeave={functions.deselection}>
                    <img id={id} className="control-btn-icon" src="/imgs/backend-images/icon/play-button.png" alt="control button" width={30} height={30} />
                </button>
            </div>
        </div>
    )
}

export function Radios({ name, data, functions }){
    const { getIframeId, getIframeDescription, setToasterIsPlayingState } = functions;
    const { Image } = Client.Components.Dynamic
    const RadioPlayers = useRef({});
    const { player, isPlayingState } = useMusic();
    const { isPlaying, setIsPlaying } = isPlayingState;
    const [ isIframePlaying, setIsIframePlaying ] = useState({});

    useEffect(() => {
        let isPlayingDict = {}
        for (const playerId of document.querySelectorAll(`.${name.toLowerCase()}.radio`)) isPlayingDict[playerId.id] = false;
        setIsIframePlaying(isPlayingDict);
    }, []);

    useEffect(() => {
        if (isPlaying.category !== `${name} Radio`) return;
        if (!isPlaying.playlist || !isPlaying.music) return;
        let iframeId = getIframeId(isPlaying.playlist, isPlaying.music);
        
        setIsIframePlaying((prev) => ({ ...prev, [iframeId]: isPlaying.state }));
    }, [isPlaying.playlist, isPlaying.music]);

    Client.Hooks.useDelayedEffect(() => {
        if (isPlaying.category !== `${name} Radio`) return;
        if (Object.values(isIframePlaying).every((value) => value === false)){
            document.querySelectorAll(`.control-btn`).forEach((e) => e.style.pointerEvents = "initial");
            return;
        }
        for (const id in isIframePlaying) {
            document.querySelector(`#${id}.control-btn`).style.pointerEvents = "none";
            if (isIframePlaying[id]){
                document.querySelector(`#${id}.control-btn`).style.pointerEvents = "initial";
            }
        }
    }, [isIframePlaying, isPlaying.category], 100);
    
    function selection(e){
        e.target.classList.add("selected");
        e.target.parentElement.querySelector(".radio-name").classList.add("selected");
        e.target.parentElement.parentElement.querySelector(`.${name.toLowerCase()}.radio`).classList.add("selected");
    }
    
    function deselection(e){
        if (isIframePlaying[e.target.id]) return;
        e.target.classList.remove("selected");
        e.target.parentElement.querySelector(".radio-name").classList.remove("selected");
        e.target.parentElement.parentElement.querySelector(`.${name.toLowerCase()}.radio`).classList.remove("selected");
    }

    function play(e, id){
        e.stopPropagation();
        for (let i = 0; i < document.querySelectorAll(".control-btn").length; i++){
            const btn = document.querySelectorAll(".control-btn")[i];
            if (btn.id !== id) {
                btn.classList.remove("selected");
                btn.parentElement.querySelector(".radio-name").classList.remove("selected");
                btn.parentElement.parentElement.querySelector(`.radio`).classList.remove("selected");
            }
        }
        const cpi = id;
        if (!isIframePlaying[cpi]) {
            if (!RadioPlayers.current[cpi]) {
            RadioPlayers.current[cpi] = new window.YT.Player(cpi, {
                events: {
                onReady: (event) => {
                    event.target.setPlaybackQuality('hd1080'); 
                    event.target.playVideo();
                    event.target.setVolume(isPlaying.volume[0]);
                },
                onStateChange: (event) => {
                    if (event.data === window.YT.PlayerState.PAUSED) {
                    setIsIframePlaying((prev) => ({ ...prev, [cpi]: false }));
                    }
                },
                }
            });
            } else {
                RadioPlayers.current[cpi].playVideo();
            }
            setToasterIsPlayingState(cpi, true, setIsPlaying);
            player.current = RadioPlayers.current[cpi];
            e.target.classList.add("selected");
            e.target.parentElement.parentElement.querySelector(".radio-name").classList.add("selected");
            document.getElementById(cpi).classList.add("selected");
            document.querySelector(`#${cpi}.control-btn-icon`).src = "/imgs/backend-images/icon/pause.png";
            document.querySelector(`#${name.toLowerCase()}-radios .belt`).style.animationPlayState = "paused";
            setIsIframePlaying((prev) => ({ ...prev, [cpi]: true }));
        } else {
            RadioPlayers.current[cpi].pauseVideo();
            setToasterIsPlayingState(cpi, false, setIsPlaying);
            setIsIframePlaying((prev) => ({ ...prev, [cpi]: false }));
        }
    }
    
    return(
        <div className="h-full overflow-hidden">
            <h2 className="flex items-center justify-center gap-x-4 text-[#dc503b] font-comic-relief h-concerned text-center text-5xl nmob:text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                {
                    name === "Lofi" ?
                    <>
                        <Image id="lofi-girl" alt="lofi-girl" name="lofi-girl.png" dir="icon/" constant />
                        Lofi Radio
                    </>
                    :
                    name === "Jazz" ?
                    <>
                        Jazz Radio
                    </>
                    :
                    <></>
                }
            </h2>
            <div className="conveyor h-[60%] w-full radios" id={`${name.toLowerCase()}-radios`}>
                <div className="belt" style={{
                    "--radio-count": Object.keys(data).length
                }}>
                    {
                        Object.entries(data).map(([id, src], i) => (
                            <Radio key={i} name={name} id={id} src={`https://www.youtube.com/embed/${src}`} functions={{ play, selection, deselection, getIframeDescription }} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export function MusicLibrary(){
    const { Image } = Client.Components.Dynamic
    const { winSize, device } = useGlobal();
    const { isPlayingState, speakerUID, player } = useMusic();
    const { isPlaying, setIsPlaying } = isPlayingState;
    const { speakerUniqueId, setSpeakerUniqueId } = speakerUID;
    const conveyorElem = useRef(null);

    let constant = { isPlaying, setIsPlaying, player, setSpeakerUniqueId };

    useEffect(() => {
        const scrollHorizontally = (e) => {
            e.preventDefault();
            if (device.device !== "xs") {
                e.currentTarget.scrollBy({
                    left: e.deltaY * 2, // scroll horizontally by the amount of vertical scroll
                    top: 0, // don't scroll vertically
                    behavior: 'smooth' // smooth scrolling
                });
            }
        }
        conveyorElem.current.addEventListener('wheel', scrollHorizontally, { passive: false });
        return () => {
            if (conveyorElem.current) {
                conveyorElem.current.removeEventListener('wheel', scrollHorizontally);
            }
        }
    }, [conveyorElem])

    function playRandomly(e){ 
        setIsPlaying((prev) => ({...prev, state: false}));
        if(player.current) player.current.pauseVideo();
        constant["e"] = e;
        const { playlist, music, id } = getRandomMusic();
        playMusic({ 
            c: "Random",
            playlist, music, id, 
            recursiveFunction: playRandomly,
            isRfDOMEvent: true,
            globallyRandom: true
        }, constant);
    }

    return(
        <div className="flex flex-col items-center h-[95%] relative">
            <h2 className="text-[#9b3331] font-comic-relief py-16 text-center text-5xl nmob:text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                Music Library
            </h2>
            <div ref={conveyorElem} className="conveyor" id="playlists" style={{
                overflowY: device.device === "xs" ? "auto" : "hidden",
                overflowX: device.device === "xs" ? "hidden" : "auto",
                justifyContent: (winSize.windowSize[1] >= 1000 && winSize.windowSize[0] >= 2500) || device.device === "xs" ? "center" : undefined, //Still have to manually adjust the condition.
                gridTemplateColumns: device.device === "xs" ? "200px" : `repeat(${
                    Math.ceil((Object.keys(musicId).length +
                    Object.keys(musicId.BGM).length +
                    Object.keys(musicId["Game OST"]).length +
                    Object.keys(musicId["EToH OST"]).length +
                    Object.keys(musicId["Other OST"]).length)
                    /
                    (winSize.windowSize[1] >= 1000 ? Math.floor((winSize.windowSize[1] - 750) / 300) + 1 : 1))
                }, 200px)`,
                gridTemplateRows: 
                    device.device === "xs" ? `repeat(${
                        Object.keys(musicId).length +
                        Object.keys(musicId.BGM).length +
                        Object.keys(musicId["Game OST"]).length +
                        Object.keys(musicId["EToH OST"]).length +
                        Object.keys(musicId["Other OST"]).length 
                    }` : `repeat(${winSize.windowSize[1] >= 1000 ? Math.floor((winSize.windowSize[1] - 750) / 300) + 1 : 1}, 1fr)`
            }}>
                <CategoryTitle text="Background Music" />
                <PlaylistLibCard cate="BGM" name="Vindsvept" backdropColor="#402726" />
                <CategoryTitle text="Game OST" />
                <PlaylistLibCard cate="Game OST" name="DM DOKURO Calamity Mod" backdropColor="#A038C8" />
                <PlaylistLibCard cate="Game OST" name="A Hat in Time" backdropColor="#6070A0" />
                <PlaylistLibCard cate="Game OST" name="A Hat in Time (Seal the Deal)" backdropColor="#803800" />
                <PlaylistLibCard cate="Game OST" name="The Binding of Isaac" backdropColor="#382030" />
                <PlaylistLibCard cate="Game OST" name="The Binding of Isaac (Rebirth)" backdropColor="#650005" />
                <PlaylistLibCard cate="Game OST" name="The Binding of Isaac (Afterbirth)" backdropColor="#ef8778" />
                <PlaylistLibCard cate="Game OST" name="The Binding of Isaac (Repentance)" backdropColor="#b50017" />
                <PlaylistLibCard cate="Game OST" name="The Binding of Isaac (Antibirth)" backdropColor="#383030" />
                <PlaylistLibCard cate="Game OST" name="The Legend of Bum-bo" backdropColor="#42330A" />
                <PlaylistLibCard cate="Game OST" name="The Binding of Isaac (Lullabies)" backdropColor="#31372A" />
                <PlaylistLibCard cate="Game OST" name="The Binding of Isaac (Mutations)" backdropColor="#00355D" />
                <PlaylistLibCard cate="Game OST" name="Library of Ruina" backdropColor="#311f0bff" />
                <CategoryTitle text="EToH OST" />
                <PlaylistLibCard cate="EToH OST" name="ToTUTU" backdropColor="#f15555" />
                <PlaylistLibCard cate="EToH OST" name="ToLR" backdropColor="#5d4b02" /> 
                <CategoryTitle text="Other OST" />
                <PlaylistLibCard cate="Other OST" name="Fieren Beyond Journey's End" backdropColor="#99cba6" />
            </div>
            <div className="flex flex-row gap-x-4">
                <div className="flex flex-col items-center gap-y-2">
                    <button className="round-btn mt-4" onClick={() => document.getElementById("music-library").style.display = "block"}>
                        <Image name="search-interface-symbol.png" alt="search" dir="icon/" width={28} height={28} constant />
                    </button>
                    <span className="text-white font-comic-relief">Search</span>
                </div>
                <div className="flex flex-col items-center gap-y-2">
                    <button className="random-play round-btn mt-4" onClick={playRandomly}>
                        <DiceSVG width={28} height={28} number={1} />
                    </button>
                    <span className="text-white font-comic-relief">Random</span>
                </div>
            </div>
            <div id="speaker-hidden-container">
                <div id={speakerUniqueId}></div>
            </div>
        </div>
    )
}

export function RadioToast({ radioNameList }){
    const { isPlayingState, player, speakerUID, cs } = useMusic();
    const { device, authUser } = useGlobal();
    const { isPlaying, setIsPlaying } = isPlayingState;
    const { setSpeakerUniqueId } = speakerUID;
    const { currentSearching } = cs;
    const { Image } = Client.Components.Dynamic

    let constant = { isPlaying, setIsPlaying, player, setSpeakerUniqueId };

    Client.Hooks.useDelayedEffect(() => {
        if(!player.current) return;
        console.log(player.current)
        if(isPlaying.state){ 
            player.current?.playVideo();
        } else {
            player.current?.pauseVideo();
        }
    }, [isPlaying.state], 100)

    useEffect(() => {
        // Comment below if in development
        if(process.env.NODE_ENV === "production" && !authUser.isAuthUser && !authUser.isAuthUser?.email_confirmed_at) return;
        if (!isPlaying.state){
            document.querySelectorAll('.belt').forEach((b) => b.style.animationPlayState = "running");
            // document.querySelector(`${
            //     isPlaying.category === "Lofi Radio" ? "#lofi-radios" :
            //     isPlaying.category === "Jazz Radio" ? "#jazz-radios" : ""
            // } .belt`).style.animationPlayState = "running";
            document.querySelectorAll(".control-btn-icon").forEach((cbi) => {
                cbi.src = "/imgs/backend-images/icon/play-button.png"
            });
            document.querySelectorAll(".control-btn").forEach((cb) => {
                cb.src = "/imgs/backend-images/icon/play-button.png"
                cb.classList.remove("selected")
            });

            radioNameList.forEach((rn) => {
                document.querySelectorAll(`.${rn.toLowerCase()}.radio`).forEach((lr) => lr.classList.remove("selected"));
            })

            document.querySelectorAll(".radio-name").forEach((rn) => {
                rn.classList.remove("selected")
            });
        }

        if (isPlaying.state && !radioNameList.includes(isPlaying.category)){
            document.querySelectorAll(".control-btn").forEach((e) => e.style.pointerEvents = "none");
        } else if (!isPlaying.state && !radioNameList.includes(isPlaying.category)) {
            document.querySelectorAll(".control-btn").forEach((e) => e.style.pointerEvents = "initial");
        }
    }, [isPlaying.state, isPlaying.category])

    useEffect(() => {
        // Comment below if in development
        if(process.env.NODE_ENV === "production" && !authUser.isAuthUser?.email_confirmed_at) return;
        let showNameTimeout;
        let hideNameTimeout;
        if(device.device !== "lg" && device.device !== "xl" && device.device !== "2xl"){
            showNameTimeout = setTimeout(() => document.getElementById("mn-dialog").show(), 100);
            hideNameTimeout = setTimeout(() => document.getElementById("mn-dialog").close(), 3100);
        } else {
            showNameTimeout = setTimeout(() => document.getElementById("music-name").style.width = `${160 + ((isPlaying.playlist.length + isPlaying.music.length) * 10)}px`, 100);
            hideNameTimeout = setTimeout(() => document.getElementById("music-name").style.width = 0, 3100);
        }
        return () => {
            clearTimeout(showNameTimeout);
            clearTimeout(hideNameTimeout);
        }
    }, [isPlaying.playlist, isPlaying.music, device.device]);

    function isRadio(){
        let iframeId;
        switch (`${isPlaying.playlist} - ${isPlaying.music}`) {
            case "Hip Hop - Relax/Study": iframeId = "hh-rs"; break;
            case "Hip Hop - Sleep/Chill": iframeId = "hh-sc"; break;
            case "Asian - Relax/Study": iframeId = "a-rs"; break;
            case "Sad - Rainy Days": iframeId = "s-rd"; break;
            case "Peacful Piano - Focus/Study": iframeId = "pp-fs"; break;
            case "Classical - Read/Study": iframeId = "c-rs"; break;
            case "Medieval - Scribing Manuscripts": iframeId = "m-sm"; break;
            case "Synthwave - Chill/Gaming": iframeId = "s-cg"; break;
            case "Jazz - Chill/Study": iframeId = "j-cs"; break;
            
            case "Jazzoppa - Fieren Jazz": iframeId = "j-fj"; break;
            case "Jazzoppa - Ghibli Jazz": iframeId = "j-gj"; break;

            default:
                iframeId = "speaker";
        }
        return [iframeId, iframeId !== "speaker"];
    }

    function playOnToast(e){
        let iframeId = isRadio()[0];
        setIsPlaying((prevState) => ({ ...prevState, state: !prevState.state }))
        if(isRadio()[1]){
            if(isPlaying.state){
                document.querySelector(`#${iframeId}.control-btn-icon`).src = "/imgs/backend-images/icon/play-button.png";
                document.querySelector(`${
                    isPlaying.category === "Lofi Radio" ? "#lofi-radios" :
                    isPlaying.category === "Jazz Radio" ? "#jazz-radios" : ""
                } .belt`).style.animationPlayState = "running";
            } else {   
                document.querySelector(`#${iframeId}.control-btn-icon`).src = "/imgs/backend-images/icon/pause.png";
                document.querySelector(`#${
                    isPlaying.category === "Lofi Radio" ? "#lofi-radios" :
                    isPlaying.category === "Jazz Radio" ? "#jazz-radios" : ""
                } .belt`).style.animationPlayState = "paused";
            }
        }
    }

    function skipOnToast(e){
        if(radioNameList.includes(isPlaying.category)) return;
        else if(isPlaying.category === "Random") {
            if(!isPlaying.globallyRandom){
                if(currentSearching.cate) document.getElementById(isPlaying.playlist).querySelector(".random-play").click();
                else document.getElementById(isPlaying.subcategory).querySelector(".random-play").click();
            }
            else document.querySelector(".random-play").click();
        }
        else if(isPlaying.category === "Normal") {
            if(isPlaying.subcategory){
                constant["e"] = e
                const names = Object.keys(musicId[isPlaying.subcategory][isPlaying.playlist]);
                nextMusicInLib(isPlaying.playlist, names.indexOf(isPlaying.music), Object.values(musicId[isPlaying.subcategory][isPlaying.playlist]), names, isPlaying.subcategory, constant);
            }
        }
    }

    return(
        (isPlaying.playlist && isPlaying.music) && 

        <div className="toast-container">
            <button onClick={playOnToast} className="toast-btn">
                <img src={`/imgs/backend-images/icon/${isPlaying.state ? "pause" : "play-button"}.png`} alt="control-btn" width={25} height={25} />
            </button>
            <button id="skip-play-btn" disabled={radioNameList.includes(`${isPlaying.category} Radio`)} onClick={skipOnToast}>
                <Image name="next-button.png" alt="next-play-btn" dir="icon/" width={25} height={25} constant />
            </button>
            <button id="show-mn-btn" onClick={() => {
                if(document.getElementById("mn-dialog").open) document.getElementById("mn-dialog").close();
                else document.getElementById("mn-dialog").show()
            }}>
                <Image name="name-tag.png" alt="name-tag" dir="icon/" width={25} height={25} constant />
            </button>
            <button onClick={() => {
                if(document.getElementById("volume-slider").style.display === "block") document.getElementById("volume-slider").style.display = "none";
                else document.getElementById("volume-slider").style.display = "block"
            }}>
                <img src={`/imgs/backend-images/icon/${isPlaying.volume[0] === 0 ? "muted" : "audio"}.png`} alt="volume-btn" width={25} height={25} />
                <div id="volume-slider" style={{ display: "none" }}>
                <Range
                    direction={Direction.Up}
                    min={0}
                    max={100}
                    step={1}
                    values={isPlaying.volume}
                    onChange={(values) => setIsPlaying((prev) => ({...prev, volume: values }))}
                    renderTrack={({ props, children }) => (
                        <div
                        {...props}
                        style={{
                            ...props.style,
                            height: "50px",
                            width: "6px",
                            borderRadius: "9999px",
                            backgroundColor: "#fff",
                        }}
                        >
                        {children}
                        </div>
                    )}
                    renderThumb={({ props }) => (
                        <div
                        {...props}
                        key={props.key}
                        style={{
                            ...props.style,
                            height: "15px",
                            width: "15px",
                            borderRadius: "9999px",
                            backgroundColor: "#999",
                        }}
                        />
                    )}
                />
            </div>
            </button>
            <div id="music-name" style={{ width: 0 }} className="font-comic-relief text-white">{`Now playing: ${isPlaying.playlist} - ${isPlaying.music}`}</div>
            <dialog id="mn-dialog">
                <div>{`Now playing: ${isPlaying.playlist} - ${isPlaying.music}`}</div>
            </dialog>
        </div>

    )
}

export function MusicLibraryDialog(){
    const { Image } = Client.Components.Dynamic
    const { cs, mlList } = useMusic();
    const { showingList, setShowingList } = mlList;
    const { currentSearching, setCS } = cs;

    function showAllCate(){
        let list = [];
        Object.keys(musicId).forEach((cate, i) => list.push(<MusicLibraryCard key={cate} nth={i} cate={cate} />));
        return list
    }

    function searchCheck(e){
        setShowingList((() => {
            let list = [];
            let i = 0;
            if (Object.values(currentSearching).every((v) => v === undefined)) {
                Object.keys(musicId).forEach((cate) => {
                    const searchPattern = new RegExp(`(${e.target.value})+`, "g")
                    if(cate.match(searchPattern)){
                        list.push(<MusicLibraryCard key={cate} nth={i} matchedSearch={libName.match(searchPattern)} cate={cate} />)
                        i++;
                    }
                })
            } else if (currentSearching.cate && !currentSearching.lib) {
                Object.keys(musicId[currentSearching.cate]).forEach((libName) => {
                    const searchPattern = new RegExp(`(${e.target.value})+`, "g")
                    if(libName.match(searchPattern)){
                        list.push(<MusicLibraryCard key={libName} nth={i} matchedSearch={libName.match(searchPattern)} cate={currentSearching.cate} libName={libName} />)
                        i++;
                    }
                })
            } else if (currentSearching.cate && currentSearching.lib) {
                Object.keys(musicId[currentSearching.cate][currentSearching.lib]).forEach((musicName) => {
                    const searchPattern = new RegExp(`(${e.target.value})+`, "g")
                    if(musicName.match(searchPattern)){
                        list.push(<MusicCard key={musicName} nth={i} musicName={musicName} matchedSearch={musicName.match(searchPattern)} />)
                        i++;
                    }
                })
            }
            
            return list
        })())
    }

    useEffect(() => setShowingList(showAllCate()), [])

    return(
        <div id="music-library" className="pseudo-modal" style={{ display: "none" }}>
            <div className="music-library-container">
                <div className="flex flex-col w-full items-center">
                    <div id="lib-search-bar">
                        <input placeholder="Search for music here" onChange={searchCheck} type="text"/>
                        <Image name="search-interface-symbol.png" alt="search" dir="icon/" width={28} height={28} constant />
                    </div>
                    <div className="lib-list">
                        {showingList}
                    </div>
                </div>
                
                <div className="flex flex-row justify-center gap-x-4">
                    { Object.values(currentSearching).some((v) => v !== undefined) &&
                        <button onClick={() => {
                            if(currentSearching.cate && !currentSearching.lib){
                                setCS({ cate: undefined, lib: undefined });
                                setShowingList(showAllCate())
                            } else if (currentSearching.cate && currentSearching.lib){
                                setCS((prev) => ({...prev, lib: undefined}));
                                setShowingList((() => {
                                    let list = [];
                                    Object.keys(musicId[currentSearching.cate]).forEach((libName, i) => list.push(<MusicLibraryCard key={libName} nth={i} cate={currentSearching.cate} libName={libName} />))
                                    return list
                                })())
                            }
                        }}>
                            <Image name="left-arrow.png" alt="left-arrow" dir="icon/" width={28} height={28} constant />
                        </button>
                    }
                    <button onClick={() => document.getElementById("music-library").style.display = "none"}>
                        <Image name="close.png" alt="close" dir="icon/" width={28} height={28} constant />
                    </button>
                </div>
            </div>
        </div>
    )
}

export function MyMusicPlayer() {
    return <>
        <div className="flex flex-col items-center h-full relative">
            <h2 className="text-[#e96d6b] font-comic-relief py-16 text-center text-3xl nmob:text-4xl sm:text-5xl md:text-6xl lg:text-8xl">
                Play your own <span id="rainbow-text">playlist</span>
            </h2>
            <div className="w-[75%] h-[400px] grid grid-cols-[25%_calc(75%_-_1rem)] gap-4 justify-items-center">
                <div className="w-full h-full flex flex-col gap-y-4">
                    <div className="h-1/2 bg-white/50 flex items-center justify-center">
                        <button className="w-[90%] h-[90%] flex flex-col items-center justify-center" style={{
                            border: "5px dashed white"
                        }}>
                            <span className="text-white font-comic-relief text-8xl" style={{ lineHeight: 0.75 }}>+</span>
                            <span className="text-white font-comic-relief text-xl">Add a music</span>
                        </button>
                    </div>
                    <div className="h-1/2 bg-white/50 flex items-center justify-center">
                        <button className="w-[90%] h-[90%] flex flex-col items-center justify-center" style={{
                            border: "5px dashed white"
                        }}>
                            <span className="text-white font-comic-relief text-8xl" style={{ lineHeight: 0.75 }}>+</span>
                            <span className="text-white font-comic-relief text-xl">Import from a playlist</span>
                        </button>
                    </div>
                </div>
                <div className="relative w-full h-full flex items-center justify-center">
                    <h3 className="absolute top-[-3rem] right-[-1.5rem] rotate-4 lg:rotate-2 text-white font-comic-relief text-center text-sm sm:text-lg md:text-xl lg:text-3xl">Your created playlist will show here!</h3>
                    <div className="overflow-scroll h-full w-full grid grid-cols-2 md:grid-cols-3 auto-rows-[calc(50%_-_0.5rem)] gap-4">
                        <div className="bg-white/50 w-full h-full"></div>
                        <div className="bg-white/50 w-full h-full"></div>
                        <div className="bg-white/50 w-full h-full"></div>
                        <div className="bg-white/50 w-full h-full"></div>
                        <div className="bg-white/50 w-full h-full"></div>
                        <div className="bg-white/50 w-full h-full"></div>
                        <div className="bg-white/50 w-full h-full"></div>
                        <div className="bg-white/50 w-full h-full"></div>
                        <div className="bg-white/50 w-full h-full"></div>
                        <div className="bg-white/50 w-full h-full"></div>
                        <div className="bg-white/50 w-full h-full"></div>
                        <div className="bg-white/50 w-full h-full"></div>
                        <div className="bg-white/50 w-full h-full"></div>
                        <div className="bg-white/50 w-full h-full"></div>
                    </div>
                </div>
            </div>
        </div>
    </>
}