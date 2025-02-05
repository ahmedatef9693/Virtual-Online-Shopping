import frappe
import requests
import json
@frappe.whitelist()
def get_data():
    response = requests.get('https://dummyjson.com/carts')
    try:
        validate_response(response)
        return get_carts(response)
        
    except frappe.DoesNotExistError as de:
        frappe.throw(f'Error Occured For The Request {str(de)}')



def validate_response(response):
    if response.status_code >= 400 and response.status_code <= 499:
        raise frappe.DoesNotExistError('Invalid Response')
    elif response.status_code >= 500 and response.status_code <= 599:
        raise frappe.DoesNotExistError('Internel Server Error')
    

def show_data(carts):
    for cart in carts:
        print(f'cart id : { cart["id"]}')
        print(f'cart : {cart["products"]}')

def get_carts(response):
    data = json.loads(response.text).get('carts')
    for cart in data:
        for product in cart.get('products'):
            product['discount_percentage'] =product['discountPercentage']
            product['discount_total'] = product['discountedTotal']
            product['thumbnail_link'] = product['thumbnail']
            del product['discountPercentage']
            del product['discountedTotal']
    return data