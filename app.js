//Storage Controller
const StorageCtrl = (function() {

    return {
        storeItem: function(item) {
            let items;

            //Checking if any item in localStorage
            if(localStorage.getItem('items') === null) {
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
            
        },

        getItemsfromStorage: function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },

        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            //Removing the element and replacing it with updated element
            items.forEach(function(item,index){
                if(updatedItem.id === item.id) {
                    items.splice(index,1,updatedItem);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));

            //Removing the element with given id 
            items.forEach(function(item,index){
                if(id === item.id) {
                    items.splice(index,1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        }    
    }
})();


//Item Controller
const ItemCtrl = (function() {
    //Item Constructor
    class Item {
        constructor(id, name, calories) {
            this.id = id;
            this.name = name;
            this.calories = calories;
        }
    }

    //Data Structure / State
    const data = {
        // items: [
        //     {id: 0, name: 'Steak Dinner', calories: 1000},
        //     {id: 1, name: 'Egg Rice', calories: 800}
        // ],

        items: StorageCtrl.getItemsfromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function() {
            return data.items;
        },

        addItem: function(name,calories) {
            let ID;
            //Creating IDs
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Calories to number
            calories = parseInt(calories);

            //Create new item
            const newItem = new Item(ID,name,calories);

            data.items.push(newItem);

            return newItem;

        },

        getTotalCalories: function() {
            let total = 0;
            data.items.forEach(function(item) {
                total += item.calories;
            });

            data.totalCalories = total;

            return data.totalCalories;
        },

        getItemById: function(id) {
            let found = null;
            data.items.forEach(function(item) {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },

        updateItem: function(name,calories) {
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;  
                } 
            });
            return found;
        },

        deleteItem: function(id) {
            const ids = data.items.map(function(item){
                return item.id;
            });

            const index = ids.indexOf(id);

            //Removing from array
            data.items.splice(index,1);
        },

        clearAllItems: function() {
            data.items = [];
        },

        setCurrentItem: function(item) {
            data.currentItem = item;
        },

        getCurrentItem: function() {
            return data.currentItem;
        },

        logData: function(){
            return data;
        }
    }

})();


//UI Controller
const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    } 

    return {
        populateItemList: function(items){
            let html ='';

            items.forEach(function(item) {
                html += `<li id="item-${item.id}" class="list-group-item p-3">
                <strong>${item.name} : </strong> <span class="fst-italic">${item.calories} Calories</span>
                <a href="#" class="float-end"><i class="edit-item bi bi-pencil-fill"></i></a>
            </li>`;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        addListItem: function(item) {
            const li = document.createElement('li');
            li.className = 'list-group-item p-3';
            li.id = `item-${item.id}`;

            li.innerHTML = `<strong>${item.name} : </strong> <span class="fst-italic">${item.calories} Calories</span>
            <a href="#" class="float-end"><i class="edit-item bi bi-pencil-fill"></i></a>`;

            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
        },

        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                let itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name} : </strong> <span class="fst-italic">${item.calories} Calories</span>
                    <a href="#" class="float-end"><i class="edit-item bi bi-pencil-fill"></i></a>`;
                }
            })
        },

        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            })
        },

        getSelectors: function() {
            return UISelectors;
        },

        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        showTotalCalories: function(total) {
            document.querySelector(UISelectors.totalCalories).textContent = total;
        },

        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

            UICtrl.showEditState();
        },

        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';

        },

        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        }
    }
})();


//App Controller
const App = (function(ItemCtrl,UICtrl,StorageCtrl) {
    const loadEventListeners = function() {
        const UISelectors = UICtrl.getSelectors();

        //Adding Item event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

        //Disable Submit on Enter  //Optional
        document.addEventListener('keypress',function(e){
            if(e.key === 'Enter' || e.code === 'Enter'){
                e.preventDefault();
                return false;
            }
        });

        //Edit Icon Link event
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

        //Update Event
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

        //Delete Event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

        //Back Event
        document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);

        //Back Event
        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);
    };

    //Add item Submit
    const itemAddSubmit = function(e){
        //Get form input from UICtrl
        const input = UICtrl.getItemInput();
        if(input.name!=='' && input.calories!==''){
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //Adding item to ui list
            UICtrl.addListItem(newItem);

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            //Store in local Storage
            StorageCtrl.storeItem(newItem);

            //Clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    const itemEditClick = function(e) {
        if(e.target.classList.contains('edit-item')) {
            const listId = e.target.parentNode.parentNode.id;
            console.log(e.target.parentNode.parentNode);
            
            //Break into array to get the id, splitter is '-'
            const listIdArr = listId.split('-');

            //Get the actual id
            const id = parseInt(listIdArr[1]);

            const itemToEdit = ItemCtrl.getItemById(id);

            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to input value
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    };

    const itemUpdateSubmit = function(e) {
        //Get itemInput
        const input = UICtrl.getItemInput();

        //Update item
        const updatedItem = ItemCtrl.updateItem(input.name,input.calories);

        //Updating UI
        UICtrl.updateListItem(updatedItem);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        //Update Local Storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    };

    const itemDeleteSubmit = function(e) {
        //Getting current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from Data Structure
        ItemCtrl.deleteItem(currentItem.id);

        UICtrl.deleteListItem(currentItem.id);

        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    const clearAllItemsClick = function(e) {
        if(confirm('ARE YOU SURE TO REMOVE ALL ITEMS FROM YOUR LIST???')){
            ItemCtrl.clearAllItems();
            
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            
            UICtrl.removeItems();
    
            StorageCtrl.clearItemsFromStorage();
        }
        e.preventDefault();
    }

    return {
        init: function(){
            //Clear Edit State/ Set initial State
            UICtrl.clearEditState();   

            //Fetch items from data structure
            const items = ItemCtrl.getItems();

            //Populate list or display list with items
            UICtrl.populateItemList(items);

            //Show Total Calories
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            //Load All Event Listeners
            loadEventListeners();
        }
    }
})(ItemCtrl,UICtrl,StorageCtrl);

//Initializing App
App.init();