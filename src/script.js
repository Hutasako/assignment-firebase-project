// TO DO:
  //  integrate auth
  //  use current user as author
  //  


document.addEventListener("DOMContentLoaded", function(){
  const db = firebase.firestore();

  sampleTitle = 'Cool blog title'
  sampleDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at orci velit. Donec ut diam ipsum. Etiam ac sapien a nisl ultrices laoreet. Phasellus pharetra convallis lorem tempor ullamcorper. Nam tempus mattis magna id blandit. Proin convallis quam id tortor pretium interdum. Aenean nisl ligula, hendrerit vitae blandit id, pretium vitae orci. Nunc eget egestas orci. Pellentesque a neque dignissim, facilisis orci vitae, sollicitudin est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum purus eros, vestibulum sed semper non, imperdiet et nisi. Cras quis ligula et est sagittis tempor. '
  sampleAuthor = 'Bob Loblaw'

  sampleBlogID = 'F5KhGjAZDQXtXTRaKXl8';
  sampleComment = 'This is another nice comment.'

  const timelineSelector = document.querySelector(".timeline");

  function addBlog(title, desc){
    db.collection("blogs").add({
      title: title,
      desc: desc,
      author: sampleAuthor,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).then( (docRef) => {
      console.log(`Blog created: ${docRef.id}`)
    }).catch( (error) => {
      console.log(`Error adding blog: ${error}`)
    });
  }

  function getAllBlogs(){
    db.collection("blogs").get().then((querySnapshot) =>{
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);       
        displayBlog(doc.id, JSON.stringify(doc.data()))
     
      })
    })

  }
  
  function getBlog(blogID){
    db.collection("blogs").doc(blogID)
    .get()
    .then((doc) => {
      if (doc.exists) {
          console.log(`Document data: ${JSON.stringify(doc.data())}`);
      } else {
          console.log("No such document!");
      }
    })
  }

  function displayBlog(id, blog){
    const blogParsed = JSON.parse(blog)
    console.log(`Printing blogs`)
    console.log(blogParsed)
    let commentsString = '';

    db.collection("blogs").doc(id).collection("comments")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(doc => {
          let parsedComment = JSON.parse(JSON.stringify(doc.data()));
          let commentDate = new Date(parsedComment.timestamp.seconds);
          commentsString += 
          `
          <div class="comment">
          <div class="post-header">
            <a style="align-self:center"><img src="https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png" height="20px"></a><p>${parsedComment.author} <span>${commentDate}</span></p></div>
            <div class="comment-text">
            <p>${parsedComment.text}</p>
          </div>
          `

      })
    }).then(() => {
      let blogDate = new Date(blogParsed.timestamp.seconds);
      const blogContent = 
        `<div class="post" data-blog-id="${id}">
        <div class="post-header">
          <a style="align-self:center"><img src="https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png" height="20px"></a><p>${blogParsed.author} <span>${blogDate}</span></p></div>
        <h2>${blogParsed.title}</h2>
        <div class="post-text" id="post-text">
          <p>${blogParsed.desc}</p>
        </div>
        <button onclick="showComments()">🖹 comments <small>▼</small></button>
        <button> ❤ LIKES</button>
        <!-- this for comments, will be hidden until clicked -->
        <div class="comments animation" id="comments">
        ${commentsString}
          <div class="commenting">
            <form method="post" id="comment-form">
              <a style="align-self:center"><img src="https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png" height="20px"></a>
              <textarea  id="commenting" class="write-comment" ></textarea>
              <input type="submit"  value="comment" id="submit-comment" data-blog-id="${id}">
            </form>
          </div>
        </div> `
        // console.log(blogContent)
    //     console.log(`Comments: ${comments}`);
        timelineSelector.innerHTML += blogContent;
    })
  }

  function addComment(blogid, text, author){
    db.collection("blogs").doc(blogid).collection("comments").add({
      author: author,
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).then( (docRef) => {
      console.log(`Comment created: ${docRef.id}`)
    }).catch( (error) => {
      console.log(`Error adding comment: ${error}`)
    });
  }

  function getComments(blogID){
    console.log(`Getting comments for ${blogID}`)
    let commentsString = '';
    db.collection("blogs").doc(blogID).collection("comments")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(doc => {
          let parsed = JSON.parse(JSON.stringify(doc.data()));
          commentsString += 
          `
          <div class="comment">
          <div class="post-header">
            <a style="align-self:center"><img src="https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png" height="20px"></a><p>${parsed.author} <span>timestamp</span></p></div>
            <div class="comment-text">
            <p>${parsed.text}</p>
          </div>
          `
      })
    })
    console.log(commentsString);
    return commentsString
  }
  getAllBlogs();

  // Listener for comments form
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    if(e.target.id == "comment-form"){
      console.log("Comment form.")
      console.log(e.target.elements)
      // addComment(blogid, text, author)
    }
  })

  function showComments() {
    console.log(`click`)
    var Post = document.getElementById("post-text")
    var Comms = document.getElementById("comments");
    if (Comms.style.display === "none") {
      Post.classList.add("clear");
      Comms.style.display = "block";
    } else {
      Post.classList.remove("clear");
      Comms.style.display = "none";
    }
  }
  
})


