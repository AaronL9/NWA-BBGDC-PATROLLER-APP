import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/colors";

export default function ResendCode({ sendCodeHanlder, setShowOption }) {
  const [timer, setTimer] = useState(60);
  const [showTryAgain, setShowTryAgain] = useState(false);

  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setShowTryAgain(true);
      setShowOption(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleTryAgain = () => {
    setTimer(60);
    setShowTryAgain(false);
    setShowOption(false);
    sendCodeHanlder();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <View
      style={{
        alignSelf: "flex-end",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "grey", fontSize: 12 }}>
        {timer > 0 && (
          <Text>Didn't receive code? resend in {formatTime(timer)}</Text>
        )}
      </Text>

      {showTryAgain && (
        <TouchableOpacity onPress={handleTryAgain}>
          <Text
            style={{
              color: Colors.accent,
              fontSize: 12,
            }}
          >
            Resend
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
