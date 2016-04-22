import React from "react"
import {render} from "react-dom"
import CollectionAdmin from "../src/collection-admin"
import fetchItems from "./model.js"

render(<CollectionAdmin fetchItems={fetchItems} />, document.getElementById("app"))
