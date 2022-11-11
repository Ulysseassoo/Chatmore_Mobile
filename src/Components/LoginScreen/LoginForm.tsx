import { Box, Button, Flex, FormControl, Input, Stack, Text } from "native-base"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { darktheme } from "../../Theme/globalTheme"
import * as Constants from "../../Constants/index"
import FormInput from "../FormInput"
import { supabase } from "../../Supabase/supabaseClient"
import useAuthStore from "../../Store/authStore"

interface FormData {
	email: string
	password: string
}

const LoginForm = () => {
	const setLoggedIn = useAuthStore((state) => state.setLoggedIn)
	const { handleSubmit, control } = useForm<FormData>()

	const onSubmit = async (formData: FormData) => {
		console.log(formData)
		try {
			const { error, data } = await supabase.auth.signInWithPassword(formData)
			if (error) throw error
			if (data.session !== null) {
				setLoggedIn(data.session)
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<FormControl>
			<Stack space={5} marginX="4">
				<Stack>
					<Controller
						control={control}
						name="email"
						rules={{
							required: {
								value: true,
								message: "This field is required"
							},
							pattern: {
								value: Constants.regex,
								message: "Please enter a valid email"
							}
						}}
						render={({ field: { onChange, value, onBlur }, formState: { errors } }) => (
							<FormInput placeholder="Email" onChange={onChange} defaultValue={""} value={value} onBlur={onBlur} error={errors.email} />
						)}
					/>
				</Stack>
				<Stack>
					<Controller
						control={control}
						name="password"
						rules={{
							required: {
								value: true,
								message: "This field is required"
							},
							minLength: {
								value: 5,
								message: "Your password is too small"
							}
						}}
						render={({ field: { onChange, value, onBlur }, formState: { errors } }) => (
							<FormInput
								onChange={onChange}
								defaultValue={""}
								value={value}
								onBlur={onBlur}
								placeholder="Password"
								error={errors.password}
								isPassword
							/>
						)}
					/>
				</Stack>

				<Flex flexDir="row-reverse">
					<Text color="white">Forgot your password ?</Text>
				</Flex>

				<Button onPress={handleSubmit(onSubmit)} bg={darktheme.accentColor}>
					Sign in
				</Button>
			</Stack>
		</FormControl>
	)
}

export default LoginForm
