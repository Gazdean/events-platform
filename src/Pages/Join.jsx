import React, { useState } from "react"
import {Form, Button, Card, Alert, Container} from "react-bootstrap"
import { useAuth } from '../Contexts/AuthContext'
import { Link, useNavigate } from "react-router-dom"

import { useForm } from 'react-hook-form'
import { addNewUser } from "../apiFirebaseCalls"

export default function Join () {

    const {signup} = useAuth()
    const [error, setError] = useState("")
    const [emailSent, setEmailSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [emailString, setEmailString] = useState('')
    const navigate = useNavigate() 

    const {register, handleSubmit, watch, reset, formState:{errors}} = useForm()

    const emailRegex = /^((([!#$%&'*+\-/=?^_`{|}~\w])|([!#$%&'*+\-/=?^_`{|}~\w][!#$%&'*+\-/=?^_`{|}~\.\w]{0,}[!#$%&'*+\-/=?^_`{|}~\w]))[@]\w+([-.]\w+)*\.\w+([-.]\w+)*)$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/
    const alertMessage = <p>A verification email has been sent to {emailString}.<br/> Please verify your account to sign in.<br/> If its not in your inbox please check your Junk Folder.</p>
   

    async function onSubmit(data) {
        setError('')
        setLoading(true)
        setEmailSent(false)
        setEmailString('')
        // react-hook-form deals with event.preventDefault()
        const email = data.email
        const password = data.password
        try {   
            await signup(email, password)
            await addNewUser(email)
            setEmailSent(true)
            setEmailString(email)
        } catch {
            console.log(error)
            setError('Failed to create account')
        } finally {
            setLoading(false)
            reset()
        }
    }

    function handleOnFocus() {
        setEmailSent(false)
    }

    return (
        
        <Container className="w-100" style={{maxWidth:"400px"}}>
            <Card >
                <Card.Body >
                    <h2 className="text-center mb-4">Create an account</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {emailSent && <Alert variant="info">{alertMessage}</Alert>}
                    <Form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
                        <Form.Group id="email">
                            <Form.Label htmlFor="joinEmail">Email</Form.Label>
                            <Form.Control id="joinEmail" name="joinEmail" type="email"  autoComplete="email" onFocus={handleOnFocus}{...register('email', {required:true, pattern:emailRegex})}></Form.Control>
                            {errors.email?.type==="required"&&<p tabIndex="0" className="border border-2 border-danger rounded mt-2 ps-2" >An email is required</p>}
                            {errors.email?.type==="pattern"&&<p tabIndex="0" className="border border-2 border-danger rounded mt-2 ps-2">Must be a valid email address</p>}
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label htmlFor="joinPassword">Password</Form.Label>
                            <Form.Control id="joinPassword" name="joinPassword" type="password" onFocus={handleOnFocus} {...register('password', {required:true, pattern: passwordRegex})}></Form.Control>
                             {errors.password?.type==="required"&&<p tabIndex="0" className="border border-2 border-danger rounded mt-2 ps-2">A password is required</p>}
                             {errors.password?.type==="pattern"&&<p tabIndex="0" className="border border-2 border-danger rounded mt-2 pe-2 ps-2">Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.</p>}
                        </Form.Group>
                        <Form.Group id="email">
                            <Form.Label htmlFor="joinConfirm">Password Confirmation</Form.Label>
                            <Form.Control id="joinConfirm" name="joinConfirm"type="password" onFocus={handleOnFocus} {...register("confirmPassword", {required: "Please confirm your password",validate: (value) =>value === watch("password") || "Passwords do not match"})} ></Form.Control>
                            {errors.confirmPassword && ( <p tabIndex="0" className="border border-2 border-danger rounded mt-2 ps-2">{errors.confirmPassword.message}</p>)}
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-4" type="submit" variant={loading ? `info` : `primary`} >{loading ? `Registering` : `Sign Up`}</Button>
                    </Form>
                </Card.Body>
                    <Card.Text className="w-100 text-center mt-2">
                         Already have an account? <Link to="/sign-in">Log in</Link>
                    </Card.Text>
            </Card>
        </Container>
    )
}