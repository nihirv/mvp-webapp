import React, { Component } from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom"
import { css } from "@emotion/core"
import ReactCursorPosition from 'react-cursor-position';
import { expand_in } from "../styles/animations"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const style = css`
    animation-name: ${expand_in};
    animation-duration: 1s;
    --dim: 200px;
    height: var(--dim);
    width: var(--dim);
    max-width: 45vw;
    max-height: 45vw;
    box-sizing: border-box;
    background-color: var(--color2);
    background: linear-gradient(var(--color2), var(--color2g));
    font-family: var(--font1);
    font-size: 25px;
    font-weight: 1000;
    margin: 10px;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: 0.5s;
    color: var(--color1);
    border-radius: var(--radius);

    @media (max-width: 600px) {
        font-size: 16px;
    }

    img, .faicon {
        height: 50%;
        margin: 10%;
        font-size: 80px;
    }
`
export default class Tile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            x: 0,
            y: 0,
            interval: null
        }
        this.interval = null
    }

    tilt = (e) => {
        // console.log(e.clientX)
        var rect = ReactDOM.findDOMNode(this).getBoundingClientRect()
        var w = rect.right - rect.left
        var h = rect.top - rect.bottom
        var next = {
            x: ( e.clientY - rect.top - 0.5*(rect.bottom - rect.top) ) / h,
            y: ( e.clientX - rect.left - 0.5*(rect.right - rect.left) ) / w, 
        }
        console.log(next)
        this.setState(next,
        )
    }

    render () {
        const k = 0.1 * 2* 3.1415926
        return (
            <Link css={style} to={this.props.to} onClick={this.props.onClick}
                // onMouseLeave={() => {clearInterval(this.i); this.setState({x: 0, y: 0})}} 
                // onMouseEnter={() => {this.i = setInterval(this.tilt, 100)}} 
                style={{transform: `rotateX(${k*this.state.x}rad) rotateY(${k*this.state.y}rad)`, order: '3px solid red'}}>
                {this.props.faIcon ? <FontAwesomeIcon icon={this.props.faIcon} className="faicon" /> : <img src={this.props.icon} alt="" />}
                {this.props.title}
            </Link>
        )
    }        
}