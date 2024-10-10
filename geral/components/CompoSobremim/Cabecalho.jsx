import { Link } from 'expo-router';
import {View, Text, StyleSheet} from 'react-native';



export default function Cabecalho(){
    const styles = StyleSheet.create({
        header: {
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundColor: 'blue',
            padding: 10,
            color: 'white'
        }
    })

    
    return(
        <View>
            <Text style={styles.header}>Sobre Mim </Text>
            
        </View>
        
    )
}