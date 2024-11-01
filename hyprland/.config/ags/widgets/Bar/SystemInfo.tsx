import Binding from '../../../../../../../../usr/share/astal/gjs/binding'
import Variable from '../../../../../../../../usr/share/astal/gjs/variable'
import {Gtk} from 'astal/gtk3'

const cpu = Variable(0).poll(
    1000 * 60 * 10,
    [
        'bash',
        '-c',
        `awk '{u=$2+$4; t=$2+$4+$5; if (NR==1){u1=u; t1=t;} else print ($2+$4-u1) * 100 / (t-t1) " % "; }' <(grep 'cpu ' /proc/stat) <(sleep 1;grep 'cpu ' /proc/stat)`,
    ],
    (out, _) => Math.ceil(parseInt(out.split('')[0])), // Kind of stupid removing the % symbol
)

const memory = Variable(0).poll(
    1000 * 60 * 10,
    [
        'bash',
        '-c',
        `free -h | awk 'NR==2 { total=$2; used=$3; sub(/[[:alpha:]]+/, "", total); sub(/[[:alpha:]]+/, "", used); print (used / total) * 100 }'`,
    ],
    (out, _) => Math.ceil(parseInt(out)),
)

const update = Variable(0).poll(
    1000 * 60 * 10,
    ['bash', '-c', 'pacman -Qu | wc -l'],
    (out, _) => parseInt(out),
)

const Item = ({
    icon,
    label,
}: {
    icon: string
    label: string | Binding<string>
}) => {
    return (
        <eventbox className="item">
            <box>
                <label
                    className="icon"
                    label={icon}
                    valign={Gtk.Align.CENTER}
                    halign={Gtk.Align.CENTER}
                    vexpand={true}
                    hexpand={true}
                />
                <label
                    className="percentage"
                    label={label}
                    vexpand={true}
                    hexpand={true}
                    valign={Gtk.Align.CENTER}
                    halign={Gtk.Align.CENTER}
                />
            </box>
        </eventbox>
    )
}

const SystemInfo = () => {
    return (
        <box className="system-info">
            <Item icon="󰻠" label={cpu((c) => c + '%')} />
            <Item icon="󰍛" label={memory((m) => m + '%')} />
            <Item icon="󰇚" label={update((u) => u.toString())} />
        </box>
    )
}

export default SystemInfo
