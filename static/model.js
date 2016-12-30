import _ from 'underscore'
import uuidV4 from 'uuid/v4'

const itemSchema = {
	ticker: {
		type: String,
	},
	lastPrice: {
		type: Number,
	},
	dateOfIPO: {
		type: Date,
	},
	isArchive: {
		type: Boolean
	},	
	isExpire: {
		type: Boolean
	}
}

const items = []

const addItem = (itemAttrs) => {
	const _id = uuidV4()
	items.push(_.extend({ _id: _id }, itemAttrs))
}

const updateItem = (oldItem, updatedItem) => {
	var index = items.indexOf(oldItem);
	items.splice(index, 1, updatedItem);
}

const deleteItem = (item) => {
	var index = items.indexOf(item);
	item.isArchive = true  
	items.splice(index, 1, item);
	return items;  
}

const undoItem = (item) => {
	var index = items.indexOf(item);
	item.isArchive = false
	items.splice(index, 1, item);
	return items;
}

const fetchItems = (selector = {}, fetchOptions = {}) => {  
	const sortKey = _.first(_.keys(fetchOptions.sort))
	const keys = Object.keys(selector) 
	const listing = items.slice() // assign the element
	let selected = []
	
	if (keys.length != 0){

		for (var count = 0; count < keys.length; count++) {        
			_.chain(listing).filter(function(item) {				
				const condition = _.first(_.keys(selector[keys[count]]))

				if (condition == "isNotEmpty"){ 
					if ((item[keys[count]] == null)){
						selected.push(item)
					}						
				}
				if (condition == "isEmpty"){
					if ((item[keys[count]] != null)){
						selected.push(item)
					}					 
				}
				if (condition == "textContains" ){
					const val = selector[keys[count]].value	
					if (keys[count] == "lastPrice"){
						if( !(val[0] <= item[keys[count]] && val[1]>= item[keys[count]]) ){
							selected.push(item)
						}
					}			
					else if (keys[count] == "dateOfIPO"){
						val.from_date = val.from_date != "" ? new Date(Date.parse(val.from_date)) : ""
						val.to_date = val.to_date != "" ? (new Date(Date.parse(val.to_date))) : ""
						item[keys[count]] = new Date(Date.parse(item[keys[count]]))				
						if (val.from_date!="" && val.to_date!=""){
							if (!(val.from_date <= item[keys[count]] && val.to_date >= item[keys[count]])){
								selected.push(item)
							}
						}	
						else if(val.from_date!=""){
							if (!(val.from_date <= item[keys[count]])){
								selected.push(item)
							}
						}else if(val.to_date!=""){							
							if (!(val.to_date >= item[keys[count]])){
								selected.push(item)
							}
						}
					}
					else{
						if (val !="" && item[keys[count]] != undefined && item[keys[count]].toString().search(new RegExp(val, "i")) == -1){
							selected.push(item)
						}else if (val != "" && item[keys[count]] == undefined){
							selected.push(item)
						}
					}	
				}

			})
		}

		selected = _.uniq(selected);
		for ( var i = 0; i < items.length; i++ ) {
			for ( var e = 0; e < selected.length; e++ ) {
				if ( items[i] === selected[e] ) {
					var index = listing.indexOf(items[i]);
					listing.splice(index, 1)
				};
			}
		}
		
	}
	if (sortKey) {		
		const sortDir = fetchOptions.sort[sortKey]
		const sortedItems = _.sortBy(listing, sortKey)    
		return sortDir === 1 ?  sortedItems : sortedItems.reverse()
	} else {		
		return listing
	}
	//return items
}

addItem({ ticker: 'GOOG', lastPrice: 312.35, dateOfIPO: new Date(),isArchive: false, isExpire: true })
addItem({ ticker: 'AAPL', lastPrice: 4.33,dateOfIPO: new Date(),isArchive: false, isExpire: true })
addItem({ ticker: 'FB', lastPrice: 38.11,dateOfIPO: new Date(),isArchive: false, isExpire: false })

export { fetchItems as default, addItem, itemSchema, updateItem, deleteItem, undoItem}
