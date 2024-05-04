import { View } from "react-native";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Input, Button } from "@/components/auth";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { object, string } from "yup";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const { colorScheme } = useColorScheme();

  const validationSchema = object({
    email: string().email().required(),
  });

  return (
    <View className="mt-7 grow">
      <Input
        label="Email"
        LeftIcon={Feather}
        leftIconName="mail"
        inputMode="text"
        inputRef={emailRef}
        colorScheme={colorScheme}
        value={email}
        setValue={setEmail}
        error={emailError}
        setError={setEmailError}
        disabled={loading}
      />

      <Button
        onPress={() => {}}
        disabled={loading}
        text="Reset Password"
        marginTop="mt-4"
      />
    </View>
  );
}

// export default function ForgotPasswordPage() {
//   useEffect(() => {
//     supabase.auth.onAuthStateChange(async (event, session) => {
//       if (event == "PASSWORD_RECOVERY") {
//         // const { data, error } = await supabase.auth.updateUser({
//         //   password: newPassword,
//         // });
//       }
//     });
//   }, []);

//   return (
//     <SafeAreaView className="flex items-center justify-between w-full h-full bg-light-bg dark:bg-dark-bg">
//       <StatusBar style="auto" />

//       <View className="w-[90%] h-full">
//         <View className="mb-12">
//           <Text className="text-4xl text-black dark:text-white">Forecast</Text>
//         </View>

//         <View>
//           <Text className="text-2xl text-black dark:text-white">
//             Forgot Password
//           </Text>
//           <Text className="mt-1 text-gray-500 text-md dark:text-gray-400">
//             Enter your email address to reset your password
//           </Text>
//         </View>

//         <View className="mt-7 grow">
//           <View>
//             <Text className="mb-1 text-black text-md dark:text-white">
//               Name
//             </Text>
//             <View className="flex flex-row items-center justify-center p-2 border-2 border-gray-200 rounded-md dark:border-gray-700 bg-light-input dark:bg-dark-input">
//               <Feather
//                 name="mail"
//                 size={20}
//                 color={
//                   colorScheme === "dark"
//                     ? "rgba(156, 163, 175, 1)"
//                     : "rgba(107, 114, 128 1)"
//                 }
//               />
//               <TextInput
//                 placeholder="Enter your full name"
//                 // value={name}
//                 onChangeText={(val) => {
//                   setNameError("");
//                   setName(val);
//                 }}
//                 // disabled={loading}
//                 className="py-[5px] ml-2 text-gray-500 dark:text-gray-400 placeholder:text-gray-500 dark:placeholder:text-gray-400 grow"
//                 inputMode="email"
//                 // ref={nameRef}
//               />
//             </View>
//             {/* {nameError && (
//               <Text className="mt-1 text-red-500 text-md dark:text-red-400">
//                 {nameError}
//               </Text>
//             )} */}
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }
