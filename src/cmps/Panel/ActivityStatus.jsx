import { AngleRightIcon } from "../../services/svg.service"
import { utilService } from "../../services/util.service"
import { UserImg } from "../UserImg"

export function ActivityStatus({ type, fromStatus, toStatus, activityTitle = null }) {
    function getTitle(type, title) {
        switch (type) {
            case 'create':
                return ''
            case 'remove':
                return ''
            case 'date':
                if (!title || title === '-') return '-'
                return utilService.timeStampToDate(title)
            // case 'link':
            //     return <a href={title.url} target="_blank">
            //         <p>{title.displayTxt || title.url}</p>
            //     </a>
            case 'person':
                if (title === 'Added') return 'Added'
                return <div className="activity-members-container">
                    <UserImg user={title} />
                </div>
            // case 'File':
            //     if (!title || title === '-') return '-'
            //     idx = (title.length > 0) ? 0 : (title.length - 1)
            //     return title[idx]?.url ? <img className="activity-file-img" src={title[idx].url} alt="" /> : '-'
            case 'group color':
                if (!title || title === '-') return '-'
                return <div className="activity-group-color-container" >
                    <div style={{ color: title }}>
                        {activityTitle}
                    </div>
                </div>
            default:
                return type
        }
    }

    return (
        <>
            <div
                className={`old-status ${type}`}
                style={{
                    backgroundColor: fromStatus.color && fromStatus.color,
                    color: fromStatus.color ? 'white' : 'unset'
                }}
            >
                <div style={{ color: fromStatus.color ? 'white' : 'unset' }}>
                    {getTitle(type, fromStatus.title)}
                </div>
            </div>

            <AngleRightIcon />

            <div
                className={`new-status ${type}`}
                style={{
                    backgroundColor: toStatus.color && toStatus.color,
                    color: toStatus.color ? 'white' : 'unset'
                }}
            >
                <div style={{ color: toStatus.color ? 'white' : 'unset' }}>
                    {getTitle(type, toStatus.title)}
                </div>
            </div>
        </>
    )
}