import "react-native-url-polyfill/auto"
import { NativeBaseProvider } from "native-base"
import AppNavigator from "./src/Router/AppNavigator"
import Authenticator from "./src/Components/Authenticator"

export default function App() {
	return (
		<NativeBaseProvider>
			<Authenticator>
				<AppNavigator />
			</Authenticator>
		</NativeBaseProvider>
	)
}
