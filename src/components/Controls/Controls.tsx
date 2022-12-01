import './Controls.css'
import { FormEvent, useContext, useState, useEffect, useMemo } from 'react';
import { ArrayDataContext, UpdateArrayDataContext } from '../../contexts/ArrayContex'
import { UpdateTimeContext, TimeContext } from '../../contexts/TimeContext'
import { DisabledContext } from '../../contexts/DisabledContext'
import { increaseArrayQuantity, evaluateSessionStorageValue } from '../../utils/utils'

const Controls: React.FC = () => {
    const currentFlipViewStatus = useMemo(() => (evaluateSessionStorageValue('flipViewStatus', false)), [])
    const [flipViewStatus, setFlipView] = useState(currentFlipViewStatus)

    const arrayData = useContext(ArrayDataContext)
    const setArray = useContext(UpdateArrayDataContext)
    const sleepTime = useContext(TimeContext)
    const setSleepTime = useContext(UpdateTimeContext)
    const disabledStatus = useContext(DisabledContext)

    useEffect(() => {
        const barsContainer = document.querySelector('.barsContainer')
        if (flipViewStatus) {
            barsContainer!.classList.add('flipBarsContainer')
            return
        }
        barsContainer!.classList.remove('flipBarsContainer')
    }, [flipViewStatus])

    function handleInpuitQuantity(e: FormEvent<HTMLInputElement>) {
        const array = [...arrayData]
        const currentQuantity = Number(sessionStorage.getItem("currentQuantity"));
        const quantity = e.currentTarget.valueAsNumber

        if (quantity > array.length) {
            increaseArrayQuantity({ array, currentQuantity, quantity })
            sessionStorage.setItem("currentQuantity", String(array.length));
            setArray!(array)
        } else {
            for (let i = quantity; i < array.length;) array.pop();
            sessionStorage.setItem("currentQuantity", String(array.length));
            setArray!(array)
        }
    }

    const handleInputSpeed = (e: React.FormEvent<HTMLInputElement>) => {
        sessionStorage.setItem("currentSleepTime", JSON.stringify({ ...sleepTime, inputSpeed: e.currentTarget.valueAsNumber }));
        const currentSleepTime = JSON.parse(sessionStorage.getItem("currentSleepTime")!)
        setSleepTime(currentSleepTime)
    }

    const handleFreeze = () => {
        if (!sleepTime.isPause) {
            setSleepTime({ ...sleepTime, isPause: true })
            return
        }
        setSleepTime({ ...sleepTime, isPause: false })
    }

    const handleFlipView = () => {
        if (!flipViewStatus) {
            sessionStorage.setItem('flipViewStatus', String(!flipViewStatus))
            setFlipView(!flipViewStatus)
            return
        }
        sessionStorage.setItem('flipViewStatus', String(!flipViewStatus))
        setFlipView(!flipViewStatus)
    }

    return (
        <>
            <div id='controls-container'>
                <div id='range-container'>

                    <div id='rangeLables'>
                        <label htmlFor="Quantity">Quantity</label>
                        <label htmlFor="Speed">Speed</label>
                    </div>

                    <div id='range-inputs-container'>
                        <input
                            className={`${disabledStatus ? 'disabledBorderClr' : ''} `}
                            onInput={handleInpuitQuantity}
                            disabled={disabledStatus}
                            type="range"
                            name="Quantity"
                            id="Quantity"
                            min="10"
                            value={arrayData.length}
                            max="250"
                        />

                        <input
                            onInput={handleInputSpeed}
                            value={sleepTime.inputSpeed}
                            type="range"
                            name="Speed"
                            id="Speed"
                            min="0"
                            max="2000"
                            step="400"
                        />
                    </div>
                </div>
                <div id='shuffle-freeze-flip-view-container'>
                    <div id='shuffle-freeze-container'>
                        <button onClick={() => window.location.reload()}>Shuffle</button>
                        <button onClick={handleFreeze}>{sleepTime.isPause ? 'Unfreeze' : 'Freeze'}</button>
                    </div>
                    <span onClick={handleFlipView} className='flip-view'>Flip View</span>
                </div>
            </div>
        </>
    )
}

export default Controls
