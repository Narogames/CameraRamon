import { Link } from "expo-router";
import React from "react";
import { View } from "react-native";
export default function telaprincipal(){
    return(
        <View>
            <Link href='./Galeria/'>Galeria</Link>
            <Link href='./Camera/'>Câmera</Link>
        </View>
    )
}