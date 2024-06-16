import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import Logo from "/img/myday-temp-logo.png"
import { GetStartedBtn } from "./GetStartedBtn"

export function HomeHeader({ scrolled }) {
    const user = useSelector((storeState) => storeState.userModule.user)
    const navigate = useNavigate()

    return (
        <header className={"home-header-container full " + (scrolled ? 'scrolled' : '')}>
            <img src={Logo} className='home-header-logo' alt="" />
            <div>
                {!user && <div className='btn-header-login' onClick={() => navigate('/auth/login')}>
                    Log in
                </div>}
                <GetStartedBtn />
            </div>
        </header>
    )
}