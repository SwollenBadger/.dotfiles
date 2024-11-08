import Binding from '../../../../../../../../usr/share/astal/gjs/binding'
import Variable from '../../../../../../../../usr/share/astal/gjs/variable'
import {Gtk} from 'astal/gtk3'

const cpu = Variable<number[]>([0]).poll(
    1000 * 60,
    [
        'bash',
        '-c',
        `awk '{print $2,$4,$5}' <(grep -i -E "cpu[[:digit:]]" /proc/stat) <(echo "cpu0 ;") <(sleep 1; grep -i -E "cpu[[:digit:]]" /proc/stat)`,
    ],
    (out) => {
        const calc_usage = (a: number[], b: number[]): number => {
            const u = a[0] + a[1]
            const t = a.reduce((c, p) => c + p)

            const u1 = b[0] + b[1]
            const t1 = b.reduce((c, p) => c + p)

            return Math.ceil(((u1 - u) * 100) / (t1 - t))
        }

        let cpu_usage: number[] = []

        const [snapshot_a, snapshot_b] = out.split(/\n;\s*/).map((out) => {
            return out
                .split('\n')
                .map((out) => out.split(/\s/).map((out) => parseInt(out)))
        })

        for (let i = 0; i < snapshot_a.length; i++) {
            cpu_usage.push(calc_usage(snapshot_a[i], snapshot_b[i]))
        }

        return cpu_usage
    },
)

const memory = Variable<{
    [key: string]: number
    total: number
    used: number
    free: number
    shared: number
    buff: number
    available: number
}>({
    total: 0,
    used: 0,
    free: 0,
    shared: 0,
    buff: 0,
    available: 0,
}).poll(
    1000 * 60 * 10,
    ['bash', '-c', `free --bytes | awk 'NR==2'`],
    (out, _) => {
        const [total, used, free, shared, buff, available] = out
            .split(/\s+/)
            .filter((out) => !isNaN(parseInt(out)))
            .map((out) => parseInt(out))

        return {total, used, free, shared, buff, available}
    },
)

const update = Variable(0).poll(
    1000 * 60 * 10,
    ['bash', '-c', 'pacman -Qu | wc -l'],
    (out) => parseInt(out),
)

const Item = ({
    icon,
    label,
    tooltipMarkup,
}: {
    icon: string
    label: string | Binding<string>
    tooltipMarkup?: Binding<string> | string
}) => {
    return (
        <eventbox
            className="item"
            tooltipMarkup={tooltipMarkup ? tooltipMarkup : ''}
        >
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
            <Item
                icon="󰻠"
                tooltipMarkup={cpu((cores) => {
                    return cores
                        .map((cpu_usage, i) => `Cpu ${i}: ${cpu_usage} %`)
                        .join('\n')
                })}
                label={cpu(
                    (cores) =>
                        Math.ceil(
                            cores.reduce((c, p) => c + p) / cores.length,
                        ) + '%',
                )}
            />
            <Item
                icon="󰍛"
                tooltipMarkup={memory((memory) => {
                    let memory_info: string[] = []

                    for (const i in memory) {
                        memory_info.push(
                            `${i[0].toUpperCase() + i.slice(1)}: ${Math.floor(memory[i] / 1024 ** 3)} GIB`,
                        )
                    }

                    return memory_info.join('\n')
                })}
                label={memory((memory) => {
                    const {total, used} = memory
                    return Math.ceil((used * 100) / total) + '%'
                })}
            />
            <Item icon="󰇚" label={update((u) => u.toString())} />
        </box>
    )
}

export default SystemInfo
