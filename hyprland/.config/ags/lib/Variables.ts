export const trayItemShownIds = ['fcitx', 'obs', 'blueman', 'nm-applet']

export const batteryIcons: {[key: number]: string} = {
    15: '',
    45: '',
    75: '',
    100: '',
}

export const networkIcons: {
    disconnected: string
    wired: string
    wireless: {[key: string | number]: string}
} = {
    disconnected: '󰅛',
    wired: '',
    wireless: {
        disconnected: '󰤭',
        connecting: '󰤩',
        5: '󰤯',
        15: '󰤟',
        25: '󰤢',
        50: '󰤥',
        75: '󰤨',
    },
}

export const speakerIcons = {
    default: '',
    muted: '',
}

export const microphoneIcons = {
    default: '',
    muted: '',
}
