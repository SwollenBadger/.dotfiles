import AstalBattery from 'gi://AstalBattery'
import {bind} from '../../../../../../../../usr/share/astal/gjs/binding'
import Variable from '../../../../../../../../usr/share/astal/gjs/variable'
import {nearest} from '../../lib/helpers'
import {batteryIcons} from '../../lib/Variables'
import ToggleButton from '../../components/ToggleButton'

const BatteryService = AstalBattery.get_default()

function getBatteryIcons(percentage: number): string {
    const key = nearest(
        percentage,
        Object.keys(batteryIcons).map((k) => parseInt(k)),
    )
    return batteryIcons[key]
}

const Battery = () => {
    const charging = bind(BatteryService, 'charging')
    const visible = bind(BatteryService, 'isPresent')
    const percentage = bind(BatteryService, 'percentage').as(
        (percentage: number) => {
            return Math.floor(percentage * 100)
        },
    )
    const energyRate = bind(BatteryService, 'energyRate').as((energy_rate) => {
        return Math.ceil(energy_rate)
    })

    return (
        <ToggleButton
            className="battery"
            setup={(self) => {
                self.toggleClassName('warning', percentage.get() <= 30)
                self.toggleClassName('critical', percentage.get() <= 15)
                self.toggleClassName('charging', charging.get())

                self.hook(percentage, (_, percentage) => {
                    self.toggleClassName('warning', percentage <= 30)
                    self.toggleClassName('critical', percentage <= 15)
                })

                self.hook(charging, (_, charging) => {
                    self.toggleClassName('charging', charging)
                })
            }}
            visible={visible}
        >
            <box>
                <label
                    className="percentage"
                    label={percentage.as((percentage) => `${percentage}%`)}
                />
                <label
                    className="icon"
                    label={percentage.as((percentage) =>
                        getBatteryIcons(percentage),
                    )}
                />
                <label
                    className="indicator"
                    label={bind(
                        Variable.derive(
                            [charging, energyRate],
                            (charging: boolean, energy_rate: number) => {
                                return charging
                                    ? '󱐌'
                                    : energy_rate.toString() + 'W'
                            },
                        ),
                    )}
                />
            </box>
        </ToggleButton>
    )
}

export default Battery
