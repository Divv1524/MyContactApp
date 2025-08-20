// components/LocationButton.js
import React from "react";
import { ActivityIndicator, Text } from "react-native";
import AppButton from "./AppButton";

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

// Location-specific variants
export const RefreshBtn = ({ loading, ...props }) => (
  <AppButton
    {...props}
    style={{ backgroundColor: "#2563EB", flex: 1, margin: 5 }}
    title={
      loading ? <ActivityIndicator color="white" size="small" /> : "📡 Refresh"
    }
  />
);

export const StartStopBtn = ({ isTracking, loading, ...props }) => (
  <AppButton
    {...props}
    style={{
      backgroundColor: isTracking ? "#DC2626" : "#10B981",
      flex: 1,
      margin: 5,
    }}
    title={
      loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : isTracking ? (
        "⛔ Stop"
      ) : (
        "▶ Start"
      )
    }
  />
);

export const ExportCSVBtn = withButtonStyle({ backgroundColor: "#10B981",flex: 1, margin: 5  });
export const ClearFileBtn = withButtonStyle({ backgroundColor: "#DC2626" ,flex: 1, margin: 5 });
