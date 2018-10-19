document.addEventListener('DOMContentLoaded', () => {
  formSubmit()
  //end of DOMContentLoaded scope\\
})

function formSubmit() {
  let formBtn = document.getElementById('blogForm')
  if (!formBtn) {
    throw new Error('no form present')
  }
  formBtn.addEventListener('submit', (e) => {
    e.preventDefault()
    // grab all values from the form
    let postData = {}
    let formElements = e.target.elements
    let editTitle = e.target.elements[0].value
    let editContent = e.target.elements[1].value
    let editPhoto = e.target.elements[2].value

    let newPostObj = {
      title: editTitle,
      content: editContent,
      photo: editPhoto
    }
    // axios.post that data to the correct backend route
    axios.post('https://secret-savannah-43473.herokuapp.com/posts', newPostObj)
      .then((res) => {
        if (res) {
          alert(`GOAL!`)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  })
}