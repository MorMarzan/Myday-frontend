import { useState } from "react"
import { useNavigate, useParams } from "react-router"

import { userService } from "../services/user.service"

import { setIsLoading, showErrorMsg } from "../store/actions/system.actions"
import { login, signup } from "../store/actions/user.actions"

import { uploadService } from "../services/upload.service"
import { DynamicInput } from "../cmps/DynamicInput"
import { UserImg } from "../cmps/UserImg"
import HoltCatImg from "/img/welcome-to-monday.avif"

export function LoginSignup() {
    const [user, setUser] = useState(userService.getEmptyUser())
    const { navLocation } = useParams()
    const navigate = useNavigate()

    const isLogin = navLocation === 'login'

    function toggleLogin(navLocation) {
        navigate(`/auth/${navLocation}`)
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break
            case 'checkbox':
                value = target.checked
                break
            default:
                break
        }

        setUser(prevUser => ({ ...prevUser, [field]: value }))

    }

    async function onImgUpload(ev) {
        try {
            const imgData = await uploadService.uploadImg(ev)
            setUser(prevUser => ({ ...prevUser, imgUrl: imgData.url }))
        } catch (err) {
            console.log('err', err)
        }
    }

    async function onSubmitForm(ev) {
        ev.preventDefault()
        setIsLoading(true)
        try {
            if (isLogin) {
                await login(user)
                navigate('/board/workspace')
            } else {
                await signup(user)
                navigate('/board/workspace')
            }

        } catch (err) {
            console.log('err', err)
            showErrorMsg('Cannot login, please try again')
        } finally {

            setIsLoading(false)
        }
    }

    const usernameInputProps = {
        name: 'username',
        inputValue: user.username,
        placeholder: 'Enter your username',
        handleChange: handleChange,
        isRequired: true
    }

    const fullnameInputProps = {
        name: 'fullname',
        inputValue: user.fullname,
        placeholder: 'Enter your fullname',
        handleChange: handleChange,
        isRequired: true
    }

    const passwordInputProps = {
        name: 'password',
        inputValue: user.password,
        type: 'password',
        placeholder: 'Enter your password',
        handleChange: handleChange,
        isRequired: true
    }

    const noticeContent = isLogin ?
        <p>Don't have an account yet? <span onClick={() => toggleLogin('signup')}>Sign up</span></p>
        :
        <p>Already have an account? <span onClick={() => toggleLogin('login')}>Log in</span></p>

    return (
        <section className="login-signup">
            <div className='flex column align-center justify-center login-content-container'>

                <div className="flex column align-center justify-center form-container">
                    <h1>Welcome to myday</h1>
                    <h2>{isLogin ? 'Log in to your account' : 'Get started - it\'s free. No credit card needed.'}</h2>

                    <form onSubmit={onSubmitForm} className='full-width'>

                        <div className="flex column full-width form-section-container">
                            <label>Username:</label>
                            <DynamicInput inputProps={usernameInputProps} />
                        </div>

                        {!isLogin && <div className="flex column full-width form-section-container">
                            <label>Fullname:</label>
                            <DynamicInput inputProps={fullnameInputProps} />
                        </div>}

                        <div className="flex column full-width form-section-container">
                            <label>Password:</label>
                            <DynamicInput inputProps={passwordInputProps} />
                        </div>

                        {!isLogin && <div className="flex align-center full-width form-section-container user-img-selection">
                            <label className='user-img-label'>Your Image:</label>
                            <label className="flex custom-file-upload">
                                <input type="file" accept="image/*" onChange={onImgUpload} />
                                {(user.imgUrl || user.fullname) ? <UserImg user={user} /> : <UserImg />}
                            </label>
                        </div>}

                        <button>{isLogin ? 'Log in' : 'Sign up'}</button>
                    </form>
                </div>

                <div className='notice-navigation'>
                    {noticeContent}
                </div>
            </div>

            <div className="img-container">
                <img src={HoltCatImg} />
            </div>
        </section>
    )
}
