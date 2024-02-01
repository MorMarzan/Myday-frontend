import { useSelector } from 'react-redux'
import { BrowserWarningTxt } from './BrowserWarningTxt'

export function BrowserWarning() {
    const isIncompatibleBrowser = useSelector((storeState) => storeState.systemModule.isIncompatibleBrowser)

    if (!isIncompatibleBrowser) {
        return null
    }

    return (
        <section className="browser-warning">
            <div className="scrolling-text">
                <BrowserWarningTxt />
                <BrowserWarningTxt />
            </div>
        </section>
    )
}
