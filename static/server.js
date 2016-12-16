import express from "express"
import React from "react"
import {renderToString} from "react-dom/server"
import fetchItems, { addItem, itemSchema, updateItem, deleteItem, undoItem} from "./model"
import CollectionAdmin from "../src/collection-admin"

const app = express()
const renderedComponent = renderToString(
  <CollectionAdmin
    itemType="stock"
    itemSchema={itemSchema}
    fetchItems={fetchItems}
    addItem={addItem}
    updateItem={updateItem}
    deleteItem = {deleteItem}
    undoItem = {undoItem}
  />
)

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
    <html>
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-hQpvDQiCJaD2H465dQfA717v7lu5qHWtDbWNPvaTJ0ID5xnPUlVXnKzq7b8YUkbN" crossorigin="anonymous">
        <title>Collection Admin</title>
      </head>
      <body>
        <div id="app">${renderedComponent}</div>
        <script type="text/javascript" src="/static/bundle.js"></script>
      </body>
    </html>`)
})

app.get("/static/bundle.js", function(req, res) {
  res.sendFile("bundle.js", {root: __dirname})
})

app.listen(4000, () => {
  console.log('Open http://localhost:4000 in your browser...')
})
