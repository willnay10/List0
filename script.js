// DOM elements
const listsContainer = document.getElementById('listsContainer');
const newListBtn = document.getElementById('newListBtn');

// Load checklists from LocalStorage
function loadChecklists() {
    const lists = JSON.parse(localStorage.getItem('lists') || '[]');
    listsContainer.innerHTML = '';
    if (!lists.length) {
        listsContainer.innerHTML = '<p style="text-align:center; opacity:0.7; font-size:18px;">No checklists yet. Create your first one!</p>';
    }
    lists.forEach((list, i) => renderList(list, i));
}

// Render a single checklist
function renderList(list, index) {
    const div = document.createElement('div');
    div.className = 'list-card';
    div.innerHTML = `
        <div class="list-header">
            <h3 contenteditable="true" onblur="updateListName(${index}, this.textContent)" onkeydown="if(event.key==='Enter') this.blur()">${list.name}</h3>
            <button onclick="deleteList(${index})">Delete</button>
        </div>
        <ul class="items">
            ${(list.items && list.items.length)
                ? list.items.map((item, i) => `
                    <li class="${item.done ? 'done' : ''}">
                        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleItem(${index}, ${i})">
                        <span contenteditable="true" onblur="updateItem(${index}, ${i}, this.textContent)" onkeydown="if(event.key==='Enter') this.blur()">${item.text}</span>
                        <button onclick="deleteItem(${index}, ${i})">×</button>
                    </li>
                `).join('')
                : '<li style="opacity:0.5; font-style:italic;">No items yet — add one below!</li>'
            }
        </ul>
        <div class="add-item">
            <input type="text" placeholder="Add a new item..." onkeypress="if(event.key==='Enter' && this.value.trim()) { addItem(${index}, this.value); this.value=''; }">
        </div>
    `;
    listsContainer.appendChild(div);
}

// Save lists to LocalStorage
function saveLists(lists) {
    localStorage.setItem('lists', JSON.stringify(lists));
}

// Add new checklist
newListBtn.onclick = () => {
    const lists = JSON.parse(localStorage.getItem('lists') || '[]');
    lists.push({ name: "New Checklist", items: [] });
    saveLists(lists);
    loadChecklists();
};

// Update checklist name
window.updateListName = (listIndex, name) => {
    const lists = JSON.parse(localStorage.getItem('lists') || '[]');
    lists[listIndex].name = name.trim() || "Untitled List";
    saveLists(lists);
};

// Add new item
window.addItem = (listIndex, text) => {
    const lists = JSON.parse(localStorage.getItem('lists') || '[]');
    lists[listIndex].items.push({ text: text.trim(), done: false });
    saveLists(lists);
    loadChecklists();
};

// Toggle item done
window.toggleItem = (listIndex, itemIndex) => {
    const lists = JSON.parse(localStorage.getItem('lists') || '[]');
    lists[listIndex].items[itemIndex].done = !lists[listIndex].items[itemIndex].done;
    saveLists(lists);
    loadChecklists();
};

// Update item text
window.updateItem = (listIndex, itemIndex, text) => {
    const lists = JSON.parse(localStorage.getItem('lists') || '[]');
    lists[listIndex].items[itemIndex].text = text.trim() || "Empty item";
    saveLists(lists);
};

// Delete item
window.deleteItem = (listIndex, itemIndex) => {
    const lists = JSON.parse(localStorage.getItem('lists') || '[]');
    lists[listIndex].items.splice(itemIndex, 1);
    saveLists(lists);
    loadChecklists();
};

// Delete checklist
window.deleteList = (listIndex) => {
    const lists = JSON.parse(localStorage.getItem('lists') || '[]');
    if (confirm("Delete this checklist forever?")) {
        lists.splice(listIndex, 1);
        saveLists(lists);
        loadChecklists();
    }
};

// Initial load
loadChecklists();
