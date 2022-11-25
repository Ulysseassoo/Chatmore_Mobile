import { FormControl, Stack, Flex, Text, Button } from "native-base"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { darktheme } from "../../Theme/globalTheme"
import FormInput from "../FormInput"
import * as Constants from "../../Constants/index"
import { supabase } from "../../Supabase/supabaseClient"
import useAuthStore from "../../Store/authStore"

interface FormData {
	email: string
	password: string
	username: string
}

const RegisterForm = () => {
	const setLoggedIn = useAuthStore((state) => state.setLoggedIn)
	const { handleSubmit, control } = useForm<FormData>()

	const onSubmit = async (formData: FormData) => {
		try {
			const { error, data } = await supabase.auth.signUp(formData)
			if (error) throw error
			if (data.user !== null) {
				const updates = {
					id: data.user.id,
					username: formData.username,
					email: formData.email,
					updated_at: new Date().toISOString()
				}
				const { error: errorProfile } = await supabase.from("profiles").upsert(updates)
				if (errorProfile) throw errorProfile
			}

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
						name="username"
						rules={{
							required: {
								value: true,
								message: "Username is required"
							}
						}}
						render={({ field: { onChange, value, onBlur }, formState: { errors } }) => (
							<FormInput placeholder="Username" onChange={onChange} defaultValue={""} value={value} onBlur={onBlur} error={errors.username} />
						)}
					/>
				</Stack>

				<Stack>
					<Controller
						control={control}
						name="email"
						rules={{
							required: {
								value: true,
								message: "Email is required"
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
				<Stack space="2">
					<Controller
						control={control}
						name="password"
						rules={{
							required: {
								value: true,
								message: "At least 5 characters, use at least 1 upper and 1 lower case."
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

				<Button onPress={handleSubmit(onSubmit)} bg={darktheme.accentColor} mt="6">
					Sign up
				</Button>
			</Stack>
		</FormControl>
	)
}

export default RegisterForm
