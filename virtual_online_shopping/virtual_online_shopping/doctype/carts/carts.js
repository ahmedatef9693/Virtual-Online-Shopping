// Copyright (c) 2025, ahmed atef and contributors
// For license information, please see license.txt

frappe.ui.form.on("Carts", {
    refresh(frm) {
        frm.add_custom_button(__('Buy Product'), function() {
            let d = new frappe.ui.Dialog({
                title: __("Select Items to Buy"),
                fields: [{
                    label: __("Products"),
                    fieldname: "products",
                    fieldtype: "Table",
                    fields: [{
                            label: __("Product Id"),
                            fieldname: "product_id",
                            fieldtype: "Data",
                            in_list_view: 1,
                            read_only: 1
                        },
                        {
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
                                console.log(cur_row)
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
                        }
                    ]
                }],
                primary_action_label: __("Buy"),
                primary_action() {}
            });

            let table_field = d.fields_dict.products.grid;
            table_field.df.data = frm.doc.products.
            map(row => ({
                product_id: row.id,
                product_name: row.title,
                quantity: row.quantity,
                price: row.price,
                discount_amount: Math.round((row.price * row.quantity) - ((row.price * row.quantity * row.discount_percentage) / 100), 1)
            }));
            table_field.refresh();
            d.show();
        }, 'Actions')

    },
});