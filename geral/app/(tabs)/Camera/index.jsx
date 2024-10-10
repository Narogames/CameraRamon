import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Text, Image, Pressable, Modal, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as MediaLibrary from 'expo-media-library';

export default function CameraApp() {
    const [permissaoCamera, pedirPermissaoCamera] = useCameraPermissions();
    const [permissaoGaleria, setPermissaoGaleria] = useState(null);
    const [foto, setFoto] = useState(null);
    const cameraRef = useRef(null);
    const [mostrarFoto, setMostrarFoto] = useState(false);
    const [facing, setFacing] = useState('back');
    const [scanning, setScanning] = useState(false);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const pedirPermissaoGaleria = async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            setPermissaoGaleria(status === 'granted');
        };
        pedirPermissaoGaleria();
    }, []);

    if (!permissaoCamera) {
        return <View></View>
    }
    if (!permissaoCamera.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.textoPermissao}> O aplicativo deseja utilizar a câmera.</Text>
                <Pressable style={styles.botaoPermissao} onPress={pedirPermissaoCamera}>
                    <Text style={styles.textoBotao}>Pedir Permissão</Text>
                </Pressable>
            </View>
        )
    }

    const tirarFoto = async () => {
        if (cameraRef.current) {
            try {
                const fotoBase64 = await cameraRef.current.takePictureAsync({
                    quality: 0.5,
                    base64: true
                });

                setFoto(fotoBase64);
                setMostrarFoto(true);
            } catch (error) {
                console.log('Erro ao tirar foto:', error);
            }
        }
    }

    const salvarFoto = async () => {
        try {
            if (permissaoGaleria && foto) {
                const asset = await MediaLibrary.createAssetAsync(foto.uri);
                console.log('Foto salva na galeria:', asset.uri);
                setFoto(null);
                setMostrarFoto(false);
            } else {
                console.log('Permissão para salvar na galeria não concedida');
            }
        } catch (error) {
            console.log('Erro ao salvar foto:', error);
        }
    }

    const apagarFoto = () => {
        setFoto(null);
        setMostrarFoto(false);
    }

    const toggleCameraFacing = () => {
        setFacing(facing === 'back' ? 'front' : 'back');
    }

    const handleBarCodeScanned = ({ data }) => {
        setQrCodeData(data);
        setModalVisible(true);
    };

    const abrirUrl = () => {
        if (qrCodeData) {
            Linking.openURL(qrCodeData);
        }
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {mostrarFoto && foto ? 
            <View style={styles.fotoContainer}>
                <Image source={{ uri: foto.uri }} style={styles.foto} /> 
                <View style={styles.botoes}>
                    <Pressable style={styles.botaoSalvar} onPress={salvarFoto}>
                        <Text style={styles.textoBotao}>Salvar</Text>
                    </Pressable>
                    <Pressable style={styles.botaoApagar} onPress={apagarFoto}>
                        <Text style={styles.textoBotao}>Apagar</Text>
                    </Pressable>
                </View>
            </View> :
            <View style={styles.cameraContainer}>
                <BarCodeScanner
                    onBarCodeScanned={scanning ? handleBarCodeScanned : undefined}
                    style={styles.camera}
                />
                <View style={styles.botoesCamera}>
                    <Pressable style={styles.botaoTirar} onPress={tirarFoto}>
                        <Text style={styles.textoBotao}>Tirar foto</Text>
                    </Pressable>
                    <Pressable style={styles.botaoTrocar} onPress={toggleCameraFacing}>
                        <Text style={styles.textoBotao}>Trocar Câmera</Text>
                    </Pressable>
                </View>
            </View>
            }
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTexto}>Deseja ir para o site?</Text>
                    <Text style={styles.modalLink}>{qrCodeData}</Text>
                    <Pressable style={styles.modalBotaoSim} onPress={abrirUrl}>
                        <Text style={styles.textoBotao}>Sim</Text>
                    </Pressable>
                    <Pressable style={styles.modalBotaoNao} onPress={() => setModalVisible(false)}>
                        <Text style={styles.textoBotao}>Não</Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoPermissao: {
        textAlign: 'center',
    },
    cameraContainer: {
        flex: 1,
        width: '100%',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    fotoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    foto: {
        width: '100%',
        height: '70%',
        marginBottom: 20,
    },
    botoes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    botoesCamera: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 20,
        paddingHorizontal: 10,
    },
    botaoSalvar: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 25,
        marginHorizontal: 5,
        flex: 1,
        alignItems: 'center',
    },
    botaoApagar: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 25,
        marginHorizontal: 5,
        flex: 1,
        alignItems: 'center',
    },
    botaoTirar: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 25,
        marginHorizontal: 5,
        flex: 1,
        alignItems: 'center',
    },
    botaoTrocar: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 25,
        marginHorizontal: 5,
        flex: 1,
        alignItems: 'center',
    },
    botaoPermissao: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 25,
        marginTop: 20,
    },
    textoBotao: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalTexto: {
        color: '#FFFFFF',
        fontSize: 20,
        marginBottom: 20,
    },
    modalLink: {
        color: '#00FF00',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalBotaoSim: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 25,
        marginBottom: 10,
        alignItems: 'center',
    },
    modalBotaoNao: {
        backgroundColor: '#F44336',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
});
