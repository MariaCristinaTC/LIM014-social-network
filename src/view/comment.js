import {
  updateComment,
  deleteComment,
  getDataUser,
} from './services/firestore.services.js';
import { user } from './services/aut.services.js';

export const itemComment = (objComment, idPost) => {
  const userId = user().uid;
  const commentElement = document.createElement('div');
  commentElement.classList.add('all-comments');
  commentElement.innerHTML = `
  <div class="${userId !== objComment.userId ? 'hide' : 'show menu-comment'}">
    <i class="fas fa-ellipsis-v btn-menu-comment"></i>
    <div id="menu-comment-content" class="menu-comment-content">
      <li id="edit-comment"><i class="fas fa-edit select"></i> Editar</li>
      <li id="delete-comment-${
  objComment.id
}"><i class="fas fa-trash-alt select"></i> Borrar</li>
    </div>
  </div> 
  <div class = "photo-comment-container">
    <img class="avatar-comment" src=""/>
    <div class = "comment-container">
      <p class="name-comment"></p>
      <p class = "comment-text">${objComment.comment}</p>
      <div class = "hide edit-comment-text-btns">
        <textarea class = "edit-comment-text">${objComment.comment}</textarea>
        <div class = "edit-comment-btns">
          <button type="button" class="btn-save-comment-${
  objComment.id
}">Guardar</button>
          <button type="button" class="btn-cancel-comment">Cancelar</button>
        </div>
      </div>
      <time class="time-comment">${objComment.date}</time>
    </div>
  </div>
    `;

  getDataUser(objComment.userId).then((doc) => {
    const avatarComment = commentElement.querySelector('.avatar-comment');
    const nameComment = commentElement.querySelector('.name-comment');
    avatarComment.src = doc.data().photo;
    nameComment.textContent = doc.data().username;
  });

  /* ---------------- Menu despegable comment --------------------------*/
  const btnMenuComment = commentElement.querySelector('.btn-menu-comment');
  btnMenuComment.addEventListener('click', () => {
    commentElement
      .querySelector('#menu-comment-content')
      .classList.toggle('show');
  });
  // close menu click outside
  window.addEventListener('click', (e) => {
    if (e.target !== btnMenuComment) {
      commentElement
        .querySelector('#menu-comment-content')
        .classList.remove('show');
    }
  });
  /* -------------- edit and delete menu comment -------------------*/
  const editComment = commentElement.querySelector('#edit-comment');
  const editCommentText = commentElement.querySelector('.edit-comment-text');
  const btnCancelComment = commentElement.querySelector('.btn-cancel-comment');
  // edit comment menu
  editComment.addEventListener('click', () => {
    commentElement
      .querySelector('.edit-comment-text-btns')
      .classList.remove('hide');
    commentElement.querySelector('.comment-text').classList.add('hide');
  });
  // cancel edit comment
  btnCancelComment.addEventListener('click', () => {
    commentElement
      .querySelector('.edit-comment-text-btns')
      .classList.add('hide');
    commentElement.querySelector('.comment-text').classList.remove('hide');
    editCommentText.value = objComment.comment;
  });
  // update comment
  const btnSaveComment = commentElement.querySelector(
    `.btn-save-comment-${objComment.id}`,
  );
  btnSaveComment.addEventListener('click', () => {
    updateComment(idPost, objComment.id, editCommentText.value);
  });
  // delete comment
  const deleteCommentSelect = commentElement.querySelector(
    `#delete-comment-${objComment.id}`,
  );
  deleteCommentSelect.addEventListener('click', () => {
    deleteComment(idPost, objComment.id);
  });
  return commentElement;
};
