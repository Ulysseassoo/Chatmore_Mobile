import { Box, Input, Text } from "native-base"
import React, { useState } from "react"
import { FieldError } from "react-hook-form"
import { darktheme } from "../Theme/globalTheme"

interface Props {
	onChange: (text: any) => void
	onBlur: () => void
	defaultValue: string | undefined
	placeholder: string
	error: FieldError | undefined
	isPassword?: boolean
	value: string
}

const FormInput = ({ onChange, onBlur, defaultValue, placeholder, error, isPassword = false }: Props) => {
	const [onFocus, setOnFocus] = useState<boolean>(false)

	return (
		<Box>
			<Input
				borderBottomColor={onFocus ? darktheme.accentColor : "#FFF"}
				focusOutlineColor={"black"}
				onFocus={() => setOnFocus(true)}
				color="white"
				backgroundColor={"black"}
				borderColor="black"
				onChangeText={(text) => onChange(text)}
				onBlur={() => {
					setOnFocus(false)
					onBlur()
				}}
				secureTextEntry={isPassword}
				defaultValue={defaultValue}
				placeholder={placeholder}
				placeholderTextColor="gray.500"
				variant="filled"
				p={2}
			/>
			{error && (
				<Text color="red.500" pt="2">
					{error.message}
				</Text>
			)}
		</Box>
	)
}

export default FormInput
