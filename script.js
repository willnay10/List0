// script.js
// Full Firebase + Checklist App Logic for List0

// PASTE YOUR OWN FIREBASE CONFIG HERE (from Firebase Console → Project Settings → Web App)
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456ghi789"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const authScreen = document.getElementById('authScreen');
const appScreen = document.getElementById('appScreen');
const authStatus = document.getElementById('authStatus');
const listsContainer = document.getElementById('listsContainer');

// Auth state observer
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        authScreen.style.display = 'none';
        appScreen.style.display = 'block';
        authStatus.innerHTML = `Hi, <strong style="color:#ffd43a">${user.email.split('@')[0]}</strong>`;
        loadChecklists(user.uid);
    } else {
        // No user signed in
        authScreen.style.display = 'block';
        appScreen.style.display = 'none';
        authStatus.textContent = 'Not signed in';
    }
});

// Login
document.getElementById('loginBtn')?.addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if (!email || !password) return alert("Please fill in both fields");
    
    auth.signInWithEmailAndPassword(email, password)
        .catch(err => alert(err.message));
});

// Signup
document.getElementById('signupBtn')?.addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if (!email || !password) return alert("Please fill in both fields");
    if (password.length < 6) return alert("Password must be at least 6 characters");

    auth.createUserWithEmailAndPassword(email, password)
        .catch(err => alert(err.message));
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    auth.signOut();
});

// Load all checklists for the current user
function loadChecklists(uid) {
    db.collection('users').doc(uid).collection('lists')
        .onSnapshot(snapshot => {
            listsContainer.innerHTML = '';
            if (snapshot.empty) {
                listsContainer.innerHTML = '<p style="text-align:center; opacity:0.7; font-size:18px;">No checklists yet. Create your first one!</p>';
            }
            snapshot.forEach(doc => renderList(doc));
        }, err => console.error(err));
}

// Render a single checklist
function renderList(doc) {
    const list = doc.data();
    const listId = doc.id;

    const div = document.createElement('div');
    div.className = 'list-card';
    div.innerHTML = `
        <div class="list-header">
            <h3 contenteditable="true" spellcheck="false"
                onblur="updateListName('${listId}', this.textContent)"
                onkeydown="if(event.key==='Enter') this.blur()">${escapeHtml(list.name || 'Untitled List')}</h3>
            <button onclick="deleteList('${listId}')">Delete</button>
        </div>
        <ul class="items">
            ${list.items && list.items.length > 0
                ? list.items.map((item, index) => `
                    <li class="${item.done ? 'done' : ''}">
                        <input type="checkbox" ${item.done ? 'checked' : ''} 
                               onchange="toggleItem('${listId}', ${index})">
                        <span contenteditable="true" spellcheck="false"
                              onblur="updateItemText('${listId}', ${index}, this.textContent)"
                              onkeydown="if(event.key==='Enter') this.blur()">${escapeHtml(item.text)}</span>
                        <button onclick="deleteItem('${listId}', ${index})">×</button>
                    </li>
                `).join('')
                : '<li style="opacity:0.5; font-style:italic;">No items yet — add one below!</li>'
            }
        </ul>
        <div class="add-item">
            <input type="text" placeholder="Add a new item... (press Enter)"
                   onkeypress="if(event.key==='Enter' && this.value.trim()) { addItem('${listId}', this.value); this.value=''; }">
        </div>
    `;
    listsContainer.appendChild(div);
}

// Helper: prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add new checklist
document.getElementById('newListBtn')?.addEventListener('click', () => {
    if (!auth.currentUser) return;
    db.collection('users').doc(auth.currentUser.uid).collection('lists').add({
        name: "New Checklist",
        items: []
    });
});

// Update list name
window.updateListName = (listId, name) => {
    if (!name.trim()) name = "Untitled List";
    db.collection('users').doc(auth.currentUser.uid).collection('lists').doc(listId)
        .update({ name });
};

// Add new item
window.addItem = (listId, text) => {
    if (!text.trim()) return;
    db.collection('users').doc(auth.currentUser.uid).collection('lists').doc(listId)
        .update({
            items: firebase.firestore.FieldValue.arrayUnion({
                text: text.trim(),
                done: false
            })
        });
};

// Toggle item complete
window.toggleItem = (listId, index) => {
    const ref = db.collection('users').doc(auth.currentUser.uid).collection('lists').doc(listId);
    ref.get().then(doc => {
        const items = doc.data().items;
        items[index].done = !items[index].done;
        ref.update({ items });
    });
};

// Update item text
window.updateItemText = (listId, index, newText) => {
    if (!newText.trim()) newText = "Empty item";
    const ref = db.collection('users').doc(auth.currentUser.uid).collection('lists').doc(listId);
    ref.get().then(doc => {
        const items = doc.data().items;
        items[index].text = newText.trim();
        ref.update({ items });
    });
};

// Delete item
window.deleteItem = (listId, index) => {
    const ref = db.collection('users').doc(auth.currentUser.uid).collection('lists').doc(listId);
    ref.get().then(doc => {
        const items = doc.data().items;
        items.splice(index, 1);
        ref.update({ items });
    });
};

// Delete entire list
window.deleteList = (listId) => {
    if (confirm("Delete this entire checklist forever?")) {
        db.collection('users').doc(auth.currentUser.uid).collection('lists').doc(listId).delete();
    }
};