import { Avatar, Box, FlatList, Flex, HStack, Icon, Image, Input, Text, View, VStack } from "native-base"
import React, { useEffect, useRef, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { darktheme } from "../../../Theme/globalTheme"
import { FontAwesome } from "@expo/vector-icons"
import { supabase } from "../../../Supabase/supabaseClient"
import { FlatListProps, ListRenderItem, TextInput } from "react-native"
import { Profile } from "../../../Interface/Profile"
import useSettingsStore from "../../../Store/settingsStore"

const ContactScreen = () => {
	const contactProfiles = useSettingsStore((state) => state.contactProfiles)

	const renderItem: ListRenderItem<{
		id: string
		updated_at?: string | undefined
		username?: string | undefined
		avatar_url?: string | undefined
		email?: string | undefined
		about?: string | undefined
		phone?: string | undefined
	}> = ({ item }) => (
		<Box p="2" width="full" mb={2}>
			<HStack space="4" alignItems={"center"}>
				<Avatar
					source={{
						uri: item.avatar_url
					}}
					height="10"
					width="10"
					borderRadius={"full"}
					bg="yellow.500">
					{item.username && item?.username[0].toUpperCase() + item?.username[1].toUpperCase()}
				</Avatar>

				<Flex justifyContent={"space-between"}>
					<Text color="white" fontWeight={"bold"}>
						{item.username}
					</Text>
					<Text color="gray.400" ellipsizeMode="tail" numberOfLines={1} maxW={"xs"}>
						{item.about}
					</Text>
				</Flex>
			</HStack>
		</Box>
	)

	return (
		<Box bg={darktheme.primaryColor} height="full" position="relative">
			<SafeAreaView>
				<FlatList data={contactProfiles} renderItem={renderItem} keyExtractor={({ id }) => id} />
			</SafeAreaView>
		</Box>
	)
}

export default ContactScreen
