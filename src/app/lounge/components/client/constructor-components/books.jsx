import { Application, extend } from "@pixi/react";
import { Container, Graphics, Sprite, Texture, Assets, Rectangle } from "pixi.js";

import { useRef, useState, useEffect } from "react";
import { useGlobal } from "@/glient/global";
import { Book } from "../utility-components";
import bookMetadataList from "../../bookmetadata.json";

extend({
    Container,
    Graphics,
    Sprite,
})

export function BookContent() {
    return(
        <div id="book-content" style={{ display: "none" }}>
            <div className="inner-cover">
                <div className="pages">
                    <iframe id="book-website-embed" loading="lazy"></iframe> 
                    <div className="book-nav-ctrl-btns">
                        <button className="close" onClick={() => document.getElementById("book-content").style.display = "none"}>✕</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function BookShelf(){
    const defaultSpriteSizes = {
        container: {
            width: 550,
            height: 560
        },
        shelf: {
            s1: {
                width: 530,
                height: 120
            }
        },
        bookshelf: 0.125
    }
    const parent = useRef(null);
    const bookshelf = useRef(null);
    const { device } = useGlobal();
    const [ textures, setTextures ] = useState(Texture.EMPTY);
    const [ spriteSizes, setSpriteSizes ] = useState(defaultSpriteSizes);
    const [ dialogPos, setDialogPos ] = useState({ x: 0, y: 0 });
    const [ bookMetadata, setBookMetadata ] = useState({
        title: "",
        link: "",
        allowEmbed: false,
        coverColor: "#ffffff"
    });

    function showBookCover(e, bmd){
        e.stopPropagation();
        const { x, y } = e.data.global;
        setDialogPos({ x: x, y: y - 50 });
        setBookMetadata({ 
            title: bmd.title,
            link: bmd.link, 
            allowEmbed: bmd.embed, 
            coverColor: bmd.coverColor
        });
        document.getElementById("link-dialog").show();
    }

    function openBookOnline(e) {
        document.getElementById("link-dialog").close();
        if(bookMetadata.allowEmbed){
            e.preventDefault();
            document.getElementById("book-website-embed").src = bookMetadata.link;
            document.querySelector("#book-content .inner-cover").style.backgroundColor = bookMetadata.coverColor;
            document.getElementById("book-content").style.display = "block";
        }
    }

    function openBook(e) {
        document.getElementById("link-dialog").close();
        if(bookMetadata.allowEmbed){
            e.preventDefault();
            document.getElementById("book-website-embed").src = bookMetadata.link;
            document.querySelector("#book-content .inner-cover").style.backgroundColor = bookMetadata.coverColor;
            document.getElementById("book-content").style.display = "block";
        }
    }

    useEffect(() => {
        (async () => {
            await Assets.init({ manifest: "/asset-bundles-manifest.json" })
            if (textures === Texture.EMPTY) {
                Assets
                    .loadBundle("library")
                    .then((loaded) => {
                        setTextures(loaded)
                    })
            }
        })()
    }, []);

    useEffect(() => {
        if (device.device === "sm"){
            setSpriteSizes((prev) => ({
                ...prev, 
                container: {
                    width: 438,
                    height: 535
                },
                bookshelf: 0.1
            }))
        } else if (device.device === "xs"){
            setSpriteSizes((prev) => ({
                ...prev, 
                container: {
                    width: 329,
                    height: 400
                },
                bookshelf: 0.075
            }))
        } else {
            setSpriteSizes(defaultSpriteSizes)
        }

        // return () => {
        //     if(bookshelf.current) {
        //         bookshelf.current.destroy({ children: true, texture: true, baseTexture: true });
        //     }
        // }
    }, [device.device])

    return (
        <>
            <div className="relative" ref={parent} style={{ width: `${spriteSizes.container.width}px`, height: `${spriteSizes.container.height}px`, boxShadow: "0 1rem 4rem black" }}>
                <Application resizeTo={parent}>
                    { textures.bookshelf && 
                        <pixiContainer x={0} y={0}
                            interactive={true}
                            hitArea={new Rectangle(0, 0, spriteSizes.container.width, spriteSizes.container.height)}
                            onClick={() => document.getElementById("link-dialog").close()}
                            onTap={() => document.getElementById("link-dialog").close()}
                        >
                            <pixiSprite
                                texture={textures.bookshelf}
                                x={0} y={0}
                                scale={spriteSizes.bookshelf}
                                ref={bookshelf}
                            />
                            <pixiContainer 
                                x={10} y={10} 
                                width={spriteSizes.shelf.s1.width} 
                                height={spriteSizes.shelf.s1.height}
                                cursor="pointer"
                        
                            >
                                <Book
                                    side="left"
                                    position={{ x: 50, y: 50 }} 
                                    thickness={30}
                                    height={70}
                                    color={{
                                        cover: 0x3366cc,
                                        spine: 0x254080,
                                        front: 0x99bbff
                                    }}
                                    event={{
                                        onClick: (e) => showBookCover(e, bookMetadataList.GiftLVL9999),
                                        onTap: (e) => showBookCover(e, bookMetadataList.GiftLVL9999)
                                    }}
                                />
                                <Book
                                    zIndex={2}
                                    side="right"
                                    position={{ x: 150, y: 40 }}
                                    thickness={15}
                                    height={80} 
                                    color={{
                                        cover: 0xff0000,
                                        spine: 0x800000,
                                        front: 0xff6666
                                    }}
                                    event={{
                                        onClick: (e) => showBookCover(e, bookMetadataList.ChroniclesAristocratIsekai),
                                        onTap: (e) => showBookCover(e, bookMetadataList.ChroniclesAristocratIsekai)
                                    }}
                                />
                                <Book
                                    zIndex={1}
                                    side="right"
                                    position={{ x: 170, y: 40 }}
                                    thickness={35}
                                    height={80} 
                                    color={{
                                        cover: 0x00ff00,
                                        spine: 0x008000,
                                        front: 0x66ff66
                                    }}
                                    event={{
                                        onClick: (e) => showBookCover(e, bookMetadataList.HangingOutWithAGamerGirl),
                                        onTap: (e) => showBookCover(e, bookMetadataList.HangingOutWithAGamerGirl)
                                    }}
                                />
                                <Book
                                    zIndex={1}
                                    side="right"
                                    position={{ x: 220, y: 40 }}
                                    thickness={15}
                                    height={80} 
                                    color={{
                                        cover: 0xffff00,
                                        spine: 0x808000,
                                        front: 0xffbb66
                                    }}
                                    event={{
                                        onClick: (e) => showBookCover(e, bookMetadataList.SOLInvicibleIsekaid),
                                        onTap: (e) => showBookCover(e, bookMetadataList.SOLInvicibleIsekaid)
                                    }}
                                />
                            </pixiContainer>
                        </pixiContainer>
                    }
                </Application>
                <dialog id="link-dialog" className="p-2 rounded-md" style={{ top: `${dialogPos.y}px`, left: `${dialogPos.x}px` }} >
                    <div className="size-fit text-center flex flex-col gap-4">
                        <h1 className="text-sky-500 text-sm md:text-lg">{bookMetadata.title}</h1>
                        <button className="text-xs md:text-base text-neutral-800" onClick={openBook}>« Read Now »</button>
                        <a className="text-xs md:text-sm text-neutral-400" href={bookMetadata.link} target="_blank" onClick={() => document.getElementById("link-dialog").close()}>« Read Online »</a>
                    </div>
                </dialog>
            </div>
            <div className="text-white sm:text-xs" style={{ position: "absolute", bottom: 0, left: 0 }}>
                Sorry for the inconvenience, but not all books on the shelf you can read on iframe on this site, since some sites don&apos;t allow embedding their content.
            </div>
        </>
    )
}