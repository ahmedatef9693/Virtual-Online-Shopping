import frappe
from virtual_online_shopping.api_connect import json
def get_from_cache():
    carts = frappe.cache().get_value('carts')
    if carts:
        return json.loads(carts)
    return None

def set_cache(carts):
    frappe.cache().set_value('carts',json.dumps(carts))