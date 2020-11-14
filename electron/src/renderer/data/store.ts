import { observable, action } from 'mobx';
import { ipcRenderer } from 'electron';
import { DisplayMode } from '@/shared/types';
import { ProjectList } from './projects';
import { AnnotationEntry, CleanEntry, EntitiesStatsDTO, Entry, ErrorEntry, LayerDTO, LayersDTO, QNode, QNodeEntry, StatementEntry, StatementLayerDTO, TableDTO, TypeEntry} from '../common/dtos';
import { Cell } from '../common/general';

type EditorsStatus = "Wikifier" | "YamlEditor";
class EditorsState {
    @observable public nowShowing: EditorsStatus = "Wikifier";
}

class TableState {
    @observable public table: TableDTO;
    @observable public isCellSelectable: boolean;
    @observable public showSpinner: boolean;
    @observable public selectedCell: Cell;
    @observable public showCleanedData: boolean;


    constructor() {
        this.table = {} as TableDTO;
        this.isCellSelectable = false;
        this.showSpinner = false;
        this.selectedCell = new Cell()
        this.showCleanedData = false;

    }

}

class WikifierState {
    @observable public showSpinner: boolean;
    @observable public wikifierError?: string;
    @observable public entitiesStats?: EntitiesStatsDTO;


    constructor() {
        this.showSpinner = false;
    }
}

class OutputState {
    @observable public showSpinner: boolean;
    @observable public isDownloadDisabled: boolean;

    constructor() {
        this.showSpinner = false;
        this.isDownloadDisabled = true;
    }
    
}

class YamlEditorState {
    @observable public yamlContent?: string;
    @observable public yamlError?: string | undefined;
}

class Layer<T extends Entry> {
    @observable public entries: T[];
    private entryMap: Map<string, T>;

    constructor(responseLayer?: LayerDTO<T>) {
        this.entryMap = new Map<string, T>();
        if (!responseLayer) {
            this.entries = []
        }
        else {
            this.entries = responseLayer.entries;
            for (const entry of this.entries) {
                for (const index_pair of entry.indices) {
                    this.entryMap.set(`${index_pair[0]},${index_pair[1]}`, entry)
                }

            }
        }
    }

    public find(cell: Cell | null): T | undefined {
        if (cell.row && cell.col) {
            const index = `${cell.row},${cell.col}`;
            return this.entryMap.get(index);
        }
        return undefined
    }
}

class StatementLayer extends Layer<StatementEntry>{
    qnodes: Map<string, QNode>

    constructor(responseLayer?: StatementLayerDTO) {
        super(responseLayer);
        if (responseLayer && responseLayer.qnodes) {
            this.qnodes = new Map<string, QNode>(Object.entries(responseLayer.qnodes));
        }
        else {
            this.qnodes = new Map<string, QNode>();
        }
    }

    public getQNode(id: string): QNode {
        const return_val = this.qnodes.get(id);
        if (return_val) {
            return return_val;
        }
        return { "label": id, "url": "", description: "", "id": id };
    }
}


class LayerState {
    @observable public qnode: Layer<QNodeEntry>;
    @observable public type: Layer<TypeEntry>;
    @observable public statement: StatementLayer;
    @observable public error: Layer<ErrorEntry>;
    @observable public cleaned: Layer<CleanEntry>;
    @observable public annotation: Layer<AnnotationEntry>;

    constructor() {
        this.qnode = new Layer<QNodeEntry>();
        this.type = new Layer<TypeEntry>();
        this.statement = new StatementLayer();
        this.error = new Layer<ErrorEntry>();
        this.cleaned = new Layer<CleanEntry>();
        this.annotation = new Layer<AnnotationEntry>();
    }

    @action
    public updateFromDTO(dto: LayersDTO) {
        console.debug('Updating layers: ', dto);
        if (dto.qnode) {
            this.qnode = new Layer(dto.qnode);
        }
        if (dto.type) {
            this.type = new Layer(dto.type);
        }
        if (dto.statement) {
            this.statement = new StatementLayer(dto.statement);
        }
        if (dto.error) {
            this.error = new Layer(dto.error);
        }
        if (dto.cleaned) {
            this.cleaned = new Layer(dto.cleaned);
        }
        if (dto.annotation){
            this.annotation = new Layer(dto.annotation)
        }
    }


}


class WikiStore {
    @observable public editors = new EditorsState();
    @observable public table = new TableState();
    @observable public wikifier = new WikifierState();
    @observable public output = new OutputState();
    @observable public yaml = new YamlEditorState();
    @observable public layers = new LayerState();
    
    @observable public displayMode: DisplayMode = 'project-list';
    @observable public projects = new ProjectList();

    @action
    public changeProject(path?: string) {
        if (path) {
            this.displayMode = 'project';
            if (path) {
                ipcRenderer.send('show-project', path)
            }
            this.projects.setCurrent(path);
        } else {
            this.displayMode = 'project-list';
            ipcRenderer.send('show-project', null);
        }
    }
}


const wikiStore = new WikiStore();
export default wikiStore;
