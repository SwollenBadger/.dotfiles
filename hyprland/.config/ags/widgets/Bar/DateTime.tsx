import GLib from 'gi://GLib?version=2.0'
import Variable from '../../../../../../../../usr/share/astal/gjs/variable'
import ToggleButton from '../../components/ToggleButton'

const date = Variable<string>('').poll(
    1000,
    () => GLib.DateTime.new_now_local().format('%A %d %b %Y')!,
)

const time = Variable<string>('').poll(
    1000,
    () => GLib.DateTime.new_now_local().format('%H:%M')!,
)

const Calendar = () => {
    return (
        <ToggleButton className="datetime">
            <box>
                <label className="time" label={time()} />
                <label className="separator" label="" />
                <label className="date" label={date()} />
            </box>
        </ToggleButton>
    )
}

export default Calendar
