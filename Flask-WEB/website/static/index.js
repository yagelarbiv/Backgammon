function deleteNote(noteId){
    fetch('/delete-note', {
        method: 'POST',
        body: JSON.stringify({ noteId: noteId }),
    }).then((_res) => {
        window.location.href = "/";
    });
}

function openChatWithUser(userId) {
    // You would need to implement this function to open a chat window or panel
    console.log("Open chat with user ID:", userId);
  }