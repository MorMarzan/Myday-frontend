import { utilService } from "../services/util.service"

export function UserImg({ user }) {
    return (
        <>
            {user && user !== 'Added' ? (
                user.imgUrl ? (
                    <img className="user-img" src={user.imgUrl} alt="User" />
                ) : (
                    <span className="extra-members-box">{utilService.getAcronym(user.fullname)}</span>
                )
            ) : (
                <img
                    src="https://res.cloudinary.com/dkvliixzt/image/upload/v1704358773/person-empty_zckbtr_wrffbw.svg"
                    className="user-img"
                />
            )}
        </>
    )
}

