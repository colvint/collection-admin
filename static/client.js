import React from "react"
import { render } from "react-dom"
import fetchItems, { itemSchema, addItem } from "./model"
import CollectionAdmin from "../src/collection-admin"

render(
  <CollectionAdmin
    itemType="stock"
    itemSchema={itemSchema}
    fetchItems={fetchItems}
    addItem={addItem}
    updateItem={() => {}}
  />,
  document.getElementById("app")
)
