
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { supabase } from "./supabase";
import Auth from "./Auth";
import ChangePassword from "./ChangePassword";
import NoteForm from "./NoteForm";
import NoteItem from "./NoteItem";
import SearchBar from "./SearchBar";
import FilterButtons from "./FilterButtons";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [recoveryMode, setRecoveryMode] = useState(
    window.location.pathname === "/reset-password"
  );

  const [notes, setNotes] = useState([]);

  const [task, setTask] = useState("");
  const [title, setTitle] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedList, setSelectedList] = useState("Personal");
  const [selectedTags, setSelectedTags] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [taskView, setTaskView] = useState("active");

  const [selectedLists, setSelectedLists] = useState([]);
  const [selectedFilterTags, setSelectedFilterTags] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [lists, setLists] = useState([]);
  const [tags, setTags] = useState([]);

  /* =========================
     CHECK LOGIN AND RECOVERY
  ========================= */

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!mounted) return;

      setSession(currentSession);

      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
      }

      setLoading(false);
    });

    async function getSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.log(error.message);
      }

      if (!mounted) return;

      setSession(data.session);
      setLoading(false);
    }

    getSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* =========================
     LOAD TASKS
  ========================= */

  useEffect(() => {
    if (!session || recoveryMode) return;

    async function loadNotes() {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.log(error.message);
        return;
      }

      setNotes(data || []);
    }

    loadNotes();
  }, [session, recoveryMode]);

  /* =========================
     LOAD LISTS AND TAGS
  ========================= */

  useEffect(() => {
    if (!session || recoveryMode) return;

    async function loadListsAndTags() {
      const { data: listData, error: listError } = await supabase
        .from("lists")
        .select("*")
        .order("created_at", { ascending: true });

      if (listError) {
        console.log(listError.message);
        return;
      }

      const { data: tagData, error: tagError } = await supabase
        .from("tags")
        .select("*")
        .order("created_at", { ascending: true });

      if (tagError) {
        console.log(tagError.message);
        return;
      }

      if (listData.length === 0) {
        const defaultLists = ["Personal", "Work", "List 1"];

        const { data: newLists, error } = await supabase
          .from("lists")
          .insert(
            defaultLists.map((name) => ({
              user_id: session.user.id,
              name,
            }))
          )
          .select();

        if (error) {
          console.log(error.message);
          return;
        }

        setLists(newLists.map((item) => item.name));
      } else {
        setLists(listData.map((item) => item.name));
      }

      if (tagData.length === 0) {
        const defaultTags = ["Tag 1", "Tag 2"];

        const { data: newTags, error } = await supabase
          .from("tags")
          .insert(
            defaultTags.map((name) => ({
              user_id: session.user.id,
              name,
            }))
          )
          .select();

        if (error) {
          console.log(error.message);
          return;
        }

        setTags(newTags.map((item) => item.name));
      } else {
        setTags(tagData.map((item) => item.name));
      }
    }

    loadListsAndTags();
  }, [session, recoveryMode]);

  /* =========================
     ADD TASK
  ========================= */

  async function addNote() {
    if (!task.trim() || !session) return;

    const colors = ["yellow", "blue", "pink", "orange"];

    const randomColor =
      colors[Math.floor(Math.random() * colors.length)];

    const newNote = {
      user_id: session.user.id,
      title,
      text: task,
      startDate,
      endDate,
      list: selectedList,
      tags: selectedTags,
      completed: false,
      color: randomColor,
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert([newNote])
      .select()
      .single();

    if (error) {
      console.log(error.message);
      return;
    }

    setNotes([...notes, data]);

    setTask("");
    setTitle("");
    setStartDate("");
    setEndDate("");
    setSelectedList("Personal");
    setSelectedTags([]);
  }

  /* =========================
     DELETE TASK
  ========================= */

  async function deleteNote(id) {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error.message);
      return;
    }

    setNotes(notes.filter((note) => note.id !== id));
  }

  /* =========================
     TOGGLE TASK
  ========================= */

  async function toggleNote(id) {
    const note = notes.find((note) => note.id === id);

    if (!note) return;

    const { data, error } = await supabase
      .from("tasks")
      .update({
        completed: !note.completed,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.log(error.message);
      return;
    }

    setNotes(
      notes.map((note) => (note.id === id ? data : note))
    );
  }

  /* =========================
     START EDIT
  ========================= */

  function startEdit(note) {
    setEditingId(note.id);
    setEditText(note.text);
  }

  /* =========================
     SAVE EDIT
  ========================= */

  async function saveEdit(id) {
    if (!editText.trim()) return;

    const { data, error } = await supabase
      .from("tasks")
      .update({ text: editText })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.log(error.message);
      return;
    }

    setNotes(
      notes.map((note) => (note.id === id ? data : note))
    );

    setEditingId(null);
    setEditText("");
  }

  /* =========================
     UPDATE TASK
  ========================= */

  async function updateNote(id, changes) {
    const { data, error } = await supabase
      .from("tasks")
      .update(changes)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.log(error.message);
      return;
    }

    setNotes(
      notes.map((note) => (note.id === id ? data : note))
    );
  }

  /* =========================
     DATE FUNCTIONS
  ========================= */

  function isToday(date) {
    if (!date) return false;

    const today = new Date();
    const checkDate = new Date(date);

    if (Number.isNaN(checkDate.getTime())) return false;

    return (
      today.getFullYear() === checkDate.getFullYear() &&
      today.getMonth() === checkDate.getMonth() &&
      today.getDate() === checkDate.getDate()
    );
  }

  function isThisWeek(date) {
    if (!date) return false;

    const today = new Date();
    const checkDate = new Date(date);

    if (Number.isNaN(checkDate.getTime())) return false;

    const startOfWeek = new Date(today);
    const day = today.getDay();

    startOfWeek.setDate(today.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    return checkDate >= startOfWeek && checkDate < endOfWeek;
  }

  function isThisMonth(date) {
    if (!date) return false;

    const today = new Date();
    const checkDate = new Date(date);

    if (Number.isNaN(checkDate.getTime())) return false;

    return (
      today.getFullYear() === checkDate.getFullYear() &&
      today.getMonth() === checkDate.getMonth()
    );
  }

  /* =========================
     LIST FILTER
  ========================= */

  function toggleListFilter(list) {
    if (selectedLists.includes(list)) {
      setSelectedLists(
        selectedLists.filter((selectedList) => selectedList !== list)
      );
    } else {
      setSelectedLists([...selectedLists, list]);
    }
  }

  /* =========================
     TAG FILTER
  ========================= */

  function toggleTagFilter(tag) {
    if (selectedFilterTags.includes(tag)) {
      setSelectedFilterTags(
        selectedFilterTags.filter((selectedTag) => selectedTag !== tag)
      );
    } else {
      setSelectedFilterTags([...selectedFilterTags, tag]);
    }
  }

  /* =========================
     FILTER TASKS
  ========================= */

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      (note.text || "").toLowerCase().includes(search.toLowerCase()) ||
      (note.title || "").toLowerCase().includes(search.toLowerCase());

    let matchesDate = true;

    if (filter === "today") {
      matchesDate = isToday(note.created_at);
    }

    if (filter === "week") {
      matchesDate = isThisWeek(note.created_at);
    }

    if (filter === "month") {
      matchesDate = isThisMonth(note.created_at);
    }

    const matchesList =
      selectedLists.length === 0 ||
      selectedLists.includes(note.list);

    const matchesTag =
      selectedFilterTags.length === 0 ||
      selectedFilterTags.some((tag) => (note.tags || []).includes(tag));

    return matchesSearch && matchesDate && matchesList && matchesTag;
  });

  const displayedNotes = filteredNotes.filter((note) => {
    if (taskView === "active") return !note.completed;
    if (taskView === "completed") return note.completed;

    return true;
  });

  const activeNotes = notes.filter((note) => !note.completed);
  const completedNotes = notes.filter((note) => note.completed);

  const totalNotes = activeNotes.length;

  const todayNotes = activeNotes.filter(
    (note) => isToday(note.created_at)
  ).length;

  const weekNotes = activeNotes.filter(
    (note) => isThisWeek(note.created_at)
  ).length;

  const monthNotes = activeNotes.filter(
    (note) => isThisMonth(note.created_at)
  ).length;

  /* =========================
     ADD LIST
  ========================= */

  function addList() {
    Swal.fire({
      title: "Create Category",
      input: "text",
      inputPlaceholder: "Enter category name",
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value.trim()) return "Please enter a category name";

        if (lists.includes(value.trim())) {
          return "That category already exists";
        }
      },
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const newList = result.value.trim();

      const { data, error } = await supabase
        .from("lists")
        .insert([{ user_id: session.user.id, name: newList }])
        .select()
        .single();

      if (error) {
        console.log(error.message);
        return;
      }

      setLists([...lists, data.name]);
    });
  }

  /* =========================
     RENAME LIST
  ========================= */

  function renameList(list) {
    Swal.fire({
      title: "Rename Category",
      input: "text",
      inputValue: list,
      showCancelButton: true,
      confirmButtonText: "Rename",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value.trim()) return "Please enter a category name";

        if (lists.includes(value.trim()) && value.trim() !== list) {
          return "That category already exists";
        }
      },
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const newList = result.value.trim();

      const { error } = await supabase
        .from("lists")
        .update({ name: newList })
        .eq("user_id", session.user.id)
        .eq("name", list);

      if (error) {
        console.log(error.message);
        return;
      }

      const affectedNotes = notes.filter((note) => note.list === list);

      for (const note of affectedNotes) {
        await updateNote(note.id, { list: newList });
      }

      setLists(
        lists.map((item) => (item === list ? newList : item))
      );

      setNotes(
        notes.map((note) =>
          note.list === list ? { ...note, list: newList } : note
        )
      );

      setSelectedLists(
        selectedLists.map((item) => (item === list ? newList : item))
      );
    });
  }

  /* =========================
     DELETE LIST
  ========================= */

  function deleteList(list) {
    if (lists.length === 1) {
      Swal.fire({
        icon: "warning",
        title: "Cannot delete category",
        text: "You need to keep at least one category.",
      });

      return;
    }

    Swal.fire({
      title: "Delete category?",
      text: `Delete "${list}"? Tasks in this category will be moved to another category.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const newLists = lists.filter((item) => item !== list);
      const newDefaultList = newLists[0];

      const affectedNotes = notes.filter((note) => note.list === list);

      for (const note of affectedNotes) {
        await updateNote(note.id, { list: newDefaultList });
      }

      const { error } = await supabase
        .from("lists")
        .delete()
        .eq("user_id", session.user.id)
        .eq("name", list);

      if (error) {
        console.log(error.message);
        return;
      }

      setLists(newLists);

      setNotes(
        notes.map((note) =>
          note.list === list
            ? { ...note, list: newDefaultList }
            : note
        )
      );

      setSelectedLists(
        selectedLists.filter((item) => item !== list)
      );
    });
  }

  /* =========================
     ADD TAG
  ========================= */

  function addTag() {
    Swal.fire({
      title: "Create Tag",
      input: "text",
      inputPlaceholder: "Enter tag name",
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value.trim()) return "Please enter a tag name";

        if (tags.includes(value.trim())) {
          return "That tag already exists";
        }
      },
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const newTag = result.value.trim();

      const { data, error } = await supabase
        .from("tags")
        .insert([{ user_id: session.user.id, name: newTag }])
        .select()
        .single();

      if (error) {
        console.log(error.message);
        return;
      }

      setTags([...tags, data.name]);
    });
  }

  /* =========================
     RENAME TAG
  ========================= */

  function renameTag(tag) {
    Swal.fire({
      title: "Rename Tag",
      input: "text",
      inputValue: tag,
      showCancelButton: true,
      confirmButtonText: "Rename",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value.trim()) return "Please enter a tag name";

        if (tags.includes(value.trim()) && value.trim() !== tag) {
          return "That tag already exists";
        }
      },
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const newTag = result.value.trim();

      const { error } = await supabase
        .from("tags")
        .update({ name: newTag })
        .eq("user_id", session.user.id)
        .eq("name", tag);

      if (error) {
        console.log(error.message);
        return;
      }

      const affectedNotes = notes.filter(
        (note) => (note.tags || []).includes(tag)
      );

      for (const note of affectedNotes) {
        const newTags = (note.tags || []).map(
          (item) => (item === tag ? newTag : item)
        );

        await updateNote(note.id, { tags: newTags });
      }

      setTags(
        tags.map((item) => (item === tag ? newTag : item))
      );

      setNotes(
        notes.map((note) => {
          if (!(note.tags || []).includes(tag)) return note;

          return {
            ...note,
            tags: (note.tags || []).map(
              (item) => (item === tag ? newTag : item)
            ),
          };
        })
      );

      setSelectedTags(
        selectedTags.map((item) => (item === tag ? newTag : item))
      );

      setSelectedFilterTags(
        selectedFilterTags.map((item) => (item === tag ? newTag : item))
      );
    });
  }

  /* =========================
     DELETE TAG
  ========================= */

  function deleteTag(tag) {
    Swal.fire({
      title: "Delete tag?",
      text: `Delete "${tag}" from the sidebar and from assigned tasks?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const affectedNotes = notes.filter(
        (note) => (note.tags || []).includes(tag)
      );

      for (const note of affectedNotes) {
        const newTags = (note.tags || []).filter((item) => item !== tag);

        await updateNote(note.id, { tags: newTags });
      }

      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("user_id", session.user.id)
        .eq("name", tag);

      if (error) {
        console.log(error.message);
        return;
      }

      setTags(tags.filter((item) => item !== tag));

      setNotes(
        notes.map((note) => {
          if (!(note.tags || []).includes(tag)) return note;

          return {
            ...note,
            tags: (note.tags || []).filter((item) => item !== tag),
          };
        })
      );

      setSelectedTags(
        selectedTags.filter((item) => item !== tag)
      );

      setSelectedFilterTags(
        selectedFilterTags.filter((item) => item !== tag)
      );
    });
  }

  /* =========================
     SIGN OUT
  ========================= */

  async function signOut() {
    await supabase.auth.signOut();
  }

  /* =========================
     LOADING AND AUTH SCREENS
  ========================= */

  if (loading) {
    return <div>Loading...</div>;
  }

  if (recoveryMode) {
    return <ChangePassword />;
  }

  if (!session) {
    return <Auth />;
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="menu-header">
            <h2>Menu</h2>
            <span className="menu-icon">☰</span>
          </div>

          <div className="search-box">
            <SearchBar search={search} setSearch={setSearch} />
          </div>

          <div className="sidebar-group">
            <p className="sidebar-label">TASKS</p>

            <FilterButtons
              filter={filter}
              setFilter={setFilter}
              totalNotes={totalNotes}
              todayNotes={todayNotes}
              weekNotes={weekNotes}
              monthNotes={monthNotes}
            />
          </div>

          <div className="sidebar-group">
            <p className="sidebar-label">CATEGORIES</p>

            {lists.map((list, index) => {
              const listCount = activeNotes.filter(
                (note) => note.list === list
              ).length;

              return (
                <div
                  className={`list-item ${
                    selectedLists.includes(list) ? "filter-selected" : ""
                  }`}
                  key={list}
                >
                  <button
                    className="list-filter"
                    onClick={() => toggleListFilter(list)}
                  >
                    <span className={`list-color list-${index}`}></span>
                    <span>{list}</span>
                    <b>{listCount}</b>
                  </button>

                  <div className="item-actions">
                    <button onClick={() => renameList(list)}>✎</button>
                    <button onClick={() => deleteList(list)}>🗑</button>
                  </div>
                </div>
              );
            })}

            <button className="add-list" onClick={addList}>
              <span>＋</span>
              Add New Category
            </button>
          </div>

          <div className="sidebar-group">
            <p className="sidebar-label">TAGS</p>

            <div className="tags">
              {tags.map((tag) => (
                <div
                  className={`sidebar-tag ${
                    selectedFilterTags.includes(tag) ? "filter-selected" : ""
                  }`}
                  key={tag}
                >
                  <button
                    className="tag-filter"
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag}
                  </button>

                  <div className="tag-actions">
                    <button onClick={() => renameTag(tag)}>✎</button>
                    <button onClick={() => deleteTag(tag)}>🗑</button>
                  </div>
                </div>
              ))}

              <button onClick={addTag}>+ Add Tag</button>
            </div>
          </div>
        </div>

        <div className="sidebar-bottom">
          <div>
            <span>☷</span>
            Settings
          </div>

          <div onClick={signOut}>
            <span>↪</span>
            Sign out
          </div>
        </div>
      </aside>

      <main className="main-content">
        <h1 className="page-title">Sticky Wall</h1>

        <div className="task-view-toggle">
          <button
            className={taskView === "all" ? "selected" : ""}
            onClick={() => setTaskView("all")}
          >
            All Tasks ({notes.length})
          </button>

          <button
            className={taskView === "active" ? "selected" : ""}
            onClick={() => setTaskView("active")}
          >
            Active Tasks ({activeNotes.length})
          </button>

          <button
            className={taskView === "completed" ? "selected" : ""}
            onClick={() => setTaskView("completed")}
          >
            Completed Tasks ({completedNotes.length})
          </button>
        </div>

        <div className="wall">
          {displayedNotes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              toggleNote={toggleNote}
              deleteNote={deleteNote}
              startEdit={startEdit}
              editingId={editingId}
              editText={editText}
              setEditText={setEditText}
              saveEdit={saveEdit}
              updateNote={updateNote}
              lists={lists}
              tags={tags}
            />
          ))}

          <NoteForm
            task={task}
            setTask={setTask}
            title={title}
            setTitle={setTitle}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            lists={lists}
            tags={tags}
            addNote={addNote}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
