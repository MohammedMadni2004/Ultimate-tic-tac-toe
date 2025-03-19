// import { useTheme } from "@/contexts/theme-provider";
// import { Toaster as Sonner } from "sonner";
// import { View, Text, TouchableOpacity } from "react-native";
// import tw from 'twrnc';

// type ToasterProps = React.ComponentProps<typeof Sonner>;

// const toast = ({ ...props }: ToasterProps) => {
//   const { theme = "system" } = useTheme();

//   return (
//     <Sonner
//       theme={theme as ToasterProps["theme"]}
//       toastOptions={{
//         classNames: {
//           toast:
//             "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
//           description: "group-[.toast]:text-muted-foreground",
//           actionButton:
//             "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground hover:group-[.toast]:bg-primary/90",
//           cancelButton:
//             "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground hover:group-[.toast]:bg-muted/90",
//         },
//         style: {
//           background: "var(--background)",
//           color: "var(--foreground)",
//           border: "1px solid var(--border)",
//         },
//       }}
//       {...props}
//       renderToast={(toast) => {
//         return (
//           <View
//             style={[
//               tw`p-4 bg-background border border-border shadow-lg rounded-md`, // Tailwind styles with twrnc
//               { backgroundColor: toast.style.background, borderColor: toast.style.border }
//             ]}
//           >
//             <Text style={tw`text-foreground`}>{toast.description}</Text>
//             <View style={tw`flex-row justify-between mt-2`}>
//               <TouchableOpacity style={tw`bg-primary p-2 rounded-md`}>
//                 <Text style={tw`text-primary-foreground`}>{toast.actionText}</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={tw`bg-muted p-2 rounded-md`}>
//                 <Text style={tw`text-muted-foreground`}>{toast.cancelText}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         );
//       }}
//     />
//   );
// };

// export { toast };