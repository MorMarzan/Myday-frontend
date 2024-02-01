import Lottie from 'lottie-react'
import animationData from '/img/snowman.json'

export function LottieAnimation() {
    return (
        <div>
            <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
            />
        </div>
    )
}