import {makeAutoObservable} from "mobx";

export default class UserStore {
    _isAuth = false
    _user = {}
    constructor() {
        makeAutoObservable(this)
    }

    setIsAuth(bool:boolean) {
        this._isAuth = bool
    }
    setUser(user:{}) {
        this._user = user
    }

    get isAuth() {
        return this._isAuth
    }
    get User() {
        return this._user
    }



}
