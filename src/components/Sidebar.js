import React, { Component } from "react"
import { css } from "@emotion/core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";

const style = css`
    position: absolute;
    // background-color: var(--color2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    border-radius: 30px;
    height: 100%;

    // width: auto;
    .item {
        font-family: var(--font1);
        font-weight: 900;
        color: var(--color2);
        display: flex;
        width: 160px;
        flex-direction: row;
        align-items: center;
        justify-content: left;
        padding: 10px;
        margin: 5px;
        cursor: pointer;
        transition-duration: 1s;
        border-radius: 50px;
        :hover {
            background-color: var(--color2);
            color: var(--color1) !important;
            .faicon {
                color: var(--color1) !important;
            }
        }
        .faicon, img {
            padding-right: 10px;
            transition-duration: 1s;
            font-size: 35px;
            color: var(--color2);

            height: 35px;
            width: 35px;
        }
    }
    img {
    }
`

export default class extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div css={style}>
                {this.props.items.map(i=>{return ( 
                    <Link to={i.to} onClick={i.onClick} className="item"> 
                        {i.faIcon ? <FontAwesomeIcon icon={i.faIcon} className="faicon"/> : <img src={i.icon} />}
                        {i.title}
                    </Link>
                )})}
            </div>
        )
    }
}