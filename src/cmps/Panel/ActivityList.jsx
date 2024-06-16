
import { ActivityPreview } from "./ActivityPreview.jsx"

export function ActivityList({ activities }) {
    const sortedActivities = [...activities].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return (
        <ul className="activity-list clean-list" >
            {
                sortedActivities.map(activity =>
                    <li className="activity-preview subgrid full-grid-column align-center" key={activity._id} >
                        <ActivityPreview activity={activity} />
                    </li>
                )
            }
        </ul >
    )
}