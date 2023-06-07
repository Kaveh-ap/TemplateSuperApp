module.exports = {
    project: {
        ios: {},
        android: {},
    },
    dependencies: {
        'react-native-appmetrica': {
            platforms: {
                android: null,
            },
        },
    },
    assets: ["./assets/fonts"],
    commands: require('@callstack/repack/commands')
};
