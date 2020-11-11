//response DTOs:

export interface ResponseWithProjectDTO {
    project: ProjectDTO;
}

export interface ResponseWithLayersDTO extends ResponseWithProjectDTO {
    layers: LayersDTO;
    yamlError?: string;
}

export interface UploadDataFileResponseDTO extends ResponseWithLayersDTO {
    table: TableDTO;
}

export interface UploadWikifierOutputResponseDTO extends ResponseWithLayersDTO { }

export interface UploadYamlResponseDTO extends ResponseWithLayersDTO { }

export interface GetProjectResponseDTO extends UploadDataFileResponseDTO {
    yamlContent: string;    
}
export interface ChangeSheetResponseDTO extends GetProjectResponseDTO { }

export interface ChangeDataFileResponseDTO extends GetProjectResponseDTO {}

export interface UploadEntitiesDTO extends ResponseWithLayersDTO {
    entitiesStats: EntitiesStatsDTO;
}

export interface CallWikifierServiceDTO extends ResponseWithLayersDTO {
    wikifierError: string;
}

//types:

interface SavedStateDTO {
    current_data_file: string;
    current_sheet: string;
    current_wikifiers: string[];
    current_yaml: string;
 }

export interface ProjectDTO {
    directory: string;
    title: string;
    data_files: { [key: string]: string[] };
    yaml_files: string[];
    wikifier_files: string[];
    entity_files: string[];
    yaml_sheet_associations: { [key: string]: { [key: string] : string[] } };
    sparql_endpoint: string;
    warn_for_empty_cells: boolean;
    handle_calendar: string;
    cache_id: string;
    _saved_state: SavedStateDTO;
}

export interface TableDTO {
    cells: string[][];
    firstRowIndex: number;
    dims: number[];
}

export interface EntitiesStatsDTO {
    added: string[];
    updated: string[];
    failed: string[];
}

export type CellIndex = [number, number];


//layers:

export interface Entry {
    indices: CellIndex[];
}

export type LayerType = "qnode" | "statement" | "error" | "type"| "cleaned" | "annotation";

export interface LayerDTO<T extends Entry> {
    layerType: LayerType;
    entries: T[];
}

export interface QNode{
    label: string
    description: string
    id: string
    url?: string;
}

export interface StatementLayerDTO extends LayerDTO<StatementEntry> {
    qnodes: {[key: string]: QNode };
}

export interface LayersDTO {
    qnode?: LayerDTO<QNodeEntry>;
    statement?: StatementLayerDTO;
    error?: LayerDTO<ErrorEntry>;
    type?: LayerDTO<TypeEntry>;
    cleaned?: LayerDTO<CleanEntry>;
    annotation?: LayerDTO<AnnotationEntry>;
}


export interface QNodeEntry extends Entry, QNode {
    context: string; // null or ""
}

export interface CleanEntry extends Entry {
    cleaned: string;
    original: string;
}

export interface TypeEntry extends Entry {
    type: string;
}

export interface ErrorEntry extends Entry {
    error: any;
}

export interface StatementEntry extends Entry{
    item: string
    property: string
    cell: string
    value: string
    qnodes: any
    qualifier?: any
    unit?: string
}


//annotations:
export interface AnnotationTypeArgs{
    type: "MonolingualText" | "Quantity" | "Time" | "WikibaseItem";
    language?: string;
    unit?: string;
    precision?: string;
    calendar?: string;
    format?: string;
}

export interface AnnotationEntry extends Entry {
    //indices: CellIndex[];
    indexArguments: string[];
    role: "mainSubject" | "property" | "dependentVar" | "qualifier";
    typeArgs?: AnnotationTypeArgs;
}

