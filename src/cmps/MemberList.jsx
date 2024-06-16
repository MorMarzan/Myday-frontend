import { UserImg } from './UserImg'

export function MemberList({ members, onMemberClick }) {

    if (!members || !members.length) return <p className="member-list">No members to show</p>

    return (
        <ul className="clean-list member-list">
            {members.map((member, idx) => {
                return (
                    <li key={idx}>
                        <button
                            className="btn member-option"
                            onClick={() => onMemberClick(member)}
                        >
                            <UserImg user={member} />
                            <p className="username">{member.fullname}</p>
                        </button>
                    </li>
                )
            })}
        </ul>
    )
}
