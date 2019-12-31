import {createContext} from "react";
const UsersContext = createContext({
    users: []
});
export const UsersProvider = UsersContext.Provider;
export const UsersConsumer = UsersContext.Consumer;
export default UsersContext;
