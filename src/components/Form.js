import { Form as FormStyle } from "../styles/forms"
import { panel } from "../styles/theme"
import React, { Component } from "react"
import Button from "./Button"
import eye from "../images/see-icon.png"
import { Redirect } from "react-router-dom"
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
// import 'react-google-places-autocomplete/dist/assets/index.css'; Build breaking!!


export default class Form extends Component {
    constructor(props) {
        super(props)

        // need to assert that the questions prop contains either ONLY lists or objects
        // need to assert that the list of onSubmits is the same as the number of slides

        var question_ids = {}
        for (var s of this.props.slides) {
            console.log('S:', s)
            s.questions.map((q) => {
                question_ids[q.id] = q.default ? q.default : ''
                // if (q.type == 'confirm-password') {              // confirm-<value> key is automatically put into state when its value is changed in input
                //     question_ids[`confirm-${q.id}`] = ''
                // } 
            })
        }
        console.log('question ids:', question_ids)
        this.state = {
            ...question_ids, 
            slide_idx: 0,
            loading: false
        }
        // var question_slides = this.props.questions
        // if (!question_slides.every((q) => {return q instanceof Array})) {      // if all elements are arrays then each of them represent a slide. if list of objects then convert to list of list of objects
        //     question_slides = [question_slides]                           // if not, then we need to put that list of dicts into a list to make it a list of lists of dicts
        // }
        // this.question_slides = question_slides

        // this.state = props.questions ?
        //     props.questions.reduce(
        //         (acc, curr) => {return {...acc, ...curr.reduce(
        //             (qs, q) => {return {...qs, [q.id]: q.default ? q.default : ''}},
        //             {...acc}
        //         )}},
        //         {slide_idx: 0}
        //     )
        //     :
        //     {}
    }

    componentDidUpdate = (prevProps) => {

    }

    handleChange = (e) => {
        this.setState({[e.target.id]: e.target.value},
            () =>{console.log(this.state)})
    }

    handleNumChange = (e) => {
        this.setState({[e.target.id]: e.target.value.replace(/\D/g,'')},
            () =>{console.log(this.state)})
    }
    
    handleOptionChange = (e) => {
        this.setState({[e.target.id]: e.target.value},
            () =>{console.log(this.state)})
    }

    validate = () => {
        var s = this.state
        var errors = []
        for (var q of this.props.slides[this.state.slide_idx].questions) {
            console.log('verifying:', q)
            if (q.type === 'text' || q.type === 'password') {
                if (s[q.id] == '') {errors.push(`Fill in the ${q.title.toLowerCase()} field`)}
            }
            if (q.type === 'confirm-password') {
                console.log('confirm', s[q.id])
                if (s[q.id].length < 8) {errors.push('Password should be atleast 8 characters long')}
                if (s[q.id] != s[`confirm-${q.id}`]) {errors.push(`Passwords need to match`)}
            }
            if(q.type === 'phone-number'){
                if (s[q.id].length < 10 || s[q.id].length > 12) {errors.push('Enter a valid phone number')}
            }
            if (q.type === 'email') {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!re.test(String(s[q.id]).toLowerCase())) {errors.push('Email is not valid')}
            }
        }
        console.log('FORM ERRORS:', errors)
        this.setState({error: errors[0]})       // either null or some error
        return errors.length > 0 ? false : true
    }

    submit = async () => {
        if (this.validate()) {      // do basic validation based on field type
            this.setState({loading: true})
            console.log('current slide idx', this.state.slide_idx)
            var onSubmit = this.props.slides[this.state.slide_idx].onSubmit
            try {
                if (onSubmit) {await onSubmit(this.state)}                  // validate + do extra stuff
                console.log('both internal and external validation successful')
                
                console.log('current slide idx in try', this.state.slide_idx)
                const new_slide_idx = this.state.slide_idx + 1
                console.log('setting slide idx to:', new_slide_idx)
                this.setState({slide_idx: new_slide_idx})    // if onSubmit doesn't return null
            }
            catch (error) {
                console.log('An external error occured:', error)
                this.setState({error: error.message})
            }
            this.setState({loading: false})
        }
        else {
            console.log('internal validation failed')
        }
    }

    render () {
        // console.log('STATE:', this.state)
        console.log('slide idx:', this.state.slide_idx)
        console.log('slides len:', this.props.slides.length)
        console.log(this.state.slide_idx > this.props.slides.length - 1)
        const go_to_new = typeof(this.state.slide_idx) == NaN || typeof(this.state.slide_idx) == undefined
        console.log('go to new?', go_to_new)
        if (this.state.slide_idx > this.props.slides.length - 1 || go_to_new) {
            console.log('reached end of slides')
            if (!this.props.stay) {
                console.log('redirecting to:', this.props.redirect)
                return <Redirect to={this.props.redirect}/>
            }
            else {
                this.setState({slide_idx: this.state.slide_idx - 1})
            }
        }

        var question_slides = this.question_slides
        // console.log('All question slides:', question_slides)
        return (
            <>
            <div css={panel} style={{display: 'flex', flexDirection: 'row', overflowY: 'auto', overflowX: 'hidden', justifyContent: 'left', padding: '20px'}}>
                {
                    this.props.slides.map((s) => {              // map question slides to that form slide
                        // console.log('question slide:', s)
                        return <>  
                        <div style={{minWidth: '100%', padding: '0px', transform: `translateX(-${100 * this.state.slide_idx}%)`, transitionDuration: '0.5s', paddingRight: '20px'}}>
                            <div css={FormStyle} >
                                <div style={{fontSize: '30px', marginBottom: '20px', fontWeight: '900'}}>
                                    {s.title}
                                    <div className='detail'>
                                        {s.subtitle}
                                    </div>
                                </div>
                                {
                                    s.questions.map((q) => {                         // map question slide (list of objects) to the questions
                                        q = {...q, value: this.state[q.id]}
                                        switch (q.type) {
                                            case "text":
                                                return <TextResponse {...q} handleChange={this.handleChange} />
                                            case "number":
                                                return <TextResponse {...q} handleChange={this.handleNumChange} />
                                            case "phone-number":
                                                return <TextResponse {...q} handleChange={this.handleNumChange} /> 
                                            case "email":
                                                return <EmailField {...q} handleChange={this.handleChange}/>
                                            case "password":
                                                return <Password {...q} handleChange={this.handleChange}/>
                                            case "confirm-password":
                                                return <ConfirmPassword {...q} confirm_value={this.state[`confirm-${q.id}`]} handleChange={this.handleChange}/>
                                            case "dropdown":
                                                return <DropDown {...q} handleChange={this.handleOptionChange} />
                                            case "location":
                                                return <LocationField />
                                            default:
                                                return `${q.type} IS NOT A VALID QUESTION TYPE`
                                        }
                                    })
                                }
                                <div className="error">
                                    {this.state.error}
                                </div>
                                <div className='detail'>
                                    {s.detail}
                                </div>
                                <Button text='Submit' onClick={this.submit} loading={this.state.loading}/>
                            </div>
                        </div>
                        </>
                    })
                }
            </div>
            </>
        )
    }
}

export const TextResponse = (props) => {
    // console.log('VALUE:', props.value)
    return (
        <div className="field-container">
            <div className="field-title ">
                <strong>{props.title}</strong>
            </div>
            <br/>
            <div className="field-title detail">
                {props.detail}
            </div>
            <br/>
            <input type="text" id={props.id} value={props.value} className="text-response" placeholder="" onChange={props.handleChange}/>
        </div>
    )
}

export const EmailField = (props) => {
    return <TextResponse {...props} />
}

export const LocationField = (props) => {
    return <GooglePlacesAutocomplete onSelect={console.log} />
}

export class Password extends Component {
    constructor (props) {
        super(props)
        this.state = {
            hidden: true
        }
    }

    toggleHidden = () => {
        this.setState({hidden: !this.state.hidden})
    }

    render(){
        return (
            <div className="field-container ">
                <div className="field-title">
                    <strong>Password</strong>
                </div>
                <br/>
                <div className="password">
                    <input type={ this.state.hidden ? 'password' : 'input' } id={this.props.id} value={this.props.value} className="text-response" placeholder=""  onChange={ this.props.handleChange }/>
                    <img src={ eye } onClick={ this.toggleHidden } alt="" />
                </div>
            </div>
        )
    }
}

export class ConfirmPassword extends Component {
    constructor (props) {
        super(props)
        this.state = {
            hidden: true
        }
    }

    toggleHidden = () => {
        this.setState({hidden: !this.state.hidden})
    }

    render(){
        return (
            <>
            <div className="field-container ">
                <div className="field-title">
                    <strong>Password</strong>
                </div>
                <br/>
                <div className="password">
                    <input type={ this.state.hidden ? 'password' : 'input' } id="password" value={this.props.value} className="text-response" placeholder=""  onChange={ this.props.handleChange }/>
                    <img src={ eye } onClick={ this.toggleHidden } alt="" />
                </div>
            </div>
            <div className="field-container ">
                <div className="field-title">
                    <strong>Confirm Password</strong>
                </div>
                <br/>
                <div className="password">
                    <input type={ this.state.hidden ? 'password' : 'input' } id="confirm-password" value={this.props.confirm_value} className="text-response" placeholder=""  onChange={ this.props.handleChange }/>
                </div>
            </div>
            </>
        )
    }
}

export const DropDown = (props) => {
    return (
        <div className="field-container">
            <div className="field-title ">
                <strong>{props.title}</strong>
            </div>
            <br/>
            <div className="field-title detail">
                {props.detail}
            </div>
            <br/>
            <select id={props.id} onChange={props.handleChange}>
                <option disabled selected>Select</option>
                {
                    props.options.map((o)=>{return (
                        <option value={o}>{o}</option>
                    )})
                }
            </select>
        </div>
    )
}