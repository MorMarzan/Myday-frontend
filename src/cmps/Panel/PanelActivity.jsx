import { ActivityList } from "./ActivityList"

export function PanelActivity({ activities }) {
    return (
        <section className="panel-activity">
            <ActivityList activities={activities} />
        </section>
    )
}