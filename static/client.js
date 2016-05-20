import React from "react"
import { render } from "react-dom"
import fetchItems, { itemSchema } from "./model"
import CollectionAdmin from "../src/collection-admin"

render(
  <CollectionAdmin
    itemType="stock"
    itemSchema={itemSchema}
    fetchItems={fetchItems}
    onSave={() => {}}
  />,
  document.getElementById("app")
)
