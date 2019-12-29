import {Mode} from './mode'

export class User {
    id: number;
    nasHomepage: string;
    nasId: string;
    nasPassword: string;
    mode: Mode = Mode.NONE;

    constructor(id: number, nasHomepage: string, nasId: string, nasPassword: string, mode) {
        this.id = id;
        this.nasHomepage = nasHomepage;
        this.nasId = nasId;
        this.nasPassword = nasPassword;
        this.mode = mode;
    }

}
