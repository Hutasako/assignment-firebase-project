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
    // const arrBlogs = []
    db.collection("blogs").get().then((querySnapshot) =>{
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);       
        // arrBlogs.push(JSON.stringify(doc.data()));
        displayBlog(doc.id, JSON.stringify(doc.data()))
      // let comm = getComments(doc.id)

      // console.log(comm);
      })
    })
    // console.log(`Current blogs: `)
    // console.log(arrBlogs)
    // displayBlog(arrBlogs)
  }
  
  function getBlog(blogID){
    db.collection("blogs").doc(blogID)
    .get()
    .then((doc) => {
      if (doc.exists) {
          console.log(`Document data: ${JSON.stringify(doc.data())}`);
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    })
  }

  function displayBlog(id, blog){
    const blogParsed = JSON.parse(blog)
    console.log(`Printing blogs`)
    console.log(blogParsed)
    let commentsString = '';

    // let comments = getComments(id);
    db.collection("blogs").doc(id).collection("comments")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(doc => {
          // console.log(doc.id, " => ", JSON.parse(JSON.stringify(doc.data())));
          let parsedComment = JSON.parse(JSON.stringify(doc.data()));
          // let commentDate = parsedComment.timestamp.seconds;
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
          // arrComments.push(parsed);
          // console.log(`Comments: `);
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
            <form>
              <a style="align-self:center"><img src="https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png" height="20px"></a>
              <textarea  id="commenting" class="write-comment" ></textarea>
              <input type="submit"  value="comment">
            </form>
          </div>
        </div> `
        // console.log(blogContent)
    //     console.log(`Comments: ${comments}`);
        timelineSelector.innerHTML += blogContent;
    }

    )
    
  }

  function addComment(blogid, text){
    db.collection("blogs").doc(blogid).collection("comments").add({
      author: sampleAuthor,
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
    // let blogSelector = document.querySelector(".post");
    // console.log(blogSelector.data.blogID)
    db.collection("blogs").doc(blogID).collection("comments")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(doc => {
          // console.log(doc.id, " => ", JSON.parse(JSON.stringify(doc.data())));
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
          // arrComments.push(parsed);
          // console.log(`Comments: `);
      })
    })
    console.log(commentsString);
    return commentsString
  }
  // addBlog(sampleTitle, sampleDesc);
  // addComment(sampleBlogID, sampleComment);
  getAllBlogs();
  // getBlog(sampleBlogID);
  // getComments(sampleBlogID);

  document.addEventListener("click", () => {

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


