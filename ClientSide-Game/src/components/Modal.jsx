
function Modal({list,onListClick}) {
  return (
    <>
    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop"> <i className="bi bi-menu-up"></i> </button>
    <div className="modal fade" style={{color: "black"}} id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel" >Select User to Chat</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                {list.map((item,index) => (
                    <p style={{cursor:"pointer"}} key={index} onClick={() => onListClick(item)} data-bs-dismiss="modal">{item.name} </p>
                ))}
            </div>
            <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
        </div>
    </div>
    </>
  )
}

export default Modal