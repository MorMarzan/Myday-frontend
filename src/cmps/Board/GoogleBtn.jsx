import { GoogleIcon } from "../../services/svg.service"

export function GoogleBtn({ onBtnClick, txt }) {
    return (
        <button className='flex align-center justify-center google-btn' onClick={onBtnClick}>
            <div className="flex google-logo-caontainer">
                <GoogleIcon />
            </div>
            <div className="txt-container">
                <p>{txt}</p>
            </div>
        </button>
    )
}
