import frappe
import json


@frappe.whitelist()
def create_purchase_order(products):
    pass








@frappe.whitelist()
def validate_products(product_names):
    product_names = json.loads(product_names)
    filtered_product_names = []
    for name in product_names:
        if not frappe.db.exists('Item',{'name':name}):
            filtered_product_names.append(name)
    if len(filtered_product_names) > 0:
        frappe.enqueue(
        create_items, 
        queue="short", 
        is_async=True,
        filtered_product_names =filtered_product_names 
        )



def create_items(filtered_product_names):
    for name in filtered_product_names:
        doc = frappe.new_doc('Item')
        doc.name = name
        doc.item_code = name
        doc.item_group = 'Products'
        doc.stock_uom = 'Nos'
        doc.insert()