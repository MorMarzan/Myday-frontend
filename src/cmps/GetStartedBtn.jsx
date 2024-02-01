import { useNavigate } from "react-router"
import { ArrowRightIcon } from "../services/svg.service"

export function GetStartedBtn() {
    const navigate = useNavigate()
    return (
        <button onClick={() => navigate('/board/workspace')} className='btn-get-started'><span className='get-started-txt'>Get Started</span>
            <ArrowRightIcon />
        </button>
    )
}
