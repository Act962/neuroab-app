export type RootStackParamList = {
    Home: undefined
    Form: undefined
    instructions: undefined
    Roullete:undefined
    Admin: undefined
    Users: undefined
}

declare global {
    namespace ReactNavigation {
        interface RootParamList extends
            RootStackParamList { }
    }
}