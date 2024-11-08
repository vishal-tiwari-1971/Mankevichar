
const Card=()=> {
    return(<>
    <div className="card bg-base-100 w-96 shadow-xl">
  <figure>
    <img
      src="https://cdn.pixabay.com/photo/2018/06/17/17/48/pen-3481061_640.jpg"
      alt="diary" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">
      Title
      <div className="badge badge-secondary">NEW</div>
    </h2>
    <p>Content</p>
    <div className="card-actions justify-end">
      <div className="badge badge-outline">Like</div>
      <div className="badge badge-outline">Read more</div>
    </div>
  </div>
</div>
    </>
    )
  }

  export default Card;
