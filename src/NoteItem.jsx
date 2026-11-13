
function NoteItem({
  note,
  toggleNote,
  deleteNote,
  startEdit,
  editingId,
  editText,
  setEditText,
  editTitle,
  setEditTitle,
  editStartDate,
  setEditStartDate,
  editEndDate,
  setEditEndDate,
  saveEdit,
  cancelEdit,
  updateNote,
  lists,
  tags,
}) {
  function toggleTag(tag) {
    if ((note.tags || []).includes(tag)) {
      updateNote(note.id, {
        tags: (note.tags || []).filter(
          (selectedTag) => selectedTag !== tag
        ),
      });
    } else {
      updateNote(note.id, {
        tags: [...(note.tags || []), tag],
      });
    }
  }

  return (
    <div
      className={`sticky-note ${note.color || "yellow"} ${
        note.completed ? "completed" : ""
      }`}
    >
      {editingId === note.id ? (
        <div className="edit-note">
          <input
            className="edit-title-input"
            type="text"
            value={editTitle}
            placeholder="Title (optional)"
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <textarea
            value={editText}
            placeholder="Write your task..."
            onChange={(e) => setEditText(e.target.value)}
          />

          <div className="edit-date-fields">
            <div>
              <label>Start Date</label>
              <input
                type="date"
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
              />
            </div>

            <div>
              <label>Deadline</label>
              <input
                type="date"
                value={editEndDate}
                onChange={(e) => setEditEndDate(e.target.value)}
              />
            </div>
          </div>

          <select
            className="edit-list-select"
            value={note.list || ""}
            onChange={(e) =>
              updateNote(note.id, { list: e.target.value })
            }
          >
            {lists.map((list) => (
              <option key={list} value={list}>
                {list}
              </option>
            ))}
          </select>

          <div className="edit-tags">
            <p>Tags</p>

            {tags.map((tag) => (
              <button
                type="button"
                key={tag}
                className={
                  (note.tags || []).includes(tag)
                    ? "tag-selected"
                    : ""
                }
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="edit-actions">
            <button
              type="button"
              className="save-note"
              onClick={() => saveEdit(note.id)}
            >
              Save
            </button>

            <button
              type="button"
              className="cancel-edit"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {note.title && (
            <h3 className="sticky-title">{note.title}</h3>
          )}

          <p
            className="sticky-text"
            onClick={() => toggleNote(note.id)}
          >
            {note.text}
          </p>

          {(note.startDate || note.endDate) && (
            <div className="note-dates">
              {note.startDate && (
                <small>Start: {note.startDate}</small>
              )}

              {note.endDate && (
                <small>Deadline: {note.endDate}</small>
              )}
            </div>
          )}

          {note.tags && note.tags.length > 0 && (
            <div className="note-tags">
              {note.tags.map((tag) => (
                <span
                  className="note-tag active-tag"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="note-footer">
            <button
              type="button"
              className="check-button"
              onClick={() => toggleNote(note.id)}
              aria-label={
                note.completed
                  ? "Mark task as active"
                  : "Mark task as completed"
              }
            >
              {note.completed ? "↶" : "✓"}
            </button>

            <div className="note-buttons">
              <button
                type="button"
                aria-label="Edit task"
                onClick={() => startEdit(note)}
              >
                ✎
              </button>

              <button
                type="button"
                aria-label="Delete task"
                onClick={() => deleteNote(note.id)}
              >
                🗑
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NoteItem;
