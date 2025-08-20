// components/AppButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

// Base Button
const AppButton = ({ title, onPress, style, textStyle }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

// HOC to generate styled variants
const withButtonStyle = (extraStyle = {}, extraTextStyle = {}) => {
    return function (props) {
        return (
            <AppButton
                {...props}
                style={[extraStyle, props.style]}
                textStyle={[extraTextStyle, props.textStyle]}
            />
        );
    };
};

// Variants (created using HOC)
export const LogoutBtn = withButtonStyle({ backgroundColor: "#e53935", flex: 1, marginRight: 10 });
export const AddContactBtn = withButtonStyle({ backgroundColor: "#4caf50", flex: 1, marginRight: 10 });
export const SaveContactBtn = withButtonStyle({backgroundColor: "#2196f3", padding: 15,borderRadius: 8,marginTop: 10,});
export const ProfileButton = withButtonStyle({ backgroundColor: "tomato", paddingHorizontal: 20 });
export const EditBtn= withButtonStyle({backgroundColor: '#4caf50',paddingVertical: 6,paddingHorizontal: 12,borderRadius: 6, marginLeft: 10,})
export const DelBtn= withButtonStyle({backgroundColor: '#e53935',paddingVertical: 6,paddingHorizontal: 12,justifyContent: 'center',alignItems: 'center',borderRadius: 6,marginLeft: 10})

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 5,
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AppButton;
