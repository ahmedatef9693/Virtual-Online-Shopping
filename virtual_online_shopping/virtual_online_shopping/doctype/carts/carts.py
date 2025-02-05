# Copyright (c) 2025, ahmed atef and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from virtual_online_shopping.api_connect import get_data,json
from virtual_online_shopping.cache_helpers import get_from_cache, set_cache
class Carts(Document):
	@staticmethod
	def get_carts():
		carts = get_from_cache()
		if carts:
			return carts
		else:
			all_data = get_data()
			carts = []
			for cart in all_data:
				print(f'\n\n{cart}\n\n')
				carts.append(
					{
					'name':cart.get('id'),
					'cart_id':cart.get('id'),
					'products':cart.get('products'),
					'total':cart.get('total'),
					'discounted_total':cart.get('discountedTotal'),
					'user_id':cart.get('userId'),
					'total_products': cart.get('totalProducts'),
					'total_quantity': cart.get('totalQuantity'),
					})
			set_cache(carts)
			return carts
	@staticmethod
	def get_document(name,carts):
		for cart in carts:
			if cart.get("name") == int(name):
				cart['name'] = int(name)
				return cart
	def db_insert(self, *args, **kwargs):
		pass

	def load_from_db(self):
		
		carts = Carts.get_carts()
		document =  Carts.get_document(self.name,carts)
		super(Document,self).__init__(document)
	def db_update(self):
		pass

	@staticmethod
	def get_list(args):
		carts = Carts.get_carts()
		return carts

	@staticmethod
	def get_count(args):
		pass

	@staticmethod
	def get_stats(args):
		pass

