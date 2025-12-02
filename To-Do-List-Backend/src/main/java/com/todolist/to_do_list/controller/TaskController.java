package com.todolist.to_do_list.controller;

import com.todolist.to_do_list.model.Task;
import com.todolist.to_do_list.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class TaskController {

    @Autowired
    TaskService service;

    @RequestMapping("/greet")
    public String greet(){
        return "Welcome to TO-DO-TASKS";
    }

    @GetMapping("/tasks")
    public List<Task> allTasks(){
        return service.allTasks();
    }

    @PostMapping("/addtask")
    public ResponseEntity<?> addTask(@RequestBody Task task){
        service.addTask(task);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/updatetask/{id}")
    public String upadeTask(@RequestBody Task task,@PathVariable int id){
        service.updateTask(task,id);
        return "Task updated successfully!";
    }

    @DeleteMapping("/deletetask/{id}")
    public String deleteTask(@PathVariable int id){
        service.deleteTask(id);
        return "Task deleted successfully!";
    }
}
