import "react-native-url-polyfill/auto"
import { NativeBaseProvider } from "native-base"
import AppNavigator from "./src/Router/AppNavigator"

export default function App() {
	return (
		<NativeBaseProvider>
			<AppNavigator />
		</NativeBaseProvider>
	)
}
