const path = require('path');
const pagePath = 'file://' + path.resolve(__dirname, '../src/index.html');
const {StageTest, correct, wrong} = require('hs-test-web');

class TodoTest extends StageTest {

    page = this.getPage(pagePath)

    tests = [
        this.page.execute(() => {
            if (document.title !== 'To-Do List') {
                return wrong("The title of the page should be 'To-Do List'")
            }

            return correct();
        }),
        this.page.execute(() => {

            let taskList = document.getElementById("task-list")

            if (taskList === null || taskList.tagName !== 'UL')
                return wrong("Can't find <ul> tag with id '#task-list'")

            let tasks = taskList.getElementsByTagName("li")

            const numberOfTasks = tasks.length;
            let counter = 0;

            while (true) {

                if (counter > numberOfTasks) {
                    return wrong("Looks like after deleting a task it is not removed from the task list!")
                }

                const deleteButton = document.querySelector("button.delete-btn")
                if (deleteButton === null) {
                    break
                }
                deleteButton.click()

                counter++
            }

            taskList = document.getElementById("task-list")
            if (taskList === null || taskList.tagName !== 'UL')
                return wrong("After deleting the tasks can't find <ul> tag with id '#task-list'")

            tasks = taskList.getElementsByTagName("li")

            if (tasks.length !== 0) {
                return wrong("After deleting all the tasks there shouldn't be any <li> tag")
            }

            return correct()
        }),
        this.page.execute(() => {
            const tasksName = ['First task', 'Second task', 'Third task', 'Fourth task', 'Fifth task']

            const inputField = document.getElementById("input-task")
            if (inputField === null || inputField.tagName !== 'INPUT')
                return wrong("Can't find input field with id '#input-task'")

            const addButton = document.getElementById("add-task-button")
            if (addButton === null || addButton.tagName !== 'BUTTON')
                return wrong("Can't find button with id '#add-task-button'")

            const taskList = document.getElementById("task-list")
            if (taskList === null || taskList.tagName !== 'UL')
                return wrong("Can't find <ul> tag with id '#task-list'")

            let currentTaskCounter = 1;

            for (let taskName of tasksName) {
                inputField.value = taskName
                addButton.click()

                const tasks = taskList.getElementsByTagName("li")

                if (tasks.length !== currentTaskCounter) {
                    return wrong("After adding a task number of the <li> tags is not increased!")
                }

                currentTaskCounter++
            }

            return correct()
        }),
        this.page.execute(() => {

            const taskList = document.getElementById("task-list")
            if (taskList.tagName !== 'UL')
                return wrong("Can't find <ul> tag with id '#task-list'")

            const tasks = taskList.getElementsByTagName("li")
            if (tasks.length !== 5)
                return wrong("Inside the <ul> tag should be 5 <li> elements after adding 5 tasks!")

            for (let task of tasks) {
                const checkbox = task.querySelector("input[type=checkbox]")
                if (checkbox === null)
                    return wrong("Inside each <li> tag should one <input> tag with 'checkbox' type")

                const taskName = task.querySelector("span.task")
                if (taskName === null)
                    return wrong("Inside each <li> tag should one <spane> tag with 'task' class")

                const deleteButton = task.querySelector("button.delete-btn")
                if (deleteButton === null)
                    return wrong("Inside each <li> tag should one <button> tag with 'delete-btn' class")
            }


            return correct();
        }),
        this.page.execute(() => {
            const taskList = document.getElementById("task-list")
            if (taskList.tagName !== 'UL')
                return wrong("Can't find <ul> tag with id '#task-list'")

            let tasks = taskList.getElementsByTagName("li")

            for (let task of tasks) {
                const taskName = task.querySelector("span.task")

                if (taskName === null)
                    return wrong("Inside each <li> tag should one <spane> tag with 'task' class")

                if (taskName.textContent === 'Third task') {
                    const checkbox = task.querySelector("input[type=checkbox]")
                    checkbox.click()
                    break;
                }
            }

            tasks = taskList.getElementsByTagName("li")

            for (let task of tasks) {

                const taskName = task.querySelector("span.task")

                if (taskName === null) {
                    return wrong("After marking a task as completed can not find a <span> tag with 'task' class inside <li> tag")
                }

                if (taskName.textContent === 'Third task') {
                    let taskName = task.querySelector("span.task")
                    if (taskName === null)
                        return wrong("Inside each <li> tag should be one <span> tag with 'task' class")

                    if (!taskName.style.textDecoration.includes("line-through") &&
                        !getComputedStyle(taskName).textDecoration.includes("line-through")) {
                        return wrong("If checkbox is checked the task name should be crossed out.\n" +
                            "The span tag with task name should have 'text-decoration: line-trough' style")
                    }

                    return correct()
                }
            }

            return wrong("Can't find task with name 'Third task' after it was added!")
        }),
        this.node.execute(async () => {
            await this.page.refresh()
            return correct()
        }),
        this.page.execute(async () => {

            const taskList = document.getElementById("task-list")
            if (taskList.tagName !== 'UL')
                return wrong("Can't find <ul> tag with id '#task-list'")

            const tasks = taskList.getElementsByTagName("li")

            if (tasks.length !== 5) {
                return wrong("Looks like you didn't store the tasks in the local storage.\n" +
                    "After refreshing the page expected 5 tasks!")
            }

            for (let task of tasks) {
                const checkbox = task.querySelector("input[type=checkbox]")
                if (checkbox === null)
                    return wrong("Inside each <li> tag should one <input> tag with 'checkbox' type")

                const taskName = task.querySelector("span.task")
                if (taskName === null)
                    return wrong("Inside each <li> tag should one <spane> tag with 'task' class")

                const deleteButton = task.querySelector("button.delete-btn")
                if (deleteButton === null)
                    return wrong("Inside each <li> tag should one <button> tag with 'delete-btn' class")
            }

            return correct()
        })
    ]
}

it('Test stage', async function () {
    try {
        this.timeout(30000)
    } catch (ignored) {
    }
    await new TodoTest().runTests()
}, 30000)

