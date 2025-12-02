package com.todolist.to_do_list.service;

import com.todolist.to_do_list.model.Task;
import com.todolist.to_do_list.repo.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    TaskRepo repo;

    public String status(){
        return "I am from service package";
    }

    public List<Task> allTasks() {
        return repo.findAll();
    }

    public void addTask(Task task) {
        repo.save(task);
    }

    public void updateTask(Task task, int id) {
        task.setId(id);
        repo.save(task);
    }

    public void deleteTask(int id) {
        repo.deleteById(id);
    }
}
