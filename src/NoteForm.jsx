/*import { useState } from "react";

function NoteForm({ task, setTask, addNote }) {

const [showForm, setShowForm] = useState(false);


function handleAdd() {

addNote();
setShowForm(false);
}


return (
<div

className={`add-note-card ${showForm ? "open" : ""}`}
onClick={() => !showForm && setShowForm(true)}
>

{!showForm ? (
<div className="big-plus">
+
</div>

) : (

<div className="add-note-form">


<input

type="text"
value={task}
placeholder="Write a note..."
autoFocus
onClick={(e) => e.stopPropagation()}
onChange={(e) => setTask(e.target.value)}
onKeyDown={(e) => {

if (e.key === "Enter") {

handleAdd();
}

}}

/>


<div className="form-buttons">


<button

onClick={(e) => {
e.stopPropagation();
handleAdd();

}}

>
Add
</button>


<button
className="cancel"
onClick={(e) => {
e.stopPropagation();
setShowForm(false);

}}
>
Cancel
</button>


</div>
</div>

)}
</div>

);


}


export default NoteForm;

*/

/*function NoteForm ({task,setTask,addHabit}){

return(

<div>

<input type="text" 
value={task}
placeholder="Add habit"
onChange={(e)=> setTask(e.target.value)}
/>

<button onClick={addHabit}>Add</button>


</div>

)

}


export default NoteForm;*/


/*import { useState } from "react";

function NoteForm({

task,
setTask,

title,
setTitle,

startDate,
setStartDate,

endDate,
setEndDate,

selectedList,
setSelectedList,

selectedTags,
setSelectedTags,

lists,
tags,

addNote

}){

const [showForm,setShowForm]=useState(false)

function handleAdd(){
if(!task.trim()) return

addNote()
setShowForm(false)

}

function toggleTag(tag){
if(selectedTags.includes(tag)){

setSelectedTags(selectedTags.filter((selectedTag)=>

selectedTag!==tag

))

}else{

setSelectedTags([

...selectedTags,

tag

])
}
}

return(

<div

className={`add-note-card ${showForm?"open":""}`}
onClick={()=>!showForm&&setShowForm(true)}

>

{!showForm?(

<div className="big-plus">

*

</div>

):(

<div className="add-note-form">

<input
type="text"
value={title}
placeholder="Title (optional)"
onClick={(e)=>e.stopPropagation()}
onChange={(e)=>setTitle(e.target.value)}
/>

<textarea
value={task}
placeholder="Write a task..."
autoFocus
onClick={(e)=>e.stopPropagation()}
onChange={(e)=>setTask(e.target.value)}
/>

<div className="date-fields">

<div>

<label>Start Date</label>

<input
type="date"
value={startDate}
onClick={(e)=>e.stopPropagation()}
onChange={(e)=>setStartDate(e.target.value)}
/>

</div>

<div>

<label>Deadline</label>

<input
type="date"
value={endDate}
onClick={(e)=>e.stopPropagation()}
onChange={(e)=>setEndDate(e.target.value)}

/>

</div>

</div>

<select
value={selectedList}
onClick={(e)=>e.stopPropagation()}
onChange={(e)=>setSelectedList(e.target.value)}

>


{lists.map((list)=>(

<option

key={list}
value={list}

>
{list}

</option>

))}


</select>

<div className="tag-selector">


<p>Tags</p>
{tags.map((tag)=>(

<button
type="button"
key={tag}

className={selectedTags.includes(tag)?"tag-selected":""}
onClick={(e)=>{

e.stopPropagation()
toggleTag(tag)

}}

>

{tag}

</button>

))}


</div>

<div className="form-buttons">

<button
onClick={(e)=>{
e.stopPropagation()
handleAdd()

}}

>

Add Task

</button>

<button

className="cancel"
onClick={(e)=>{
e.stopPropagation()
setShowForm(false)

}}

>
Cancel

</button>

</div>

</div>

)}

</div>
)
}


export default NoteForm;
*/


import { useState } from "react";

function NoteForm({

task,
setTask,

title,
setTitle,

startDate,
setStartDate,

endDate,
setEndDate,

selectedList,
setSelectedList,

selectedTags,
setSelectedTags,

lists,
tags,

addNote

}){

const [showForm,setShowForm]=useState(false)

function handleAdd(){
if(!task.trim()) return

addNote()
setShowForm(false)

}

function toggleTag(tag){

if(selectedTags.includes(tag)){

setSelectedTags(selectedTags.filter((selectedTag)=>
selectedTag!==tag
))

}else{

setSelectedTags([
...selectedTags,
tag
])

}

}

return(

<div

className={`add-note-card ${showForm?"open":""}`}
onClick={()=>!showForm&&setShowForm(true)}

>

{!showForm?(

<div className="big-plus">

+

</div>

):( 

<div className="add-note-form">

<input
type="text"
value={title}
placeholder="Title (optional)"
onClick={(e)=>e.stopPropagation()}
onChange={(e)=>setTitle(e.target.value)}
/>

<textarea
value={task}
placeholder="Write a task..."
autoFocus
onClick={(e)=>e.stopPropagation()}
onChange={(e)=>setTask(e.target.value)}
/>

<div className="date-fields">

<div>

<label>Start Date</label>

<input
type="date"
value={startDate}
onClick={(e)=>e.stopPropagation()}
onChange={(e)=>setStartDate(e.target.value)}
/>

</div>

<div>

<label>Deadline</label>

<input
type="date"
value={endDate}
onClick={(e)=>e.stopPropagation()}
onChange={(e)=>setEndDate(e.target.value)}
/>

</div>

</div>

<select
value={selectedList}
onClick={(e)=>e.stopPropagation()}
onChange={(e)=>setSelectedList(e.target.value)}
>

{lists.map((list)=>(

<option
key={list}
value={list}
>

{list}

</option>

))}

</select>

<div className="tag-selector">

<p>Tags</p>

{tags.map((tag)=>(

<button
type="button"
key={tag}

className={selectedTags.includes(tag)?"tag-selected":""}

onClick={(e)=>{

e.stopPropagation()
toggleTag(tag)

}}

>

{tag}

</button>

))}

</div>

<div className="form-buttons">

<button

onClick={(e)=>{

e.stopPropagation()
handleAdd()

}}

>

Add Task

</button>

<button

className="cancel"

onClick={(e)=>{

e.stopPropagation()
setShowForm(false)

}}

>

Cancel

</button>

</div>

</div>

)}

</div>

)

}

export default NoteForm;

