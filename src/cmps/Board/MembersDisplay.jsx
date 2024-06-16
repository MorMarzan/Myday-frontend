import { UserImg } from "../UserImg"

export function MembersDisplay({ members }) {
    let extraMembers
    if (members) { extraMembers = members.length - 2 }

    if (!members) return (
        <div className="members-display">
            <img className="user-img"
                src="https://res.cloudinary.com/dkvliixzt/image/upload/v1704358773/person-empty_zckbtr_wrffbw.svg"
            />
        </div>
    )

    return (
        <div className="members-display flex">
            {!members.length &&
                <img className="user-img"
                    src="https://res.cloudinary.com/dkvliixzt/image/upload/v1704358773/person-empty_zckbtr_wrffbw.svg"
                />
            }

            {!!members.length && <div className="member-img-container flex justify-center align-center">
                {extraMembers > 0 ?
                    <>
                        <UserImg user={members[0]} />
                        <span className="extra-members-box">+{extraMembers + 1}</span>
                    </>
                    :
                    <>
                        {
                            members.map((member, idx) => {
                                return idx < 2 ? <UserImg key={idx} user={member} /> : ''
                            })
                        }
                    </>
                }
            </div>
            }
        </div>
    )
}
