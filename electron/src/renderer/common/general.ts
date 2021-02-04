// console.log
export const LOG = {
    default: "background: ; color: ",
    highlight: "background: yellow; color: black",
    link: "background: white; color: blue"
};

export interface gridApiInterface {
    api: any;
    columnApi: any;
}

export interface ErrorMessage {
    errorCode: number;
    errorTitle: string;
    errorDescription: string;
}


export class Cell {
    col: number;
    row: number;
    value: string | null = null;

    constructor(col: number, row: number, value?: string | null) {
        this.col = col;
        this.row = row;
        if (value == undefined) {
            this.value = null;
        }
        else {
            this.value = value
        }
    }

}

export enum t2wmlColors {
    PROJECT = "#f8f9fa",
    TABLE = "#339966",
    WIKIFIER = "#006699",
    YAML = "#006699",
    OUTPUT = "#990000",
    TREE = "#695b5a"
}

export interface CellSelection{
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}
