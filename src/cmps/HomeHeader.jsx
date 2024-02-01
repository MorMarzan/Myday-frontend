import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Logo from '/img/myday-temp-logo.png'

import { GetStartedBtn } from './GetStartedBtn'

export function HomeHeader({ scrolled }) {
    const navigate = useNavigate()
    const user = useSelector((storeState) => storeState.userModule.user)

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

// <header className="home-header full main-container">
//     <div className="flex">
//         <img src={Logo} alt="logo" />
//     </div>
//     <div className="flex">
//         <div className="user-actions flex">
//             {/* {user && (
//                 <span className="user-info">
//                     <Link to={`user/${user._id}`}>
//                         {user.imgUrl && <img src={user.imgUrl} />}
//                         {user.fullname}
//                     </Link>
//                     <button onClick={onLogout}>Logout</button>
//                 </span>
//             )}
//             {!user && (
//                 <section className="user-info">
//                     <LoginSignup onLogin={onLogin} onSignup={onSignup} />
//                 </section>
//             )} */}
//             <button
//                 onClick={onLogin}
//                 className={'get-started-btn flex align-center justify-center'}>
//                 Get Started
//             </button>
//         </div>
//     </div>
// </header>