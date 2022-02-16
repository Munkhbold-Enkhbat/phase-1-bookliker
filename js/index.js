document.addEventListener("DOMContentLoaded", () => {
  getListOfBooks()
});

const panel = document.querySelector('div#show-panel')
let showBookDetails = false

/******************** Liker of Book *******************/
let userId = 1
let currentUser = {}

fetch(`http://localhost:3000/users/${userId}`)
.then(res => res.json())
.then(data => currentUser = data)
.then(() => console.log('currentUser @ start:', currentUser))
/*****************************************************/

function getListOfBooks() {
  fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(books => books.forEach(renderOneBook))
}

/************* HELPER FUNCTION TO CREATE ELEMENT ***********/
const makeEl = el => document.createElement(el)
const setContent = (el, content) => el.textContent = content 
/***********************************************************/

function renderOneBook(item) {
  const bookli = makeEl('li')
  setContent(bookli, item.title) 
  bookli.className = 'bookli'

  ///////////////////////////// HIDDEN BOOK DETAILS ////////////////////////

  /************** CREATING ELEMENTS FOR EVERY BOOK **************/
  const book = makeEl('div')
  const img = makeEl('img')
  const title = makeEl('h3')  
  const subTitle = makeEl('h3')
  const author = makeEl('h3')
  const p = makeEl('p')
  const ul = makeEl('ul')
  const btn = makeEl('button')

  img.src = item.img_url

/************** INSERTING TEXTCONTENTS ************/
  setContent(title, item.title)
  setContent(subTitle, item.subTitle)
  setContent(author, item.author)
  setContent(p, item.description)
  setContent(btn, 'LIKE')

 /************ Create List of Booklikers onto DOM **************/
  const likers = item.users/////////////////////////////////////////////////////////--->
  likers.forEach(liker => {
    const li = makeEl('li')
    setContent(li, liker.username)
    li.className = 'reader'
    ul.appendChild(li)
  })

/********* Get list of the Booklikers from DOM **********/
  const readers = ul.getElementsByClassName('reader') /////////////////////////////---->

/********* Handle LIKE button click ********/
  btn.addEventListener('click', () => {

    // ul.remove()
    console.log('readers on DOM:', readers)
    console.log('uls', ul);
    // debugger
    // console.log('If user is already there:', users.includes(currentUser));
    // for(let i = 0; i < readers.length; i++) {
    //   console.log('Reader:', readers[i]);
    //   if(readers[i].innerHTML === currentUser.username) {
    //     removeLikedUser(currentUser, users)
    //     handleUnLikeButton(currentUser)
    //   }
    // }
    checkAndRemoveLikedUser(likers)
    console.log('Likers after remove:', likers);
    
     
    if (btn.textContent === 'LIKE') {
      btn.textContent = 'UNLIKE'
      item.users.push(currentUser)
      renderLikedUser(currentUser, ul)
      handleLikeButton(item) 
    } else {
      btn.textContent = 'LIKE'
      item.users.pop(currentUser)
      removeLikedUser(ul)
      handleUnLikeButton(likers)
    }
  })
  book.append(img, title, subTitle, author, p, ul, btn)
////////////////////////////////////////////////////////////////////////////////////

  /********* Event listener for clicking on Book title ********/
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

/********** Updating Backend Booklikers list *********/
function handleLikeButton(book) {
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

/********** Rendering New Liker to a Booklikers' list ********/
function renderLikedUser(user, list) {
  const li = makeEl('li')
  setContent(li, user.username)
  li.id = user.id  
  list.appendChild(li)
}

function checkAndRemoveLikedUser(likers) {
  console.log('userID:', currentUser.id);
  // likers = likers.filter(liker => {
  //   console.log('Each Liker ID:', liker.id)
  //   liker.id !== currentUser.id
  // })

  likers.forEach((liker, index) => {
    if(liker.id === currentUser.id) {
      likers.splice(index, 1)
    }
  })
  // for(let i = 0; i < likers.length; i++) {
  //   console.log('Reader:', likers[i]);
  //   if(likers[i].id === userId) {
  //     // removeLikedUser(currentUser, users)
  //     likers.querySelector('li').innerText = ''
      
  //     // handleUnLikeButton(list)
  //   } 
  // }
}

/********** Removing Liker from Backend Bookliker's list ******/
function handleUnLikeButton(users) {
  fetch(`http://localhost:3000/users`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(users)
  })
  .then(res => res.json())
  .then(data => console.log('Updated Users:', data))
}
