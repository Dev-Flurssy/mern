export default function Comments({ postId, comments, updateComments }) {
  return (
    <div>
      {comments.map((c) => (
        <p key={c._id}>{c.text}</p>
      ))}
    </div>
  );
}
