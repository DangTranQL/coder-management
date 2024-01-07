# User: /users

get, post("/"): get all users, create a user

get("/:id"): get user by name

get("/search/:name"): get user by name

get("/tasks/:id"): get user's task by id

delete("/:id"): delete user by id

delete("/remove/:id"): delete a task of a user by id

# Task: /tasks

get, post("/"): get all tasks, create a task

get("/:id"): get task by id

put("/:id"): assign a task

put("/update/:id"): update name or status of task by id

delete("/:id"): delete task by id