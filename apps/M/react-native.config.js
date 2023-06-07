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
    commands: require('@callstack/repack/commands'),
};
