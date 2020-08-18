import requests

from t2wml.api import Sheet
from web_exceptions import NoSuchDatasetIDException, CellResolutionWithoutYAMLFileException
from app_config import DATAMART_API_ENDPOINT
from t2wml_web import download

def get_dataset_id(data_sheet):
    #step one: extract dataset id from cell B1
    try:
        sheet = Sheet(data_sheet.data_file.file_path, data_sheet.name)
        data_cell=str(sheet[0, 1])
    except:
        raise ValueError("Could not get dataset id from sheet")
    #step two: check if dataset id exists
    response=requests.get(DATAMART_API_ENDPOINT+"/metadata/datasets/{dataset_id}".format(dataset_id=data_cell))
    if response.status_code!=200:
        raise ValueError("Dataset ID not found in datamart")
    
    return data_cell

def get_download(project, sheet):
    yaml_file = sheet.yaml_file
    if not yaml_file:  
        raise CellResolutionWithoutYAMLFileException(
            "Cannot download report without uploading YAML file first")
    response=download(sheet, yaml_file, project, "tsv")
    kgtk=response["data"]
    return kgtk


def upload_to_datamart(project, data_sheet):
    try:
        dataset_id = get_dataset_id(data_sheet)
    except Exception as e:
        raise NoSuchDatasetIDException(str(e))

    #step three: get the download kgtk
    kgtk=get_download(project, data_sheet)

    #step four: concatenate download with item defs file

    #step five: upload to datamart
    response=requests.post(DATAMART_API_ENDPOINT + "/datasets/{dataset_id}/t2wml".format(dataset_id=dataset_id),
                            )

    data={}
    return data


