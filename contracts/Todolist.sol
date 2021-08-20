pragma solidity >=0.4.21 < 0.7.0;

contract Todolist{

    uint public listCounter;

    struct Task{
        uint id;
        string content;
        bool completed;
    }

    mapping (uint => Task) public tasks;

    event TaskCreated(uint id,string content, bool completed);
    event TaskCompleted(uint id, bool completed);

    function createTask(string memory _content) public {
        listCounter++;
        tasks[listCounter] = Task(listCounter, _content, false);
        emit TaskCreated(listCounter, _content, false);
    }

    function taskCompleted(uint _id) public{
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, true);
    }
}