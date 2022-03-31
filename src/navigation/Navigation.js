import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginForm from "../modules/authentication/login/LoginForm";

const Stack=createStackNavigator()



const Navigation=()=>{
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginForm} options={{headerShown:false}}/>
            </Stack.Navigator>

        </NavigationContainer>
    )
}

export default Navigation;