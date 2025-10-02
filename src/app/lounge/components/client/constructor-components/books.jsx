import { Application, extend } from "@pixi/react";
import { Container, Graphics, Sprite, Texture, Assets, Rectangle } from "pixi.js";

import { useRef, useState, useEffect } from "react";
import { useGlobal } from "@/glient/global";
import { Book } from "../utility-components";

extend({
    Container,
    Graphics,
    Sprite,
})

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
    const { device } = useGlobal();
    const [ textures, setTextures ] = useState(Texture.EMPTY);
    const [ spriteSizes, setSpriteSizes ] = useState(defaultSpriteSizes);
    const [ dialogPos, setDialogPos ] = useState({ x: 0, y: 0 });
    const [ bookMetadata, setBookMetadata ] = useState({
        title: "",
        link: ""
    });

    function showBookCover(e, title, link){
        e.stopPropagation();
        const { x, y } = e.data.global;
        setDialogPos({ x: x, y: y - 50 });
        setBookMetadata({ title, link });
        document.getElementById("link-dialog").show();
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
                                        onClick: (e) => showBookCover(
                                            e, 
                                            "My Gift LVL 9999 Unlimited Gacha Manga", 
                                            "https://mygiftlvl9999unlimitedgacha.com/"
                                        ),
                                        onTap: () => showBookCover(
                                            e, 
                                            "My Gift LVL 9999 Unlimited Gacha Manga", 
                                            "https://mygiftlvl9999unlimitedgacha.com/"
                                        )
                                    }}
                                />
                                <Book
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
                                        onClick: (e) => showBookCover(
                                            e, 
                                            "Chronicles of an Aristocrat Reborn in Another World", 
                                            "https://comick.io/comic/tensei-kizoku-no-isekai-boukenroku-jichou-wo-shiranai-kamigami-no-shito"
                                        ),
                                        onTap: () => showBookCover(
                                            e, 
                                            "Chronicles of an Aristocrat Reborn in Another World", 
                                            "https://comick.io/comic/tensei-kizoku-no-isekai-boukenroku-jichou-wo-shiranai-kamigami-no-shito"
                                        )
                                    }}
                                />
                            </pixiContainer>
                        </pixiContainer>
                    }
                </Application>
                <dialog id="link-dialog" style={{ top: `${dialogPos.y}px`, left: `${dialogPos.x}px` }} >
                    <div className="w-[10vw]">
                        <a href={bookMetadata.link} target="_blank">{bookMetadata.title}</a>
                    </div>
                </dialog>
            </div>
            <div className="text-white" style={{ position: "absolute", bottom: 0, left: 0 }}>
                Sorry for the inconvenience, but I can&apos;t really embed manga iframe to this site. It&apos;s about copyright infringement stuff.
            </div>
        </>
    )
}