import AstalNetwork from 'gi://AstalNetwork'
import AstalWp from 'gi://AstalWp'
import {bind} from '../../../../../../../../usr/share/astal/gjs/binding'
import Variable from '../../../../../../../../usr/share/astal/gjs/variable'
import ToggleButton from '../../components/ToggleButton'
import {nearest} from '../../lib/helpers'
import {microphoneIcons, networkIcons, speakerIcons} from '../../lib/Variables'

const NetworkService = AstalNetwork.get_default()
const WifiService = NetworkService.wifi
const WiredService = NetworkService.wired

const SpeakerService = AstalWp.get_default()?.audio.defaultSpeaker
const MicrophoneService = AstalWp.get_default()?.audio.defaultMicrophone

function getWifiIcons(wifiStrength: number, wifiState: number): string {
    const networkIconsKeys = Object.keys(networkIcons.wireless)
        .filter((key) => !Number.isNaN(parseInt(key)))
        .map((key) => parseInt(key))
    const networkIconKey = nearest(wifiStrength, networkIconsKeys)

    if (wifiState <= AstalNetwork.State.DISCONNECTED) {
        return networkIcons.wireless.disconnected
    }

    if (wifiState <= AstalNetwork.State.CONNECTING) {
        return networkIcons.wireless.connecting
    }

    return networkIcons.wireless[networkIconKey]
}

function getVolumeClass(volume: number): string {
    const volumeLevel: {[key: number]: string} = {
        35: 'low',
        75: 'medium',
        90: 'high',
        111: 'warning',
        125: 'overamplified',
    }

    const volumeKey = nearest(
        volume,
        Object.keys(volumeLevel).map((volume) => parseInt(volume)),
    )

    return volumeLevel[volumeKey]
}

const Wifi = () => {
    const wifiStrength = bind(WifiService, 'strength')
    const wifiState = bind(WifiService, 'state')

    return (
        <label
            label={bind(
                Variable.derive(
                    [wifiStrength, wifiState],
                    (wifi_strength, wifi_state) =>
                        getWifiIcons(wifi_strength, wifi_state),
                ),
            )}
        />
    )
}

const Wired = () => {
    return (
        <label
            label={bind(WiredService.device, 'state').as((wired_state) => {
                return wired_state / 10 <= AstalNetwork.DeviceState.UNAVAILABLE
                    ? networkIcons.disconnected
                    : networkIcons.wired
            })}
        />
    )
}

const Microphone = () => {
    if (!MicrophoneService) {
        return <label label={microphoneIcons.muted} />
    }

    const microphoneVolume = bind(MicrophoneService, 'volume').as((volume) =>
        Math.round(volume * 100),
    )
    const microphoneMute = bind(MicrophoneService, 'mute')

    return (
        <label
            label={bind(
                microphoneMute.as((mute) =>
                    mute ? microphoneIcons.muted : microphoneIcons.default,
                ),
            )}
            className={bind(
                Variable.derive(
                    [microphoneVolume, microphoneMute],
                    (volume, mute) => {
                        return [
                            'microphone',
                            mute ? 'low' : getVolumeClass(volume),
                        ].join(' ')
                    },
                ),
            )}
            tooltipText={microphoneVolume.as(
                (volume) => `Current microphone volume: ${volume}%`,
            )}
        />
    )
}

const Speaker = () => {
    if (!SpeakerService) {
        return <label label={microphoneIcons.muted} />
    }

    const speakerVolume = bind(SpeakerService, 'volume').as((volume) =>
        Math.round(volume * 100),
    )
    const speakerMute = bind(SpeakerService, 'mute')

    return (
        <label
            label={bind(
                speakerMute.as((mute) =>
                    mute ? speakerIcons.muted : speakerIcons.default,
                ),
            )}
            className={bind(
                Variable.derive(
                    [speakerVolume, speakerMute],
                    (volume, mute) => {
                        return [
                            'microphone',
                            mute ? 'low' : getVolumeClass(volume),
                        ].join(' ')
                    },
                ),
            )}
            tooltipText={speakerVolume.as(
                (volume) => `Current speaker volume: ${volume}%`,
            )}
        />
    )
}

const QuickControl = () => {
    return (
        <ToggleButton className="quick-control">
            <box>
                {!WifiService ? (
                    <Wired />
                ) : (
                    bind(NetworkService, 'primary').as((primary_network) =>
                        primary_network !== AstalNetwork.Primary.WIFI ? (
                            <Wired />
                        ) : (
                            <Wifi />
                        ),
                    )
                )}
                <Microphone />
                <Speaker />
            </box>
        </ToggleButton>
    )
}

export default QuickControl
