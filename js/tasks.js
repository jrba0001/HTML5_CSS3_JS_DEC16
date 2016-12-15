$(document).ready(function() {
	var API_URL = 'http://localhost:8000/api/';
	var tasks = [];
	var newTaskInput = $('#newTaskName');
	var tasksContainer = $('#tasksContainer');


	var drawTasks = function () {
		tasksContainer.empty();

		if (tasks.length == 0) {
			tasksContainer.append('<li class="task-item">No tienes tareas pendientes</li>');
		} else {
			var contentToAdd = '';

			for (var i = 0; i < tasks.length; i++) {
				contentToAdd += '<li class="task-item">' + tasks[i].name + '<button class="deleteTask" data-task-id="' + tasks[i].id + '">Eliminar</button></li>';
			}

			tasksContainer.append(contentToAdd);
		}
	};

	var createTask = function (name) {
		var success = function(data) {
			newTaskInput.val('');
			tasks.push(data);
			drawTasks();
		};

		var data = {
			'name': name
		};

		$.ajax({
			type: "POST",
			url: API_URL + "tasks",
			data: data,
			success: success
		});
	}

	var getTasks = function () {
		var success = function(data) {
			tasks = data;
			drawTasks();
		};

		$.ajax({
			type: "GET",
			url: API_URL + "tasks",
			success: success
		});
	}

	var deleteTask = function(id) {
		var success = function(data) {
			tasks = $.grep(tasks, function(item){
				return item.id != id;
			});

			drawTasks();
		}

		$.ajax({
			type: "DELETE",
			url: API_URL + "tasks/" + id,
			success: success
		});
	}


	$('#sendNewTask').on("click", function(event){
		if (newTaskInput.val() != '') {
			event.preventDefault();
			createTask(newTaskInput.val());
		}
	});

	$(document).on("click", ".deleteTask", function(event){
		var id = $(this).data('taskId');
		deleteTask(id);
	});

	getTasks();
});