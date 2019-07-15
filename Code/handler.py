import pyexcel
import json
from pathlib import Path
from Code.ItemTable import ItemTable
from Code.bindings import bindings
from Code.YamlParser import YAMLParser
from Code.Region import Region
from Code.utility_functions import get_actual_cell_index, check_if_empty
from Code.t2wml_parser import get_cell
from Code.triple_generator import generate_triples
from Code.ItemExpression import ItemExpression
from Code.ValueExpression import ValueExpression
from Code.BooleanEquation import BooleanEquation
from Code.ColumnExpression import ColumnExpression
from Code.RowExpression import RowExpression
__WIKIFIED_RESULT__ = str(Path.cwd() / "Datasets/data.worldbank.org/wikifier.csv")


def add_excel_file_to_bindings(excel_filepath: str, sheet_name: str) -> None:
	"""
	This function reads the excel file and add the pyexcel object to the bindings
	:return: None
	"""
	try:
		records = pyexcel.get_book(file_name=excel_filepath)
		if not sheet_name:
			bindings["excel_sheet"] = records[0]
		else:
			bindings["excel_sheet"] = records[sheet_name]

	except IOError:
		raise IOError('Excel File cannot be found or opened')


def remove_empty_and_invalid_cells(region: Region) -> None:
	"""
	This functions searches for empty or invalid strings in the region and remove those cells from the region
	:param region:
	:return:
	"""
	for col in range(bindings["$left"] + 1, bindings["$right"]):
		for row in range(bindings["$top"] + 1, bindings["$bottom"]):
			if check_if_empty(str(bindings['excel_sheet'][row, col])):
				region.add_hole(row, col, col)


def update_bindings(item_table: dict, region: dict = None, excel_filepath: str = None, sheet_name: str =None):
	if region:
		bindings["$left"] = region['left']
		bindings["$right"] = region['right']
		bindings["$top"] = region['top']
		bindings["$bottom"] = region['bottom']
	if excel_filepath:
		add_excel_file_to_bindings(excel_filepath, sheet_name)
	bindings["item_table"] = item_table


def highlight_region(item_table, excel_data_filepath, sheet_name, region_specification, template) -> str:
	update_bindings(item_table, region_specification, excel_data_filepath, sheet_name)
	region = region_specification['region_object']
	remove_empty_and_invalid_cells(region)
	head = region.get_head()
	data = {"data_region": set(), "item": set(), "qualifier_region": set(), 'error': dict()}
	bindings["$col"] = head[0]
	bindings["$row"] = head[1]
	try:
		item = template['item']
	except KeyError:
		item = None

	try:
		qualifiers = template['qualifier']
	except KeyError:
		qualifiers = None

	while region.sheet.get((bindings["$col"], bindings["$row"]), None) is not None:
		try:
			row_be_skipped = False
			column_be_skipped = False
			if region_specification['skip_row']:
				row_be_skipped = region_specification['skip_row'].evaluate(bindings)
				region.add_hole(bindings["$row"], bindings["$col"], bindings["$col"])

			if region_specification['skip_column']:
				column_be_skipped = region_specification['skip_column'].evaluate(bindings)
				region.add_hole(bindings["$row"], bindings["$col"], bindings["$col"])

			if not row_be_skipped and not column_be_skipped:
				data_cell = get_actual_cell_index((bindings["$col"], bindings["$row"]))
				data["data_region"].add(data_cell)

				if item and isinstance(item, (ItemExpression, ValueExpression, BooleanEquation, ColumnExpression, RowExpression)):
					try:
						item_cell = get_cell(item)
						item_cell = get_actual_cell_index(item_cell)
						data["item"].add(item_cell)
					except AttributeError:
						pass

				if qualifiers:
					qualifier_cells = set()
					for qualifier in qualifiers:
						if isinstance(qualifier["value"], (ItemExpression, ValueExpression, BooleanEquation, ColumnExpression, RowExpression)):
							try:
								qualifier_cell = get_cell(qualifier["value"])
								qualifier_cell = get_actual_cell_index(qualifier_cell)
								qualifier_cells.add(qualifier_cell)
							except AttributeError:
								pass
					data["qualifier_region"] |= qualifier_cells
		except Exception as e:
			data['error'][get_actual_cell_index((bindings["$col"], bindings["$row"]))] = str(e)

		if region.sheet[(bindings["$col"], bindings["$row"])].next is not None:
			bindings["$col"], bindings["$row"] = region.sheet[(bindings["$col"], bindings["$row"])].next
		else:
			bindings["$col"], bindings["$row"] = None, None

	data['data_region'] = list(data['data_region'])
	data['item'] = list(data['item'])
	data['qualifier_region'] = list(data['qualifier_region'])
	return data


def resolve_cell(item_table: ItemTable, excel_data_filepath: str, sheet_name: str, region_specification: dict, template: dict, column: str, row: str) -> str:
	update_bindings(item_table, region_specification, excel_data_filepath, sheet_name)
	region = region_specification['region_object']
	bindings["$col"] = column
	bindings["$row"] = row
	data = {}
	if region.sheet.get((bindings["$col"], bindings["$row"]), None) is not None:
		try:
			statement = evaluate_template(template)
			data = {'statement': statement}
		except Exception as e:
			data = {'error': str(e)}
	json_data = json.dumps(data)
	return json_data


def generate_download_file(user_id, item_table: ItemTable, excel_data_filepath: str, sheet_name: str, region_specification: dict, template: dict, filetype: str):
	update_bindings(item_table, region_specification, excel_data_filepath, sheet_name)
	region = region_specification['region_object']
	response = []
	error = []
	head = region.get_head()
	bindings["$col"] = head[0]
	bindings["$row"] = head[1]
	while region.sheet.get((bindings["$col"], bindings["$row"]), None) is not None:
		try:
			statement = evaluate_template(template)
			response.append({'cell': get_actual_cell_index((bindings["$col"], bindings["$row"])), 'statement': statement})
		except Exception as e:
			error.append({'cell': get_actual_cell_index((bindings["$col"], bindings["$row"])), 'error': str(e)})
		if region.sheet[(bindings["$col"], bindings["$row"])].next is not None:
			bindings["$col"], bindings["$row"] = region.sheet[(bindings["$col"], bindings["$row"])].next
		else:
			bindings["$col"], bindings["$row"] = None, None
	if filetype == 'json':
		json_response = json.dumps(response)
		return json_response
	elif filetype == 'ttl':
		try:
			json_response = generate_triples(user_id, response, filetype)
			return json_response
		except Exception as e:
			return str(e)


def load_yaml_data(yaml_filepath):
	yaml_parser = YAMLParser(yaml_filepath)
	region = yaml_parser.get_region()
	region['region_object'] = Region(region["left"], region["right"], region["top"], region["bottom"])
	template = yaml_parser.get_template()
	return region, template


def build_item_table(wikifier_output_filepath, excel_data_filepath, sheet_name):
	item_table = ItemTable()
	item_table.generate_hash_tables(wikifier_output_filepath)
	if excel_data_filepath:
		item_table.populate_cell_to_qnode_using_cell_values(excel_data_filepath, sheet_name)
	return item_table


def evaluate_template(template):
	response = dict()
	for key, value in template.items():
		if key == 'qualifier':
			for i in range(len(template[key])):
				response[key] = []
				temp_dict = dict()
				for k, v in template[key][i].items():
					if isinstance(v, (ItemExpression, ValueExpression, BooleanEquation)):
						col, row, temp_dict[k] = v.evaluate_and_get_cell(bindings)
						temp_dict['cell'] = get_actual_cell_index((col, row))
					else:
						temp_dict[k] = v
				response[key].append(temp_dict)
		else:
			if isinstance(value, (ItemExpression, ValueExpression, BooleanEquation)):
				col, row, response[key] = value.evaluate_and_get_cell(bindings)
				if key == "item":
					response['cell'] = get_actual_cell_index((col, row))
			else:
				response[key] = value
	return response
