document.addEventListener("DOMContentLoaded", () => {
  getListOfBooks()
});

const panel = document.querySelector('div#show-panel')
let showBookDetails = false

/******** User, who to like book *******/
let userId = 5
let newUser = {}

fetch(`http://localhost:3000/users/${userId}`)
.then(res => res.json())
.then(data => newUser = data)
.then(() => console.log('newUser:', newUser))

function getListOfBooks() {
  fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(books => books.forEach(book => renderOneBook(book)))
}

function renderOneBook(item) {
  const bookli = document.createElement('li')
  bookli.className = 'bookli'
  bookli.textContent = item.title

  /*********** HIDDEN BOOK DETAILS ***********/
  const book = document.createElement('div')
  book.className = 'card'
  const img = document.createElement('img')
  img.src = item.img_url
  const title = document.createElement('h3')
  title.textContent = item.title
  const subTitle = document.createElement('h3')
  subTitle.textContent = item.subtitle
  const author = document.createElement('h3')
  author.textContent = item.author
  const p = document.createElement('p')
  p.textContent = item.description

  const ul = document.createElement('ul')
  const users = item.users
  users.forEach(user => {
    const li = document.createElement('li')
    li.textContent = user.username
    ul.appendChild(li)
  })

  const btn = document.createElement('button')
  btn.textContent = 'LIKE'
  btn.addEventListener('click', () => {
    // console.log('newUser1:', newUser);
    console.log('users:', item.users);
    item.users.push(newUser)
    renderLikedBook(newUser, ul)
    handleLikeButton(item) 

    if (btn.textContent === 'LIKE') {
      btn.textContent = 'UNLIKE'
    } else {
      btn.textContent = 'LIKE'
    }
  })
  book.append(img, title, subTitle, author, p, ul, btn)

  bookli.addEventListener('click', () => {
    showBookDetails = !showBookDetails
    if (showBookDetails) {
      book.style.display = 'block'
      panel.innerText = ''
      panel.append(book)
    } else {
      book.style.display = 'none'
    }
  })

  document.querySelector('ul#list').appendChild(bookli)
}

function handleLikeButton(book) {
  // fetch(`http://localhost:3000/users/${userId}`)
  // .then(res => res.json())
  // .then(data => user = data)
  fetch(`http://localhost:3000/books/${book.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(book)
  })
  .then(res => res.json())
  .then(data => console.log('Data from BackEnd:', data))    
}

function renderLikedBook(user, list) {
  const li = document.createElement('li')
  li.textContent = user.username
  list.appendChild(li)
}