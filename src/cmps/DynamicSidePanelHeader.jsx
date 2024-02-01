import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { CloseIcon, HomeIcon, MenuIcon, PersonIcon } from "../services/svg.service"
// import { MemberPicker } from "./Board/Group/Picker/PickerModals/MemberPicker"
import { UserImg } from "./UserImg"
import { utilService } from "../services/util.service"
import { setSidePanelOpen } from "../store/actions/system.actions"
import { getUserById } from "../store/actions/user.actions"

export function DynamicSidePanelHeader(props) {
    const { type, title, subjects, members } = props.headerProps
    const { boardId, taskId } = props
    const [users, setUsers] = useState(null)
    const [activeSubject, setActiveSubject] = (type === 'taskDetails') ? useState('Updates') : useState('Activity Log')
    const navigate = useNavigate()

    useEffect(() => {
        if (members && members.length > 0) getTaskMembers(members)
        else setUsers(['guest'])
    }, [taskId, members])

    async function getTaskMembers(memberIds) {
        const taskMembers = memberIds.map(memberId => getUserById(memberId))
        setUsers(taskMembers)
    }

    // function onClosePanel() {
    //     setSidePanelOpen(false)
    //     // navigate('borad/' + boardId)
    // }

    if (!users?.length) return

    return (
        <section className="panel-header grid">
            <button className="btn" onClick={() => {
                setSidePanelOpen(false)
                navigate('/board/' + boardId)
            }}>
                <CloseIcon />
            </button>

            <section className="panel-title-section flex align-center space-between">
                <span className="title">{title}
                    {type === 'activitylog' && <span> Log</span>}
                </span>
                {type === 'taskDetails' && (
                    <div className="title-section-actions flex justify-center align-center">
                        <span className="panel-members flex justify-center align-center">
                            {users[0] !== 'guest'
                                ? users.map((user, index) => (
                                    <UserImg key={index} user={user} />
                                ))
                                : <UserImg />
                            }
                        </span>
                        <button className="btn svg-inherit-color">
                            <MenuIcon />
                        </button>
                    </div>
                )}
            </section>
            <section className="panel-subjects flex">
                {subjects.map((sub, idx) => (
                    <button
                        key={sub}
                        className={`btn ${sub === activeSubject ? 'active' : ''}`}
                        onClick={() => {
                            if (type === 'taskDetails') {
                                props.headerProps.onSwitchToSubject(sub)
                                setActiveSubject(sub)
                            }
                        }}
                    >

                        {sub === 'Updates' && <HomeIcon />}
                        {utilService.capitalizeFirstLetter(sub)}
                    </button>
                ))}
            </section>
        </section>
    )

}
