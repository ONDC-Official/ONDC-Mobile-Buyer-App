import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../modules/authentication/login/Login";
import Splash from "../modules/authentication/splash/Splash";

const Stack=createStackNavigator()



const Navigation=()=>{
    return (
        <NavigationContainer>
            <Stack.Navigator>
            <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}}/>
            <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
            </Stack.Navigator>

        </NavigationContainer>
    )
}

export default Navigation;