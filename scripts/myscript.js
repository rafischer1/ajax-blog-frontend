let parent = document.getElementById('blog')
document.addEventListener('DOMContentLoaded', () => {
  console.log('script: ⚽')
  M.AutoInit();
  getPosts()
  getUsers()
  //end of DOMContentLoaded scope\\
})

function getUsers() {
  axios.get('https://secret-savannah-43473.herokuapp.com/users')
    .then((res) => {
      console.log('users data:', res.data)
      res.data.forEach((users) => {
        let userDiv = document.getElementById('userDiv')
        let userH5 = document.createElement('h5')
        userH5.className = "usersText"
        userDiv.appendChild(userH5)
        userH5.innerText = `
        User: ${users.id}
        \n${users.first_name} ${users.last_name}\n ${users.location}  `
      })
    })
}

function getPosts() {
  axios.get('https://secret-savannah-43473.herokuapp.com/posts')
    .then((res) => {
      // handle success
      res.data.forEach((posts) => {
        ////////////set data into cards\\\\\\\\\\\\
        ///////////////generate cards\\\\\\\\\\\\\\
        let divRow = document.createElement('div')
        let divCol = document.createElement('div')
        divCol.className = "col s12 m7"
        let divCard = document.createElement('div')
        divCard.className = "card"
        let spanCardTitle = document.createElement('span')
        spanCardTitle.className = 'card-title'
        let divCardImage = document.createElement('div')
        divCardImage.className = 'card-image'
        let imgSrc = document.createElement('img')
        let divCardContent = document.createElement('div')
        divCardContent.className = 'card-content'
        let del_button = document.createElement('button')
        let editBtn = document.createElement('a')

        spanCardTitle.innerText = posts.title
        divCardContent.innerText = posts.content
        imgSrc.src = posts.photo
        parent.appendChild(divRow)
        divRow.appendChild(divCol)
        divCol.appendChild(divCard)
        divCard.appendChild(spanCardTitle)
        divCard.appendChild(divCardImage)
        divCardContent.appendChild(imgSrc)
        divCard.appendChild(divCardContent)
        divCardContent.appendChild(del_button)
        del_button.innerText = "X"
        del_button.setAttribute('data-id', posts.id)
        del_button.className = "delBtn"
        divCardContent.appendChild(editBtn)
        editBtn.setAttribute('postID', posts.id)
        editBtn.setAttribute('data-target', 'modal1')
        editBtn.setAttribute('name', 'Edit')
        editBtn.className = "editBtn modal-trigger"
        editBtn.innerText = "Edit"

        /////edit this record!!\\\\\
        editBtn.addEventListener('click', (ev) => {
          if (ev) {
            modalFunction(ev)
          } else {
            alert(`That didn't work for some reason`)
          }
        })
        //////////// DELETE THIS RECORD! \\\\\\\\\\\\\\\\
        del_button.addEventListener('click', (ev) => {
          ev.preventDefault()
          if (confirm('Are you sure you want to delete this post?')) {
            axios.delete(`https://secret-savannah-43473.herokuapp.com/posts/${posts.id}`)
              .then((res) => {
                console.log(`deleted`)
                ev.target.parentElement.parentElement.remove()

                alert(`Deleted!`)
              })
              .catch((err) => {
                console.log(err)
              })
          } else {
            alert('Delete avoided!')
          }
        })
      })
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .then(function() {
      // always executed
    })
}

function modalFunction(ev) {
  let id = ev.target.getAttribute('postID')
  let openModal = document.querySelectorAll('.modal')
  let instance = M.Modal.init(openModal)

  //axios get call by id to populate modal\\
  axios.get(`https://secret-savannah-43473.herokuapp.com/posts/${id}`)
    .then((post) => {
      let formTitle = document.getElementById('formTitle')
      let modalTitle = document.getElementById('modalTitle')
      let modalContent = document.getElementById('modalContent')
      let modalPhoto = document.getElementById('modalPhoto')
      formTitle.innerText = post.data[0].title
      modalTitle.value = post.data[0].title
      modalContent.value = post.data[0].content
      modalPhoto.value = post.data[0].photo
      let modalpostID = post.data[0].id

      let modalFormSubmit = document.getElementById('modalFormSubmit')

      console.log('before submit')
      //modalForm submit event listener
      modalFormSubmit.addEventListener('submit', (ev) => {
        ev.preventDefault()
        console.log('after submit')
        /////grab all values from the form\\\

        let putData = {}
        let formElements = ev.target.elements
        console.log('put data elements;', ev.target.elements)
        if (formElements[0].value) {
          putData.title = formElements[0].value
        }
        if (formElements[1].value) {
          putData.content = formElements[1].value
        }
        if (formElements[2].value) {
          putData.photo =
            formElements[2].value
        }
        putData.id = modalpostID

        ////axios put call to update entry\\\\
        axios.put(`https://secret-savannah-43473.herokuapp.com/posts/${modalpostID}`, putData)
          .then((response) => {
            if (response) {
              alert(`Update complete!`)
              ////window reload - not a great solution but works!\\\\
              location.reload()
            } else {
              alert(`That didn't work for some reason...`)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      })
    })
}