import { useRoute } from "@react-navigation/core"
import {
	Avatar,
	Box,
	Button,
	Center,
	Flex,
	FormControl,
	HStack,
	Icon,
	Input,
	Modal,
	Pressable,
	ScrollView,
	Text,
	useToast,
	VStack
} from "native-base"
import React, { useState } from "react"
import { Profile } from "../../../Interface/Types"
import { darktheme } from "../../../Theme/globalTheme"
import { MaterialIcons } from "@expo/vector-icons"
import useAuthStore from "../../../Store/authStore"
import { createUserBlock, deleteUserBlock, UserHasBlockedData, UserHasBlockedDelete } from "../../../Api/API"
import useIsUserBlocked from "../../../Hooks/useIsUserBlocked"

interface Params {
	profile: Profile
}

export interface RouteProps {
	key: string
	name: string
	path?: string
	params: Params
}

const ProfileUserScreen = () => {
	const { params } = useRoute<RouteProps>()
	const { profile } = params
	const toast = useToast()
	const session = useAuthStore((state) => state.session)
	const deleteBlockedUser = useAuthStore((state) => state.deleteBlockedUser)
	const addBlockedUser = useAuthStore((state) => state.addBlockedUser)
	const [showModal, setShowModal] = useState(false)
	const isUserBlocked = useIsUserBlocked(profile.id)

	const closeModal = () => setShowModal(false)

	const unblockUser = async () => {
		const deleteUsers: UserHasBlockedDelete = {
			blocking_user_id: session?.user.id,
			blocked_user_id: profile.id
		}

		try {
			await deleteUserBlock(deleteUsers)
			// Delete store
			deleteBlockedUser(profile.id)
			toast.show({
				description: `${profile.username} has been unblocked !`,
				bg: "green.500",
				placement: "top"
			})
		} catch (error: any) {
			console.log(error)
		}
	}

	const blockUser = async () => {
		const update: UserHasBlockedData = {
			blocking_user_id: session?.user.id,
			blocked_user_id: profile.id,
			created_at: new Date()
		}
		try {
			const createBlockRelation = await createUserBlock(update)
			// Add store
			addBlockedUser(createBlockRelation)
			toast.show({
				description: `${profile.username} has been blocked !`,
				color: "green.500",
				placement: "top"
			})
			closeModal()
		} catch (error) {
			toast.show({
				description: "User couldn't be blocked. Restart later."
			})
		}
	}

	const blockButton = () => {
		if (isUserBlocked) {
			return (
				<Pressable
					bg={darktheme.headerMenuColor}
					p="2"
					py="4"
					borderRadius="xl"
					shadow="2"
					onPress={unblockUser}
					_pressed={{
						bg: darktheme.lineBreakColor
					}}
					style={{
						shadowColor: darktheme.lineBreakColor
					}}>
					<HStack alignItems={"center"} space="1.5">
						<Icon as={MaterialIcons} name="block" size={7} color={"white"} />
						<Box>
							<Text color={"white"} fontSize={"lg"}>
								Unblock this user
							</Text>
						</Box>
					</HStack>
				</Pressable>
			)
		}

		return (
			<Pressable
				bg={darktheme.headerMenuColor}
				p="2"
				py="4"
				borderRadius="xl"
				shadow="2"
				onPress={() => setShowModal(true)}
				_pressed={{
					bg: darktheme.lineBreakColor
				}}
				style={{
					shadowColor: darktheme.lineBreakColor
				}}>
				<HStack alignItems={"center"} space="1.5">
					<Icon as={MaterialIcons} name="block" size={7} color={darktheme.importantColor} />
					<Box>
						<Text color={darktheme.importantColor} fontSize={"lg"}>
							Block this user
						</Text>
					</Box>
				</HStack>
			</Pressable>
		)
	}

	return (
		<>
			<Flex bg={darktheme.profileColor} flex="1">
				<Flex justifyContent={"space-between"} flex="1" pb="3">
					<Box>
						<Center pt="4">
							<Avatar
								source={{
									uri: profile?.avatar_url
								}}
								bg={darktheme.accentColor}
								size={"2xl"}>
								{profile?.username && profile?.username[0].toUpperCase() + profile?.username[1].toUpperCase()}
							</Avatar>

							<Text color="white" mt="3" fontSize={"2xl"}>
								{profile?.username}
							</Text>
						</Center>

						<Box mt="8" px="4">
							<Box
								bg={darktheme.headerMenuColor}
								p="2"
								borderRadius="xl"
								shadow="2"
								style={{
									shadowColor: darktheme.lineBreakColor
								}}>
								<Text color="white" fontSize={"lg"}>
									{profile.about}
								</Text>
								<Text color={darktheme.textColor} fontSize="sm">
									About
								</Text>
							</Box>

							<Box
								bg={darktheme.headerMenuColor}
								p="2"
								mt="4"
								borderRadius="xl"
								shadow="2"
								style={{
									shadowColor: darktheme.lineBreakColor
								}}>
								<Text color="white" fontSize={"lg"}>
									{profile.phone}
								</Text>
								<Text color={darktheme.textColor} fontSize="sm">
									Phone number
								</Text>
							</Box>
						</Box>
					</Box>

					<VStack px="4" space="3.5">
						{blockButton()}
					</VStack>
				</Flex>
			</Flex>

			<Center>
				<Modal isOpen={showModal} onClose={closeModal}>
					<Modal.Content bg={darktheme.headerMenuColor} maxWidth="400px">
						<Modal.Body>
							<Text color="white" fontSize={"xl"}>
								Block {profile.username} ?
							</Text>
							<Button.Group space={2} textTransform="uppercase" pt="4" alignSelf={"flex-end"}>
								<Button variant="ghost" colorScheme="blueGray" onPress={closeModal}>
									No
								</Button>
								<Button color="white" onPress={blockUser} bg={darktheme.importantColor}>
									Yes
								</Button>
							</Button.Group>
						</Modal.Body>
					</Modal.Content>
				</Modal>
			</Center>
		</>
	)
}

export default ProfileUserScreen
