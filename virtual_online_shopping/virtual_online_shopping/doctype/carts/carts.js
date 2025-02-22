// Copyright (c) 2025, ahmed atef and contributors
// For license information, please see license.txt

frappe.ui.form.on("Carts", {
    refresh(frm) {
        frm.add_custom_button(__('Buy Product'), function() {
            let d = show_products_discount_list()
            let table_field = d.fields_dict.products.grid;
            table_field.df.data = frm.doc.products.
            map(row => ({
                product_name: row.title,
                quantity: row.quantity,
                price: row.price,
                discount_percent_per_item: row.quantity !== 1 ? row.discount_percentage / row.quantity : 0,
                discount_amount: Math.round((row.price * row.quantity) - ((row.price * row.quantity * row.discount_percentage) / 100), 1)
            }));
            table_field.refresh();
            d.show();
            validate_items_existence(frm.doc.products);
        }, 'Actions')

    },
});


function show_products_discount_list() {
    let d = new frappe.ui.Dialog({
        title: __("Select Items to Buy"),
        fields: [{
            label: __("Products"),
            fieldname: "products",
            fieldtype: "Table",
            fields: [{
                    label: __("Product Name"),
                    fieldname: "product_name",
                    fieldtype: "Data",
                    in_list_view: 1,
                    read_only: 1
                },
                {
                    label: __("Quantity"),
                    fieldname: "quantity",
                    fieldtype: "Float",
                    in_list_view: 1,
                    onchange: function(e) {
                        let idx = e.currentTarget.parentElement.fieldobj.doc.idx - 1;
                        let cur_row = d.fields_dict.products.df.data[idx];
                        let percent = (cur_row.price * cur_row.quantity * cur_row.discount_percent_per_item) / 100;
                        let discount_amount = (cur_row.price * cur_row.quantity) - percent;
                        cur_row.discount_amount = discount_amount;
                        d.refresh()
                    }
                },
                {
                    label: __("Price"),
                    fieldname: "price",
                    fieldtype: "currency",
                    in_list_view: 1,
                    read_only: 1
                },
                {
                    label: __("Discount Amount"),
                    fieldname: "discount_amount",
                    fieldtype: "currency",
                    in_list_view: 1,
                    read_only: 1
                },
                {
                    label: __("Discount Percent Per Item"),
                    fieldname: "discount_percent_per_item",
                    fieldtype: "percent",
                    in_list_view: 1,
                    read_only: 1
                }
            ]
        }],
        primary_action_label: __("Buy"),
        primary_action() {
            let products = d.fields_dict.products.grid.df.data;
            frappe.xcall("virtual_online_shopping.api.create_purchase_order", {
                products: products
            }).then((r) => {
                frappe.show_alert(__('Purchase Order Created'));
                d.hide();
            })
        }
    });
    return d;
}

function validate_items_existence(products) {
    let product_names = products.map((row) => { return row.title })
    frappe.xcall("virtual_online_shopping.api.validate_products", {
        product_names: product_names
    }).then((r) => {})
}