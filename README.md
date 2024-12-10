# Multiply App

## Get started

1. Start the app

```bash
    npx expo start
```

1. Upgrade minor Dependencies

```bash
npx expo install --fix
```

## Dependencies

1. Drawer Navigation

```bash
npx expo install @react-navigation/drawer react-native-gesture-handler react-native-reanimated
```

1. Async Storage

- to store simple key value pair
- I need to store app settings data

```bash
npx expo install @react-native-async-storage/async-storage
```

1. number picker

```bash
npx expo install @react-native-picker/picker
```

## Local app development

```sh
npx expo run:android
eas build --platform android --local --profile preview
```

```sh
npx expo install expo-dev-client
npm install -g eas-cli
eas login
eas build:configure
```

## build

```sh
eas build --profile development --platform android
```
