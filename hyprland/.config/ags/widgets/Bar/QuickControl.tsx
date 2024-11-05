import AstalNetwork from 'gi://AstalNetwork'
import AstalWp from 'gi://AstalWp'
import {bind} from '../../../../../../../../usr/share/astal/gjs/binding'
import Variable from '../../../../../../../../usr/share/astal/gjs/variable'
import ToggleButton from '../../components/ToggleButton'
import {nearest} from '../../lib/helpers'
import {microphoneIcons, networkIcons, speakerIcons} from '../../lib/Variables'

const NetworkService = AstalNetwork.get_default()
const SpeakerService = AstalWp.get_default()?.audio.defaultSpeaker!
const MicrophoneService = AstalWp.get_default()?.audio.defaultMicrophone!

function getWifiIcons(wifiStrength: number, wifiState: number): string {
    const networkIconsKeys = Object.keys(networkIcons.wireless)
        .filter((key) => !Number.isNaN(parseInt(key)))
        .map((key) => parseInt(key))
    const networkIconKey = nearest(wifiStrength, networkIconsKeys)

    if (wifiState <= AstalNetwork.DeviceState.UNAVAILABLE) {
        return networkIcons.wireless.disconnected
    }

    if (wifiState <= AstalNetwork.DeviceState.SECONDARIES) {
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

const Network = () => {
    const networkPrimary = bind(NetworkService, 'primary')

    const wifiStrength = bind(NetworkService.wifi, 'strength')
    const wifiState = bind(NetworkService.wifi.device, 'state')

    const networkInfo = Variable.derive(
        [networkPrimary, wifiStrength, wifiState],
        (network_primary, wifi_strength, wifi_state) => {
            let label =
                network_primary === AstalNetwork.Primary.WIFI
                    ? getWifiIcons(wifi_strength, wifi_state / 10)
                    : networkIcons.wired

            if (network_primary < 1) {
                label = networkIcons.disconnected
            }

            return {
                label,
                wifiStrength: wifi_strength,
            }
        },
    )

    return (
        <label
            setup={(self) => {
                self.label = networkInfo.get().label
                self.hook(networkInfo, (self, network) => {
                    self.label = network.label
                })
            }}
        />
    )
}

const Microphone = () => {
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
                <Network />
                <Microphone />
                <Speaker />
            </box>
        </ToggleButton>
    )
}

export default QuickControl
