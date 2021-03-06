import { css } from "@emotion/core"
import React from "react"

export default (props) => {
    const style = css`
        width: 100%;
        min-height: 92vh;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        padding: 0 40px; 
        text-align: center;
        box-sizing: border-box;
        position: sticky;
        position: -webkit-sticky;
        background: ${props.idx ?
                        props.idx % 2 == 0 ? 'transparent' : 'linear-gradient(var(--color2), var(--color2g))'
                        :
                        'transparent'
                    };
        font-family: var(--font1);
        align-items: center;

        > div, button, a {
            margin-top: 30px;
        }

        

        .hero-img {
            position: absolute;
            padding: 0;
            min-height: 100%;
            min-width: 100%;


            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            z-index: -2;
        }
        .hero-filter {
            background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8));
            z-index: -1;

            position: absolute;
            padding: 0;
            min-height: 100%;
            min-width: 100%;
            margin-top: 0;
        }
    `

    switch (props.op) {
        case 'sass':
            return (
                'YO'
            )
        default:
            return (
                <div css={style}>
                    {props.inner}
                    {
                        props.hero?
                        <>
                        <div className="hero-filter"></div>
                        <img className="hero-img" src={props.hero} alt="Add a hero image in src/images to cover this background!"/>
                        </>
                        :
                        null
                    }
                </div>
            )
    }
}