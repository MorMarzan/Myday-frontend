import React from "react"
import { FilledStarIcon } from "../services/svg.service"

export default function FavoriteDisplay() {
    return (
        <div className="favorite-display flex align-cneter">
            <FilledStarIcon />

            <span>Favorites</span>
        </div>
    )
}
