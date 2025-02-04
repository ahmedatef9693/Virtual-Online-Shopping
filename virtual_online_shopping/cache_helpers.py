import frappe
from virtual_online_shopping.api_connect import json
def get_from_cache():
    return json.loads(frappe.cache().get_value('carts'))

def set_cache(carts):
    frappe.cache().set_value('carts',json.dumps(carts))