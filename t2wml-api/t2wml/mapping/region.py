from collections import OrderedDict
from t2wml.utils.t2wml_exceptions import InvalidYAMLFileException
from string import punctuation
from t2wml.utils.bindings import bindings
from t2wml.parsing.yaml_parsing import RegionParser

def string_is_valid(text: str) -> bool:
    def check_special_characters(text: str) -> bool:
        return all(char in punctuation for char in str(text))
    if text is None or check_special_characters(text):
        return False
    text=text.strip().lower()
    if text in ["", "#na", "nan"]:
        return False
    return True

class Region:
    def __init__(self, region_data):
        self.left=region_data["t_var_left"]
        self.right=region_data["t_var_right"]
        self.top=region_data["t_var_top"]
        self.bottom=region_data["t_var_bottom"]
        self.create_holes(region_data)

    def create_holes(self, region_data):
        self.indices=OrderedDict()
        skip_rows=set(region_data.get("skip_row", []))
        skip_cols=set(region_data.get("skip_column", []))
        skip_cells=region_data.get("skip_cell", [])
        skip_cells=[tuple(i) for i in skip_cells]
        skip_cells=set(skip_cells)
        for column in range(self.left, self.right+1):
            if column not in skip_cols:
                for row in range(self.top, self.bottom+1):
                    if row not in skip_rows:
                        try:
                            if (column, row) not in skip_cells and string_is_valid(str(bindings.excel_sheet[row-1][column-1])):
                                self.indices[(column, row)]=True
                        except Exception as e:
                            print(e)
        if len(self.indices)==0:
            raise InvalidYAMLFileException("Defined range includes no cells")
        
    def __iter__(self):
        for key in self.indices:
            yield key
            
    @staticmethod
    def create_from_yaml(yaml_data):
        region_parser=RegionParser(yaml_data)
        return Region(region_parser.parsed_region)