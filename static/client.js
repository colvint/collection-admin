import React from "react"
import { render } from "react-dom"
import fetchItems, { itemSchema, addItem, updateItem} from "./model"
import CollectionAdmin from "../src/collection-admin"

render(
  <CollectionAdmin
    itemType="stock"
    itemSchema={itemSchema}
    fetchItems={fetchItems}
    addItem={addItem}
    updateItem={updateItem}
  />,
  document.getElementById("app")
)
