import { useEffect, useState } from "react"
import { utilService } from "../../../../services/util.service"
import { TitleStat } from "./TitleStat"

export function LabelSummary({ title, group, board }) {
    const [titleStats, setTitleStats] = useState(calcTitleStatsAndPercentage(group, title, board))

    useEffect(() => {
        setTitleStats(calcTitleStatsAndPercentage(group, title, board))
    }, [title, group, board])

    function getTitleColor(title, board, labelId) {
        const titleInfo = board[title].find((item) => item.id === labelId)
        return titleInfo ? titleInfo.color : null
    }

    function calcTitleStatsAndPercentage(group, title, board) {
        const totalTasks = group.tasks.length

        const titleStats = group.tasks.reduce((acc, task) => {
            const labelId = task[title]
            acc[labelId] = (acc[labelId] || 0) + 1
            return acc
        }, {})

        const resultArray = Object.entries(titleStats).map(([labelId, value]) => {
            const percentage = ((value / totalTasks) * 100).toFixed(2)
            const formattedPercentage = percentage.includes('.00') ? percentage.split('.')[0] + '%' : percentage + '%'

            const label = board[title].find((option) => option.id === labelId).title

            return {
                title: label,
                color: getTitleColor(title, board, labelId),
                percentageMap: {
                    percent: formattedPercentage,
                    fraction: `${value}/${totalTasks}`,
                },
            }
        })

        return resultArray
    }





    return (
        <li className="label-summary">
            <p>{utilService.capitalizeFirstLetter(title)}</p>
            <div className="label-summary-battery">
                {titleStats.map((titleStat, idx) => {
                    return <TitleStat idx={idx} titleStat={titleStat} key={idx} />
                })}
            </div>
        </li>
    )
}
