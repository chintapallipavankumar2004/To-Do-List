# 📝 To-Do List — Full Stack Application

Welcome to the **To-Do List** — a modern, full stack application designed for productivity, built using the latest technologies.

---

## 🌟 What Makes This Project Innovative?

- **End-to-End Modern Stack:** Java 23 & Spring Boot 4 backend, MySQL for persistent storage, and a visually rich HTML/CSS/JS frontend.
- **Live UI:** Enjoy a responsive, animated interface with instant feedback and auto-refresh.
- **Smart Filters:** Effortlessly switch between To-Do, Completed, or All tasks.
- **RESTful Architecture:** Seamless API integration for fast performance and scalability.
- **Clean Structure:** Tidy and modular codebase — easy to extend and maintain!
- **Real-World Ready:** User-friendly features like auto-increment task IDs and smooth UX.
- **Open Source:** Freely adaptable for personal growth or team use!

---

## 🚀 Features

- Create, list, complete, and delete tasks
- Single-click complete/uncomplete actions
- Intuitive filters: To-Do, Completed, All
- Beautiful card-based design
- Autorefresh on user actions
- Mobile-ready responsive layout

---

## 🛠️ Tech Stack

**Backend:**  
- Java 23+  
- Spring Boot 4  
- Spring Data JPA  
- MySQL

**Frontend:**  
- HTML5  
- CSS3  
- JavaScript (using Fetch API)

---

## 📁 Project Structure

```
To-Do-List/
 ├── src/
 │   ├── main/
 │   │   ├── java/com/todolist/to_do_list/
 │   │   │     ├── controller/
 │   │   │     ├── service/
 │   │   │     ├── repo/
 │   │   │     └── model/
 │   │   └── resources/
 │   │         └── application.properties
 │   └── test/
 ├── Frontend/
 │   ├── index.html
 │   ├── style.css
 │   └── app.js
 ├── pom.xml
 └── README.md
```

---

## ⚙️ Quick Start

### 1️⃣ Setup MySQL Database

Create the database:

```sql
CREATE DATABASE todolist;
```

### 2️⃣ Configure Backend

Edit `src/main/resources/application.properties`:

```
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/todolist
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 3️⃣ Run The Backend

- Using Maven:
  ```sh
  mvn spring-boot:run
  ```
- Or use your IDE's run button (IntelliJ/Eclipse).

### 4️⃣ Launch The Frontend

- Open the `Frontend` folder.
- Start `index.html` (recommended: use Live Server extension).

**Note:** Ensure backend is running on `http://localhost:8080`

---

## 🌐 REST API Endpoints

| Method | Endpoint                | Description          |
|--------|-------------------------|----------------------|
|  GET   | `/tasks`                | Get all tasks        |
| POST   | `/addtask`              | Add a new task       |
|  PUT   | `/updatetask/{id}`      | Update status/name   |
| DELETE | `/deletetask/{id}`      | Delete a task        |

---

## 📸 User Interface Preview

*Screenshots coming soon!*

---

## 👨‍💻 Author

**CHINTAPALLI PAVAN KUMAR**  
B.Tech CSE (AIML)  
Full Stack Developer | Java | Spring Boot | MySQL

---

## ⭐ Support

If you found this project helpful or interesting, please leave a ⭐ star on GitHub!

---

Let’s build something extraordinary together — happy coding!
